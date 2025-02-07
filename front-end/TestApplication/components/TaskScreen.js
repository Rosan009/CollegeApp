import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import { readFile } from 'react-native-fs'; // To read file and encode it to base64

const TaskScreen = ({ route, navigation }) => {
  const { staffName,StaffId } = route.params;
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');

  // Fetch token from AsyncStorage when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        console.log("Token fetched:", storedToken);  // Debug: Log token fetched
        setToken(storedToken);  // Set token to state
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert('Error', 'Failed to load authentication token.');
      }
    };
    
    fetchToken();
  }, []);

  // 📂 Handle File Selection
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.ppt, DocumentPicker.types.pptx, DocumentPicker.types.doc, DocumentPicker.types.docx],
      });

      setFile(result[0]); // Save selected file
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker');
      } else {
        console.error('File Picker Error:', err);
        Alert.alert('Error', 'Failed to pick file.');
      }
    }
  };

  // 📤 Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!taskTitle || !taskDescription) {
      Alert.alert("Error", "Both title and description are required.");
      return;
    }
  
    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }
  
    try {
    
      const formData = new FormData();
      formData.append("task", "Task description here");
      formData.append("file", file);
  
      // Convert the task details to JSON and append it
      formData.append(
        "task",
        new Blob(
          [
            JSON.stringify({
              title: taskTitle,
              description: taskDescription,
              staffId:StaffId,
            }),
          ],
          { type: "application/json" }
        )
      );
  
      // Send request
      const response = await axios.post(
        "http://10.0.2.2:8083/admin/addTask",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Success", "Task added successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Network error occurred. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task for {staffName}</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Description"
        value={taskDescription}
        onChangeText={setTaskDescription}
        multiline
      />

      <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Select File</Text>
      </TouchableOpacity>

      {file && <Text style={styles.fileName}>Selected: {file.name}</Text>}

      <View style={styles.buttonContainer}>
        <Button title="Add Task" onPress={handleSubmit} color="#28A745" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  header: { fontSize: 24, marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, borderRadius: 5 },
  textArea: { height: 100, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 5 },
  uploadButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  uploadText: { color: '#FFFFFF', fontSize: 16 },
  fileName: { marginTop: 5, color: '#333', textAlign: 'center' },
  buttonContainer: { marginTop: 10 },
});

export default TaskScreen;
