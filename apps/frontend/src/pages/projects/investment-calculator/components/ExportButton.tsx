import { Button } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

interface ExportButtonProps {
  onExport: () => void;
}

/** Downloads the active mode's full timeline as CSV. */
const ExportButton = ({ onExport }: ExportButtonProps) => (
  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={onExport}>
    Export CSV
  </Button>
);

export default ExportButton;
