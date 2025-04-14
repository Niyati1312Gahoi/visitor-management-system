import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'visitor',
    department: 'None'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Handle department changes based on role
      if (name === 'role') {
        newData.department = value === 'visitor' ? 'None' : '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department || 'None'
      });

      if (response.data.success) {
        await login(response.data.token, response.data.user);
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/visitor-dashboard');
        }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleFields = () => {
    if (formData.role === 'admin') {
      return (
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            error={formData.role === 'admin' && !formData.department}
            helperText={
              formData.role === 'admin' && !formData.department
                ? 'Department is required for admin'
                : ''
            }
          >
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Management">Management</MenuItem>
          </TextField>
        </Grid>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%'
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Create a new account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!formData.name}
                helperText={!formData.name ? 'Name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!formData.email}
                helperText={!formData.email ? 'Email is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="visitor">Visitor</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </TextField>
            </Grid>
            {getRoleFields()}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={formData.password.length > 0 && formData.password.length < 6}
                helperText={
                  formData.password.length > 0 && formData.password.length < 6
                    ? 'Password must be at least 6 characters long'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                }
                helperText={
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register; 