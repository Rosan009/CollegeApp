import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const StaffUi = ({ route, navigation }) => {
  const { staffId } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Unauthorized. Please log in again.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`http://10.0.2.2:8083/staff/getTasks/${staffId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      let text = await response.text();
      let data = JSON.parse(text);

      if (response.ok) {
        setTasks(data);
      } else {
        Alert.alert('Error', 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const openFile = async (filePath) => {
    if (!filePath) {
      Alert.alert('Error', 'No file found');
      return;
    }

    try {
      const fileUrl = filePath;  // Assume it's a valid URL
      const fileExtension = fileUrl.split('.').pop();
      const localFile = `${RNFS.DocumentDirectoryPath}/temp.${fileExtension}`;

      // Download the file to local storage
      const options = { fromUrl: fileUrl, toFile: localFile };
      await RNFS.downloadFile(options).promise;

      // Open the file
      await FileViewer.open(localFile);
    } catch (error) {
      console.error("File Open Error:", error);
      Alert.alert('Error', 'Cannot open the file. Make sure you have an appropriate app installed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>

              {item.filePath ? (
                <TouchableOpacity onPress={() => openFile(item.filePath)}>
                  <Text style={styles.fileLink}>📂 Open File</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noFile}>No file available</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTasks}>No tasks available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  taskDescription: { fontSize: 14, color: '#666', marginTop: 5 },
  fileLink: { fontSize: 16, color: '#007BFF', textDecorationLine: 'underline', marginTop: 10 },
  noFile: { fontSize: 14, color: 'red', marginTop: 5 },
  noTasks: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
});

export default StaffUi;
