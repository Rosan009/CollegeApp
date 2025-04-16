import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("http://192.168.102.76:8083/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      await AsyncStorage.setItem("authToken", data.token);
  
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
  
      console.log(`Current Time: ${hours}:${minutes}`); // Log the current time for debugging
  
      const staffFormAccessedToday = await AsyncStorage.getItem("staffFormAccessedToday");
      console.log(`staffFormAccessedToday: ${staffFormAccessedToday}`); // Log this value
      await AsyncStorage.removeItem("staffFormAccessedToday");

  
      if (data.role === "STAFF") {
        if (staffFormAccessedToday) {
          console.log("Navigating to StaffDetail as form was already accessed today.");
          navigation.navigate("StaffDetail", {
            staffId: data.staffId,
            staffName: data.staffName,
          });
          return;
        }
  
        if (hours === 20 && minutes >= 0 && minutes <= 55) {
          console.log("Navigating to StaffForm (within the allowed time).");
          navigation.navigate("StaffForm", {
            staffId: data
            .staffId,
            staffName: data.staffName,
          });
          
          await AsyncStorage.setItem("staffFormAccessedToday", "true");
        } else {
          console.log("Navigating to StaffDetail (outside the allowed time).");
          navigation.navigate("StaffDetail", {
            staffId: data.staffId,
            staffName: data.staffName,
          });
        }
      } else if (data.role === "ADMIN") {
        console.log("Navigating to Home (Admin Login).");
        navigation.navigate("Home");
      } else {
        console.log("Navigating to StaffDetail (Default case).");
        navigation.navigate("StaffDetail", {
          staffId: data.staffId,
          staffName: data.staffName,
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require("../components/img/WhatsApp Image 2025-04-16 at 09.47.48_124dd629.jpg")} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
