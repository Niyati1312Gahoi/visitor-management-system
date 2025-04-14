import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, CheckCircle as CheckCircleIcon, Pending as PendingIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const VisitorDashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [requestForm, setRequestForm] = useState({
    hostEmail: '',
    purpose: '',
    visitDate: '',
    visitTime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activitiesRes, pendingRes] = await Promise.all([
        axios.get('/api/visitors/my-activities'),
        axios.get('/api/visitors/pending-requests')
      ]);
      setActivities(activitiesRes.data.data);
      setPendingRequests(pendingRes.data.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async () => {
    try {
      await axios.post('/api/visitors/request-visit', requestForm);
      setOpenRequestDialog(false);
      setRequestForm({
        hostEmail: '',
        purpose: '',
        visitDate: '',
        visitTime: ''
      });
      fetchData();
    } catch (err) {
      setError('Failed to create visit request');
      console.error(err);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'checked-in':
        return <Chip icon={<CheckCircleIcon />} label="Checked In" color="success" />;
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" />;
      default:
        return <Chip label={status} />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.name}!
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Pending Visit Requests</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenRequestDialog(true)}
                >
                  New Request
                </Button>
              </Box>
              <List>
                {pendingRequests.map((request) => (
                  <ListItem key={request._id}>
                    <ListItemText
                      primary={request.purpose}
                      secondary={`Host: ${request.hostEmployee.name} - ${format(new Date(request.visitDate), 'MMM dd, yyyy')} at ${request.visitTime}`}
                    />
                    <ListItemSecondaryAction>
                      {getStatusChip(request.status)}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {activities.map((activity) => (
                  <ListItem key={activity._id}>
                    <ListItemText
                      primary={activity.purpose}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Host: {activity.hostEmployee.name}
                          </Typography>
                          <br />
                          {activity.checkInTime && (
                            <Typography component="span" variant="body2">
                              Check-in: {format(new Date(activity.checkInTime), 'MMM dd, yyyy HH:mm')}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      {getStatusChip(activity.status)}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)}>
        <DialogTitle>New Visit Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Host Email"
                value={requestForm.hostEmail}
                onChange={(e) => setRequestForm({ ...requestForm, hostEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose"
                value={requestForm.purpose}
                onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Visit Date"
                InputLabelProps={{ shrink: true }}
                value={requestForm.visitDate}
                onChange={(e) => setRequestForm({ ...requestForm, visitDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Visit Time"
                InputLabelProps={{ shrink: true }}
                value={requestForm.visitTime}
                onChange={(e) => setRequestForm({ ...requestForm, visitTime: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Cancel</Button>
          <Button onClick={handleRequestSubmit} variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VisitorDashboard; 