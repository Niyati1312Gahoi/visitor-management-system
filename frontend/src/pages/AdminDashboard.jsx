import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Timer as TimerIcon,
  Search as SearchIcon,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const AdminDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    overstay: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, visitorsRes] = await Promise.all([
        axios.get('/api/visitors/stats'),
        axios.get('/api/visitors/active')
      ]);
      setStats(statsRes.data);
      setVisitors(visitorsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card sx={{ height: '100%', backgroundColor: 'white', borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
        </Box>
      </CardContent>
    </Card>
  );

  const handleAddVisitor = () => {
    // Navigate to add visitor form
  };

  const handleExport = () => {
    // Export visitor data
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Visitors" value={stats.total} icon={PeopleIcon} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Active Visitors" value={stats.active} icon={PersonAddIcon} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Overstay Visitors" value={stats.overstay} icon={TimerIcon} />
        </Grid>
      </Grid>

      {/* Visitor Log */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Visitor Log</Typography>
          <Box>
            <TextField
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddVisitor}
              sx={{ mr: 1 }}
            >
              Add Visitor
            </Button>
            <Button variant="contained" color="secondary" onClick={handleExport}>
              Export
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visitors
                .filter(visitor =>
                  Object.values(visitor).some(
                    value =>
                      value &&
                      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map((visitor) => (
                  <TableRow key={visitor._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>{visitor.name[0]}</Avatar>
                        {visitor.name}
                      </Box>
                    </TableCell>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.hostEmployee?.name}</TableCell>
                    <TableCell>
                      {visitor.checkInTime
                        ? format(new Date(visitor.checkInTime), 'h:mm a')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {visitor.checkOutTime
                        ? format(new Date(visitor.checkOutTime), 'h:mm a')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
          <Typography variant="body2" color="text.secondary" mr={2}>
            1-100
          </Typography>
          <IconButton size="small">
            <NavigateBefore />
          </IconButton>
          <IconButton size="small">
            <NavigateNext />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 