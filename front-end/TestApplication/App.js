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
import StaffTaskDetail from './components/StaffTaskDetail';
import  StaffUi  from './components/StaffUi';
import StaffDetail from './components/StaffDetail';
import StaffChat from './components/StaffChat';
import AdminChat from './components/AdminChat';
import AdminViewTask from './components/AdminViewTask';

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
        <Stack.Screen name="StaffDetailScreen" component={StaffDetailScreen} />
        <Stack.Screen name="Task" component={TaskScreen} />
        <Stack.Screen name="TaskView" component={TaskView} />
        <Stack.Screen name="TaskDetail" component={StaffTaskDetail} />
        <Stack.Screen name="StaffUi" component={StaffUi} />
        <Stack.Screen name="StaffDetail" component={StaffDetail} />
        <Stack.Screen name="StaffChat" component={StaffChat} />
        <Stack.Screen name="AdminChat" component={AdminChat} />
        <Stack.Screen name="AdminViewTask" component={AdminViewTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
