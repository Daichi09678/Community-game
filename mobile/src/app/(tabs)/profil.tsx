import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://localhost:5000/api';

// ============ Types ============
interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  created_at: string;
  bio?: string;
  location?: string;
  avatarPhoto?: string | null;
  bannerPhoto?: string | null;
  totalReports?: number;
  totalVotes?: number;
  rank?: string;
  level?: number;
  xp?: number;
  favGames?: string[];
}

interface Activity {
  id: string;
  title: string;
  type: string;
  tag: string;
  tagColor: string;
  votes: number;
  time: string;
}

// ============ Game Data ============
const GAME_NAMES: Record<string, string> = {
  hsr: 'Star Rail',
  gi: 'Genshin',
  zzz: 'Zenless',
  hi3: 'Honkai 3rd',
};

const GAME_COLORS: Record<string, string> = {
  hsr: '#4ECDC4',
  gi: '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

// ============ Main Component ============
export default function ProfilPage() {
  const router = useRouter();
  
  // ============ State ============
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  
  // Edit form state
  const [editNama, setEditNama] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editFavGames, setEditFavGames] = useState<string[]>([]);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [bannerPhoto, setBannerPhoto] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState('default');

  // ============ Fetch Profile ============
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.success) {
        const userData = result.user;
        setUser(userData);
        setEditNama(userData.nama || '');
        setEditBio(userData.bio || '');
        setEditLocation(userData.location || '');
        setAvatarPhoto(userData.avatarPhoto || null);
        setBannerPhoto(userData.bannerPhoto || null);
        setEditFavGames(userData.favGames || ['hsr', 'gi']);
        setBannerId(userData.bannerId || 'default');
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============ Fetch Activities ============
  const fetchActivities = async () => {
    setActivityLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/user/recent-activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setActivities(result.activities || []);
      }
    } catch (error) {
      console.error('Fetch activities error:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  // ============ Load Data ============
  useEffect(() => {
    fetchProfile();
    fetchActivities();
  }, []);

  // ============ Handle Avatar Upload ============
  const handleAvatarUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery access to upload avatar');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64String = `data:image/jpeg;base64,${asset.base64}`;
      
      setUploadingAvatar(true);
      try {
        const token = await AsyncStorage.getItem('token');
        await fetch(`${API_URL}/profile/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatarPhoto: base64String }),
        });
        
        setAvatarPhoto(base64String);
        setUser(prev => prev ? { ...prev, avatarPhoto: base64String } : prev);
        Alert.alert('Success', 'Avatar updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload avatar');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  // ============ Handle Banner Upload ============
  const handleBannerUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery access to upload banner');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 6],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64String = `data:image/jpeg;base64,${asset.base64}`;
      
      setUploadingBanner(true);
      try {
        const token = await AsyncStorage.getItem('token');
        await fetch(`${API_URL}/profile/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bannerPhoto: base64String, bannerId: 'custom' }),
        });
        
        setBannerPhoto(base64String);
        setUser(prev => prev ? { ...prev, bannerPhoto: base64String } : prev);
        Alert.alert('Success', 'Banner updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload banner');
      } finally {
        setUploadingBanner(false);
      }
    }
  };

  // ============ Reset Avatar ============
  const resetAvatar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarPhoto: null }),
      });
      
      setAvatarPhoto(null);
      setUser(prev => prev ? { ...prev, avatarPhoto: null } : prev);
      Alert.alert('Success', 'Avatar reset to default');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset avatar');
    }
  };

  // ============ Reset Banner ============
  const resetBanner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bannerPhoto: null, bannerId: 'default' }),
      });
      
      setBannerPhoto(null);
      setBannerId('default');
      setUser(prev => prev ? { ...prev, bannerPhoto: null, bannerId: 'default' } : prev);
      Alert.alert('Success', 'Banner reset to default');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset banner');
    }
  };

  // ============ Save Profile ============
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: editNama,
          bio: editBio,
          location: editLocation,
          favGames: editFavGames,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUser(prev => prev ? {
          ...prev,
          nama: editNama,
          bio: editBio,
          location: editLocation,
          favGames: editFavGames,
        } : prev);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated!');
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // ============ Handle Logout ============
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Gagal logout, silakan coba lagi');
            }
          },
        },
      ]
    );
  };

  // ============ Toggle Game ============
  const toggleGame = (game: string) => {
    if (editFavGames.includes(game)) {
      setEditFavGames(editFavGames.filter(g => g !== game));
    } else {
      setEditFavGames([...editFavGames, game]);
    }
  };

  // ============ Loading ============
  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <ActivityIndicator size="large" color="#C8A96E" />
        <Text style={styles.loadingText}>LOADING PROFILE...</Text>
      </View>
    );
  }

  // ============ Render ============
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#050810" />

      {/* ====== Banner ====== */}
      <TouchableOpacity 
        style={styles.bannerContainer}
        onPress={handleBannerUpload}
        activeOpacity={0.8}
      >
        {bannerPhoto ? (
          <Image source={{ uri: bannerPhoto }} style={styles.bannerImage} />
        ) : (
          <View style={[styles.bannerDefault, styles.bannerDefault1]}>
            <View style={styles.bannerOverlay} />
          </View>
        )}
        <View style={styles.bannerOverlayEdit}>
          <View style={styles.bannerEditBadge}>
            <Ionicons name="camera-outline" size={16} color="#C8A96E" />
            <Text style={styles.bannerEditText}>
              {uploadingBanner ? 'Uploading...' : (bannerPhoto ? 'Change Banner' : 'Upload Banner')}
            </Text>
          </View>
        </View>
        {uploadingBanner && (
          <View style={styles.bannerLoadingOverlay}>
            <ActivityIndicator size="large" color="#C8A96E" />
          </View>
        )}
      </TouchableOpacity>

      {/* ====== Profile Header ====== */}
      <View style={styles.profileHeader}>
        {/* Avatar */}
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleAvatarUpload}
          activeOpacity={0.8}
        >
          {avatarPhoto ? (
            <Image source={{ uri: avatarPhoto }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarDefault}>
              <Text style={styles.avatarText}>
                {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          {uploadingAvatar && (
            <View style={styles.avatarLoadingOverlay}>
              <ActivityIndicator size="small" color="#C8A96E" />
            </View>
          )}
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={12} color="#050810" />
          </View>
        </TouchableOpacity>

        {/* Nama & Email */}
        <View style={styles.userInfo}>
          {isEditing ? (
            <TextInput
              style={styles.inputName}
              value={editNama}
              onChangeText={setEditNama}
              placeholder="Your name"
              placeholderTextColor="#5A5248"
            />
          ) : (
            <Text style={styles.userName}>{user?.nama || 'User'}</Text>
          )}
          <Text style={styles.userEmail}>{user?.email || '-'}</Text>
        </View>

        {/* Rank Badge */}
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{user?.rank || 'Novice Omni-Voyager'}</Text>
        </View>
      </View>

      {/* ====== Location ====== */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={16} color="#5A5248" />
        {isEditing ? (
          <TextInput
            style={styles.inputLocation}
            value={editLocation}
            onChangeText={setEditLocation}
            placeholder="Location"
            placeholderTextColor="#5A5248"
          />
        ) : (
          <Text style={styles.locationText}>{user?.location || 'Unknown Location'}</Text>
        )}
      </View>

      {/* ====== XP Progress ====== */}
      <View style={styles.xpContainer}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>Level {user?.level || 1}</Text>
          <Text style={styles.xpValue}>{user?.xp || 0} XP</Text>
        </View>
        <View style={styles.xpBarTrack}>
          <View 
            style={[
              styles.xpBarFill,
              { width: `${Math.min(((user?.xp || 0) % 100), 100)}%` }
            ]} 
          />
        </View>
      </View>

      {/* ====== Stats Row ====== */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#C8A96E' }]}>
            {user?.totalReports?.toLocaleString() || '0'}
          </Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4ECDC4' }]}>
            {user?.totalVotes?.toLocaleString() || '0'}
          </Text>
          <Text style={styles.statLabel}>Votes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#A855F7' }]}>
            {user?.level || 1}
          </Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* ====== Favorite Games ====== */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>FAVORITE GAMES</Text>
        <View style={styles.gamesContainer}>
          {Object.entries(GAME_NAMES).map(([key, label]) => {
            const isSelected = editFavGames.includes(key);
            const color = GAME_COLORS[key] || '#C8A96E';
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.gameBadge,
                  isSelected && { borderColor: color, backgroundColor: `${color}14` },
                ]}
                onPress={() => isEditing && toggleGame(key)}
                disabled={!isEditing}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.gameBadgeText,
                  isSelected && { color },
                  !isEditing && { color: '#5A5248' },
                ]}>
                  {isEditing ? (isSelected ? '✓ ' : '+ ') : ''}{label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ====== Bio ====== */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BIO</Text>
        {isEditing ? (
          <TextInput
            style={styles.inputBio}
            value={editBio}
            onChangeText={setEditBio}
            placeholder="Write something about yourself..."
            placeholderTextColor="#5A5248"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.bioText}>
            {user?.bio || 'No bio yet. Tap edit to add one!'}
          </Text>
        )}
      </View>

      {/* ====== Recent Activity ====== */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
          <TouchableOpacity onPress={() => router.push('/riwayat')}>
            <Text style={styles.viewAllText}>View all →</Text>
          </TouchableOpacity>
        </View>

        {activityLoading ? (
          <View style={styles.activityLoading}>
            <ActivityIndicator size="small" color="#C8A96E" />
            <Text style={styles.activityLoadingText}>Loading activities...</Text>
          </View>
        ) : activities.length > 0 ? (
          activities.slice(0, 3).map((act, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <Text style={styles.activityId}>#{act.id}</Text>
                <View>
                  <Text style={styles.activityTitle}>{act.title}</Text>
                  <Text style={styles.activityType}>{act.type}</Text>
                </View>
              </View>
              <View style={styles.activityRight}>
                <View style={[styles.activityTag, { borderColor: `${act.tagColor}40` }]}>
                  <Text style={[styles.activityTagText, { color: act.tagColor }]}>
                    {act.tag}
                  </Text>
                </View>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noActivity}>No recent activity</Text>
        )}
      </View>

      {/* ====== Action Buttons ====== */}
      <View style={styles.actionsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#050810" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#050810" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={() => {
                setIsEditing(false);
                setEditNama(user?.nama || '');
                setEditBio(user?.bio || '');
                setEditLocation(user?.location || '');
                setEditFavGames(user?.favGames || ['hsr', 'gi']);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={18} color="#C8A96E" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ====== Reset Buttons ====== */}
      <View style={styles.resetContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetAvatar}>
          <Ionicons name="refresh-outline" size={14} color="#E05C7A" />
          <Text style={styles.resetButtonText}>Reset Avatar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetBanner}>
          <Ionicons name="refresh-outline" size={14} color="#C8A96E" />
          <Text style={[styles.resetButtonText, { color: '#C8A96E' }]}>Reset Banner</Text>
        </TouchableOpacity>
      </View>

      {/* ====== Logout Button ====== */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

// ============ Styles ============
const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#050810',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050810',
  },
  loadingText: {
    color: '#5A5248',
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 2,
  },
  bottomPadding: {
    height: 40,
  },

  // Banner
  bannerContainer: {
    height: 140,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerDefault: {
    width: '100%',
    height: '100%',
  },
  bannerDefault1: {
    backgroundColor: '#0a0f1e',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,8,16,0.3)',
  },
  bannerOverlayEdit: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerEditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(5,8,16,0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.3)',
  },
  bannerEditText: {
    color: '#C8A96E',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bannerLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,8,16,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Header
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C8A96E',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarDefault: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0d1525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#C8A96E',
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,8,16,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C8A96E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#050810',
  },

  userInfo: {
    flex: 1,
  },
  inputName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8E0CC',
    backgroundColor: 'rgba(200,169,110,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.3)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8E0CC',
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  userEmail: {
    fontSize: 12,
    color: '#9A8F78',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },

  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.5)',
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderRadius: 4,
  },
  rankText: {
    color: '#C8A96E',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },

  // Location
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  inputLocation: {
    fontSize: 12,
    color: '#5A5248',
    backgroundColor: 'rgba(200,169,110,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.3)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },
  locationText: {
    fontSize: 12,
    color: '#5A5248',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },

  // XP
  xpContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    fontSize: 10,
    color: '#5A5248',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  xpValue: {
    fontSize: 10,
    color: '#5A5248',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },
  xpBarTrack: {
    height: 3,
    backgroundColor: 'rgba(200,169,110,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#C8A96E',
    borderRadius: 2,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(200,169,110,0.08)',
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },
  statLabel: {
    fontSize: 9,
    color: '#5A5248',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(200,169,110,0.08)',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 9,
    color: '#5A5248',
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: 10,
    color: '#C8A96E',
    fontWeight: '600',
  },

  // Games
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gameBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.1)',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  gameBadgeText: {
    fontSize: 10,
    color: '#5A5248',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Bio
  inputBio: {
    backgroundColor: 'rgba(200,169,110,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.3)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#9A8F78',
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: 13,
    color: '#9A8F78',
    lineHeight: 20,
  },

  // Activity
  activityLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  activityLoadingText: {
    color: '#5A5248',
    fontSize: 11,
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.06)',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  activityId: {
    fontSize: 9,
    color: '#5A5248',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
    width: 40,
  },
  activityTitle: {
    fontSize: 13,
    color: '#E8E0CC',
    fontWeight: '600',
  },
  activityType: {
    fontSize: 10,
    color: '#5A5248',
    marginTop: 1,
  },
  activityRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  activityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 3,
  },
  activityTagText: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityTime: {
    fontSize: 9,
    color: '#5A5248',
    fontFamily: Platform.OS === 'ios' ? 'Space Mono' : 'monospace',
  },
  noActivity: {
    color: '#5A5248',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
  },

  // Action Buttons
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: 'rgba(200,169,110,0.1)',
    borderColor: 'rgba(200,169,110,0.3)',
  },
  editButtonText: {
    color: '#C8A96E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  saveButton: {
    backgroundColor: 'rgba(109,209,138,0.1)',
    borderColor: '#6DD18A',
  },
  saveButtonText: {
    color: '#050810',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cancelButton: {
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderColor: 'rgba(200,169,110,0.2)',
  },
  cancelButtonText: {
    color: '#9A8F78',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Reset Buttons
  resetContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(224,92,122,0.3)',
    backgroundColor: 'rgba(224,92,122,0.08)',
  },
  resetButtonText: {
    color: '#E05C7A',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    marginHorizontal: 20,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});