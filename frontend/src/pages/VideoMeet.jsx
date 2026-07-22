import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import MeetingLobby from '../components/meeting/MeetingLobby';
import VideoGrid from '../components/meeting/VideoGrid';
import MeetingToolbar from '../components/meeting/MeetingToolbar';
import ChatPanel from '../components/meeting/ChatPanel';
import MeetingTopBar from '../components/meeting/MeetingTopBar';
import ParticipantsPanel from '../components/meeting/ParticipantsPanel';
import SettingsModal from '../components/meeting/SettingsModal';
import { Box } from '@mui/material';

const server_url = import.meta.env.VITE_API_URL;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoref = useRef();
  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState(true);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState('');
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState('');
  const videoRef = useRef([]);
  const dataChannelsRef = useRef({});
  const isTrackToggleRef = useRef(false);
  let [videos, setVideos] = useState([]);
  let [peerCameraStates, setPeerCameraStates] = useState({});
  
  let [elapsed, setElapsed] = useState(0);
  let [showParticipants, setShowParticipants] = useState(false);
  let [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (askForUsername) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [askForUsername]);

  useEffect(() => {
    getPermissions();
  });

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then(() => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (audio !== undefined && !isTrackToggleRef.current) {
      getUserMedia();
    }
    isTrackToggleRef.current = false;
  }, [audio]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
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
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then(() => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        'signal',
                        fromId,
                        JSON.stringify({ sdp: connections[fromId].localDescription })
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
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-call', window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on('chat-message', addMessage);

      socketRef.current.on('user-left', (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
        setPeerCameraStates((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        // Clean up the data channel for the departed user
        if (dataChannelsRef.current[id]) {
          try { dataChannelsRef.current[id].close(); } catch (e) {}
          delete dataChannelsRef.current[id];
        }
      });

      socketRef.current.on('user-joined', (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
            }
          };

          connections[socketListId].onaddstream = (event) => {
            attachRemoteVideoTrackListeners(socketListId, event.stream);

            let videoExists = videoRef.current.find((video) => video.socketId === socketListId);

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
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

          // Set up WebRTC DataChannel for camera state signaling (no backend needed)
          const setupDataChannel = (channel, peerId) => {
            channel.onopen = () => {
              dataChannelsRef.current[peerId] = channel;
              // Send our current camera state to the newly connected peer
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

          // Create an outgoing data channel (used by the offerer)
          if (socketListId !== socketIdRef.current) {
            const dc = connections[socketListId].createDataChannel('camera-state');
            setupDataChannel(dc, socketListId);
          }

          // Listen for incoming data channels (used by the answerer)
          connections[socketListId].ondatachannel = (event) => {
            setupDataChannel(event.channel, socketListId);
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit('signal', id2, JSON.stringify({ sdp: connections[id2].localDescription }));
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  // Broadcast camera state to all connected peers via DataChannels (UI sync backup)
  let broadcastCameraState = (enabled) => {
    const msg = JSON.stringify({ type: 'camera-state', enabled });
    Object.values(dataChannelsRef.current).forEach((ch) => {
      try {
        if (ch.readyState === 'open') ch.send(msg);
      } catch (e) {}
    });
  };

  // Detect remote camera on/off via WebRTC track mute events (primary mechanism)
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

  let handleVideo = () => {
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

  let handleAudio = () => {
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

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = '/';
  };

  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('chat-message', message, username);
    setMessage('');
  };

  let connect = () => {
    setAskForUsername(false);
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
