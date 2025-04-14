import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VisitorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    hostEmployee: '',
    photo: null,
    status: 'pending'
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees');
        setEmployees(response.data.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    const fetchVisitor = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/visitors/${id}`);
          const visitor = response.data.data;
          setFormData({
            fullName: visitor.fullName,
            email: visitor.email,
            phone: visitor.phone,
            company: visitor.company,
            purpose: visitor.purpose,
            hostEmployee: visitor.hostEmployee,
            status: visitor.status
          });
        } catch (err) {
          console.error('Error fetching visitor:', err);
          setError('Failed to load visitor details');
        }
      }
    };

    fetchEmployees();
    if (id) fetchVisitor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (id) {
        await axios.put(`/api/visitors/${id}`, formData);
        setSuccess('Visitor updated successfully');
      } else {
        await axios.post('/api/visitors', formData);
        setSuccess('Visitor registered successfully');
      }
      setTimeout(() => navigate('/visitors'), 2000);
    } catch (err) {
      console.error('Error saving visitor:', err);
      setError(err.response?.data?.message || 'Failed to save visitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Visitor' : 'Register New Visitor'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose of Visit"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Host Employee"
                name="hostEmployee"
                value={formData.hostEmployee}
                onChange={handleChange}
                required
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name} - {employee.department}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                id="photo-upload"
                required={!id}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="contained"
                  component="span"
                  sx={{ mb: 2 }}
                >
                  {formData.photo ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </label>
              {formData.photo && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.photo}
                    alt="Visitor"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/visitors')}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default VisitorForm; 