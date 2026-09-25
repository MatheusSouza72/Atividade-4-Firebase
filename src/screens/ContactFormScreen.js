import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase'; // Caminho corrigido
import { Feather } from '@expo/vector-icons';

export default function ContactFormScreen({ route, navigation }) {
  const contactToEdit = route.params?.contact;

  const [nome, setNome] = useState(contactToEdit?.nome || '');
  const [telefone, setTelefone] = useState(contactToEdit?.telefone || '');
  const [cidade, setCidade] = useState(contactToEdit?.cidade || '');
  const [anotacao, setAnotacao] = useState(contactToEdit?.anotacao || '');
  const [saving, setSaving] = useState(false);

  const notify = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSave = async () => {
    if (!nome.trim() || !telefone.trim() || !cidade.trim()) {
      notify('Atenção', 'Nome, Telefone e Cidade são campos obrigatórios.');
      return;
    }

    const payload = { 
      nome: nome.trim(), 
      telefone: telefone.trim(), 
      cidade: cidade.trim(), 
      anotacao: anotacao.trim(),
      userId: auth.currentUser ? auth.currentUser.uid : null,
      updatedAt: serverTimestamp()
    };
    
    setSaving(true);

    try {
      if (contactToEdit?.id) {
        // Atualiza contato existente no Firestore
        const contactRef = doc(db, 'contatos', contactToEdit.id);
        await updateDoc(contactRef, payload);
        notify('Sucesso', 'Contato atualizado com sucesso!');
      } else {
        // Cria novo contato no Firestore
        await addDoc(collection(db, 'contatos'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        notify('Sucesso', 'Contato adicionado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Erro no Firestore:', error);
      notify('Erro', 'Não foi possível salvar o contato no banco de dados.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarPlaceholder}>
        <Feather name="camera" size={24} color="#64748B" />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nome *</Text>
        <View style={styles.inputBox}>
          <Feather name="user" size={18} color="#94A3B8" style={styles.icon} />
          <TextInput placeholder="Ex: João Silva" placeholderTextColor="#94A3B8" value={nome} onChangeText={setNome} style={styles.input} />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Telefone *</Text>
        <View style={styles.inputBox}>
          <Feather name="phone" size={18} color="#94A3B8" style={styles.icon} />
          <TextInput placeholder="Ex: (11) 98765-4321" placeholderTextColor="#94A3B8" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Cidade *</Text>
        <View style={styles.inputBox}>
          <Feather name="map-pin" size={18} color="#94A3B8" style={styles.icon} />
          <TextInput placeholder="Ex: São Paulo - SP" placeholderTextColor="#94A3B8" value={cidade} onChangeText={setCidade} style={styles.input} />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Anotação (opcional)</Text>
        <View style={[styles.inputBox, styles.textAreaBox]}>
          <Feather name="file-text" size={18} color="#94A3B8" style={[styles.icon, { marginTop: 12 }]} />
          <TextInput
            placeholder="Detalhes adicionais..."
            placeholderTextColor="#94A3B8"
            value={anotacao}
            onChangeText={setAnotacao}
            style={[styles.input, styles.textArea]}
            multiline
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 48 },
  icon: { marginRight: 8 },
  input: { flex: 1, color: '#0F172A', fontSize: 14 },
  textAreaBox: { height: 90, alignItems: 'flex-start' },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 8 },
  saveButton: { backgroundColor: '#2563EB', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});