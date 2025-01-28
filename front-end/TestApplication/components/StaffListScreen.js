import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const StaffListScreen = ({ navigation }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("", {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      setStaffData(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error(error);
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
    navigation.navigate('StaffDetail', {
      staffName: staff.name,
      staffImage: staff.img,
      staffId: staff.staff_id,
      staffEmail: staff.email,
      staffMobile: staff.mobile
    });
  };

  const renderItem = ({ item }) => {
    // Default image URL (replace with your own placeholder image)
    const defaultImage = 'https://example.com/path/to/default-image.png';
    const staffImage = item.img && item.img !== '' ? item.img : defaultImage;

    return (
      <TouchableOpacity key={item.email} style={styles.staffBox} onPress={() => navigateToStaffDetail(item)}>
        {item.img && item.img !== '' ? (
        <Image source={{ uri: staffImage }} style={styles.staffImage} resizeMode="cover" />
        ):(
          <Icon name="user" size={30} color="#4CAF50" />
        )}
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{item.name}</Text>
          <Text style={styles.staffEmail}>{item.email}</Text>
          <Text style={styles.staffId}>{item.staff_id}</Text>
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
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={staffData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
  },
  staffBox: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    alignItems: 'center',
  },
  staffImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    overflow: 'hidden',
    resizeMode: 'cover', // Ensure the image covers the space correctly
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    color: '#333',
  },
  staffId: {
    fontSize: 18,
    color: '#333',
  },
  staffEmail: {
    fontSize: 14,
    color: '#666',
  },
});

export default StaffListScreen;
