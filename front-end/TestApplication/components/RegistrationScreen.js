import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);  

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setToken(storedToken);  // Set the token to state
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert('Error', 'Failed to load authentication token.');
      }
    };
    
    fetchToken();
  }, []); 

  const handleRegister = () => {
    if (!name || !userName || !phoneNumber || !staffId || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    // Phone number validation
    const isValidPhoneNumber = /^\d{10}$/.test(phoneNumber);
    if (!isValidPhoneNumber) {
      Alert.alert('Error', 'Phone number should only contain digits and be 10 digits long.');
      return;
    }
  
    if (!token) {
      Alert.alert('Error', 'You must be logged in to register staff.');
      return;
    }
  
    const requestData = {
      username: userName,
      name: name,
      phoneNumber: phoneNumber,
      staffId: staffId,
      password: password,
    };
  
    fetch('http://192.168.102.76:8083/admin/createStaff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json(); 
        }
        return response.text(); 
      })
      .then((data) => {
        if (typeof data === 'string') {
          console.log('Raw Text Response:', data);
          if (data.includes("Successfully registered")) {
            Alert.alert('Success', 'Staff Registration Successful!');
            navigation.navigate('StaffList');
          } else {
            Alert.alert('Error', 'Registration failed.');
          }
        } else {
          if (data.success) {
            Alert.alert('Success', 'Staff Registration Successful!');
            navigation.navigate('StaffList');
          } else {
            Alert.alert('Error', data.message || 'Registration failed.');
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Error', 'Registration failed. Please try again.');
      });
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        placeholderTextColor="#888" 
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userName}
        onChangeText={(text) => setUserName(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888" 
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="phone-pad"
        maxLength={10}
        placeholderTextColor="#888" 
      />
      <TextInput
        style={styles.input}
        placeholder="Staff ID"
        value={staffId}
        onChangeText={(text) => setStaffId(text)}
        placeholderTextColor="#888" 
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholderTextColor="#888" 
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color:'black'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color:"black"
  },
});

export default RegistrationScreen;
