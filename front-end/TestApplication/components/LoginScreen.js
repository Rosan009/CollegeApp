import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8083/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      let text = await response.text(); // Read response as text
      console.log("Raw Response:", text);
  
      // Check if response is empty
      if (!text) {
        throw new Error('Empty response from server');
      }
  
      let data = JSON.parse(text); // Parse JSON if valid
      console.log("API Response:", data);
  
      if (response.ok) {
        await AsyncStorage.setItem('authToken', data.token);
        const userRole = data.role;
  
        console.log("User Role:", userRole);
  
        if (userRole === 'ADMIN') {
          navigation.replace('Home');
        } else if (userRole === 'STAFF') {
          navigation.replace('StaffUi');
        } else {
          Alert.alert('Error', 'Invalid user role');
        }
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../components/img/psna.jpg')} style={styles.logo} />
      <Text style={styles.title}>Log</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#f5f5f5' },
  logo: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20, resizeMode: 'cover' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, fontSize: 16, color: '#333', marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default LoginScreen;
