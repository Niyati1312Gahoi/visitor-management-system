import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Login as CheckInIcon,
  Logout as CheckOutIcon
} from '@mui/icons-material';
import axios from 'axios';

const Visitors = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get('/api/visitors');
      setVisitors(response.data.data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      try {
        await axios.delete(`/api/visitors/${id}`);
        setVisitors(visitors.filter(visitor => visitor._id !== id));
      } catch (err) {
        console.error('Error deleting visitor:', err);
        setError('Failed to delete visitor');
      }
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await axios.put(`/api/visitors/${id}/checkin`);
      fetchVisitors();
    } catch (err) {
      console.error('Error checking in visitor:', err);
      setError('Failed to check in visitor');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.put(`/api/visitors/${id}/checkout`);
      fetchVisitors();
    } catch (err) {
      console.error('Error checking out visitor:', err);
      setError('Failed to check out visitor');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'checked-in':
        return 'success';
      case 'checked-out':
        return 'info';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Visitors</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/visitors/new')}
        >
          Add Visitor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitors.map((visitor) => (
              <TableRow key={visitor._id}>
                <TableCell>
                  {visitor.photo && (
                    <img
                      src={visitor.photo}
                      alt={visitor.fullName}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                    />
                  )}
                </TableCell>
                <TableCell>{visitor.fullName}</TableCell>
                <TableCell>{visitor.company}</TableCell>
                <TableCell>{visitor.purpose}</TableCell>
                <TableCell>{visitor.hostEmployee?.name}</TableCell>
                <TableCell>
                  <Chip
                    label={visitor.status}
                    color={getStatusColor(visitor.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {visitor.checkInTime
                    ? new Date(visitor.checkInTime).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {visitor.checkOutTime
                    ? new Date(visitor.checkOutTime).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/visitors/${visitor._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(visitor._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {visitor.status === 'approved' && !visitor.checkInTime && (
                    <IconButton
                      size="small"
                      onClick={() => handleCheckIn(visitor._id)}
                    >
                      <CheckInIcon />
                    </IconButton>
                  )}
                  {visitor.status === 'checked-in' && !visitor.checkOutTime && (
                    <IconButton
                      size="small"
                      onClick={() => handleCheckOut(visitor._id)}
                    >
                      <CheckOutIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Visitors; 