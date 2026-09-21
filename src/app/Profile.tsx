import React from 'react';
import { useNavigation, useRoute } from 'expo-router';
import ProfileScreen from '../screens/ProfileScreen';

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();

  return <ProfileScreen {...({ navigation, route } as any)} />;
}