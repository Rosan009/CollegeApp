/* eslint-disable prettier/prettier */
// StaffProfileScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const tasks = [
  { title: 'Task 1', description: 'Description of Task 1' },
  { title: 'Task 2', description: 'Description of Task 2' },
  // Add more tasks as needed
];

const StaffProfileScreen = ({ route, navigation }) => {
  const { staffId } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', { task: item })}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff ID: {staffId}</Text>
      <Text style={styles.subHeader}>Tasks:</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
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
  subHeader: {
    fontSize: 20,
    marginBottom: 10,
  },
  taskCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    color: '#333',
  },
});

export default StaffProfileScreen;
