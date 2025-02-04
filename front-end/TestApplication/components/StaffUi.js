import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StaffUi = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, Staff!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default StaffUi;
