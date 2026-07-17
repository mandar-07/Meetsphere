import { Box, Typography } from '@mui/material';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import styles from '../../styles/videoComponent.module.css';
import { colors } from '../../theme/tokens';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function CameraOffOverlay({ name }) {
  return (
    <Box className={styles.cameraOffOverlay}>
      <Box className={styles.avatarCircle}>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          {getInitials(name)}
        </Typography>
      </Box>
      <Box className={styles.cameraOffBadge}>
        <VideocamOffOutlinedIcon sx={{ fontSize: 14, color: colors.textSecondary }} />
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: colors.textSecondary }}>
          Camera Off
        </Typography>
      </Box>
    </Box>
  );
}

export default function VideoGrid({ localVideoRef, videos, username, hasSidebar, localCameraOn, peerCameraStates }) {
  const total = videos.length + 1;
  const getGridClass = () => {
    if (total <= 1) return styles.gridSingle;
    if (total <= 2) return styles.gridTwo;
    if (total <= 4) return styles.gridFour;
    return styles.gridMany;
  };

  return (
    <Box
      className={styles.meetVideoContainer}
      sx={{
        bgcolor: colors.background,
        minHeight: '100vh',
        pr: hasSidebar ? { sm: '380px' } : 0,
        transition: 'padding-right 250ms ease',
      }}
    >
      <Box className={`${styles.conferenceView} ${getGridClass()}`}>
        {/* Local user tile */}
        <Box className={styles.videoTile}>
          <video
            className={`${styles.videoElement} ${!localCameraOn ? styles.videoHidden : ''}`}
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ transform: 'scaleX(-1)' }}
          />
          {!localCameraOn && <CameraOffOverlay name={username || 'You'} />}
          <Box className={styles.participantLabel}>
            <Typography variant="caption">{username || 'You'} (You)</Typography>
          </Box>
        </Box>

        {/* Remote participant tiles */}
        {videos.map((v, i) => {
          const peerCameraOn = peerCameraStates?.[v.socketId] !== false;
          return (
            <Box key={v.socketId} className={styles.videoTile}>
              <video
                className={`${styles.videoElement} ${!peerCameraOn ? styles.videoHidden : ''}`}
                ref={(ref) => { if (ref && v.stream) ref.srcObject = v.stream; }}
                autoPlay
                playsInline
              />
              {!peerCameraOn && <CameraOffOverlay name={`Participant ${i + 1}`} />}
              <Box className={styles.participantLabel}>
                <Typography variant="caption">Participant {i + 1}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
