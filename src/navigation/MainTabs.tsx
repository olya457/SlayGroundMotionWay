import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { BottomTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SavedPlaceScreen from '../screens/SavedPlaceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const ICONS = {
  home: {
    active: require('../assets/home_active.png'),
    inactive: require('../assets/home_inactive.png'),
  },
  saved: {
    active: require('../assets/saved_active.png'),
    inactive: require('../assets/saved_inactive.png'),
  },
  profile: {
    active: require('../assets/profile_active.png'),
    inactive: require('../assets/profile_inactive.png'),
  },
  settings: {
    active: require('../assets/settings_active.png'),
    inactive: require('../assets/settings_inactive.png'),
  },
} as const;

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIcon: ({ focused }) => {
          let key: keyof typeof ICONS = 'home';
          if (route.name === 'saved') key = 'saved';
          if (route.name === 'profile') key = 'profile';
          if (route.name === 'settings') key = 'settings';

          const src = focused ? ICONS[key].active : ICONS[key].inactive;

          return (
            <Image
              source={src}
              style={[styles.icon, focused && styles.iconFocused]}
              resizeMode="contain"
            />
          );
        },

        tabBarStyle: [
          styles.tabbar,
          Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid,
        ],
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="saved" component={SavedPlaceScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    height: 60,
    left: 20,
    right: 20,
    bottom: 30,
    borderRadius: 40,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#bb7c0fff',
    paddingHorizontal: 8,
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  shadowAndroid: {
    elevation: 10,
  },

  icon: {
    width: 26,
    height: 26,
    transform: [{ translateY: 10 }, { scale: 1 }],
  },
  iconFocused: {
    transform: [{ translateY: 10 }, { scale: 1.08 }],
  },
});

export default styles;
