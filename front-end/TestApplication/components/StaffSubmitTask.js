import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SubmitTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        console.log("Retrieved Token:", storedToken); 
        if (storedToken) {
          setToken(storedToken);
        } else {
          Alert.alert('Error', 'Authentication token is missing.');
        }
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
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx
        ]
      });

      setSelectedFile(result[0]); // Save selected file
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker');
      } else {
        console.error('File Picker Error:', err);
        Alert.alert('Error', 'Failed to pick file.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!task.title || !task.description) {
      Alert.alert("Error", "Task title and description are required.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      formData.append(
        "task",
        JSON.stringify({
          title: task.title,
          description: task.description,
          staffId: task.staffId || "unknown",
          message: message,
          id:task.id,
        })
      );

      // Send request
      const response = await axios.post(
        "http://192.168.4.171:8083/staff/submitTask",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);  


      if (response.status === 200) {
        Alert.alert("Success", "Task submitted successfully!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);}
       else {
        Alert.alert("Error", "Failed to submit task.");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      Alert.alert("Error", "Network error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title:</Text>
      <Text style={styles.value}>{task.title}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{task.description}</Text>

      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Enter your message..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.fileButton} onPress={handleFileUpload}>
        <Text style={styles.fileButtonText}>
          {selectedFile ? `📂 ${selectedFile.name}` : '📁 Pick a File'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  textarea: {
    height: 120,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
  fileButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  fileButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubmitTaskScreen;
