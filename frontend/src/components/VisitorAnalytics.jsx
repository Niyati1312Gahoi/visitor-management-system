import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const VisitorAnalytics = ({ timeLogs, visitorStats, firstTimeVisitors }) => {
  // Colors for the pie chart
  const COLORS = ['#FF9F40', '#FF6384', '#4BC0C0', '#36A2EB'];

  // Sample data for repeat visitor types
  const repeatVisitorData = [
    { name: 'Visitors', value: 35 },
    { name: 'Vendors', value: 25 },
    { name: 'Contract Staff', value: 20 },
    { name: 'Staff', value: 20 }
  ];

  return (
    <Grid container spacing={3}>
      {/* Time Logs */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Time Logs
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#2E7D32' }}>Visitor</TableCell>
                  <TableCell sx={{ color: '#2E7D32' }}>In</TableCell>
                  <TableCell sx={{ color: '#2E7D32' }}>Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.visitor}</TableCell>
                    <TableCell>{log.in}</TableCell>
                    <TableCell>{log.out}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* First Time Visitor Graph */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            First Time Visitor
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={firstTimeVisitors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Repeat Visitor % */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Repeat Visitor %
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repeatVisitorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {repeatVisitorData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Visitor Growth Graph */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Visitor Graph %
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitorStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VisitorAnalytics; 