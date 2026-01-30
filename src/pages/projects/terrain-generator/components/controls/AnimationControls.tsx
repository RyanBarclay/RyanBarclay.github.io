import { Box, Typography, Slider, IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTerrainContext } from "../../context/TerrainContext";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";

export default function AnimationControls() {
  const { config, pendingConfig, updateConfig, updatePendingConfig } =
    useTerrainContext();

  const { isPlaying, currentTime, play, pause, reset } = useAnimationLoop({
    speed: pendingConfig.animation?.speed || 1,
    enabled: config.animation?.enabled || false, // Use actual config for animation playback
  });

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    // Animation playback is immediate, not pending
    updateConfig({
      animation: {
        ...config.animation,
        enabled: !isPlaying,
      },
    });
  };

  const handleSpeedChange = (_: Event, value: number | number[]) => {
    // Speed changes go to pending config
    updatePendingConfig({
      animation: {
        ...pendingConfig.animation,
        speed: value as number,
      },
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Animation gradually morphs terrain over time
        </Typography>
        <Tooltip
          title="The animation slowly modifies the noise offset, causing the terrain to gradually evolve and morph. It's subtle - wait 5-10 seconds to see visible changes!"
          arrow
        >
          <InfoOutlinedIcon fontSize="small" sx={{ opacity: 0.6 }} />
        </Tooltip>
      </Box>

      {/* Playback Controls */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <IconButton
          onClick={togglePlayback}
          color={isPlaying ? "primary" : "default"}
          size="large"
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <IconButton onClick={reset} size="large">
          <RestartAltIcon />
        </IconButton>

        <Box sx={{ flex: 1, display: "flex", alignItems: "center", ml: 2 }}>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            {currentTime.toFixed(2)}s
          </Typography>
        </Box>
      </Box>

      {/* Speed Control */}
      <Typography variant="body2" gutterBottom>
        Speed: {(pendingConfig.animation?.speed || 1).toFixed(1)}x
      </Typography>
      <Slider
        value={pendingConfig.animation?.speed || 1}
        onChange={handleSpeedChange}
        min={0.1}
        max={5.0}
        step={0.1}
        valueLabelDisplay="auto"
        marks={[
          { value: 0.5, label: "0.5x" },
          { value: 1, label: "1x" },
          { value: 2, label: "2x" },
          { value: 5, label: "5x" },
        ]}
      />
    </Box>
  );
}
