// ============ app/(tabs)/beranda.tsx ============
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ============ Types ============
interface StatCard {
  label: string;
  value: string | number;
  change: string;
  accent: string;
}

interface ReportItem {
  id: number;
  title: string;
  type: string;
  game: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  version: string;
}

interface TopReport {
  id: number;
  title: string;
  score: number;
}

interface TrendingTag {
  label: string;
  variant: string;
  count: number;
}

interface ActivityData {
  days: string[];
  vals: number[];
  maxVal: number;
}

interface GameCoverage {
  label: string;
  pct: number;
  fill: string;
}

// ============ Dynamic API Base URL ============
const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  }
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log(`📡 [Dashboard] Platform: ${Platform.OS}, API URL: ${API_BASE_URL}`);

// ============ Constants ============
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

const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'guide', label: 'Guides' },
  { key: 'event', label: 'Events' },
  { key: 'puzzle', label: 'Puzzles' },
  { key: 'build', label: 'Builds' },
];

const games = ['all', 'hsr', 'gi', 'zzz', 'hi3'];

const { width } = Dimensions.get('window');

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
export default function Beranda() {
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeGame, setActiveGame] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statsData, setStatsData] = useState<StatCard[]>([]);
  const [reportsData, setReportsData] = useState<ReportItem[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [topReports, setTopReports] = useState<TopReport[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [gameCoverage, setGameCoverage] = useState<GameCoverage[]>([]);
  const [widgetsLoading, setWidgetsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();

    fetchDashboardData();
  }, []);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ============ API Helper with timeout ============
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    
    console.log(`🌐 Fetching: ${fullUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(fullUrl, {
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

  // ============ Fetch Dashboard Data ============
  const fetchDashboardData = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      console.log('📡 Fetching dashboard stats...');
      
      const statsRes = await fetchWithTimeout('/dashboard/stats', {}, 8000);
      
      if (statsRes.ok) {
        const stats = await statsRes.json();
        if (stats.success && stats.data) {
          setStatsData(stats.data);
        } else {
          setStatsData([
            { label: 'Total Reports', value: '0', change: 'No reports yet', accent: '#C8A96E' },
            { label: 'Active Events', value: '0', change: 'No events yet', accent: '#4ECDC4' },
            { label: 'Puzzles Solved', value: '0', change: 'No puzzles yet', accent: '#A855F7' },
            { label: 'Active Travelers', value: '0', change: 'No users yet', accent: '#C84040' },
          ]);
        }
      }

      await fetchReports(activeGame, activeFilter, searchQuery);
      await fetchWidgetsData();
      
    } catch (error: any) {
      console.error('❌ Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============ Fetch Reports ============
  const fetchReports = async (game?: string, type?: string, search?: string) => {
    setReportsLoading(true);
    try {
      const gameParam = game !== undefined ? game : activeGame;
      const typeParam = type !== undefined ? type : activeFilter;
      const searchParam = search !== undefined ? search : searchQuery;

      let url = `/dashboard/reports?game=${gameParam}&type=${typeParam}&page=1&limit=20`;
      if (searchParam && searchParam.trim()) {
        url += `&search=${encodeURIComponent(searchParam.trim())}`;
      }

      const res = await fetchWithTimeout(url, {}, 8000);
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reports) {
          setReportsData(data.reports);
        } else {
          setReportsData([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      setReportsData([]);
    } finally {
      setReportsLoading(false);
    }
  };

  // ============ Fetch Widgets Data ============
  const fetchWidgetsData = async () => {
    setWidgetsLoading(true);
    try {
      const endpoints = [
        '/dashboard/top-reports',
        '/dashboard/trending-tags',
        '/dashboard/activity',
        '/dashboard/game-coverage',
      ];

      const responses = await Promise.allSettled(
        endpoints.map(url => fetchWithTimeout(url, {}, 6000))
      );

      if (responses[0].status === 'fulfilled' && responses[0].value.ok) {
        const top = await responses[0].value.json();
        if (top.success && top.data) setTopReports(top.data);
      }

      if (responses[1].status === 'fulfilled' && responses[1].value.ok) {
        const tags = await responses[1].value.json();
        if (tags.success && tags.data) setTrendingTags(tags.data);
      }

      if (responses[2].status === 'fulfilled' && responses[2].value.ok) {
        const activity = await responses[2].value.json();
        if (activity.success && activity.data) setActivityData(activity.data);
      }

      if (responses[3].status === 'fulfilled' && responses[3].value.ok) {
        const coverage = await responses[3].value.json();
        if (coverage.success && coverage.data) setGameCoverage(coverage.data);
      }
    } catch (error) {
      console.error('❌ Error fetching widgets:', error);
    } finally {
      setWidgetsLoading(false);
    }
  };

  // ============ Refresh ============
  const onRefresh = async () => {
    setRefreshing(true);
    setApiError(null);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // ============ Handlers ============
  const handleGameChange = (game: string) => {
    setActiveGame(game);
    setActiveFilter('all');
    setSearchQuery('');
    fetchReports(game, 'all', '');
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchQuery('');
    fetchReports(activeGame, filter, '');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (text.trim() === '') {
      setIsSearching(false);
      setActiveFilter('all');
      setActiveGame('all');
      fetchReports('all', 'all', '');
      return;
    }
    
    setIsSearching(true);
    
    debounceTimerRef.current = setTimeout(() => {
      setActiveFilter('all');
      setActiveGame('all');
      fetchReports('all', 'all', text);
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setActiveFilter('all');
    setActiveGame('all');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    fetchReports('all', 'all', '');
    searchInputRef.current?.blur();
  };

  const handleTagClick = (tag: string) => {
    const searchTerm = tag.replace('#', '');
    setSearchQuery(searchTerm);
    setActiveFilter('all');
    setActiveGame('all');
    fetchReports('all', 'all', searchTerm);
  };

  useEffect(() => {
    if (!loading) {
      const timeoutId = setTimeout(() => {
        fetchReports(activeGame, activeFilter, searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [activeGame, activeFilter]);

  const accentColor = gameColors[activeGame] || '#C8A96E';

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
            placeholder="Search reports, guides..."
            placeholderTextColor="#5A5248"
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            onSubmitEditing={() => fetchReports(activeGame, activeFilter, searchQuery)}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#C8A96E" style={styles.searchSpinner} />
          )}
          {searchQuery !== '' && !isSearching && (
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
        {gameLabels[activeGame]} · Last updated: 3 hours ago
        {searchQuery && <Text style={styles.searchIndicator}> · Searching: "{searchQuery}"</Text>}
      </Text>
    </View>
  );

  // ============ Stat Cards ============
  const renderStatCards = () => {
    const displayStats = statsData.length > 0 ? statsData : [
      { label: 'Total Reports', value: '0', change: 'No data', accent: '#C8A96E' },
      { label: 'Active Events', value: '0', change: 'No data', accent: '#4ECDC4' },
      { label: 'Puzzles Solved', value: '0', change: 'No data', accent: '#A855F7' },
      { label: 'Active Travelers', value: '0', change: 'No data', accent: '#C84040' },
    ];

    return (
      <View style={styles.statsGrid}>
        {displayStats.map((card, i) => (
          <View key={i} style={[styles.statCard, { borderTopColor: card.accent }]}>
            <Text style={styles.statLabel}>{card.label}</Text>
            <Text style={[styles.statValue, { color: card.accent }]}>{card.value}</Text>
            <Text style={styles.statChange}>{card.change}</Text>
          </View>
        ))}
      </View>
    );
  };

  // ============ Game Pills ============
  const renderGamePills = () => {
    return (
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
  };

  // ============ Type Filters ============
  const renderTypeFilters = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {typeFilters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterPill,
              activeFilter === f.key && { borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.1)' },
              activeFilter !== f.key && { borderColor: 'rgba(200,169,110,0.15)', backgroundColor: 'transparent' },
            ]}
            onPress={() => handleFilterChange(f.key)}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === f.key && { color: '#C8A96E' },
                activeFilter !== f.key && { color: '#9A8F78' },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // ============ Reports List ============
  const renderReports = () => {
    if (reportsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#C8A96E" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      );
    }

    if (reportsData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? `No reports found for "${searchQuery}"` : 'No reports found'}
          </Text>
          {searchQuery !== '' && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
              <Text style={styles.clearSearchButtonText}>Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.tableContainer}>
        {reportsData.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportRow}
            onPress={() => router.push(`/detail/${report.id}` as any)}
          >
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle} numberOfLines={1}>
                {report.title}
              </Text>
              <View style={styles.reportBadges}>
                <View style={[styles.badge, { backgroundColor: 'rgba(200,169,110,0.15)' }]}>
                  <Text style={styles.badgeText}>{report.game.toUpperCase()}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: 'rgba(78,205,196,0.1)' }]}>
                  <Text style={[styles.badgeText, { color: '#4ECDC4' }]}>{report.type}</Text>
                </View>
              </View>
            </View>
            <View style={styles.reportFooter}>
              <View style={styles.authorContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{report.initials}</Text>
                </View>
                <Text style={styles.authorName}>{report.author}</Text>
              </View>
              <View style={styles.reportStats}>
                <Text style={styles.votesText}>↑ {report.votes}</Text>
                <Text style={styles.dateText}>{report.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ============ Top Reports Widget ============
  const renderTopReports = () => {
    if (widgetsLoading) {
      return (
        <View style={styles.widgetCard}>
          <Text style={styles.widgetTitle}>Top Reports</Text>
          <ActivityIndicator color="#C8A96E" size="small" />
        </View>
      );
    }

    const data = topReports.length > 0 ? topReports : [
      { id: 1, title: 'Penacony Dreamscape Guide', score: 1247 },
      { id: 2, title: 'Arlecchino Boss Fight', score: 892 },
      { id: 3, title: 'Hollow Zero Guide', score: 756 },
    ];

    const rankColors = ['#C8A96E', '#B0B8C4', '#CD7F32'];

    return (
      <View style={styles.widgetCard}>
        <Text style={styles.widgetTitle}>Top Reports</Text>
        {data.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.topReportItem}
            onPress={() => router.push(`/detail/${item.id}` as any)}
          >
            <Text style={[styles.topReportRank, { color: rankColors[i] || '#5A5248' }]}>
              #{i + 1}
            </Text>
            <Text style={styles.topReportTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.topReportScore}>↑ {item.score}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ============ Trending Tags Widget ============
  const renderTrendingTags = () => {
    if (widgetsLoading) {
      return (
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Trending Tags</Text>
          </View>
          <ActivityIndicator color="#C8A96E" size="small" />
        </View>
      );
    }

    const tags = trendingTags.length > 0 ? trendingTags : [
      { label: '#Exploration', variant: 'gold', count: 234 },
      { label: '#Lore', variant: 'cyan', count: 189 },
      { label: '#Build', variant: 'default', count: 156 },
    ];

    const tagColors: Record<string, string> = {
      default: '#C8A96E',
      gold: '#F0D080',
      cyan: '#4ECDC4',
      purple: '#A855F7',
    };

    return (
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>Trending Tags</Text>
          <TouchableOpacity onPress={() => router.push('/trending-tags' as any)}>
            <Text style={styles.viewAllText}>View all →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagsContainer}>
          {tags.slice(0, 8).map((tag, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tag}
              onPress={() => handleTagClick(tag.label)}
            >
              <Text style={[styles.tagText, { color: tagColors[tag.variant] || '#C8A96E' }]}>
                {tag.label} ({tag.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // ============ Activity Chart ============
  const renderActivityChart = () => {
    if (widgetsLoading) {
      return (
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Activity This Week</Text>
          </View>
          <ActivityIndicator color="#C8A96E" size="small" />
        </View>
      );
    }

    const data = activityData || {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      vals: [0, 0, 0, 0, 0, 0, 0],
      maxVal: 1,
    };

    return (
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>Activity This Week</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          {data.days.map((day, i) => {
            const barHeight = data.maxVal > 0
              ? Math.max(6, (data.vals[i] / data.maxVal) * 60)
              : 6;
            const isToday = i === data.days.length - 1;
            const barColor = isToday ? accentColor : 'rgba(200,169,110,0.35)';

            return (
              <View key={i} style={styles.barWrapper}>
                <View style={[styles.bar, { height: barHeight, backgroundColor: barColor }]} />
                <Text style={[styles.barLabel, isToday && { color: '#C8A96E' }]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ============ Game Coverage ============
  const renderGameCoverage = () => {
    if (widgetsLoading) {
      return (
        <View style={styles.widgetCard}>
          <Text style={styles.widgetTitle}>Game Coverage</Text>
          <ActivityIndicator color="#C8A96E" size="small" />
        </View>
      );
    }

    const coverage = gameCoverage.length > 0 ? gameCoverage : [
      { label: 'Honkai: Star Rail', pct: 45, fill: 'bg-[#4ECDC4]' },
      { label: 'Genshin Impact', pct: 30, fill: 'bg-[#6DD18A]' },
      { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
      { label: 'Honkai Impact 3rd', pct: 10, fill: 'bg-[#E05C7A]' },
    ];

    const fillColors: Record<string, string> = {
      'bg-[#4ECDC4]': '#4ECDC4',
      'bg-[#6DD18A]': '#6DD18A',
      'bg-[#A855F7]': '#A855F7',
      'bg-[#E05C7A]': '#E05C7A',
    };

    return (
      <View style={styles.widgetCard}>
        <Text style={styles.widgetTitle}>Game Coverage</Text>
        {coverage.map((g, i) => (
          <View key={i} style={styles.coverageItem}>
            <View style={styles.coverageHeader}>
              <Text style={styles.coverageLabel}>{g.label}</Text>
              <Text style={styles.coveragePercent}>{g.pct}%</Text>
            </View>
            <View style={styles.coverageBar}>
              <View
                style={[
                  styles.coverageFill,
                  { width: `${g.pct}%`, backgroundColor: fillColors[g.fill] || '#C8A96E' },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ============ Main Render ============
  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#C8A96E" />
        <Text style={styles.loadingScreenText}>LOADING DASHBOARD...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050810" />

      {renderTopbar()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C8A96E" />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderHeaderSubtitle()}
          {renderStatCards()}
          {renderGamePills()}

          {searchQuery !== '' && (
            <View style={styles.searchResultIndicator}>
              <Text style={styles.searchResultText}>
                Search results for: <Text style={styles.searchResultQuery}>"{searchQuery}"</Text>
                <Text style={styles.searchResultCount}> ({reportsData.length} reports)</Text>
              </Text>
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearSearchResult}>✕ Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          {renderTypeFilters()}

          <View style={styles.reportsSection}>
            <View style={styles.reportsHeader}>
              <Text style={styles.reportsTitle}>
                Latest Reports
                {searchQuery && (
                  <Text style={styles.filteredTag}> filtered by #{searchQuery}</Text>
                )}
              </Text>
              <Text style={styles.reportsCount}>{reportsData.length} items</Text>
            </View>
            {renderReports()}
          </View>

          <View style={styles.widgetsContainer}>
            {renderTopReports()}
            {renderTrendingTags()}
            {renderActivityChart()}
            {renderGameCoverage()}
          </View>

          <View style={styles.bottomPadding} />
        </Animated.View>
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

  // ============ Stat Cards ============
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 4,
    padding: 16,
    borderTopWidth: 2,
  },
  statLabel: {
    color: '#5A5248',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statChange: {
    color: '#4ECDC4',
    fontSize: 10,
    marginTop: 4,
  },

  // ============ Game Pills ============
  gamePillsContainer: {
    marginBottom: 16,
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
  loadingContainer: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 4,
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#5A5248',
    marginTop: 12,
  },
  emptyContainer: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 4,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#5A5248',
    fontSize: 12,
  },
  clearSearchButton: {
    marginTop: 12,
    backgroundColor: 'rgba(200,169,110,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  clearSearchButtonText: {
    color: '#C8A96E',
    fontSize: 11,
    fontWeight: '600',
  },

  // ============ Table ============
  tableContainer: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  reportRow: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.07)',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitle: {
    flex: 1,
    color: '#E8E0CC',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  reportBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C8A96E',
    letterSpacing: 0.5,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderWidth: 1,
    borderColor: '#8B6A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#C8A96E',
    fontSize: 9,
    fontWeight: '700',
  },
  authorName: {
    color: '#9A8F78',
    fontSize: 12,
  },
  reportStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  votesText: {
    color: '#4ECDC4',
    fontSize: 11,
  },
  dateText: {
    color: '#5A5248',
    fontSize: 11,
  },

  // ============ Widgets ============
  widgetsContainer: {
    gap: 16,
  },
  widgetCard: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 4,
    padding: 16,
  },
  widgetTitle: {
    color: '#E8E0CC',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#C8A96E',
    fontSize: 9,
  },
  topReportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.06)',
  },
  topReportRank: {
    fontSize: 10,
    minWidth: 24,
  },
  topReportTitle: {
    flex: 1,
    color: '#9A8F78',
    fontSize: 11,
    marginHorizontal: 8,
  },
  topReportScore: {
    color: '#4ECDC4',
    fontSize: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -2,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 2,
    backgroundColor: 'rgba(200,169,110,0.08)',
    margin: 2,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ECDC4',
  },
  liveText: {
    color: '#4ECDC4',
    fontSize: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: '100%',
    maxWidth: 28,
    borderRadius: 2,
  },
  barLabel: {
    color: '#5A5248',
    fontSize: 7,
  },
  coverageItem: {
    marginBottom: 12,
  },
  coverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  coverageLabel: {
    color: '#9A8F78',
    fontSize: 10,
  },
  coveragePercent: {
    color: '#5A5248',
    fontSize: 9,
  },
  coverageBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  coverageFill: {
    height: '100%',
    borderRadius: 2,
  },
  bottomPadding: {
    height: 20,
  },
});