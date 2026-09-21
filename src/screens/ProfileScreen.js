import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Feather name="user" size={32} color="#2563EB" />
        </View>
        <Text style={styles.emailText}>{user?.email || 'usuario@email.com'}</Text>
      </View>

      <View style={styles.menuGroup}>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="user" size={18} color="#64748B" />
          <Text style={styles.menuText}>Meus dados</Text>
          <Feather name="chevron-right" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="help-circle" size={18} color="#64748B" />
          <Text style={styles.menuText}>Ajuda</Text>
          <Feather name="chevron-right" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Bar de Navegação */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ContactList')}>
          <Feather name="users" size={20} color="#94A3B8" />
          <Text style={styles.navText}>Contatos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="user" size={20} color="#2563EB" />
          <Text style={[styles.navText, { color: '#2563EB' }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topHeader: { backgroundColor: '#2563EB', paddingTop: 50, paddingBottom: 16, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  profileBox: { alignItems: 'center', marginVertical: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  emailText: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  menuGroup: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#334155' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
});