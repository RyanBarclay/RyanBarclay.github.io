import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Switch,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  Divider,
  Zoom,
  Tooltip,
  Fab,
  Grid,
} from "@mui/material";
import {
  ExpandMore,
  Delete,
  Edit,
  Casino,
  Add,
  FileUpload,
  FileDownload,
} from "@mui/icons-material";
import { RandomizerProvider, useRandomizer } from "./RandomizerContext";
import { parseSetFile, downloadSet } from "./fileUtils";
import { ItemSet } from "./types";

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

  React.useEffect(() => {
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

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setName: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  setName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the set "{setName}"? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RandomizerContent = () => {
  const {
    sets,
    addSet,
    updateSet,
    removeSet,
    addItem,
    updateItem,
    removeItem,
    randomizeSelections,
    importSet,
  } = useRandomizer();
  const [editingSet, setEditingSet] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{
    setName: string;
    itemName: string;
  } | null>(null);
  const [addingItemToSet, setAddingItemToSet] = useState<string | null>(null);
  const [newSetDialogOpen, setNewSetDialogOpen] = useState(false);
  const [deleteSetConfirmation, setDeleteSetConfirmation] = useState<
    string | null
  >(null);
  const [randomResults, setRandomResults] = useState<
    Array<{
      setName: string;
      selectedItem: { name: string; enabled: boolean } | null;
    }>
  >([]);

  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRandomize = () => {
    const results = randomizeSelections();
    setRandomResults(results);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedSet = parseSetFile(content);

        if (importedSet) {
          importSet(importedSet);
        } else {
          alert("Could not parse the uploaded file. Please check the format.");
        }
      } catch (error) {
        console.error("Error reading file:", error);
        alert("An error occurred while reading the file.");
      }

      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleDownloadSet = (set: ItemSet) => {
    downloadSet(set);
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: "100%", padding: 2, position: "relative", pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Randomizer
      </Typography>

      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".txt"
        onChange={handleFileUpload}
      />

      {/* Randomization Results */}
      {randomResults.length > 0 && (
        <Card
          sx={{
            mb: 4,
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Randomization Results
            </Typography>

            {randomResults.map((result, index) => (
              <Box key={`result-${index}`} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {result.setName}:
                </Typography>
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {result.selectedItem
                    ? result.selectedItem.name
                    : "No enabled items in this set"}
                </Typography>
                {index < randomResults.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action buttons placed side-by-side with equal width */}
      <Grid spacing={2} sx={{ mb: 2 }}>
        <Grid size={6}>
          <Paper
            sx={{
              borderRadius: "4px",
              height: "100%",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                height: "100%",
              }}
              onClick={() => setNewSetDialogOpen(true)}
            >
              <Add sx={{ mr: 1 }} />
              <Typography>Create New Set</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper
            sx={{
              borderRadius: "4px",
              height: "100%",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                height: "100%",
              }}
              onClick={triggerFileUpload}
            >
              <FileUpload sx={{ mr: 1 }} />
              <Typography>Import Set from File</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {sets.map((set) => (
        <Accordion key={set.name} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}
            >
              <Switch
                checked={set.enabled}
                onChange={(e) =>
                  updateSet(set.name, { enabled: e.target.checked })
                }
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
              <Typography sx={{ flexGrow: 1 }}>{set.name}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Download button */}
                <Tooltip title="Download Set">
                  <IconButton
                    size="small"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleDownloadSet(set);
                    }}
                  >
                    <FileDownload />
                  </IconButton>
                </Tooltip>
                {/* Edit and Delete buttons */}
                <IconButton
                  size="small"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setEditingSet(set.name);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setDeleteSetConfirmation(set.name);
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* Full-width Add Item button */}
            <Paper
              sx={{
                mb: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => setAddingItemToSet(set.name)}
            >
              <Add fontSize="small" sx={{ mr: 1 }} />
              <Typography>Add Item</Typography>
            </Paper>

            <List>
              {set.items.map((item) => (
                <ListItem key={item.name}>
                  <Switch
                    checked={item.enabled}
                    onChange={(e) =>
                      updateItem(set.name, item.name, {
                        enabled: e.target.checked,
                      })
                    }
                  />
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setEditingItem({
                          setName: set.name,
                          itemName: item.name,
                        })
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => removeItem(set.name, item.name)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <EditDialog
        open={newSetDialogOpen}
        onClose={() => setNewSetDialogOpen(false)}
        onSave={(name) => addSet(name)}
        title="Create New Set"
      />

      <EditDialog
        open={!!editingSet}
        onClose={() => setEditingSet(null)}
        onSave={(newName) => {
          if (editingSet) {
            updateSet(editingSet, { name: newName });
          }
        }}
        initialName={editingSet || ""}
        title="Edit Set"
      />

      <EditDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={(newName) => {
          if (editingItem) {
            updateItem(editingItem.setName, editingItem.itemName, {
              name: newName,
            });
          }
        }}
        initialName={editingItem?.itemName || ""}
        title="Edit Item"
      />

      <EditDialog
        open={!!addingItemToSet}
        onClose={() => setAddingItemToSet(null)}
        onSave={(name) => {
          if (addingItemToSet) {
            addItem(addingItemToSet, name);
          }
        }}
        title="Add New Item"
      />

      <ConfirmDeleteDialog
        open={!!deleteSetConfirmation}
        onClose={() => setDeleteSetConfirmation(null)}
        onConfirm={() => {
          if (deleteSetConfirmation) {
            removeSet(deleteSetConfirmation);
            setDeleteSetConfirmation(null);
          }
        }}
        setName={deleteSetConfirmation || ""}
      />

      {/* Floating Action Button for randomization */}
      <Zoom in={sets.filter((s) => s.enabled).length > 0}>
        <Fab
          color="secondary"
          aria-label="randomize"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            height: 64,
            width: 64,
          }}
          onClick={handleRandomize}
        >
          <Casino sx={{ fontSize: 32 }} />
        </Fab>
      </Zoom>
    </Box>
  );
};

const Randomizer = () => {
  return (
    <RandomizerProvider>
      <RandomizerContent />
    </RandomizerProvider>
  );
};

export default Randomizer;
