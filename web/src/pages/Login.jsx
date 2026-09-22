import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data, res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={8}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3} textAlign="center">Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" type="email" margin="normal"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <TextField
            fullWidth label="Password" type="password" margin="normal"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
