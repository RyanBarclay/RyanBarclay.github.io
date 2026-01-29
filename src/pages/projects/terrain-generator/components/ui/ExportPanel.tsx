import { Box, Typography, Button, Divider } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useTerrainExport } from "../../hooks/useTerrainExport";

interface ExportOption {
  format: "obj" | "stl" | "heightmap-png" | "heightmap-raw";
  label: string;
  description: string;
  icon: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: "obj",
    label: "Wavefront OBJ",
    description: "Standard 3D model format (Blender, Maya)",
    icon: "📐",
  },
  {
    format: "stl",
    label: "STL (3D Print)",
    description: "STereoLithography format for 3D printing",
    icon: "🖨️",
  },
  {
    format: "heightmap-png",
    label: "Heightmap PNG",
    description: "Grayscale image (Unity, Unreal)",
    icon: "🗺️",
  },
  {
    format: "heightmap-raw",
    label: "Heightmap RAW",
    description: "Binary float data (advanced)",
    icon: "📊",
  },
];

export default function ExportPanel() {
  const { exportTerrain, canExport } = useTerrainExport();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Export Terrain
      </Typography>

      {!canExport && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Generate terrain first to enable export
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {EXPORT_OPTIONS.map((option) => (
          <Box key={option.format}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={
                <span style={{ fontSize: "1.5rem" }}>{option.icon}</span>
              }
              endIcon={<DownloadIcon />}
              onClick={() => exportTerrain(option.format)}
              disabled={!canExport}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                py: 1.5,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {option.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </Button>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="caption" color="text.secondary">
        Exported files use terrain size in filename (e.g., terrain-256x256.obj)
      </Typography>
    </Box>
  );
}
