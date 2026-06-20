import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_URL = 'http://localhost:5000/api';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nama: '', email: '', password: '' });

  const handleRegister = async () => {
    if (!form.nama || !form.email || !form.password) {
      Alert.alert('Error', 'Semua field wajib diisi');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      // Register
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          password: form.password,
          role: 'user',
        }),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        // Register sukses, langsung login
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          await AsyncStorage.setItem('token', loginData.token);
          await AsyncStorage.setItem('user', JSON.stringify(loginData.user));
          router.replace('/(tabs)/beranda');
        } else {
          Alert.alert('Info', 'Registrasi berhasil, silakan login');
          router.replace('/login');
        }
      } else {
        Alert.alert('Registrasi Gagal', registerData.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      Alert.alert('Error', 'Backend tidak dapat diakses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Daftar Akun</Text>
          <Text style={styles.subtitle}>Buat akun baru untuk melaporkan pengaduan</Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor="#94a3b8"
            value={form.nama}
            onChangeText={(text) => setForm({ ...form, nama: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password (min 6)"
              placeholderTextColor="#94a3b8"
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleRegister} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Daftar & Masuk</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Sudah punya akun? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#0B1121',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E5DCC8',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A4540',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#0C1220',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    color: '#E5DCC8',
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  eyeText: {
    fontSize: 18,
    color: '#4A4540',
  },
  button: {
    backgroundColor: '#C8A96E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#060911',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#C8A96E',
    fontSize: 14,
  },
});