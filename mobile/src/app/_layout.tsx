// src/app/_layout.tsx

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#050810',
          },
        }}
      >
        {/* 🔥 Splash Screen */}
        <Stack.Screen 
          name="splash" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Tabs */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Detail page */}
        <Stack.Screen 
          name="detail/[id]" 
          options={{ 
            headerShown: false,
            title: '',
          }} 
        />
        
        {/* Auth pages */}
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
          }} 
        />
        
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}