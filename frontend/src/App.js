import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Products from './components/Products';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
          >
            <Navbar />
            <Box
                component="main"
                sx={{
                  flex: 1,
                  py: 3,
                  px: 2,
                }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                      <PrivateRoute adminOnly>
                        <AdminPanel />
                      </PrivateRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Products />
                      </PrivateRoute>
                    }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </MuiThemeProvider>
  );
}

export default App;