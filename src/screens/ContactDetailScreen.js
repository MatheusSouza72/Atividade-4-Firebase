import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Feather } from '@expo/vector-icons';

export default function ContactDetailScreen({ route, navigation }) {
  const contactParam = route.params?.contact;
  const id = route.params?.id || contactParam?.id;

  const [contact, setContact] = useState(contactParam || null);
  const [loading, setLoading] = useState(!contactParam && !!id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchContact = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const docRef = doc(db, 'contatos', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContact({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Erro', 'Contato não encontrado.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao carregar contato:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contactParam && id) {
      fetchContact();
    }
  }, [id]);

  const confirmDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'contatos', id));
      setShowDeleteModal(false);
      Alert.alert('Sucesso', 'Contato excluído com sucesso.');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      Alert.alert('Erro', 'Não foi possível excluir o contato.');
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'CT';
    const names = name.trim().split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!contact) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIconButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={22} color="#0F172A" />
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(contact.nome)}</Text>
        </View>
        <Text style={styles.title}>{contact.nome}</Text>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Feather name="phone" size={18} color="#64748B" />
          <Text style={styles.infoText}>{contact.telefone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={18} color="#64748B" />
          <Text style={styles.infoText}>{contact.cidade}</Text>
        </View>
        {contact.anotacao ? (
          <View style={styles.infoRow}>
            <Feather name="file-text" size={18} color="#64748B" />
            <Text style={styles.infoText}>{contact.anotacao}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('ContactForm', { contact })}
      >
        <Text style={styles.primaryButtonText}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteOutlineButton} onPress={() => setShowDeleteModal(true)}>
        <Text style={styles.deleteOutlineText}>Excluir</Text>
      </TouchableOpacity>

      {/* Modal Sobremesa (Confirmação de Exclusão) */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.deleteIconBox}>
              <Feather name="trash-2" size={24} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Excluir contato?</Text>
            <Text style={styles.modalSubtitle}>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmDelete}
                disabled={deleting}
              >
                {deleting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalConfirmText}>Excluir</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  backIconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  cardInfo: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  infoText: { fontSize: 15, color: '#334155', marginLeft: 12 },
  primaryButton: { backgroundColor: '#2563EB', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  deleteOutlineButton: { height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  deleteOutlineText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center' },
  deleteIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  modalSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelButton: { flex: 1, height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  modalCancelText: { color: '#64748B', fontWeight: '600' },
  modalConfirmButton: { flex: 1, height: 44, borderRadius: 8, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  modalConfirmText: { color: '#FFFFFF', fontWeight: '600' },
});