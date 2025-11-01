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
  Alert
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Schedule,
  Star,
  CalendarToday
} from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, eachDayOfInterval } from 'date-fns';

const ProgressTracking = ({ protocols }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const handleTimeframeChange = (event, newValue) => {
    setSelectedTimeframe(newValue);
  };

  const getTimeframeData = () => {
    const now = new Date();
    let startDate, endDate, label;

    switch (selectedTimeframe) {
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        label = 'This Month';
        break;
      case 'week':
      default:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        label = 'This Week';
        break;
    }

    return { startDate, endDate, label };
  };

  const { startDate, endDate, label } = getTimeframeData();

  const filteredProtocols = protocols.map(protocol => ({
    ...protocol,
    progressHistory: protocol.progressHistory?.filter(entry => 
      isWithinInterval(new Date(entry.date), { start: startDate, end: endDate })
    ) || []
  }));

  const calculateOverallProgress = () => {
    if (filteredProtocols.length === 0) return 0;
    const totalPossibleCompletions = filteredProtocols.length * differenceInDays(endDate, startDate) + 1;
    const totalActualCompletions = filteredProtocols.reduce((sum, p) => sum + p.progressHistory.length, 0);
    return Math.round((totalActualCompletions / totalPossibleCompletions) * 100);
  };

  const getDaysApplied = () => {
    const allCompletionDates = new Set();
    filteredProtocols.forEach(p => {
      p.progressHistory.forEach(entry => {
        allCompletionDates.add(new Date(entry.date).toDateString());
      });
    });
    return allCompletionDates.size;
  };

  const getDaysAllSatisfied = () => {
    const interval = eachDayOfInterval({ start: startDate, end: endDate });
    let count = 0;
    interval.forEach(day => {
      const allDone = filteredProtocols.every(p => 
        p.progressHistory.some(entry => new Date(entry.date).toDateString() === day.toDateString())
      );
      if (allDone) {
        count++;
      }
    });
    return count;
  };

  const getTopPerformingProtocols = () => {
    return filteredProtocols
      .sort((a, b) => b.progressHistory.length - a.progressHistory.length)
      .slice(0, 3);
  };

  const getNeedsAttentionProtocols = () => {
    return filteredProtocols
      .filter(p => p.progressHistory.length === 0)
      .sort((a, b) => a.progressHistory.length - b.progressHistory.length);
  };

  const overallProgress = calculateOverallProgress();
  const daysApplied = getDaysApplied();
  const daysAllSatisfied = getDaysAllSatisfied();
  const topProtocols = getTopPerformingProtocols();
  const needsAttention = getNeedsAttentionProtocols();

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
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        📊 Progress Tracking
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTimeframe}
          onChange={handleTimeframeChange}
          variant="fullWidth"
        >
          <Tab label="This Week" value="week" />
          <Tab label="This Month" value="month" />
        </Tabs>
      </Paper>

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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Days Applied
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 700, mb: 1 }}>
                {daysApplied}
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
                  All Protocols Satisfied
                </Typography>
              </Box>
              <Typography variant="h3" color="info.main" sx={{ fontWeight: 700, mb: 1 }}>
                {daysAllSatisfied} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
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
                    <ListItem key={protocol.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={protocol.title}
                        secondary={`${protocol.progressHistory.length} completions`}
                      />
                    </ListItem>
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
                    <ListItem key={protocol.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={protocol.title}
                        secondary={`${protocol.progressHistory.length} completions`}
                      />
                    </ListItem>
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

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing data for {label} ({format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')})
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressTracking;
