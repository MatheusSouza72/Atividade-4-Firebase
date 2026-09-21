import React from 'react';
import { useNavigation, useRoute } from 'expo-router';
import ContactDetailScreen from '../screens/ContactDetailScreen';

export default function Page() {
  const navigation = useNavigation();
  const route = useRoute();

  return <ContactDetailScreen {...({ navigation, route } as any)} />;
}