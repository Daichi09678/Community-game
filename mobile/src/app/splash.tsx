// mobile/src/app/splash.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animasi masuk
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check login status and navigate
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        
        // Tunggu splash minimal 1.5 detik
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (token && user) {
          router.replace('/(tabs)/beranda');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Splash auth check error:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050810" />

      {/* Background stars */}
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

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Icon */}
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>✦</Text>
        </View>

        {/* Title */}
        <Text style={styles.logoText}>Hoyoverse Hub</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Trailblazer's Gateway</Text>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={[styles.loadingDot, { animationDelay: '0s' }]} />
          <View style={[styles.loadingDot, { animationDelay: '0.2s' }]} />
          <View style={[styles.loadingDot, { animationDelay: '0.4s' }]} />
        </View>
      </Animated.View>

      {/* Version */}
      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(200,169,110,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIconText: {
    fontSize: 32,
    color: '#C8A96E',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#C8A96E',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(200,169,110,0.4)',
    letterSpacing: 4,
    marginTop: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C8A96E',
    opacity: 0.3,
  },
  versionText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    color: 'rgba(200,169,110,0.2)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 2,
  },
});