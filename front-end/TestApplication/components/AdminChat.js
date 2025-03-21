import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const AdminChat = ({ route, navigation }) => {
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

      const response = await fetch(`http://192.168.102.76:8083/admin/getMessage/${staffId}`, {
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

   const openFile = async (fileData, fileName, fileType) => {
      if (!fileData || !fileName || !fileType) {
        Alert.alert('Error', 'File data or metadata is missing');
        return;
      }
  
      try {
        const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
        await RNFS.writeFile(localFilePath, fileData, 'base64');
  
        const fileExists = await RNFS.exists(localFilePath);
        if (!fileExists) {
          Alert.alert('Error', 'File could not be saved');
          return;
        }
  
        await FileViewer.open(localFilePath, { showOpenWithDialog: true });
      } catch (error) {
        console.error('File Open Error:', error);
        Alert.alert('Error', 'Unable to open the file.');
      }
    };
  

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{staffId}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.message}</Text>

              {item.fileData ? (
              <TouchableOpacity onPress={() => openFile(item.fileData, item.fileName, item.fileType)}>
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
  fileLink: { fontSize: 16, color: '#007BFF', textDecorationLine: 'underline', marginTop: 10 },
  noFile: { fontSize: 14, color: 'red', marginTop: 5 },
  noTasks: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
});

export default AdminChat;
