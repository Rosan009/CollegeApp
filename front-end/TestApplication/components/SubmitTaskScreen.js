import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const SubmitTaskScreen = ({ route }) => {
  const { staffId } = route.params;
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmittedTasks();
  }, [staffId]);

  const fetchSubmittedTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Unauthorized. Please log in again.');
        return;
      }

      const response = await fetch(`http://192.168.102.76:8083/admin/getSubmittedTasks/${staffId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submitted tasks');
      }

      const data = await response.json();
      console.log(data);
      setSubmittedTasks(data);
    } catch (error) {
      console.error('Error fetching submitted tasks:', error);
      Alert.alert('Error', 'Failed to load submitted tasks.');
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
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : submittedTasks.length === 0 ? (
        <Text style={styles.noTaskText}>No submitted tasks found.</Text>
      ) : (
        <FlatList
          data={submittedTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.title}>📌 {item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              
              {item.submittedAt && (
                <Text style={styles.taskDate}>
                  Sent at: {moment(item.submittedAt).format('DD-MM-YYYY | hh:mm A')}
                </Text>
              )}
              
              {item.fileData ? (
                <TouchableOpacity 
                  onPress={() => openFile(item.fileData, item.fileName, item.fileType)}
                >
                  <Text style={styles.fileLink}>📂 Open File</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noFile}>No file available</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  taskDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  noTaskText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  fileLink: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  noFile: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
  },
});

export default SubmitTaskScreen;
