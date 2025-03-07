import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StaffListScreen = ({ navigation }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        return;
      }

      const response = await axios.get('http://192.168.4.171:8083/admin/get', {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
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

  useEffect(() => {
    fetchData();
  }, []);

  const navigateToRegistration = () => {
    navigation.navigate('Register');
  };

  const navigateToStaffDetail = (staff) => {
    navigation.navigate('StaffDetailScreen', {
      staffName: staff.name,
      staffId: staff.staffId,
    });
  };

  const navigateToMessages = (staff) => {
    navigation.navigate('AdminChat', {
      staffId: staff.staffId,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.staffBox}>
        <Icon name="user" size={30} color="#4CAF50" />
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{item.name}</Text>
          <Text style={styles.staffId}>{item.staffId}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigateToStaffDetail(item)}>
            <Icon name="user-circle" size={25} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToMessages(item)}>
            <Icon name="envelope" size={25} color="#4CAF50" style={styles.messageIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToRegistration}>
          <Icon name="user-plus" size={30} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Members</Text>
        <Text></Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={staffData.filter(item => item.role !== "ADMIN")}
          renderItem={renderItem}
          keyExtractor={(item) => 
            <View>
          <Text>{item.name}</Text>
          <Text>{item.username}</Text>
          <Text>{item.staffId}</Text>
            </View>
        }  
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color:'black'
  },
  staffBox: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staffInfo: {
    flex: 1,
    marginLeft: 10,
  },
  staffName: {
    fontSize: 18,
    color: '#333',
  },
  staffUsername: {
    fontSize: 14,
    color: '#666',
  },
  staffId: {
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    marginLeft: 15,
  },
});

export default StaffListScreen;
