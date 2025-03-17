import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const TaskScreen = ({ route, navigation }) => {
  const { staffName, staffId } = route.params;
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setToken(storedToken); 
      } catch (error) {
        console.error('Error retrieving token:', error);
        Alert.alert('Error', 'Failed to load authentication token.');
      }
    };
    
    fetchToken();
  }, []);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.ppt, DocumentPicker.types.pptx, DocumentPicker.types.doc, DocumentPicker.types.docx],
      });

      setFile(result[0]); 
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker');
      } else {
        console.error('File Picker Error:', err);
        Alert.alert('Error', 'Failed to pick file.');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!taskTitle || !taskDescription || !deadline) {
      Alert.alert("Error", "all feild are required.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
    
      formData.append(
        "task", 
        JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          staffId: staffId,
          deadline: deadline, 
        })
      );

      // Send request
      const response = await axios.post(
        "http://192.168.102.76:8083/admin/addTask",
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
        placeholderTextColor="#888" 
      />

      <TextInput
        style={styles.textArea}
        placeholder="Description"
        value={taskDescription}
        onChangeText={setTaskDescription}
        multiline
        placeholderTextColor="#888" 

      />

     <TextInput
      style={styles.input}
      placeholder="enter the date example:2,3"
      value={deadline}
      onChangeText={setDeadline}
      keyboardType="numeric"
      placeholderTextColor="#888" 
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
  header: { fontSize: 24, marginBottom: 20,color: '#000' },
  input: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 20, 
    paddingHorizontal: 10, 
    borderRadius: 5, 
    color: '#000',  // Black text color for user input
  },
  textArea: { 
    height: 100, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 20, 
    padding: 10, 
    borderRadius: 5, 
    color: '#000',  // Black text color for user input
  },
  uploadButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  uploadText: { color: '#FFFFFF', fontSize: 16 },
  fileName: { marginTop: 5, color: '#333', textAlign: 'center' },
  buttonContainer: { marginTop: 10 },
});


export default TaskScreen;
