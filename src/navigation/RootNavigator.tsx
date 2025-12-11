import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

import GetTheFactsScreen from '../screens/GetTheFactsScreen';
import PlacesScreen from '../screens/PlacesScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loader" component={LoaderScreen} />
      <Stack.Screen name="onboarding" component={OnboardingScreen} />
      <Stack.Screen name="registration" component={RegistrationScreen} />
      <Stack.Screen name="tabs" component={MainTabs} />
      <Stack.Screen name="getTheFacts" component={GetTheFactsScreen} />
      <Stack.Screen name="places" component={PlacesScreen} />
      <Stack.Screen name="placeDetail" component={PlaceDetailScreen} />
    </Stack.Navigator>
  );
}
