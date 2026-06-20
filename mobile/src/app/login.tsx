import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/colors';
import { authAPI } from '../services/api';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      setLoginError('Please enter email and password');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const response = await authAPI.signIn(email, password);
      
      console.log('SignIn response:', response);

      if (response.error) {
        setLoginError(response.error);
        setLoading(false);
        return;
      }

      if (response.success) {
        // ✅ Redirect ke halaman beranda (tabs)
        router.replace('/(tabs)/beranda' as any);
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.error || 'Connection error. Please try again.');
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
        {/* Background stars effect */}
        <View style={styles.starsContainer}>
          {[...Array(30)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.1 + Math.random() * 0.3,
                  width: 1 + Math.random() * 2,
                  height: 1 + Math.random() * 2,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Animated.View style={[styles.logo, { transform: [{ scale: logoScaleAnim }] }]}>
                <Text style={styles.logoText}>✦</Text>
              </Animated.View>
            </View>
            <View style={styles.eyebrowBadge}>
              <Animated.View style={[styles.blinkDot, { opacity: blinkAnim }]} />
              <Text style={styles.eyebrowText}>Secure Access Portal</Text>
            </View>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to your Trailblazer account</Text>
          </View>

          {loginError !== '' && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorText}>⚠ {loginError}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelGold}>Astral ID</Text> / Email
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="trailblazer@galaxy.io"
                placeholderTextColor="#4A4540"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>
                <Text style={styles.labelGold}>Cipher</Text> / Password
              </Text>
              <TouchableOpacity>
                <Text style={styles.forgotLink}>Forget password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor="#4A4540"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPass(!showPass)}>
                <Text style={styles.eyeText}>{showPass ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkIcon}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Remember this terminal</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#060911" size="small" />
                <Text style={styles.submitButtonText}>Authenticating...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Continue →</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>New to the Express? </Text>
            <TouchableOpacity onPress={() => router.push('/register' as any)}>
              <Text style={styles.signupLink}>Create an account →</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    alignItems: 'center',
    paddingVertical: 40,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#C8A96E',
    borderRadius: 1,
  },
  card: {
    width: '90%',
    maxWidth: 440,
    backgroundColor: '#0B1121',
    borderWidth: 0.5,
    borderColor: 'rgba(200,169,110,0.18)',
    borderRadius: 18,
    overflow: 'hidden',
    padding: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 18,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    color: '#C8A96E',
  },
  eyebrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(78,205,196,0.25)',
    backgroundColor: 'rgba(78,205,196,0.05)',
    borderRadius: 20,
    marginBottom: 14,
  },
  blinkDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4ECDC4',
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#4ECDC4',
  },
  welcomeTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#E5DCC8',
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#4A4540',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: '#6A6058',
    marginBottom: 7,
  },
  labelGold: {
    color: '#C8A96E',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  forgotLink: {
    fontSize: 10.5,
    color: '#C8A96E',
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.75,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200,169,110,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#E5DCC8',
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  eyeText: {
    fontSize: 16,
    color: '#4A4540',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(200,169,110,0.25)',
    backgroundColor: 'rgba(200,169,110,0.06)',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'rgba(200,169,110,0.2)',
    borderColor: 'rgba(200,169,110,0.6)',
  },
  checkIcon: {
    fontSize: 9,
    color: '#C8A96E',
  },
  checkboxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A6058',
    letterSpacing: 0.5,
  },
  submitButton: {
    width: '100%',
    paddingVertical: 13.5,
    backgroundColor: '#C8A96E',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#060911',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(200,169,110,0.08)',
  },
  signupText: {
    fontSize: 12.5,
    color: '#4A4540',
    fontWeight: '600',
  },
  signupLink: {
    fontSize: 12.5,
    color: '#C8A96E',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorMessage: {
    backgroundColor: 'rgba(220,80,80,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(220,80,80,0.25)',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC5050',
    fontSize: 12,
    fontWeight: '600',
  },
});