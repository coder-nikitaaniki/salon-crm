import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SalonDashboard from './pages/SalonDashboard';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Salon CRM
          </Typography>
          {user && (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.name} ({user.role})
              </Typography>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            !user ? <Navigate to="/login" /> :
            user.role === 'SUPER_ADMIN' ? <AdminDashboard /> :
            <SalonDashboard />
          } />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
