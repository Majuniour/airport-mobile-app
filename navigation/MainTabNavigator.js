import React from 'react';
import { Platform, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import TimetableScreen from '../screens/TimetableScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'HOME',
  tabBarVisible: false,
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  tabBarOptions:{
    showLabel: true,
    style: {
      backgroundColor: '#10044c',
    },
    labelStyle: {
      fontSize: 8,
    },
  },
  tabBarIcon: ({ focused }) => {
    return <Image
    source={require('../assets/images/homemenu.png')}
    style={{width: 30, height: 30}}
  />
  },
};

HomeStack.path = '';

const TimetableStack = createStackNavigator(
  {
    Timetable: TimetableScreen,
  },
  config
);

TimetableStack.navigationOptions = {
  tabBarLabel: 'Schedule',
  tabBarVisible: false,
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  tabBarOptions:{
    showLabel: true,
    style: {
      backgroundColor: '#10044c',
    },
    labelStyle: {
      fontSize: 8,
    },
  },
  tabBarIcon: ({ focused }) => {
    return <Image
    source={require('../assets/images/profile.png')}
    style={{width: 30, height: 30}}
  />
  },
};

TimetableStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  TimetableStack,
});

tabNavigator.path = '';

export default tabNavigator;
