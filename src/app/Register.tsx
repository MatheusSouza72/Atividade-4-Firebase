import React from 'react';
import { useNavigation, useRoute } from 'expo-router';
import RegisterScreen from '../screens/RegisterScreen';

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();

  return <RegisterScreen {...({ navigation, route } as any)} />;
}