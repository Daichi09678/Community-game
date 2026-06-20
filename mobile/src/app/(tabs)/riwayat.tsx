// ============ app/(tabs)/riwayat.tsx ============
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ Types ============
type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type TypeFilter = 'all' | 'guide' | 'event' | 'puzzle' | 'build';

interface Report {
  id: number;
  report_number: string;
  judul: string;
  deskripsi: string;
  status: string;
  lokasi: string;
  created_at: string;
  game?: string;
  type?: string;
  votes?: number;
  author?: string;
  initials?: string;
}

// ============ Constants ============
const API_BASE_URL = 'http://localhost:3001/api';

const gameLabels: Record<string, string> = {
  all: 'All Games',
  hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact',
  zzz: 'Zenless Zone Zero',
  hi3: 'Honkai Impact 3rd',
};

const gameColors: Record<string, string> = {
  all: '#C8A96E',
  hsr: '#4ECDC4',
  gi: '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

const typeFilters: TypeFilter[] = ['all', 'guide', 'event', 'puzzle', 'build'];

const typeLabels: Record<string, string> = {
  all: 'All',
  guide: 'Guides',
  event: 'Events',
  puzzle: 'Puzzles',
  build: 'Builds',
};

const games: GameFilter[] = ['all', 'hsr', 'gi', 'zzz', 'hi3'];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#F0D080' },
  diproses: { label: 'Diproses', color: '#4ECDC4' },
  selesai: { label: 'Selesai', color: '#6DD18A' },
  ditolak: { label: 'Ditolak', color: '#E05C7A' },
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
export default function RiwayatPage() {
  const { tab } = useLocalSearchParams();
  
  // State
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>((tab as string) || 'all');
  const [activeGame, setActiveGame] = useState<GameFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  // ============ API Helper ============
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // ============ Fetch Reports ============
  const fetchReports = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      let url = `${API_BASE_URL}/dashboard/reports?page=${page}&limit=10`;
      
      if (activeGame !== 'all') url += `&game=${activeGame}`;
      if (activeTab !== 'all') url += `&type=${activeTab}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetchWithTimeout(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedReports = (data.reports || []).map((report: any) => ({
            id: report.id,
            report_number: `#REP-${String(report.id).padStart(4, '0')}`,
            judul: report.title || 'Untitled',
            deskripsi: report.summary || report.content || 'No description',
            status: report.status || 'pending',
            lokasi: report.game || 'Unknown',
            game: report.game || 'unknown',
            type: report.type || 'guide',
            votes: report.votes || 0,
            author: report.author || 'Anonymous',
            initials: report.authorInitials || 'TB',
            created_at: report.date || new Date().toISOString(),
          }));
          setReports(formattedReports);
          setTotalItems(data.pagination?.totalItems || 0);
          setTotalPages(data.pagination?.totalPages || 0);
          setCurrentPage(data.pagination?.currentPage || 1);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeGame, activeTab, searchQuery]);

  // ============ Refresh ============
  const onRefresh = () => {
    setRefreshing(true);
    fetchReports(1);
  };

  // ============ Load More ============
  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchReports(currentPage + 1);
    }
  };

  // ============ Handlers ============
  const handleGameChange = (game: GameFilter) => {
    setActiveGame(game);
    setSearchQuery('');
    setSearchInput('');
    fetchReports(1);
  };

  const handleTabChange = (type: string) => {
    setActiveTab(type);
    setSearchQuery('');
    setSearchInput('');
    fetchReports(1);
  };

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (text.trim() === '') {
      setSearchQuery('');
      setIsSearching(false);
      fetchReports(1);
      return;
    }
    
    setIsSearching(true);
    
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(text);
      setIsSearching(false);
      fetchReports(1);
    }, 500);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setIsSearching(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    fetchReports(1);
    searchInputRef.current?.blur();
  };

  const goToDetail = (id: number) => {
    router.push(`/detail/${id}` as any);
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  // ============ Render Components ============

  // ============ Topbar ============
  const renderTopbar = () => (
    <View style={styles.topbar}>
      <View style={styles.topbarLeft}>
        <LogoIcon />
        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>● USER</Text>
        </View>
      </View>
      <View style={styles.topbarRight}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={16} color="#5A5248" />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="#5A5248"
            value={searchInput}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            onSubmitEditing={() => fetchReports(1)}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#C8A96E" style={styles.searchSpinner} />
          )}
          {searchInput !== '' && !isSearching && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-outline" size={18} color="#5A5248" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // ============ Header Subtitle ============
  const renderHeaderSubtitle = () => (
    <View style={styles.headerSubtitleContainer}>
      <Text style={styles.headerSubtitle}>
        {gameLabels[activeGame]} · {totalItems} reports found
        {searchQuery ? <Text style={styles.searchIndicator}> · Searching: "{searchQuery}"</Text> : null}
      </Text>
    </View>
  );

  // ============ Game Pills ============
  const renderGamePills = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamePillsContainer}>
      {games.map((g) => {
        const isActive = activeGame === g;
        const color = gameColors[g] || '#C8A96E';
        return (
          <TouchableOpacity
            key={g}
            style={[
              styles.gamePill,
              isActive && { borderColor: color, backgroundColor: `${color}14` },
              !isActive && { borderColor: 'transparent', backgroundColor: 'rgba(255,255,255,0.03)' },
            ]}
            onPress={() => handleGameChange(g)}
          >
            <Text
              style={[
                styles.gamePillText,
                isActive && { color: color },
                !isActive && { color: '#5A5248' },
              ]}
            >
              {gameLabels[g]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // ============ Type Filters ============
  const renderTypeFilters = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
      {typeFilters.map((f) => {
        const isActive = activeTab === f;
        return (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterPill,
              isActive && { borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.1)' },
              !isActive && { borderColor: 'rgba(200,169,110,0.15)', backgroundColor: 'transparent' },
            ]}
            onPress={() => handleTabChange(f)}
          >
            <Text
              style={[
                styles.filterPillText,
                isActive && { color: '#C8A96E' },
                !isActive && { color: '#9A8F78' },
              ]}
            >
              {typeLabels[f]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // ============ Search Result Indicator - FIXED ============
  const renderSearchResult = () => {
    if (!searchQuery) {
      return null;
    }
    
    return (
      <View style={styles.searchResultIndicator}>
        <Text style={styles.searchResultText}>
          Search results for: <Text style={styles.searchResultQuery}>"{searchQuery}"</Text>
          <Text style={styles.searchResultCount}> ({reports.length} reports)</Text>
        </Text>
        <TouchableOpacity onPress={clearSearch}>
          <Text style={styles.clearSearchResult}>✕ Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ============ Report Item ============
  const renderReportItem = ({ item }: { item: Report }) => {
    const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
    const gameColor = gameColors[item.game || 'all'] || '#C8A96E';
    
    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => goToDetail(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportHeaderLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.initials || 'TB'}</Text>
            </View>
            <View>
              <Text style={styles.reportAuthor}>{item.author || 'Anonymous'}</Text>
              <Text style={styles.reportNumber}>{item.report_number}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        
        <Text style={styles.reportTitle} numberOfLines={1}>{item.judul}</Text>
        <Text style={styles.reportDesc} numberOfLines={2}>{item.deskripsi}</Text>
        
        <View style={styles.reportFooter}>
          <View style={styles.reportTags}>
            <View style={[styles.tag, { borderColor: gameColor, backgroundColor: `${gameColor}14` }]}>
              <Text style={[styles.tagText, { color: gameColor }]}>{item.game?.toUpperCase() || 'UNKNOWN'}</Text>
            </View>
            <View style={[styles.tag, { borderColor: '#4ECDC4', backgroundColor: 'rgba(78,205,196,0.1)' }]}>
              <Text style={[styles.tagText, { color: '#4ECDC4' }]}>{item.type || 'guide'}</Text>
            </View>
          </View>
          <View style={styles.reportStats}>
            <Ionicons name="arrow-up" size={12} color="#4ECDC4" />
            <Text style={styles.votesText}>{item.votes || 0}</Text>
            <Text style={styles.dateText}>
              {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
              }) : '-'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ============ Empty State - FIXED ============
  const renderEmpty = () => {
    const hasSearch = searchQuery && searchQuery.length > 0;
    
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="document-text-outline" size={64} color="#3A3430" />
        </View>
        <Text style={styles.emptyTitle}>
          {hasSearch ? `No results for "${searchQuery}"` : 'No reports found'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {hasSearch ? 'Try a different search term' : 'Create your first report now'}
        </Text>
        {!hasSearch && (
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/pengaduan' as any)}>
            <Text style={styles.emptyButtonText}>+ Write Report</Text>
          </TouchableOpacity>
        )}
        {hasSearch && (
          <TouchableOpacity style={styles.emptyButton} onPress={clearSearch}>
            <Text style={styles.emptyButtonText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ============ Loading State ============
  if (loading && reports.length === 0) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#C8A96E" />
        <Text style={styles.loadingScreenText}>LOADING REPORTS...</Text>
      </View>
    );
  }

  // ============ Main Render ============
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050810" />
      
      {renderTopbar()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeaderSubtitle()}
        {renderGamePills()}
        
        {renderSearchResult()}
        
        {renderTypeFilters()}

        <View style={styles.reportsSection}>
          <View style={styles.reportsHeader}>
            <Text style={styles.reportsTitle}>
              All Reports
              {searchQuery && searchQuery.length > 0 ? (
                <Text style={styles.filteredTag}> filtered by #{searchQuery}</Text>
              ) : null}
            </Text>
            <Text style={styles.reportsCount}>{totalItems} items</Text>
          </View>
          
          {reports.length === 0 ? (
            renderEmpty()
          ) : (
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderReportItem}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#C8A96E"
                  colors={["#C8A96E"]}
                />
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loading && reports.length > 0 ? (
                  <View style={styles.loaderMore}>
                    <ActivityIndicator size="small" color="#C8A96E" />
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmpty}
            />
          )}
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

// ============ Styles ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#050810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingScreenText: {
    color: '#5A5248',
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 2,
  },
  
  // ============ Topbar ============
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(5,8,16,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.12)',
    minHeight: 56,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  
  // ============ Logo ============
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
  
  // ============ User Badge ============
  userBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(78,205,196,0.35)',
    backgroundColor: 'rgba(78,205,196,0.08)',
    borderRadius: 2,
  },
  userBadgeText: {
    color: '#4ECDC4',
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 1,
  },
  
  // ============ Search ============
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 36,
  },
  searchInput: {
    flex: 1,
    color: '#E8E0CC',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  searchSpinner: {
    marginLeft: 4,
  },
  
  // ============ Header Subtitle ============
  headerSubtitleContainer: {
    marginBottom: 16,
    marginTop: 4,
  },
  headerSubtitle: {
    color: '#5A5248',
    fontSize: 10,
  },
  searchIndicator: {
    color: '#C8A96E',
  },
  
  // ============ Game Pills ============
  gamePillsContainer: {
    marginBottom: 12,
  },
  gamePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
  },
  gamePillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  
  // ============ Search Result Indicator ============
  searchResultIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(200,169,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.3)',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  searchResultText: {
    color: '#5A5248',
    fontSize: 11,
  },
  searchResultQuery: {
    color: '#E8E0CC',
    fontWeight: '700',
  },
  searchResultCount: {
    color: '#5A5248',
  },
  clearSearchResult: {
    color: '#E05C7A',
    fontSize: 11,
  },
  
  // ============ Type Filters ============
  filterContainer: {
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 6,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  
  // ============ Reports Section ============
  reportsSection: {
    marginBottom: 24,
  },
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportsTitle: {
    color: '#E8E0CC',
    fontSize: 14,
    fontWeight: '600',
  },
  reportsCount: {
    color: '#5A5248',
    fontSize: 10,
  },
  filteredTag: {
    color: '#C8A96E',
    fontSize: 10,
  },
  
  // ============ Report Card ============
  listContent: {
    paddingBottom: 20,
  },
  reportCard: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderWidth: 1,
    borderColor: '#8B6A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#C8A96E',
    fontSize: 10,
    fontWeight: '700',
  },
  reportAuthor: {
    color: '#E8E0CC',
    fontSize: 13,
    fontWeight: '600',
  },
  reportNumber: {
    color: '#5A5248',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  reportTitle: {
    color: '#E8E0CC',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportDesc: {
    color: '#9A8F78',
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  reportTags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  reportStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  votesText: {
    color: '#4ECDC4',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  dateText: {
    color: '#5A5248',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  
  // ============ Empty State ============
  emptyContainer: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(200,169,110,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#E8E0CC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#5A5248',
    fontSize: 12,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#C8A96E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  emptyButtonText: {
    color: '#050810',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  
  // ============ Load More ============
  loaderMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});