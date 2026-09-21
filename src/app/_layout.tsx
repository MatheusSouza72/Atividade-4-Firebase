import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ title: 'Criar Conta' }} />
      <Stack.Screen name="ContactList" options={{ headerShown: false }} />
      <Stack.Screen name="ContactForm" options={{ title: 'Contato' }} />
      <Stack.Screen name="ContactDetail" options={{ title: 'Detalhes do Contato' }} />
      <Stack.Screen name="Profile" options={{ title: 'Meu Perfil' }} />
    </Stack>
  );
}