import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
  title: string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  initialName = "",
  title,
}) => {
  const [name, setName] = useState(initialName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
      setName("");
    }
  };

  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!name.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
