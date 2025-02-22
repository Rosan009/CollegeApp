import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // File upload icon
import axios from 'axios';

export const StaffChat = ({ route }) => {
  const { staffName, staffId } = route.params; // Assuming staffName and staffId are passed from previous screen
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');  

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

  const handleSubmit = async () => {
    if (message.trim() === '') {
      alert('Please type a message!');
      return;
    }
  
    try {
      const formData = new FormData();
  
      // Append file if it's selected
      if (file) {
        formData.append('file', {
          uri: file.uri,
          type: file.type, // 'application/pdf', etc.
          name: file.name,
        });
      }

        const taskData = {
        message: message,
        staffId: staffId,
      };
  
      formData.append('task', JSON.stringify(taskData));
  
      const response = await axios.post('http://10.0.2.2:8083/staff/sendMessage', formData, {
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
      <Text style={styles.title}>Staff Chat</Text>

      {/* Message Input */}
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        multiline
      />

      <View style={styles.actionsContainer}>
        {/* File Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Icon name="attach-file" size={30} color="#007bff" />
        </TouchableOpacity>

        {/* Send Button */}
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
