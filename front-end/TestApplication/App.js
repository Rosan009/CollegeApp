import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import HomeScreen from './components/HomeScreen';
import StaffListScreen from './components/StaffListScreen';
import TaskListScreen from './components/TaskListScreen';
import StaffDetailScreen from './components/StaffDetailScreen'; 
import TaskScreen from './components/TaskScreen';
import TaskView from './components/TaskView';
import StaffProfileScreen from './components/StaffProfileScreen';
import StaffTaskDetail from './components/StaffTaskDetail';
import  StaffUi  from './components/StaffUi';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StaffList" component={StaffListScreen} />
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="StaffDetail" component={StaffDetailScreen} />
        <Stack.Screen name="Task" component={TaskScreen} />
        <Stack.Screen name="TaskView" component={TaskView} />
        <Stack.Screen name="StaffProfile" component={StaffProfileScreen} />
        <Stack.Screen name="TaskDetail" component={StaffTaskDetail} />
        <Stack.Screen name="StaffUi" component={StaffUi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
