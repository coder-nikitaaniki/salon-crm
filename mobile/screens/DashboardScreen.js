import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import api from '../api';

export default function DashboardScreen({ route }) {
  const { user } = route.params;
  const [appointments, setAppointments] = useState([]);
  const [salon, setSalon] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        Alert.alert('Subscription Error', err.response.data.message);
      }
    }

    try {
      const salonRes = await api.get('/salons/my-salon');
      setSalon(salonRes.data);
    } catch (err) {
      console.log('Error fetching salon', err);
    }
  };

  const handleCheckIn = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const res = await api.post('/attendance/check-in', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      setCheckedIn(true);
      Alert.alert('Success', res.data.message);
    } catch (err) {
      Alert.alert('Check-In Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}</Text>
      <Text style={styles.subtitle}>Appointments Today: {appointments.length}</Text>
      <Text style={styles.subtitle}>Check-in Status: {checkedIn ? 'Checked In' : 'Not Checked In'}</Text>
      
      {salon && (
        <Text style={[styles.subtitle, { color: salon.subscriptionStatus === 'ACTIVE' ? 'green' : 'red' }]}>
          Subscription: {salon.subscriptionStatus}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Check In (GPS)" onPress={handleCheckIn} color="green" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Refresh Data" onPress={fetchData} />
      </View>

      <Text style={styles.listTitle}>Today's Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.clientName} - {item.service}</Text>
            <Text>{item.startTime} to {item.endTime}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 5 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: '#eee' },
  buttonContainer: { marginTop: 10 }
});
