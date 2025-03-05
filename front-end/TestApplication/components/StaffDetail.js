/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height } = Dimensions.get('window');

const StaffDetail = ({ route, navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { staffId, staffName } = route.params;

  useEffect(() => {
    fetchTasks();
  }, [staffId]);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Unauthorized. Please log in again.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`http://192.168.4.171:8083/staff/getTasks/${staffId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <View style={styles.staffInfoContainer}>
            <Text style={styles.staffName}>{staffName}</Text>
            <Text style={styles.staffId}>ID: {staffId}</Text>
          </View>
  
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('StaffChat', { staffId, staffName })}>
              <Icon name="message" size={100} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('StaffUi', { staffId })}>
              <Icon name="visibility" size={100} color="#28a745" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  staffInfoContainer: {
    height: height * 0.4, // Takes 40% of screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  staffId: {
    fontSize: 28,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30, // Adjusted gap to 30 for more space between the icons
    marginTop: 20,
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default StaffDetail;
