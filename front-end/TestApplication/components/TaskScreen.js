import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const TaskScreen = ({ route, navigation }) => {
  const { staffName, staffImage } = route.params;
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleFileUpload = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setFile(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    if (!taskTitle || !taskDescription) {
      Alert.alert('Error', 'Both title and description are required.');
      return;
    }
    
    // Create the task object
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      file,
    };

    // Use a callback to add the task to TaskListScreen
    navigation.navigate('TaskList', { addTask: (task) => {
      // Add the task to the tasks state in TaskListScreen
      addTask(newTask);
    }});

    Alert.alert('Success', 'Task added successfully!'); // Show success message
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Task for {staffName}</Text>
        <TouchableOpacity>
          <Image source={staffImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

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

      <View style={styles.uploadContainer}>
        <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
          <Icon name="upload" size={30} color="#FFFFFF" />
          <Text style={styles.uploadText}>Upload File</Text>
        </TouchableOpacity>
        {file && <Text style={styles.fileName}>Uploaded: {file}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Add Task" onPress={handleSubmit} color="#28A745" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  uploadContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  uploadText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  fileName: {
    marginTop: 5,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default TaskScreen;
