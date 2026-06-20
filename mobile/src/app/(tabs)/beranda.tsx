import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const API_BASE_URL = 'http://localhost:3000/api';

// ============ Game Labels ============
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

// ============ Main Component ============
export default function Beranda() {
  const [loading, setLoading] = useState(true);
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
  const [user, setUser] = useState<any>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    fetchDashboardData();
    fetchUser();
  }, []);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        if (stats.success && stats.data) setStatsData(stats.data);
      }

      await fetchReports();
      await fetchWidgetsData();
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (game?: string, type?: string, search?: string) => {
    setReportsLoading(true);
    try {
      const gameParam = game !== undefined ? game : activeGame;
      const typeParam = type !== undefined ? type : activeFilter;
      const searchParam = search !== undefined ? search : searchQuery;

      let url = `${API_BASE_URL}/dashboard/reports?game=${gameParam}&type=${typeParam}&page=1&limit=20`;
      if (searchParam && searchParam.trim()) {
        url += `&search=${encodeURIComponent(searchParam.trim())}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reports) {
          setReportsData(data.reports);
        } else {
          setReportsData([]);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  const fetchWidgetsData = async () => {
    setWidgetsLoading(true);
    try {
      const [topRes, tagsRes, activityRes, coverageRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/top-reports`),
        fetch(`${API_BASE_URL}/dashboard/trending-tags`),
        fetch(`${API_BASE_URL}/dashboard/activity`),
        fetch(`${API_BASE_URL}/dashboard/game-coverage`),
      ]);

      if (topRes.ok) {
        const top = await topRes.json();
        if (top.success && top.data) setTopReports(top.data);
      }
      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        if (tags.success && tags.data) setTrendingTags(tags.data);
      }
      if (activityRes.ok) {
        const activity = await activityRes.json();
        if (activity.success && activity.data) setActivityData(activity.data);
      }
      if (coverageRes.ok) {
        const coverage = await coverageRes.json();
        if (coverage.success && coverage.data) setGameCoverage(coverage.data);
      }
    } catch (error) {
      console.error('Error fetching widgets:', error);
    } finally {
      setWidgetsLoading(false);
    }
  };

  // Fetch when filters or search change
  useEffect(() => {
    if (!loading) {
      fetchReports(activeGame, activeFilter, searchQuery);
    }
  }, [activeGame, activeFilter, searchQuery]);

  const handleGameChange = (game: string) => {
    setActiveGame(game);
    setActiveFilter('all');
    setSearchQuery('');
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveFilter('all');
    setActiveGame('all');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag.replace('#', ''));
    setActiveFilter('all');
    setActiveGame('all');
  };

  const accentColor = gameColors[activeGame] || '#C8A96E';

  // ============ Render Functions ============

  // Render Game Pills
  const renderGamePills = () => {
    const games = ['all', 'hsr', 'gi', 'zzz', 'hi3'];
    
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

  // Render Type Filters
  const renderTypeFilters = () => {
    const filters = [
      { key: 'all', label: 'All' },
      { key: 'guide', label: 'Guides' },
      { key: 'event', label: 'Events' },
      { key: 'puzzle', label: 'Puzzles' },
      { key: 'build', label: 'Builds' },
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {filters.map((f) => (
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

  // Render Stat Cards
  const renderStatCards = () => {
    const displayStats = statsData.length > 0 ? statsData : [
      { label: 'Total Reports', value: '0', change: 'Loading...', accent: '#C8A96E' },
      { label: 'Active Events', value: '0', change: 'Loading...', accent: '#4ECDC4' },
      { label: 'Puzzles Solved', value: '0', change: 'Loading...', accent: '#A855F7' },
      { label: 'Active Travelers', value: '0', change: 'Loading...', accent: '#C84040' },
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

  // Render Reports Table
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
            {searchQuery ? `No reports found for "#${searchQuery}"` : 'No reports found'}
          </Text>
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

  // Render Top Reports Widget
  const renderTopReports = () => {
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

  // Render Trending Tags Widget
  const renderTrendingTags = () => {
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
              style={[
                styles.tag,
                { borderColor: 'rgba(200,169,110,0.2)', backgroundColor: 'rgba(200,169,110,0.08)' },
              ]}
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

  // Render Activity Chart
  const renderActivityChart = () => {
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

  // Render Game Coverage
  const renderGameCoverage = () => {
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
      <StatusBar style="light" />
      
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Hoyoverse Hub — Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              {gameLabels[activeGame]} · Last updated: 3 hours ago
              {searchQuery && <Text style={styles.searchIndicator}> · Searching: "{searchQuery}"</Text>}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search reports, guides, events..."
              placeholderTextColor="#5A5248"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearSearch}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => router.push('/pengaduan' as any)}
          >
            <Text style={styles.writeButtonText}>+ Write Report</Text>
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        {renderStatCards()}

        {/* Game Pills */}
        {renderGamePills()}

        {/* Search Result Indicator */}
        {searchQuery !== '' && (
          <View style={styles.searchResultIndicator}>
            <Text style={styles.searchResultText}>
              Search results for: <Text style={styles.searchResultQuery}>"{searchQuery}"</Text>
              <Text style={styles.searchResultCount}> ({reportsData.length} reports found)</Text>
            </Text>
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearSearchResult}>✕ Clear search</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Type Filters */}
        {renderTypeFilters()}

        {/* Main Content - Reports */}
        <View style={styles.reportsSection}>
          <View style={styles.reportsHeader}>
            <Text style={styles.reportsTitle}>
              Latest Reports
              {searchQuery && (
                <Text style={styles.filteredTag}> filtered by #{searchQuery}</Text>
              )}
            </Text>
          </View>
          {renderReports()}
        </View>

        {/* Widgets */}
        <View style={styles.widgetsContainer}>
          {renderTopReports()}
          {renderTrendingTags()}
          {renderActivityChart()}
          {renderGameCoverage()}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
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
    paddingBottom: 100,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#050810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingScreenText: {
    color: '#5A5248',
    fontFamily: 'SpaceMono',
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 2,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: '#E8E0CC',
    fontSize: 18,
    fontFamily: 'Cinzel',
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#5A5248',
    fontSize: 12,
    fontFamily: 'Rajdhani',
    marginTop: 2,
  },
  searchIndicator: {
    color: '#C8A96E',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    color: '#5A5248',
  },
  searchInput: {
    flex: 1,
    color: '#E8E0CC',
    fontSize: 14,
    fontFamily: 'Rajdhani',
    padding: 0,
  },
  clearSearch: {
    color: '#5A5248',
    fontSize: 14,
    paddingHorizontal: 4,
  },
  writeButton: {
    backgroundColor: '#C8A96E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeButtonText: {
    color: '#050810',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Rajdhani',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
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
    fontFamily: 'SpaceMono',
    fontSize: 24,
    fontWeight: '700',
  },
  statChange: {
    color: '#4ECDC4',
    fontSize: 10,
    marginTop: 4,
  },
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
    fontFamily: 'Rajdhani',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
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
    fontFamily: 'Rajdhani',
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
    fontFamily: 'Rajdhani',
  },
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
    fontFamily: 'Rajdhani',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
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
    fontFamily: 'Cinzel',
    fontWeight: '600',
  },
  filteredTag: {
    color: '#C8A96E',
    fontSize: 10,
    fontFamily: 'SpaceMono',
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
    fontFamily: 'Rajdhani',
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
    fontFamily: 'SpaceMono',
  },
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
    fontFamily: 'Rajdhani',
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
    fontFamily: 'Rajdhani',
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
    fontFamily: 'Cinzel',
    fontWeight: '700',
  },
  authorName: {
    color: '#9A8F78',
    fontSize: 12,
    fontFamily: 'Rajdhani',
  },
  reportStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  votesText: {
    color: '#4ECDC4',
    fontSize: 11,
    fontFamily: 'SpaceMono',
  },
  dateText: {
    color: '#5A5248',
    fontSize: 11,
    fontFamily: 'SpaceMono',
  },
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
    fontFamily: 'Cinzel',
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
    fontFamily: 'SpaceMono',
  },
  topReportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.06)',
  },
  topReportRank: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    minWidth: 24,
  },
  topReportTitle: {
    flex: 1,
    color: '#9A8F78',
    fontSize: 11,
    fontFamily: 'Rajdhani',
    marginHorizontal: 8,
  },
  topReportScore: {
    color: '#4ECDC4',
    fontSize: 10,
    fontFamily: 'SpaceMono',
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
    borderRadius: 2,
    margin: 2,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'Rajdhani',
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
    fontFamily: 'SpaceMono',
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
    fontFamily: 'SpaceMono',
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
    fontFamily: 'Rajdhani',
  },
  coveragePercent: {
    color: '#5A5248',
    fontSize: 9,
    fontFamily: 'SpaceMono',
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