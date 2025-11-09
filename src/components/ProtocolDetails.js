import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { subDays, isWithinInterval, format } from 'date-fns';

const ProtocolDetails = ({ protocol }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  const getComplianceHistory = () => {
    return last7Days.map(day => {
      const completed = protocol.progressHistory?.some(entry => 
        new Date(entry.date).toDateString() === day.toDateString()
      );
      return { date: day, completed };
    });
  };

  const calculateSuccessRate = () => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const completionsInLast7Days = protocol.progressHistory?.filter(entry => 
      isWithinInterval(new Date(entry.date), { start: sevenDaysAgo, end: new Date() })
    ).length || 0;
    return Math.round((completionsInLast7Days / 7) * 100);
  };

  const complianceHistory = getComplianceHistory();
  const successRate = calculateSuccessRate();

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Last 7 Days
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {complianceHistory.map(({ date, completed }) => (
          <Chip
            key={date.toISOString()}
            label={format(date, 'EEE')}
            size="small"
            color={completed ? 'success' : 'default'}
            variant={completed ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
      <Typography variant="subtitle2" color="text.secondary">
        Success Rate (7d): {successRate}%
      </Typography>
    </Box>
  );
};

export default ProtocolDetails;
