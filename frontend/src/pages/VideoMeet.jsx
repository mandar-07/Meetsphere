import React, { useEffect, useRef, useState, useContext } from 'react';
import io from 'socket.io-client';
import MeetingLobby from '../components/meeting/MeetingLobby';
import VideoGrid from '../components/meeting/VideoGrid';
import MeetingToolbar from '../components/meeting/MeetingToolbar';
import ChatPanel from '../components/meeting/ChatPanel';
import MeetingTopBar from '../components/meeting/MeetingTopBar';
import ParticipantsPanel from '../components/meeting/ParticipantsPanel';
import SettingsModal from '../components/meeting/SettingsModal';
import { Box } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';

// Derive the socket server origin from the Vite API URL
// e.g. "https://meetsphere-vm2o.onrender.com/api/v1/users" → "https://meetsphere-vm2o.onrender.com"
const server_url = import.meta.env.VITE_SOCKET_URL;

console.log("Socket URL:", server_url);

const peerConfigConnections = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

function VideoMeetComponent() {
  const { userData, addToUserHistory } = useContext(AuthContext);

  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const localVideoref = useRef(null);
  const connectionsRef = useRef({}); // { socketId: RTCPeerConnection }
  const dataChannelsRef = useRef({});
  const videoRef = useRef([]);
  const isTrackToggleRef = useRef(false);
  const roomUsernamesRef = useRef({});

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(undefined); // undefined initially so useEffect doesn't fire on mount
  const [screen, setScreen] = useState(false);
  const [showModal, setModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState(userData?.name || userData?.username || '');
  const [videos, setVideos] = useState([]);
  const [peerCameraStates, setPeerCameraStates] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ── Timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (askForUsername) return;
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [askForUsername]);

  // ── Request permissions once on mount ──────────────────────────────────
  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPermissions = async () => {
    try {
      let vidAvail = false;
      let audAvail = false;

      try {
        const testVideo = await navigator.mediaDevices.getUserMedia({ video: true });
        vidAvail = true;
        testVideo.getTracks().forEach((t) => t.stop());
      } catch { vidAvail = false; }

      try {
        const testAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
        audAvail = true;
        testAudio.getTracks().forEach((t) => t.stop());
      } catch { audAvail = false; }

      setVideoAvailable(vidAvail);
      setAudioAvailable(audAvail);

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      }

      if (vidAvail || audAvail) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: vidAvail,
          audio: audAvail,
        });
        window.localStream = userMediaStream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = userMediaStream;
        }
      }
    } catch (error) {
      console.error('getPermissions error:', error);
    }
  };

  // ── Audio toggle reaction ──────────────────────────────────────────────
  useEffect(() => {
    if (audio !== undefined && !isTrackToggleRef.current) {
      getUserMedia();
    }
    isTrackToggleRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  // ── Screen share toggle reaction ──────────────────────────────────────
  useEffect(() => {
    if (screen !== undefined && screen !== false) {
      getDislayMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      try {
        if (window.localStream) {
          window.localStream.getTracks().forEach((track) => track.stop());
        }
      } catch {}
      Object.values(connectionsRef.current).forEach((pc) => {
        try { pc.close(); } catch {}
      });
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // ═════════════════════════════════════════════════════════════════════════
  //  Helper: Black video + silent audio (fallback when no camera/mic)
  // ═════════════════════════════════════════════════════════════════════════
  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  getUserMedia → success handler
  //  IMPORTANT: Uses addStream (NOT addTrack) to be compatible with
  //  onaddstream on the remote side.
  // ═════════════════════════════════════════════════════════════════════════
  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch {}

    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;
      try {
        connectionsRef.current[id].addStream(window.localStream);
      } catch {}

      connectionsRef.current[id].createOffer().then((description) => {
        connectionsRef.current[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              'signal', id,
              JSON.stringify({ sdp: connectionsRef.current[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);
          try {
            localVideoref.current.srcObject.getTracks().forEach((t) => t.stop());
          } catch {}
          const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connectionsRef.current) {
            try { connectionsRef.current[id].addStream(window.localStream); } catch {}
            connectionsRef.current[id].createOffer().then((description) => {
              connectionsRef.current[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    'signal', id,
                    JSON.stringify({ sdp: connectionsRef.current[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
      } catch {}
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Screen share
  // ═════════════════════════════════════════════════════════════════════════
  const getDislayMedia = () => {
    if (screen && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(getDislayMediaSuccess)
        .catch((e) => console.log(e));
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch {}

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;
      try {
        connectionsRef.current[id].addStream(window.localStream);
      } catch {}

      connectionsRef.current[id].createOffer().then((description) => {
        connectionsRef.current[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              'signal', id,
              JSON.stringify({ sdp: connectionsRef.current[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);
          try {
            localVideoref.current.srcObject.getTracks().forEach((t) => t.stop());
          } catch {}
          const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;
          getUserMedia();
        })
    );
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  WebRTC signaling: handle incoming SDP/ICE from server
  // ═════════════════════════════════════════════════════════════════════════
  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (!connectionsRef.current[fromId]) return; // No peer connection yet

      if (signal.sdp) {
        connectionsRef.current[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              connectionsRef.current[fromId]
                .createAnswer()
                .then((description) => {
                  connectionsRef.current[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        'signal', fromId,
                        JSON.stringify({ sdp: connectionsRef.current[fromId].localDescription })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connectionsRef.current[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Camera state detection helpers
  // ═════════════════════════════════════════════════════════════════════════
  const broadcastCameraState = (enabled) => {
    const msg = JSON.stringify({ type: 'camera-state', enabled });
    Object.values(dataChannelsRef.current).forEach((ch) => {
      try { if (ch.readyState === 'open') ch.send(msg); } catch {}
    });
  };

  const attachRemoteVideoTrackListeners = (peerId, stream) => {
    const updatePeerCamera = () => {
      const videoTrack = stream.getVideoTracks()[0];
      const isCameraOn = videoTrack ? videoTrack.readyState === 'live' && !videoTrack.muted : false;
      setPeerCameraStates((prev) => ({ ...prev, [peerId]: isCameraOn }));
    };
    updatePeerCamera();
    stream.getVideoTracks().forEach((track) => {
      track.onmute = updatePeerCamera;
      track.onunmute = updatePeerCamera;
      track.onended = () => setPeerCameraStates((prev) => ({ ...prev, [peerId]: false }));
    });
    stream.onaddtrack = (event) => {
      if (event.track.kind === 'video') {
        event.track.onmute = updatePeerCamera;
        event.track.onunmute = updatePeerCamera;
        event.track.onended = () => setPeerCameraStates((prev) => ({ ...prev, [peerId]: false }));
        updatePeerCamera();
      }
    };
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Connect socket and set up peer connection mesh
  // ═════════════════════════════════════════════════════════════════════════
  const connectToSocketServer = () => {
    const meetingCode = window.location.pathname.substring(1);

    console.log('[MeetSphere] Connecting socket to:', server_url, '| Room:', meetingCode);

    socketRef.current = io.connect(server_url, {
      secure: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      console.log('[MeetSphere] Socket connected. ID:', socketRef.current.id);
      socketIdRef.current = socketRef.current.id;

      // Join the room with meeting code + display name
      socketRef.current.emit('join-call', meetingCode, username);

      socketRef.current.on('chat-message', addMessage);

      // ── User left ──────────────────────────────────────────────────
      socketRef.current.on('user-left', (id) => {
        console.log('[MeetSphere] user-left:', id);

        setVideos((prev) => prev.filter((v) => v.socketId !== id));
        setPeerCameraStates((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        if (connectionsRef.current[id]) {
          connectionsRef.current[id].close();
          delete connectionsRef.current[id];
        }
        if (dataChannelsRef.current[id]) {
          try { dataChannelsRef.current[id].close(); } catch {}
          delete dataChannelsRef.current[id];
        }
      });

      // ── User joined ────────────────────────────────────────────────
      socketRef.current.on('user-joined', (joinedId, clients, roomUsernames) => {
        console.log('[MeetSphere] user-joined event. joinedId:', joinedId,
          '| clients:', clients, '| myId:', socketIdRef.current);

        // Save username mapping for later use
        roomUsernamesRef.current = { ...roomUsernamesRef.current, ...roomUsernames };

        clients.forEach((socketListId) => {
          // Skip self
          if (socketListId === socketIdRef.current) return;

          // Skip peers we already have a connection to
          if (connectionsRef.current[socketListId]) return;

          // If someone ELSE joined (not us), we only need a new
          // connection to that one new peer (joinedId), not to everyone.
          if (joinedId !== socketIdRef.current && socketListId !== joinedId) return;

          console.log('[MeetSphere] Creating RTCPeerConnection for:', socketListId);

          const pc = new RTCPeerConnection(peerConfigConnections);
          connectionsRef.current[socketListId] = pc;

          // ── ICE candidates ──────────────────────────────────────
          pc.onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit(
                'signal', socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // ── Incoming remote stream (fires when remote calls addStream) ─
          pc.onaddstream = (event) => {
            console.log('[MeetSphere] onaddstream from:', socketListId);
            attachRemoteVideoTrackListeners(socketListId, event.stream);

            const displayUsername = roomUsernamesRef.current[socketListId] || 'Guest';
            const existingVideo = videoRef.current.find((v) => v.socketId === socketListId);

            if (existingVideo) {
              setVideos((prev) => {
                const updated = prev.map((v) =>
                  v.socketId === socketListId
                    ? { ...v, stream: event.stream, username: displayUsername }
                    : v
                );
                videoRef.current = updated;
                return updated;
              });
            } else {
              const newVideo = {
                socketId: socketListId,
                stream: event.stream,
                username: displayUsername,
                autoplay: true,
                playsinline: true,
              };
              setVideos((prev) => {
                const updated = [...prev, newVideo];
                videoRef.current = updated;
                return updated;
              });
            }
          };

          // ── DataChannel for camera-state signaling ──────────────
          const setupDataChannel = (channel, peerId) => {
            channel.onopen = () => {
              dataChannelsRef.current[peerId] = channel;
              try {
                const currentVideoOn = window.localStream
                  ? window.localStream.getVideoTracks().some((t) => t.enabled)
                  : false;
                channel.send(JSON.stringify({ type: 'camera-state', enabled: currentVideoOn }));
              } catch {}
            };
            channel.onmessage = (evt) => {
              try {
                const msg = JSON.parse(evt.data);
                if (msg.type === 'camera-state') {
                  setPeerCameraStates((prev) => ({ ...prev, [peerId]: msg.enabled }));
                }
              } catch {}
            };
            channel.onclose = () => {
              delete dataChannelsRef.current[peerId];
            };
          };

          // The newly-joined user (offerer) creates the data channel.
          // Existing users (answerers) listen for it.
          if (joinedId === socketIdRef.current) {
            const dc = pc.createDataChannel('camera-state');
            setupDataChannel(dc, socketListId);
          } else {
            pc.ondatachannel = (event) => {
              setupDataChannel(event.channel, socketListId);
            };
          }

          // ── Attach local stream using addStream (matches onaddstream) ─
          if (window.localStream) {
            pc.addStream(window.localStream);
          } else {
            const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            pc.addStream(window.localStream);
          }
        });

        // ── If WE are the joiner, create and send offers to all peers ─
        if (joinedId === socketIdRef.current) {
          for (let id2 in connectionsRef.current) {
            if (id2 === socketIdRef.current) continue;

            try {
              connectionsRef.current[id2].addStream(window.localStream);
            } catch {} // may already be added above

            connectionsRef.current[id2]
              .createOffer()
              .then((description) => {
                connectionsRef.current[id2]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      'signal', id2,
                      JSON.stringify({ sdp: connectionsRef.current[id2].localDescription })
                    );
                  })
                  .catch((e) => console.log(e));
              });
          }
        }
      });
    });
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Media controls
  // ═════════════════════════════════════════════════════════════════════════
  const handleVideo = () => {
    const newVideoState = !video;
    setVideo(newVideoState);
    if (window.localStream) {
      window.localStream.getVideoTracks().forEach((track) => {
        track.enabled = newVideoState;
      });
    }
    broadcastCameraState(newVideoState);
  };

  const handleAudio = () => {
    const newAudioState = !audio;
    isTrackToggleRef.current = true;
    setAudio(newAudioState);
    if (window.localStream) {
      window.localStream.getAudioTracks().forEach((track) => {
        track.enabled = newAudioState;
      });
    }
  };

  const handleScreen = () => {
    setScreen(!screen);
  };

  const handleEndCall = () => {
    try {
      if (localVideoref.current && localVideoref.current.srcObject) {
        localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    } catch {}

    Object.values(connectionsRef.current).forEach((pc) => {
      try { pc.close(); } catch {}
    });
    connectionsRef.current = {};

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    window.location.href = '/home';
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Chat
  // ═════════════════════════════════════════════════════════════════════════
  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prev) => [...prev, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('chat-message', message, username);
    setMessage('');
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Connect flow
  // ═════════════════════════════════════════════════════════════════════════
  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const connect = async () => {
    setAskForUsername(false);

    // Save meeting to user's history
    const meetingCode = window.location.pathname.substring(1);
    try {
      await addToUserHistory(meetingCode, `Session ${meetingCode}`);
    } catch (e) {
      console.error('Could not save meeting to history:', e);
    }

    getMedia();
  };

  const toggleChat = () => {
    setShowParticipants(false);
    setModal((prev) => {
      if (!prev) setNewMessages(0);
      return !prev;
    });
  };

  const toggleParticipants = () => {
    setModal(false);
    setShowParticipants((prev) => !prev);
  };

  // ═════════════════════════════════════════════════════════════════════════
  //  Render
  // ═════════════════════════════════════════════════════════════════════════
  if (askForUsername) {
    return (
      <MeetingLobby
        username={username}
        setUsername={setUsername}
        onConnect={connect}
        localVideoRef={localVideoref}
      />
    );
  }

  return (
    <Box sx={{ bgcolor: '#0F172A', minHeight: '100vh' }}>
      <MeetingTopBar
        meetingCode={window.location.pathname.substring(1)}
        elapsed={elapsed}
        participantCount={videos.length + 1}
        isOnline={navigator.onLine}
      />

      <VideoGrid
        localVideoRef={localVideoref}
        videos={videos}
        username={username}
        hasSidebar={showModal || showParticipants}
        localCameraOn={video}
        peerCameraStates={peerCameraStates}
      />

      <ChatPanel
        open={showModal}
        onClose={() => setModal(false)}
        messages={messages}
        message={message}
        onMessageChange={(e) => setMessage(e.target.value)}
        onSend={sendMessage}
        username={username}
      />

      <ParticipantsPanel
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        username={username}
        videos={videos}
        participantCount={videos.length + 1}
      />

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      <MeetingToolbar
        video={video}
        audio={audio}
        screen={screen}
        screenAvailable={screenAvailable}
        newMessages={newMessages}
        onToggleVideo={handleVideo}
        onToggleAudio={handleAudio}
        onToggleScreen={handleScreen}
        onToggleChat={toggleChat}
        onToggleParticipants={toggleParticipants}
        onToggleSettings={() => setShowSettings(true)}
        onEndCall={handleEndCall}
      />
    </Box>
  );
}

export default withAuth(VideoMeetComponent);
