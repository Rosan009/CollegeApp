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
import StaffTaskDetail from './components/StaffTaskDetail';
import  StaffUi  from './components/StaffUi';
import StaffDetail from './components/StaffDetail';
import StaffChat from './components/StaffChat';
import AdminChat from './components/AdminChat';
import AdminViewTask from './components/AdminViewTask';
import StaffSubmitTask from './components/StaffSubmitTask';
import SubmitTaskScreen from './components/SubmitTaskScreen';

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
        <Stack.Screen name="TaskDetail" component={StaffTaskDetail} />
        <Stack.Screen name="StaffUi" component={StaffUi} />
        <Stack.Screen name="StaffDetail" component={StaffDetail} />
        <Stack.Screen name="StaffChat" component={StaffChat} />
        <Stack.Screen name="AdminChat" component={AdminChat} />
        <Stack.Screen name="AdminViewTask" component={AdminViewTask} />
        <Stack.Screen name="StaffSubmitTask" component={StaffSubmitTask} />
        <Stack.Screen name="SubmitTaskScreen" component={SubmitTaskScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
