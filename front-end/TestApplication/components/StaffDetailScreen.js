// StaffDetailScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const StaffDetailScreen = ({ route }) => {
  const { staffName, staffMobile, staffImage, staffEmail, staffId } = route.params;

  return (
    <View style={styles.container}>
      <Image source={staffImage} style={styles.staffImage} />
      <Text style={styles.staffName}>{staffName}</Text>
      <Text style={styles.staffId}>ID: {staffId}</Text>
      <Text style={styles.staffId}>Email: {staffEmail}</Text>
      <Text style={styles.staffId}>Mobile: {staffMobile}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  staffImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  staffName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  staffId: {
    fontSize: 18,
    color: '#000',
  },
});

export default StaffDetailScreen;
