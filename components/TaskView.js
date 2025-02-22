// TaskView.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskView = ({ route }) => {
  const { taskTitle, taskDescription, file } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{taskTitle}</Text>
      <Text style={styles.description}>{taskDescription}</Text>
      {file && <Text style={styles.fileText}>Uploaded File: {file}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  fileText: {
    fontSize: 16,
    color: '#555',
  },
});

export default TaskView;
