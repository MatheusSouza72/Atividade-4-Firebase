import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Feather } from '@expo/vector-icons';

export default function ContactListScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    setError(false);
    try {
      const querySnapshot = await getDocs(collection(db, 'contatos'));
      const contactList = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setContacts(contactList);
      setFilteredContacts(contactList);
    } catch (err) {
      console.error('Erro ao carregar contatos do Firestore:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchContacts);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (text) => {
    setSearch(text);
    if (!text.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    const filtered = contacts.filter((c) =>
      c.nome?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const getInitials = (name) => {
    if (!name) return 'CT';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Meus Contatos</Text>
        <TouchableOpacity style={styles.addIconButton} onPress={() => navigation.navigate('ContactForm')}>
          <Feather name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Input de busca */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#94A3B8" />
        <TextInput
          placeholder="Buscar contato..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Estado de Carregamento */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : error ? (
        /* Tela de Erro de API */
        <View style={styles.centerContainer}>
          <View style={[styles.statusIconBox, { backgroundColor: '#FEF2F2' }]}>
            <Feather name="alert-triangle" size={32} color="#EF4444" />
          </View>
          <Text style={styles.statusTitle}>Não foi possível carregar os contatos.</Text>
          <Text style={styles.statusSubtitle}>Verifique sua conexão e tente novamente.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchContacts}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Lista de Contatos */
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ContactDetail', { contact: item, id: item.id })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(item.nome)}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.phone}>{item.telefone}</Text>
                <Text style={styles.city}>{item.cidade}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            /* Estado de Lista Vazia */
            <View style={styles.centerContainer}>
              <View style={[styles.statusIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Feather name="book-open" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.statusTitle}>Nenhum contato ainda</Text>
              <Text style={styles.statusSubtitle}>Adicione seus primeiros contatos para começar.</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('ContactForm')}>
                <Text style={styles.primaryButtonText}>Adicionar contato</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Bottom Bar de Navegação */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="users" size={20} color="#2563EB" />
          <Text style={[styles.navText, { color: '#2563EB' }]}>Contatos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Feather name="user" size={20} color="#94A3B8" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, backgroundColor: '#2563EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  addIconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 16, marginBottom: 8, paddingHorizontal: 14, height: 46, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#0F172A' },
  listContent: { paddingHorizontal: 16, paddingBottom: 80 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFEDD5', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 15, fontWeight: '700', color: '#C2410C' },
  cardInfo: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  phone: { fontSize: 13, color: '#64748B', marginTop: 2 },
  city: { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  centerContainer: { alignItems: 'center', justifyContent: 'center', padding: 32, marginTop: 40 },
  statusIconBox: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statusTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A', textAlign: 'center' },
  statusSubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, marginBottom: 20 },
  retryButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  primaryButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
});