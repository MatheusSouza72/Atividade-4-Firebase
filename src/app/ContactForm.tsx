import React from 'react';
import { useNavigation, useRoute } from 'expo-router';
import ContactFormScreen from '../screens/ContactFormScreen';

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();

  return <ContactFormScreen {...({ navigation, route } as any)} />;
}