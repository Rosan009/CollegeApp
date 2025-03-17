import React, { useState } from 'react';
import { View, Alert, TouchableOpacity, Text ,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => 
  {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);

  const openFile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You are not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

    if (currentHour < 16 || (currentHour === 16 && currentMinute < 26)) {
      Alert.alert('Error', 'The report can only be viewed after 4:26 PM.');
      setLoading(false);
      return;
    }

      const response = await axios.get('http://192.168.102.76:8083/admin/report', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.error) {
        Alert.alert('Error', response.data.error);
        setLoading(false);
        return;
      }

      const { fileData, fileName, fileType } = response.data;

      if (!fileData || !fileName || !fileType) {
        Alert.alert('Error', 'File data or metadata is missing');
        return;
      }

      setFileName(fileName);
      setFileType(fileType);

      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(localFilePath, fileData, 'base64');

      const fileExists = await RNFS.exists(localFilePath);
      if (!fileExists) {
        Alert.alert('Error', 'File could not be saved');
        return;
      }

      await FileViewer.open(localFilePath, { showOpenWithDialog: true });
    } catch (error) {
      console.error('Error fetching or opening file:', error);
      Alert.alert('Error', 'Failed to fetch or open the report. Please try again later.');
    } finally {
      setLoading(false);
    }}
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('StaffList')}>
        <Icon name="group" size={100} color="#4CAF50" />
        <Text style={styles.iconLabel}>Staffs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('TaskList')}>
        <Icon name="check-square" size={100} color="#4CAF50" />
        <Text style={styles.iconLabel}>Tasks</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress= {openFile}>
        <Icon name="file-text" size={100} color="#4CAF50" />
        <Text style={styles.iconLabel}>View Today Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
