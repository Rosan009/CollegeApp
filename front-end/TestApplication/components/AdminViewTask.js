import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';

const AdminViewTask = ({ route, navigation }) => {
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

      const response = await fetch(`http://192.168.102.76:8083/admin/getTasks/${staffId}`, {
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
      Alert.alert('Error', 'No valid file found');
      return;
    }

    try {
      const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(localFile, fileData, 'base64');

      await FileViewer.open(localFile);
    } catch (error) {
      console.error("File Open Error:", error);
      Alert.alert('Error', 'Cannot open the file. Ensure you have an appropriate app installed.');
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
   
export default AdminViewTask;
