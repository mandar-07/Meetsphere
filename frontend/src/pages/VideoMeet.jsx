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

const server_url = import.meta.env.VITE_API_URL;

const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

function VideoMeetComponent() {
  const { userData, addToUserHistory } = useContext(AuthContext);

  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const connectionsRef = useRef({});
  const dataChannelsRef = useRef({});
  const videoRef = useRef([]);
  const isTrackToggleRef = useRef(false);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
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

  // Track time elapsed since call joined
  useEffect(() => {
    if (askForUsername) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [askForUsername]);

  // Request permissions once on mount
  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setVideoAvailable(true);
        setAudioAvailable(true);
      } catch (err) {
        // Fallback: try video only
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          setVideoAvailable(true);
          setAudioAvailable(false);
        } catch (err2) {
          // Fallback: try audio only
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            setVideoAvailable(false);
            setAudioAvailable(true);
          } catch (err3) {
            setVideoAvailable(false);
            setAudioAvailable(false);
          }
        }
      }

      if (stream) {
        window.localStream = stream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = stream;
        }
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }
    } catch (error) {
      console.error("Error in getPermissions:", error);
    }
  };

  const getDislayMedia = () => {
    if (screen && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(getDislayMediaSuccess)
        .catch((e) => console.log(e));
    }
  };

  const getUserMediaSuccess = (stream) => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;

      const pc = connectionsRef.current[id];
      // Clean up previous tracks
      const senders = pc.getSenders();
      senders.forEach((sender) => pc.removeTrack(sender));

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.createOffer().then((description) => {
        pc.setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ sdp: pc.localDescription }));
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
            if (localVideoref.current && localVideoref.current.srcObject) {
              localVideoref.current.srcObject.getTracks().forEach((t) => t.stop());
            }
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          if (localVideoref.current) {
            localVideoref.current.srcObject = window.localStream;
          }

          for (let id in connectionsRef.current) {
            const pc = connectionsRef.current[id];
            window.localStream.getTracks().forEach((t) => pc.addTrack(t, window.localStream));

            pc.createOffer().then((description) => {
              pc.setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit('signal', id, JSON.stringify({ sdp: pc.localDescription }));
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
        if (localVideoref.current && localVideoref.current.srcObject) {
          localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {}
    }
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;

      const pc = connectionsRef.current[id];
      const senders = pc.getSenders();
      senders.forEach((sender) => pc.removeTrack(sender));

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.createOffer().then((description) => {
        pc.setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ sdp: pc.localDescription }));
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);
          try {
            if (localVideoref.current && localVideoref.current.srcObject) {
              localVideoref.current.srcObject.getTracks().forEach((t) => t.stop());
            }
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          if (localVideoref.current) {
            localVideoref.current.srcObject = window.localStream;
          }

          getUserMedia();
        })
    );
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      const pc = connectionsRef.current[fromId];
      if (!pc) return;

      if (signal.sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              pc.createAnswer()
                .then((description) => {
                  pc.setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        'signal',
                        fromId,
                        JSON.stringify({ sdp: pc.localDescription })
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
        pc.addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e) => console.log(e));
      }
    }
  };

  const connectToSocketServer = () => {
    const meetingCode = window.location.pathname.substring(1);
    
    // Convert base API url (e.g. http://localhost:8000/api/v1/users) into socket server root origin
    const baseSocketUrl = new URL(server_url).origin;

    socketRef.current = io.connect(baseSocketUrl, { secure: true });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      // Pass the meeting code and displayName when joining the socket room
      socketRef.current.emit('join-call', meetingCode, username);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on('chat-message', addMessage);

      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
        setPeerCameraStates((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        // Close and clean up WebRTC peer connection
        if (connectionsRef.current[id]) {
          connectionsRef.current[id].close();
          delete connectionsRef.current[id];
        }

        // Clean up the data channel for the departed user
        if (dataChannelsRef.current[id]) {
          try { dataChannelsRef.current[id].close(); } catch (e) {}
          delete dataChannelsRef.current[id];
        }
      });

      socketRef.current.on('user-joined', (id, clients, roomUsernames) => {
        // Set up WebRTC peer connection ONLY for new joining clients or if we just joined
        clients.forEach((socketListId) => {
          if (socketListId === socketIdRef.current) return;
          if (connectionsRef.current[socketListId]) return; // Skip if already connected

          // If we are NOT the joiner, we should only connect to the joiner (id)
          if (id !== socketIdRef.current && socketListId !== id) return;

          const pc = new RTCPeerConnection(peerConfigConnections);
          connectionsRef.current[socketListId] = pc;

          pc.onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
            }
          };

          pc.onaddstream = (event) => {
            attachRemoteVideoTrackListeners(socketListId, event.stream);

            const displayUsername = roomUsernames[socketListId] || "Guest";

            let videoExists = videoRef.current.find((video) => video.socketId === socketListId);

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId ? { ...video, stream: event.stream, username: displayUsername } : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                username: displayUsername,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Set up WebRTC DataChannel for camera state signaling
          const setupDataChannel = (channel, peerId) => {
            channel.onopen = () => {
              dataChannelsRef.current[peerId] = channel;
              try {
                const currentVideoOn = window.localStream
                  ? window.localStream.getVideoTracks().some((t) => t.enabled)
                  : false;
                channel.send(JSON.stringify({ type: 'camera-state', enabled: currentVideoOn }));
              } catch (e) {}
            };
            channel.onmessage = (event) => {
              try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'camera-state') {
                  setPeerCameraStates((prev) => ({ ...prev, [peerId]: msg.enabled }));
                }
              } catch (e) {}
            };
            channel.onclose = () => {
              delete dataChannelsRef.current[peerId];
            };
          };

          // Create data channel if we are the offerer (which is true if id === socketIdRef.current)
          if (id === socketIdRef.current) {
            const dc = pc.createDataChannel('camera-state');
            setupDataChannel(dc, socketListId);
          } else {
            pc.ondatachannel = (event) => {
              setupDataChannel(event.channel, socketListId);
            };
          }

          // Attach local tracks
          if (window.localStream !== undefined && window.localStream !== null) {
            window.localStream.getTracks().forEach((track) => {
              pc.addTrack(track, window.localStream);
            });
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            window.localStream.getTracks().forEach((track) => {
              pc.addTrack(track, window.localStream);
            });
          }
        });

        // The newly joined user starts sending offers to all existing peers in the room
        if (id === socketIdRef.current) {
          clients.forEach((socketListId) => {
            if (socketListId === socketIdRef.current) return;
            const pc = connectionsRef.current[socketListId];
            if (!pc) return;

            pc.createOffer().then((description) => {
              pc.setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit('signal', socketListId, JSON.stringify({ sdp: pc.localDescription }));
                })
                .catch((e) => console.log(e));
            });
          });
        }
      });
    });
  };

  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const broadcastCameraState = (enabled) => {
    const msg = JSON.stringify({ type: 'camera-state', enabled });
    Object.values(dataChannelsRef.current).forEach((ch) => {
      try {
        if (ch.readyState === 'open') ch.send(msg);
      } catch (e) {}
    });
  };

  const attachRemoteVideoTrackListeners = (peerId, stream) => {
    const updatePeerCamera = () => {
      const videoTrack = stream.getVideoTracks()[0];
      const isCameraOn = videoTrack
        ? videoTrack.readyState === 'live' && !videoTrack.muted
        : false;
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

  const handleVideo = () => {
    const newVideoState = !video;
    setVideo(newVideoState);

    if (window.localStream) {
      const videoTracks = window.localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach((track) => {
          track.enabled = newVideoState;
        });
      }
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

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  const handleScreen = () => {
    setScreen(!screen);
  };

  const handleEndCall = () => {
    try {
      if (localVideoref.current && localVideoref.current.srcObject) {
        localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {}

    // Clean up peer connections
    for (let id in connectionsRef.current) {
      if (connectionsRef.current[id]) {
        connectionsRef.current[id].close();
      }
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    window.location.href = '/home';
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('chat-message', message, username);
    setMessage('');
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const connect = async () => {
    setAskForUsername(false);
    
    // Add meeting to persistent user activity history upon entering lobby
    const meetingCode = window.location.pathname.substring(1);
    try {
      await addToUserHistory(meetingCode, `Session ${meetingCode}`);
    } catch (e) {
      console.error("Could not append meeting to history on join:", e);
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

  // Clean up socket server and media tracks when component unmounts
  useEffect(() => {
    return () => {
      try {
        if (localVideoref.current && localVideoref.current.srcObject) {
          localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {}
      
      for (let id in connectionsRef.current) {
        if (connectionsRef.current[id]) {
          connectionsRef.current[id].close();
        }
      }
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

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
        onMessageChange={handleMessage}
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
