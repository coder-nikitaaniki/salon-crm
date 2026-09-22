import React, { useState, useEffect } from 'react';
import api from '../api';
import { Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Box, Button, TextField } from '@mui/material';

function AdminDashboard() {
  const [salons, setSalons] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const salonRes = await api.get('/salons');
      setSalons(salonRes.data);
      const planRes = await api.get('/plans');
      setPlans(planRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    await api.post('/plans', data);
    e.target.reset();
    fetchData();
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>Super Admin Dashboard</Typography>
      
      <Box display="flex" gap={4} mb={4}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" mb={2}>Create New Plan</Typography>
          <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField name="name" label="Plan Name" size="small" required />
            <TextField name="price" label="Price" type="number" size="small" required />
            <TextField name="durationInDays" label="Duration (Days)" type="number" size="small" required />
            <TextField name="maxStaff" label="Max Staff" type="number" size="small" required />
            <TextField name="maxAppointments" label="Max Appointments" type="number" size="small" required />
            <Button type="submit" variant="contained">Create Plan</Button>
          </form>
        </Paper>

        <Paper sx={{ p: 0, flex: 2 }}>
          <Typography variant="h6" p={2}>Existing Plans</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Max Staff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan._id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{plan.durationInDays} days</TableCell>
                  <TableCell>{plan.maxStaff}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Paper>
        <Typography variant="h6" p={2}>Salons</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salons.map(salon => (
              <TableRow key={salon._id}>
                <TableCell>{salon.name}</TableCell>
                <TableCell>{salon.address}</TableCell>
                <TableCell>{salon.subscriptionStatus}</TableCell>
                <TableCell>{salon.currentPlan?.name || 'None'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default AdminDashboard;
