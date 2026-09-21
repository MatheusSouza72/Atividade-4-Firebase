import React from 'react';
import { useNavigation, useRoute } from 'expo-router';
import ContactListScreen from '../screens/ContactListScreen';

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();

  return <ContactListScreen {...({ navigation, route } as any)} />;
}