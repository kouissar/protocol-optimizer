import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Delete,
  CheckCircle,
  Schedule,
  Edit
} from '@mui/icons-material';
import { format, isToday } from 'date-fns';
import ProtocolDetails from './ProtocolDetails';

const UserWall = ({ protocols, onRemoveProtocol, onToggleProtocolCompletion }) => {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpenNotesDialog = (protocol) => {
    setSelectedProtocol(protocol);
    const todayEntry = protocol.progressHistory?.find(entry => isToday(new Date(entry.date)));
    setNotes(todayEntry?.notes || '');
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (selectedProtocol) {
      setSaving(true);
      try {
        await onToggleProtocolCompletion(selectedProtocol.protocolId, new Date(), notes);
        setNotesDialogOpen(false);
      } catch (error) {
        console.error('Error saving notes:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const isCompletedToday = (protocol) => {
    if (!protocol.progressHistory) return false;
    return protocol.progressHistory.some(entry => isToday(new Date(entry.date)));
  };

  const getTodaysNotes = (protocol) => {
    if (!protocol.progressHistory) return null;
    const todayEntry = protocol.progressHistory.find(entry => isToday(new Date(entry.date)));
    return todayEntry?.notes;
  };

  if (protocols.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your Wall is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add protocols from the library to start tracking your progress
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
          Go to the Protocol Library tab to browse and add protocols that interest you.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          🏠 My Protocol Wall
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {protocols.length} protocol{protocols.length !== 1 ? 's' : ''} selected
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {protocols.map((protocol) => {
          const todaysNotes = getTodaysNotes(protocol);
          return (
            <Grid item xs={12} md={5} lg={4} key={protocol.protocolId} sx={{ maxWidth: '500px' }}>
              <Card 
                sx={{ 
                  height: 'auto',
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flexGrow: 1 }}>
                      {protocol.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => onRemoveProtocol(protocol.protocolId)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {protocol.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={protocol.difficulty} 
                      size="small" 
                      color={protocol.difficulty === 'Easy' ? 'success' : protocol.difficulty === 'Medium' ? 'warning' : 'error'}
                      variant="outlined"
                    />
                    <Chip 
                      icon={<Schedule />} 
                      label={protocol.timeRequired} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={protocol.frequency} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  <ProtocolDetails protocol={protocol} />
                  {todaysNotes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Today's Notes:</Typography>
                      <Typography variant="body2">{todaysNotes}</Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    variant={isCompletedToday(protocol) ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={isCompletedToday(protocol) ? <CheckCircle /> : null}
                    onClick={() => handleOpenNotesDialog(protocol)}
                    sx={{ textTransform: 'none' }}
                  >
                    {isCompletedToday(protocol) ? 'Completed' : 'Mark as Done'}
                  </Button>
                  {isCompletedToday(protocol) && (
                    <IconButton size="small" onClick={() => handleOpenNotesDialog(protocol)}>
                      <Edit />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )}
        )}
      </Grid>

      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserWall;
