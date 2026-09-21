import React from 'react';
import { useNavigation, useRoute } from 'expo-router';
import LoginScreen from '../screens/LoginScreen';

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();

  const screenProps: any = { navigation, route };

  return <LoginScreen {...screenProps} />;
}