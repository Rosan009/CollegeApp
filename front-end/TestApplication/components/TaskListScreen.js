import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // State to store tasks

  const navigateToTask = (staffId, staffName, staffImage) => {
    navigation.navigate('Task', { staffId, staffName, staffImage, addTask: addTask });
  };

  const navigateToTaskView = (task) => {
    navigation.navigate('TaskView', task);
  };

  const addTask = (task) => {
    setTasks([...tasks, task]);
    Alert.alert('Success', 'Task added successfully!');
  };

  const renderItem = ({ item }) => (
    <View style={styles.staffBox}>
      <TouchableOpacity
        onPress={() => navigateToTask(item.staffId, item.staffName, item.staffImage)}
        style={styles.staffInfoContainer}
      >
        <Image source={item.staffImage} style={styles.staffImage} />
        <Text style={styles.staffName}>{item.staffName}</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigateToTask(item.staffId, item.staffName, item.staffImage)}>
          <Icon name="plus" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToTaskView(tasks.find(task => task.staffId === item.staffId))}>
          <Icon name="eye" size={24} color="#28A745" style={styles.iconMargin} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.staffId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  staffBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  staffImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  staffInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginLeft: 15,
  },
});

export default TaskListScreen;
