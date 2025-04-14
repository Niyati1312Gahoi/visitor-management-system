import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import VisitorForm from './pages/VisitorForm';
import Profile from './pages/Profile';
import VisitorDashboard from './pages/VisitorDashboard';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="visitors">
              <Route index element={<Visitors />} />
              <Route path="new" element={<VisitorForm />} />
              <Route path=":id" element={<VisitorForm />} />
            </Route>
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="/visitor-dashboard" element={
            <ProtectedRoute>
              <VisitorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 