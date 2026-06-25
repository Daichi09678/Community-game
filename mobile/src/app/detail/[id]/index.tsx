// app/detail/[id].tsx - Tambahkan Topbar dengan Logo

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ Types ============
interface ReportDetail {
  id: string;
  title: string;
  type: string;
  game: string;
  content: string;
  status: string;
  version: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  username?: string;
  authorName?: string;
  views?: number;
  votes?: number;
}

interface User {
  id: string;
  role?: string;
  username?: string;
}

// ============ Constants ============
const API_BASE_URL = 'http://localhost:3001/api';

const GAME_MAP: Record<string, { label: string; color: string }> = {
  hsr: { label: 'Honkai: Star Rail', color: '#4ECDC4' },
  gi: { label: 'Genshin Impact', color: '#6DD18A' },
  zzz: { label: 'Zenless Zone Zero', color: '#A855F7' },
  hi3: { label: 'Honkai Impact 3rd', color: '#E05C7A' },
};

const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  guide: { label: 'Guide', icon: '📚' },
  event: { label: 'Event', icon: '🎪' },
  puzzle: { label: 'Puzzle', icon: '🧩' },
  build: { label: 'Build', icon: '⚔️' },
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'APPROVED', color: '#6DD18A', bg: 'rgba(109,209,138,0.15)' },
  draft: { label: 'DRAFT', color: '#C8A96E', bg: 'rgba(200,169,110,0.15)' },
  archived: { label: 'REJECTED', color: '#E05C7A', bg: 'rgba(224,92,122,0.15)' },
  pending: { label: 'PENDING', color: '#F0D080', bg: 'rgba(240,208,128,0.15)' },
};

// ============ Logo Component ============
const LogoIcon = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logoHexWrapper}>
      <View style={styles.logoHexBorder} />
      <View style={styles.logoHexInner}>
        <View style={styles.logoHexDot} />
        <View style={styles.logoHexCross}>
          <View style={styles.logoHexCrossH} />
          <View style={styles.logoHexCrossV} />
        </View>
      </View>
    </View>
    <Text style={styles.logoText}>Hoyoverse Hub</Text>
  </View>
);

// ============ Main Component ============
export default function DetailPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  
  // 🔥 Sembunyikan header bawaan
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: '',
      headerBackTitle: '',
      headerBackVisible: false,
    });
  }, [navigation]);
  
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // ============ Load User ============
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // ============ Fetch Report ============
  const fetchReport = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Fetching report ID:', id);
      
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/reports/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('Report not found');
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      let reportData;
      if (data.success && data.report) {
        reportData = data.report;
      } else if (data.report) {
        reportData = data.report;
      } else if (data.id) {
        reportData = data;
      } else {
        throw new Error('Invalid response format');
      }
      
      setReport(reportData);
      setLikesCount(reportData.votes || 0);
      
      // Record view
      fetch(`${API_BASE_URL}/dashboard/reports/${id}/view`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(err => console.error('Error recording view:', err));
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Report not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // ============ Auto Refresh ============
  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(() => {
      fetchReport();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [id]);

  // ============ Handlers ============
  const handleLike = async () => {
    if (liked) return;
    
    setLiked(true);
    setLikesCount(prev => prev + 1);
    
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/reports/${id}/like`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) {
        setLiked(false);
        setLikesCount(prev => prev - 1);
        throw new Error('Failed to like');
      }
    } catch (error) {
      console.error('Error liking report:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this report: ${report?.title}\n${report?.content?.slice(0, 100)}...\n\nReport ID: ${report?.id}`,
        title: report?.title || 'Report',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = async () => {
    if (!report?.id) return;
    
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_BASE_URL}/dashboard/reports/${report.id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ userId: user?.id }),
              });
              
              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Success', 'Report deleted successfully');
                router.replace('/(tabs)/riwayat');
              } else {
                Alert.alert('Error', data.error || 'Failed to delete report');
              }
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', 'Failed to delete report');
            }
          },
        },
      ]
    );
  };

  // ============ Helper Functions ============
  const formatDate = (iso: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusMessage = () => {
    if (!report) return '';
    switch (report.status) {
      case 'published':
        return '✓ This report has been approved and published.';
      case 'archived':
        return '✗ This report has been rejected and archived.';
      case 'draft':
        return '⏳ This report is still in draft and awaiting admin review.';
      default:
        return '⏳ This report is pending admin approval.';
    }
  };

  // ============ Computed Values ============
  const game = report ? GAME_MAP[report.game] : null;
  const category = report ? CATEGORY_MAP[report.type] : null;
  const status = report ? (STATUS_MAP[report.status] || STATUS_MAP.pending) : null;
  const isOwner = user && report && user.id === report.userId;
  const isAdmin = user?.role === 'admin';

  // ============ Loading State ============
  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <ActivityIndicator size="large" color="#C8A96E" />
        <Text style={styles.loadingText}>LOADING REPORT...</Text>
      </View>
    );
  }

  // ============ Error State ============
  if (error) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorCode}>404</Text>
          <Text style={styles.errorTitle}>Report Not Found</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => router.replace('/(tabs)/riwayat')}>
            <Text style={styles.errorButtonText}>← Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============ Main Render ============
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050810" />
      
      {/* ====== TOPBAR ====== */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#C8A96E" />
        </TouchableOpacity>
        <LogoIcon />
        <View style={styles.topbarRight}>
          <TouchableOpacity onPress={handleShare} style={styles.shareIconButton}>
            <Ionicons name="share-outline" size={20} color="#9A8F78" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== HEADER ====== */}
        <View style={styles.header}>
          {/* Game Tag */}
          {game && (
            <View style={styles.gameTag}>
              <View style={[styles.gameLine, { backgroundColor: game.color }]} />
              <Text style={[styles.gameLabel, { color: game.color }]}>{game.label}</Text>
            </View>
          )}
          
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{category.icon} {category.label}</Text>
              </View>
            )}
            {status && (
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.label}</Text>
              </View>
            )}
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{report?.title}</Text>
          
          {/* Status Message */}
          {report && (
            <View style={[styles.statusMessage, getStatusMessageStyle(report.status)]}>
              <Text style={[styles.statusMessageText, getStatusMessageTextStyle(report.status)]}>
                {getStatusMessage()}
              </Text>
            </View>
          )}
          
          {/* Tags */}
          {report?.tags && report.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {report.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.divider} />
        </View>
        
        {/* ====== META ====== */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Author</Text>
            <Text style={styles.metaValue}>{report?.username || report?.authorName || `User #${report?.userId?.slice(0,6)}`}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Submitted</Text>
            <Text style={styles.metaValue}>{formatDate(report?.createdAt || '')}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Version</Text>
            <Text style={styles.metaValue}>v{report?.version || '1.0'}</Text>
          </View>
        </View>
        
        {/* ====== CONTENT ====== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>Report Content</Text>
          </View>
          
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              {report?.content || 'No content provided.'}
            </Text>
          </View>
          
          <View style={styles.contentFooter}>
            <TouchableOpacity style={styles.likeButton} onPress={handleLike} disabled={liked}>
              <Ionicons name="thumbs-up" size={16} color={liked ? '#4ECDC4' : '#3A3028'} />
              <Text style={[styles.likeText, liked && { color: '#4ECDC4' }]}>{likesCount}</Text>
            </TouchableOpacity>
            <View style={styles.viewCount}>
              <Ionicons name="eye" size={14} color="#3A3028" />
              <Text style={styles.viewText}>{report?.views || 0}</Text>
            </View>
            {game && (
              <Text style={[styles.gameFooterLabel, { color: `${game.color}50` }]}>{game.label}</Text>
            )}
          </View>
        </View>
        
        {/* ====== ACTIONS ====== */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.replace('/(tabs)/riwayat')}>
            <Ionicons name="arrow-back" size={16} color="#9A8F78" />
            <Text style={styles.actionButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.actionRight}>
            <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={handleShare}>
              <Ionicons name="share-outline" size={16} color="#9A8F78" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            
            {isOwner && report?.status === 'draft' && (
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={16} color="#E05C7A" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* ====== FOOTER ====== */}
        <Text style={styles.footerText}>Page auto-refreshes every 30 seconds</Text>
      </ScrollView>
    </View>
  );
}

// ============ Helper Functions ============
const getStatusMessageStyle = (status: string) => {
  switch (status) {
    case 'published': return { backgroundColor: 'rgba(109,209,138,0.08)', borderColor: '#6DD18A30' };
    case 'archived': return { backgroundColor: 'rgba(224,92,122,0.08)', borderColor: '#E05C7A30' };
    default: return { backgroundColor: 'rgba(200,169,110,0.08)', borderColor: '#C8A96E30' };
  }
};

const getStatusMessageTextStyle = (status: string) => {
  switch (status) {
    case 'published': return { color: '#6DD18A' };
    case 'archived': return { color: '#E05C7A' };
    default: return { color: '#C8A96E' };
  }
};

// ============ Styles ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 60,
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
  
  // ====== Topbar ======
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(5,8,16,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.12)',
    minHeight: 56,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  topbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareIconButton: {
    padding: 4,
  },
  
  // ====== Logo ======
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoHexWrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoHexBorder: {
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderColor: '#C8A96E',
    transform: [{ rotate: '30deg' }],
    position: 'absolute',
    borderRadius: 2,
  },
  logoHexInner: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoHexDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(200,169,110,0.25)',
    borderWidth: 1,
    borderColor: '#C8A96E',
  },
  logoHexCross: {
    position: 'absolute',
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoHexCrossH: {
    width: 10,
    height: 1,
    backgroundColor: '#C8A96E',
    opacity: 0.35,
  },
  logoHexCrossV: {
    width: 1,
    height: 10,
    backgroundColor: '#C8A96E',
    opacity: 0.35,
    position: 'absolute',
  },
  logoText: {
    color: '#C8A96E',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // ====== Error ======
  errorContainer: {
    alignItems: 'center',
  },
  errorCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 48,
    color: '#C8A96E',
    opacity: 0.15,
    marginBottom: 8,
  },
  errorTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#E8E0CC',
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#5A5248',
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.25)',
  },
  errorButtonText: {
    color: '#9A8F78',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // ====== Header ======
  header: {
    marginBottom: 24,
  },
  gameTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  gameLine: {
    width: 28,
    height: 2,
  },
  gameLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#C8A96E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#E8E0CC',
    lineHeight: 32,
    marginBottom: 8,
  },
  statusMessage: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 8,
  },
  statusMessageText: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    backgroundColor: 'rgba(200,169,110,0.04)',
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: 'rgba(200,169,110,0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(200,169,110,0.12)',
  },
  
  // ====== Meta ======
  metaContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  metaItem: {
    flex: 1,
    padding: 14,
    backgroundColor: '#070C18',
  },
  metaLabel: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#5A5248',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9A8F78',
  },
  metaDivider: {
    width: 1,
    backgroundColor: 'rgba(200,169,110,0.08)',
  },
  
  // ====== Content ======
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionLine: {
    width: 3,
    height: 14,
    backgroundColor: '#C8A96E',
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 12,
    fontWeight: '700',
    color: '#E8E0CC',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contentBox: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
  },
  contentText: {
    fontSize: 14,
    color: '#C8C0B0',
    lineHeight: 24,
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(200,169,110,0.12)',
    backgroundColor: 'rgba(5,8,16,0.4)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#3A3028',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#3A3028',
  },
  gameFooterLabel: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginLeft: 'auto',
  },
  
  // ====== Actions ======
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,169,110,0.08)',
  },
  actionRight: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.18)',
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#9A8F78',
  },
  shareButton: {
    borderColor: 'rgba(200,169,110,0.18)',
  },
  deleteButton: {
    borderColor: '#E05C7A',
    backgroundColor: 'rgba(224,92,122,0.08)',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#E05C7A',
  },
  
  // ====== Footer ======
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#3A3028',
    marginTop: 24,
  },
});