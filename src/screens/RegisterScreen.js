import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Feather } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigation.replace('ContactList');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', 'Verifique se o e-mail é válido e a senha tem no mínimo 6 caracteres.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Feather name="user-plus" size={32} color="#2563EB" />
        </View>

        <Text style={styles.title}>Criar sua conta</Text>
        <Text style={styles.subtitle}>Cadastre-se com seu e-mail e senha para começar.</Text>

        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#94A3B8"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', elevation: 2 },
  logoContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 28 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#0F172A', fontSize: 15 },
  primaryButton: { backgroundColor: '#2563EB', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#64748B', fontSize: 14 },
  footerLink: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});