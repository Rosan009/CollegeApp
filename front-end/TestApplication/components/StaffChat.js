import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // File upload icon
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

export const StaffChat = ({ route }) => {
  const { staffId,staffName } = route.params;
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.error("No token found.");
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
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.ppt, DocumentPicker.types.pptx, DocumentPicker.types.doc, DocumentPicker.types.docx],
      });

      setFile(result);
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
    if (message.trim() === '') {
      alert('Please type a message!');
      return;
    }

    if (!token) {
      alert('Authorization token is missing.');
      return;
    }

    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', {
          uri: file.uri,
          type: file.type, // 'application/pdf', etc.
          name: file.name,
        });
      }

      const taskData = JSON.stringify({ message, staffId });

      formData.append('task', {
        string: taskData,
        type: 'application/json',
      });

      const response = await axios.post('http://192.168.102.76:8083/staff/sendMessage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage('');
        setFile(null);
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{staffName} Chat</Text>

      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        placeholderTextColor="#888" 
        multiline
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Icon name="attach-file" size={30} color="#007bff" />
        </TouchableOpacity>

        <Button title="Send" onPress={handleSubmit} color="#007bff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black'
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  uploadButton: {
    padding: 10,
  },
});

export default StaffChat;
