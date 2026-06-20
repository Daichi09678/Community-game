// mobile/src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Deteksi platform untuk menentukan URL yang benar
const getBaseURL = () => {
  // Untuk web (browser)
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }
  
  // Untuk Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  
  // Untuk iOS Simulator
  if (Platform.OS === 'ios') {
    return 'http://localhost:3000/api';
  }
  
  // Default
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getBaseURL();

console.log('📍 Platform:', Platform.OS);
console.log('📍 API URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Interceptor untuk token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    console.error('URL:', error.config?.url);
    console.error('BaseURL:', error.config?.baseURL);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend tidak merespon');
    }
    if (error.message === 'Network Error') {
      console.error('Network Error - cek koneksi dan URL backend');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // ✅ ENDPOINT MOBILE: Login tanpa OTP
  signIn: async (email: string, password: string) => {
    try {
      console.log('📍 SignIn attempt to:', api.defaults.baseURL + '/auth/signin-mobile');
      const response = await api.post('/auth/signin-mobile', { email, password });
      console.log('✅ SignIn response:', response.data);
      
      // Simpan user data jika login berhasil
      if (response.data.success && response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        // Token disimpan di cookie, tidak perlu manual
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ SignIn error:', error.message);
      throw error;
    }
  },

  signOut: async () => {
    await api.post('/auth/signout');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ============ DASHBOARD API ============

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getReports: async (params?: { game?: string; type?: string; page?: number; limit?: number }) => {
    const response = await api.get('/dashboard/reports', { params });
    return response.data;
  },

  createReport: async (data: {
    title: string;
    type: string;
    game: string;
    content: string;
    userId: string;
    version?: string;
    tags?: string[];
    summary?: string;
  }) => {
    const response = await api.post('/dashboard/reports', data);
    return response.data;
  },

  getReportById: async (id: string) => {
    const response = await api.get(`/dashboard/reports/${id}`);
    return response.data;
  },

  deleteReport: async (id: string, userId: string) => {
    const response = await api.delete(`/dashboard/reports/${id}`, { data: { userId } });
    return response.data;
  },

  likeReport: async (id: string) => {
    const response = await api.post(`/dashboard/reports/${id}/like`);
    return response.data;
  },

  viewReport: async (id: string) => {
    const response = await api.post(`/dashboard/reports/${id}/view`);
    return response.data;
  },

  getTopReports: async () => {
    const response = await api.get('/dashboard/top-reports');
    return response.data;
  },

  getTrendingTags: async () => {
    const response = await api.get('/dashboard/trending-tags');
    return response.data;
  },

  getActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },

  getGameCoverage: async () => {
    const response = await api.get('/dashboard/game-coverage');
    return response.data;
  },
};

// ============ PROFILE API ============

export const profileAPI = {
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  updateProfile: async (data: {
    username?: string;
    bio?: string;
    location?: string;
    avatarColor?: string;
    avatarPhoto?: string | null;
    bannerId?: string;
    bannerPhoto?: string | null;
    favGames?: string[];
  }) => {
    const response = await api.put('/profile/update', data);
    return response.data;
  },

  updateBanner: async (data: { bannerPhoto?: string | null; bannerId?: string }) => {
    const response = await api.post('/profile/banner', data);
    return response.data;
  },

  getUserProfile: async (userId: string) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await api.get('/user/recent-activity');
    return response.data;
  },

  getGameStats: async () => {
    const response = await api.get('/user/game-stats');
    return response.data;
  },

  getPasswordLastChanged: async () => {
    const response = await api.get('/user/password-last-changed');
    return response.data;
  },
};

// ============ ADMIN API ============

export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserDetail: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  reviewReport: async (reportId: string, action: 'accept' | 'reject', note?: string) => {
    const response = await api.post(`/admin/reports/${reportId}/review`, { action, note });
    return response.data;
  },

  updateProfile: async (data: { username?: string; bio?: string; location?: string }) => {
    const response = await api.put('/admin/profile/update', data);
    return response.data;
  },

  getActivity: async () => {
    const response = await api.get('/admin/profile/activity');
    return response.data;
  },

  getActivityStats: async () => {
    const response = await api.get('/admin/profile/activity-stats');
    return response.data;
  },

  warnUser: async (userId: string, username: string, message: string) => {
    const response = await api.post('/admin/warn-user', { userId, username, message });
    return response.data;
  },

  banUser: async (userId: string, username: string, reason: string, duration: '1day' | '7days' | '30days' | 'permanent') => {
    const response = await api.post('/admin/ban-user', { userId, username, reason, duration });
    return response.data;
  },

  unbanUser: async (userId: string, username: string) => {
    const response = await api.post('/admin/unban-user', { userId, username });
    return response.data;
  },

  checkBanStatus: async (userId: string) => {
    const response = await api.get(`/admin/check-ban-status/${userId}`);
    return response.data;
  },
};

// ============ EVENTS API ============

export const eventsAPI = {
  getEvents: async (params?: { game?: string; page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  getPendingEvents: async (params?: { game?: string; page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/events/pending', { params });
    return response.data;
  },

  approveEvent: async (id: string) => {
    const response = await api.post(`/events/${id}/approve`);
    return response.data;
  },

  rejectEvent: async (id: string, note?: string) => {
    const response = await api.post(`/events/${id}/reject`, { note });
    return response.data;
  },

  getEventStats: async () => {
    const response = await api.get('/events/stats');
    return response.data;
  },

  likeEvent: async (id: string) => {
    const response = await api.post(`/events/${id}/like`);
    return response.data;
  },
};

// ============ MISSIONS & QUESTS API ============

export const missionAPI = {
  getMainQuests: async (params?: { game?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/mission-quest/main-quests', { params });
    return response.data;
  },

  getSideMissions: async (params?: { game?: string; type?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/mission-quest/side-missions', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/mission-quest/stats');
    return response.data;
  },

  likeMission: async (id: string) => {
    const response = await api.post(`/mission-quest/side-missions/${id}/like`);
    return response.data;
  },
};

// ============ PUZZLE API ============

export const puzzleAPI = {
  getPuzzles: async () => {
    const response = await api.get('/puzzles');
    return response.data;
  },

  getAllPuzzles: async () => {
    const response = await api.get('/puzzles/all');
    return response.data;
  },

  solvePuzzle: async (puzzleId: number, points: number) => {
    const response = await api.post('/puzzles/solve', { puzzleId, points });
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/puzzles/leaderboard');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/puzzles/stats');
    return response.data;
  },
};

export default api;