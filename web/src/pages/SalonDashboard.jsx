import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Box, Alert, Button, TextField, Chip } from '@mui/material';

function SalonDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [salon, setSalon] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = () => {
    api.get('/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => {
        if(err.response?.status === 403) {
          setError(err.response.data.message);
        }
      });
      
    api.get('/clients')
      .then(res => setClients(res.data))
      .catch(console.error);

    api.get('/salons/my-salon')
      .then(res => setSalon(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.staffId = user._id; 
    
    try {
      await api.post('/appointments', data);
      fetchData();
      e.target.reset();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book');
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    try {
      await api.post('/clients', data);
      fetchData();
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add client');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Salon Dashboard</Typography>
        {user.role === 'SALON_OWNER' && salon && (
          <Chip 
            label={`Subscription: ${salon.subscriptionStatus}`} 
            color={salon.subscriptionStatus === 'ACTIVE' ? 'success' : 'error'} 
          />
        )}
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Box display="flex" gap={4} mb={4}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" mb={2}>Book Appointment</Typography>
          <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField name="clientName" label="Client Name" size="small" required />
            <TextField name="service" label="Service" size="small" required />
            <TextField name="date" type="date" size="small" required InputLabelProps={{ shrink: true }} />
            <Box display="flex" gap={2}>
              <TextField name="startTime" label="Start Time (HH:mm)" size="small" required />
              <TextField name="endTime" label="End Time (HH:mm)" size="small" required />
            </Box>
            <Button type="submit" variant="contained" disabled={!!error && error.includes('expired')}>Book</Button>
          </form>
        </Paper>

        <Paper sx={{ p: 0, flex: 2 }}>
          <Typography variant="h6" p={2}>Today's Appointments</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map(appt => (
                <TableRow key={appt._id}>
                  <TableCell>{appt.clientName}</TableCell>
                  <TableCell>{appt.service}</TableCell>
                  <TableCell>{appt.startTime} - {appt.endTime}</TableCell>
                  <TableCell>{appt.status}</TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow><TableCell colSpan={4} align="center">No appointments</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Box display="flex" gap={4}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" mb={2}>Add Client</Typography>
          <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField name="name" label="Name" size="small" required />
            <TextField name="phone" label="Phone" size="small" required />
            <Button type="submit" variant="contained">Add Client</Button>
          </form>
        </Paper>

        <Paper sx={{ p: 0, flex: 2 }}>
          <Typography variant="h6" p={2}>Clients Directory</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client._id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && (
                <TableRow><TableCell colSpan={2} align="center">No clients</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}

export default SalonDashboard;
