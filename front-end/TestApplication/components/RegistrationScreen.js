/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  const handleImagePicker = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleRegister = () => {
    if (!name || !email || !phoneNumber || !staffId || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Phone number should be 10 digits.');
      return;
    }

    // Create FormData object for image if you want to upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('staff_id', staffId);
    formData.append('mobile', phoneNumber);
    formData.append('password', password);

    if (image) {
      formData.append('image', {
        uri: image,
        type: 'image/jpeg', // or the appropriate mime type
        name: 'photo.jpg',
      });
    }

    // Make API call
    fetch('https://pactaworks.com/clg/reg.php', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) { // Adjust based on your API response structure
        Alert.alert('Success', 'Staff Registration Successful!');
        navigation.navigate('StaffList');
      } else {
        Alert.alert('Error', data.message || 'Registration failed.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff Registration</Text>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Icon name="user-circle" size={100} color="#ccc" />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Staff ID"
        value={staffId}
        onChangeText={(text) => setStaffId(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default RegistrationScreen;
