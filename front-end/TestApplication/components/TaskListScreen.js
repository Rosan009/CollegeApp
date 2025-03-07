import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskListScreen = ({ navigation }) => {
  const [staffData, setStaffData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [tasks, setTasks] = useState([]);  

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        return;
      }

      const response = await axios.get('http://192.168.4.171:8083/admin/get', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setStaffData(response.data);
      } else {
        Alert.alert('Error', 'Failed to fetch staff data.');
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      Alert.alert('Error', 'Failed to fetch staff data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToTask = (staffId, staffName) => {
    navigation.navigate('Task', { staffId, staffName });
  };

  const navigateToSubmissionPage = (staffId, staffName) => {
    navigation.navigate('SubmitTaskScreen', { staffId, staffName });
  };

  const renderItem = ({ item }) => (
    <View style={styles.staffBox}>
      <TouchableOpacity onPress={() => navigateToTask(item.staffId, item.name)} style={styles.staffInfoContainer}>
        <Text style={styles.staffName}>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigateToTask(item.staffId, item.name)}>
          <Icon name="plus" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("AdminViewTask", { staffId: item.staffId })}>
          <Icon name="eye" size={24} color="#28A745" style={styles.iconMargin} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToSubmissionPage(item.staffId, item.name)}>
          <Icon name="file-text" size={24} color="#FF6347" style={styles.iconMargin} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={staffData.filter(item => item.role !== "ADMIN")}
          renderItem={renderItem}
          keyExtractor={(item) => item.staffId.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  staffBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  staffInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginLeft: 15,
  },
});

export default TaskListScreen;
