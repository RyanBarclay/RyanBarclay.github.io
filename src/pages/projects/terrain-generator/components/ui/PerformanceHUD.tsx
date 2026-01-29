import { Paper, Typography, Box } from '@mui/material';
import { usePerformance } from '../../hooks/usePerformance';

interface PerformanceHUDProps {
  visible?: boolean;        // Show/hide HUD (default: true)
  updateInterval?: number;  // Stats update interval (default: 30)
}

export default function PerformanceHUD({
  visible = true,
  updateInterval = 30
}: PerformanceHUDProps) {
  const stats = usePerformance({ updateInterval, enabled: visible });

  if (!visible) return null;

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        p: 2,
        minWidth: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        zIndex: 1000,
        fontFamily: 'monospace'
      }}
      elevation={4}
    >
      <Typography variant="body2" fontWeight="bold" gutterBottom>
        Performance
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="caption">
          FPS: <strong>{stats.fps}</strong>
        </Typography>
        
        <Typography variant="caption">
          Triangles: <strong>{stats.triangles.toLocaleString()}</strong>
        </Typography>
        
        <Typography variant="caption">
          Draw Calls: <strong>{stats.drawCalls}</strong>
        </Typography>
        
        <Typography variant="caption">
          Memory: <strong>{stats.memoryUsage.toFixed(1)} MB</strong>
        </Typography>
        
        <Typography variant="caption">
          Geometries: <strong>{stats.geometries}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
