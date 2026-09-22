import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('owner@test.com');
  const [password, setPassword] = useState('password');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigation.replace('Dashboard', { user: res.data });
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon CRM Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
