import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  CheckCircle,
  Schedule,
  Star,
  Insights,
  CalendarToday,
  Timeline
} from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const ProgressTracking = ({ protocols }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const handleTimeframeChange = (event, newValue) => {
    setSelectedTimeframe(newValue);
  };

  const getTimeframeData = () => {
    const now = new Date();
    let startDate, endDate, label;

    switch (selectedTimeframe) {
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        label = 'This Week';
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        label = 'This Month';
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        label = 'Last 7 Days';
    }

    return { startDate, endDate, label };
  };

  const calculateOverallProgress = () => {
    if (protocols.length === 0) return 0;
    
    const protocolsWithProgress = protocols.filter(p => p.progress);
    if (protocolsWithProgress.length === 0) return 0;
    
    const totalProgress = protocolsWithProgress.reduce((sum, p) => sum + p.progress.value, 0);
    return Math.round(totalProgress / protocolsWithProgress.length);
  };

  const getProgressTrend = () => {
    // This would typically come from historical data
    // For now, we'll simulate based on current progress
    const overallProgress = calculateOverallProgress();
    if (overallProgress >= 80) return { direction: 'up', color: 'success', icon: TrendingUp };
    if (overallProgress >= 60) return { direction: 'flat', color: 'warning', icon: TrendingFlat };
    return { direction: 'down', color: 'error', icon: TrendingDown };
  };

  const getTopPerformingProtocols = () => {
    return protocols
      .filter(p => p.progress)
      .sort((a, b) => b.progress.value - a.progress.value)
      .slice(0, 3);
  };

  const getNeedsAttentionProtocols = () => {
    return protocols
      .filter(p => p.progress && p.progress.value < 50)
      .sort((a, b) => a.progress.value - b.progress.value);
  };

  const getStreakDays = () => {
    // This would typically be calculated from historical data
    // For now, we'll simulate based on current progress
    const overallProgress = calculateOverallProgress();
    if (overallProgress >= 80) return 7;
    if (overallProgress >= 60) return 3;
    return 1;
  };

  const getProgressColor = (value) => {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'error';
  };

  const { startDate, endDate, label } = getTimeframeData();
  const overallProgress = calculateOverallProgress();
  const trend = getProgressTrend();
  const topProtocols = getTopPerformingProtocols();
  const needsAttention = getNeedsAttentionProtocols();
  const streakDays = getStreakDays();

  if (protocols.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No Progress Data Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start tracking protocols to see your progress here
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
          Add protocols to your wall and start tracking your daily progress.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          📊 Progress Tracking
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Insights />}
          sx={{ textTransform: 'none' }}
        >
          Detailed Analytics
        </Button>
      </Box>

      {/* Timeframe Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTimeframe}
          onChange={handleTimeframeChange}
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': { 
              fontSize: '0.9rem',
              fontWeight: 500
            } 
          }}
        >
          <Tab label="Last 7 Days" value="week" />
          <Tab label="This Week" value="week" />
          <Tab label="This Month" value="month" />
        </Tabs>
      </Paper>

      {/* Overall Progress Card */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Overall Progress
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                {overallProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={overallProgress} 
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <trend.icon color={trend.color} />
                <Typography variant="body2" color={`${trend.color}.main`}>
                  {trend.direction === 'up' ? 'Improving' : trend.direction === 'flat' ? 'Stable' : 'Needs attention'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Current Streak
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 700, mb: 1 }}>
                {streakDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {streakDays === 1 ? 'day' : 'days'} in a row
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Active Protocols
                </Typography>
              </Box>
              <Typography variant="h3" color="info.main" sx={{ fontWeight: 700, mb: 1 }}>
                {protocols.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {protocols.filter(p => p.progress).length} being tracked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Protocol Performance */}
      <Grid container spacing={3}>
        {/* Top Performing Protocols */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Top Performing Protocols
                </Typography>
              </Box>
              {topProtocols.length > 0 ? (
                <List>
                  {topProtocols.map((protocol, index) => (
                    <React.Fragment key={protocol.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={protocol.title}
                          secondary={`${protocol.progress.value}% completion`}
                        />
                        <LinearProgress 
                          variant="determinate" 
                          value={protocol.progress.value}
                          color={getProgressColor(protocol.progress.value)}
                          sx={{ width: 60, ml: 2 }}
                        />
                      </ListItem>
                      {index < topProtocols.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No progress data available yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Needs Attention */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Needs Attention
                </Typography>
              </Box>
              {needsAttention.length > 0 ? (
                <List>
                  {needsAttention.map((protocol, index) => (
                    <React.Fragment key={protocol.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Chip 
                            label="!" 
                            size="small" 
                            color="error"
                            sx={{ fontWeight: 600 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={protocol.title}
                          secondary={`${protocol.progress.value}% completion`}
                        />
                        <LinearProgress 
                          variant="determinate" 
                          value={protocol.progress.value}
                          color="error"
                          sx={{ width: 60, ml: 2 }}
                        />
                      </ListItem>
                      {index < needsAttention.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Great job! All your protocols are performing well.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Timeframe Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing data for {label} ({format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')})
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressTracking;
