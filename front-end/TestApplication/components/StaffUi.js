import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';

const StaffUi = ({ route, navigation }) => {
  const { staffId } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks(); // Re-fetch the tasks when screen is focused
    }, [])
  );

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Unauthorized. Please log in again.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`http://192.168.102.76:8083/staff/getTasks/${staffId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to fetch tasks');
        return;
      }

      const data = await response.json();
      console.log('Tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching tasks');
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

  const handleSubmitTask = (task) => {
    const isDeadlineExpired = moment().isAfter(moment(task.deadline));

    if (isDeadlineExpired) {
      Alert.alert('Meet Me', `Meet me today for not finishing the task: ${task.title}`);
    } else {
      navigation.navigate('StaffSubmitTask', { task });
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
          renderItem={({ item }) => {
            const isDeadlineExpired = moment().isAfter(moment(item.deadline));

            return (
              <View style={styles.taskItem}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>

                {item.createdAt && (
                  <Text style={styles.taskDate}>
                    Sent at: {moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </Text>
                )}

                {item.deadline && (
                  <Text style={styles.taskDeadline}>
                    Deadline: {moment(item.deadline).format('DD MMM YYYY, hh:mm A')}
                  </Text>
                )}

                {item.fileData ? (
                  <TouchableOpacity onPress={() => openFile(item.fileData, item.fileName, item.fileType)}>
                    <Text style={styles.fileLink}>📂 Open File</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.noFile}>No file available</Text>
                )}

                <TouchableOpacity
                  style={[styles.submitButton, isDeadlineExpired && styles.disabledButton]}
                  onPress={() => handleSubmitTask(item)}
                  disabled={isDeadlineExpired}
                >
                  <Text style={styles.submitButtonText}>Submit Task</Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
  taskDate: { fontSize: 14, color: '#888', marginTop: 5 },
  taskDeadline: { fontSize: 14, color: '#FF0000', marginTop: 5 },
  fileLink: { fontSize: 16, color: '#007BFF', textDecorationLine: 'underline', marginTop: 10 },
  noFile: { fontSize: 14, color: 'red', marginTop: 5 },
  noTasks: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#CCCCCC' },
});

export default StaffUi;
