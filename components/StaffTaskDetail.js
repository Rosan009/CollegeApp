import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'; 

const StaffTaskDetail = ({ route }) => {
  const { task } = route.params;
  const [file, setFile] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  const handleFileUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setFile(result);
      Alert.alert('File Uploaded', result.name);
    }
  };

  const handleChatSubmit = () => {
    Alert.alert('Chat Message', chatMessage);
    setChatMessage(''); // Clear chat input after submission
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>

      <Button title="Upload File" onPress={handleFileUpload} />
      {file && <Text style={styles.fileName}>Uploaded: {file.name}</Text>}

      <TextInput
        style={styles.chatInput}
        placeholder="Type a message..."
        value={chatMessage}
        onChangeText={setChatMessage}
      />
      <Button title="Send Message" onPress={handleChatSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
  },
  fileName: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
  chatInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default StaffTaskDetail;
