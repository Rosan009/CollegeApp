import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, FlatList } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const StaffForm = ({ route, navigation }) => {
  const { staffId, staffName } = route.params; // assuming staffId is passed through navigation params

  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState({}); // Store task statuses here
  const [errors, setErrors] = useState({}); // Store errors for each task

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Unauthorized. Please log in again.");
        navigation.replace("Login");
        return;
      }
      fetchTaskDetails(token);
    };

    const fetchTaskDetails = async (token) => {
      try {
        const response = await axios.get(`http://192.168.102.76:8083/staff/getTasks/${staffId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const tasks = response.data;
        if (tasks.length > 0) {
          setSubmittedTasks(tasks);
        } else {
          Alert.alert("No tasks found for the staff member.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        Alert.alert("Error fetching tasks, please try again.");
      }
    };

    checkAuth();
  }, [staffId, navigation]);

  const handleStatusChange = (text, taskId) => {
    setTaskStatuses({
      ...taskStatuses,
      [taskId]: text,
    });

    setErrors({
      ...errors,
      [taskId]: "",
    });
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Alert.alert("Error", "Unauthorized. Please log in again.");
      navigation.replace("Login");
      return;
    }

    // Validation: Check if all task statuses are filled in
    let validationErrors = {};
    let hasErrors = false;

    // Loop through all tasks and check if status is empty
    for (const task of submittedTasks) {
      const status = taskStatuses[task.id];
      if (!status || status.trim() === "") {
        validationErrors[task.id] = "This field is required"; // Mark the task as having an error
        hasErrors = true;
      }
    }

    // If errors exist, display them and do not proceed with submission
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    // Submit task statuses if no errors
    try {
      for (const taskId in taskStatuses) {
        const status = taskStatuses[taskId];
        const task = submittedTasks.find(item => item.id.toString() === taskId.toString());

        if (task) {
          await axios.post(
            "http://192.168.102.76:8083/staff/submitTaskStatus",
            {
              staffId, 
              staffName,
              taskTitle: task.title, 
              description: task.description,
              taskStatus: status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }
      Alert.alert("Task status submitted successfully");
      navigation.navigate("StaffDetail", { staffId, staffName });

    } catch (error) {
      console.error("Error submitting task:", error);
      Alert.alert("Error submitting task status.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Submit Task Status</Text>

      <FlatList
        data={submittedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.title}>📌 {item.title}</Text>
            <Text style={styles.message}>{item.description}</Text>

            <TextInput
              style={[styles.textArea, errors[item.id] && styles.errorInput]} // Apply error style
              placeholder="Enter Task Status"
              multiline
              numberOfLines={4}
              value={taskStatuses[item.id] || ""}
              onChangeText={(text) => handleStatusChange(text, item.id)}
              placeholderTextColor="#888" 
            />
            {errors[item.id] && (
              <Text style={styles.errorText}>{errors[item.id]}</Text> // Display error message
            )}
          </View>
        )}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  taskItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 16,
    marginTop: 5,
    color: "#555",
  },
  textArea: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    textAlignVertical: "top",
    color: "black",
  },
  errorInput: {
    borderColor: "red", 
  },
  errorText: {
    color: "red", 
    fontSize: 12,
    marginTop: 5,
  },
});

export default StaffForm;
