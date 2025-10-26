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
  Slider,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  FormControlLabel,
  Fab
} from '@mui/material';
import {
  Delete,
  Edit,
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
  Close,
  Star,
  StarBorder
} from '@mui/icons-material';
import { format } from 'date-fns';

const UserWall = ({ protocols, onRemoveProtocol, onUpdateProgress }) => {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpenProgressDialog = (protocol) => {
    setSelectedProtocol(protocol);
    setProgressValue(protocol.progress?.value || 0);
    setNotes(protocol.progress?.notes || '');
    setProgressDialogOpen(true);
  };

  const handleSaveProgress = async () => {
    if (selectedProtocol) {
      setSaving(true);
      try {
        await onUpdateProgress(selectedProtocol.protocolId, {
          value: progressValue,
          notes: notes,
          date: new Date()
        });
        setProgressDialogOpen(false);
      } catch (error) {
        console.error('Error saving progress:', error);
        // You could add a toast notification here
      } finally {
        setSaving(false);
      }
    }
  };

  const getProgressColor = (value) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'error';
  };

  const getProgressText = (value) => {
    if (value >= 90) return 'Excellent!';
    if (value >= 80) return 'Great job!';
    if (value >= 60) return 'Good progress';
    if (value >= 40) return 'Keep going';
    return 'Getting started';
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
        {protocols.map((protocol) => (
          <Grid item xs={12} md={5} lg={4} key={protocol.id} sx={{ maxWidth: '500px' }}>
            <Card 
              sx={{ 
                height: '400px',
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

                {protocol.progress && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Progress
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={`${getProgressColor(protocol.progress.value)}.main`}
                        sx={{ fontWeight: 500 }}
                      >
                        {protocol.progress.value}%
                      </Typography>
                    </Box>
                    <Slider
                      value={protocol.progress.value}
                      disabled
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {getProgressText(protocol.progress.value)}
                    </Typography>
                    {protocol.progress.notes && (
                      <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{protocol.progress.notes}"
                      </Typography>
                    )}
                  </Paper>
                )}

                <Typography variant="caption" color="text.secondary" display="block">
                  Added: {format(protocol.addedDate, 'MMM dd, yyyy')}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleOpenProgressDialog(protocol)}
                  sx={{ textTransform: 'none' }}
                >
                  {protocol.progress ? 'Update Progress' : 'Track Progress'}
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" color="primary">
                    <StarBorder />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress Tracking Dialog */}
      <Dialog 
        open={progressDialogOpen} 
        onClose={() => setProgressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Track Progress: {selectedProtocol?.title}
            <IconButton onClick={() => setProgressDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              How well did you follow this protocol today?
            </Typography>
            
            <Box sx={{ px: 2, py: 3 }}>
              <Slider
                value={progressValue}
                onChange={(e, value) => setProgressValue(value)}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' }
                ]}
                sx={{ mb: 2 }}
              />
              
              <Typography 
                variant="h6" 
                color={`${getProgressColor(progressValue)}.main`}
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {progressValue}% - {getProgressText(progressValue)}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes (optional)"
              placeholder="How did it go? Any observations or challenges?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setProgressDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProgress}
            startIcon={<CheckCircle />}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Progress'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserWall;
