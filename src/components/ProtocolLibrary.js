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
  Tabs,
  Tab,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Add,
  CheckCircle,
  AccessTime,
  TrendingUp,
  Info
} from '@mui/icons-material';
import { protocolItems, protocolCategories, getProtocolsByCategory, getAuthors } from '../protocolData';

const ProtocolLibrary = ({ onAddProtocol, userProtocols }) => {
  const [selectedCategory, setSelectedCategory] = useState('morning');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [expandedProtocol, setExpandedProtocol] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedProtocol, setAddedProtocol] = useState(null);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleAuthorChange = (event, newValue) => {
    setSelectedAuthor(newValue);
  };

  const toggleProtocolExpansion = (protocolId) => {
    setExpandedProtocol(expandedProtocol === protocolId ? null : protocolId);
  };

  const handleAddProtocol = async (protocol) => {
    try {
      await onAddProtocol(protocol);
      setAddedProtocol(protocol);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding protocol:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const isProtocolAdded = (protocolId) => {
    return userProtocols.some(p => p.id === protocolId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  const protocols = getProtocolsByCategory(selectedCategory).filter(protocol => 
    selectedAuthor === 'all' || protocol.author === selectedAuthor
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        🧬 Multi-Expert Protocol Library
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Explore protocols from top health and performance experts. Select protocols that interest you and add them to your personal wall for tracking and optimization.
      </Alert>

      {/* Author Filter */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedAuthor}
          onChange={handleAuthorChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              minHeight: 50,
              fontSize: '0.9rem',
              fontWeight: 500
            } 
          }}
        >
          <Tab
            value="all"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>👥</span>
                <span>All Experts</span>
              </Box>
            }
          />
          {getAuthors().map((author) => (
            <Tab
              key={author.name}
              value={author.name}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{author.icon}</span>
                  <span>{author.name}</span>
                  <Chip 
                    label={author.count} 
                    size="small" 
                    sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              minHeight: 60,
              fontSize: '0.9rem',
              fontWeight: 500
            } 
          }}
        >
          {Object.values(protocolCategories).map((category) => (
            <Tab
              key={category.id}
              value={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Protocol Cards */}
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
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {protocol.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>{protocol.authorIcon}</span>
                        <span>{protocol.author}</span>
                      </Typography>
                    </Box>
                  </Box>
                  {isProtocolAdded(protocol.id) && (
                    <CheckCircle color="success" />
                  )}
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
                    color={getDifficultyColor(protocol.difficulty)}
                    variant="outlined"
                  />
                  <Chip 
                    icon={<AccessTime />} 
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp fontSize="small" color="primary" />
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    Key Benefits:
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.5,
                  maxHeight: '60px',
                  overflow: 'hidden'
                }}>
                  {protocol.benefits.slice(0, 2).map((benefit, index) => (
                    <Chip 
                      key={index}
                      label={benefit} 
                      size="small" 
                      variant="filled"
                      sx={{ 
                        backgroundColor: 'primary.light',
                        color: 'white',
                        fontSize: '0.7rem',
                        maxWidth: '100%',
                        '& .MuiChip-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    />
                  ))}
                  {protocol.benefits.length > 2 && (
                    <Chip 
                      label={`+${protocol.benefits.length - 2} more`} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<Info />}
                  onClick={() => toggleProtocolExpansion(protocol.id)}
                  sx={{ textTransform: 'none' }}
                >
                  {expandedProtocol === protocol.id ? 'Less Details' : 'More Details'}
                </Button>
                
                <Button
                  variant={isProtocolAdded(protocol.id) ? "outlined" : "contained"}
                  size="small"
                  startIcon={isProtocolAdded(protocol.id) ? <CheckCircle /> : <Add />}
                  onClick={() => handleAddProtocol(protocol)}
                  disabled={isProtocolAdded(protocol.id)}
                  sx={{ textTransform: 'none' }}
                >
                  {isProtocolAdded(protocol.id) ? 'Added' : 'Add to Wall'}
                </Button>
              </CardActions>

              {/* Expanded Details */}
              <Collapse in={expandedProtocol === protocol.id} timeout="auto" unmountOnExit>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Instructions:
                  </Typography>
                  <List dense>
                    {protocol.instructions.map((instruction, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={instruction}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                    All Benefits:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {protocol.benefits.map((benefit, index) => (
                      <Chip 
                        key={index}
                        label={benefit} 
                        size="small" 
                        variant="filled"
                        sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>

      {protocols.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No protocols found in this category.
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          ✅ {addedProtocol?.title} added to your wall!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProtocolLibrary;
