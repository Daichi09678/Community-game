// src/app/index.tsx

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirect ke splash screen
    router.replace('/splash');
  }, []);

  return null;
}