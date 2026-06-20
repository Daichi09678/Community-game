import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

interface Report {
  id: number;
  report_number: string;
  judul: string;
  deskripsi: string;
  status: string;
  lokasi: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#64748b", bg: "#f1f5f9" },
  diproses: { label: "Diproses", color: "#eab308", bg: "#fefce8" },
  selesai: { label: "Selesai", color: "#22c55e", bg: "#f0fdf4" },
  ditolak: { label: "Ditolak", color: "#ef4444", bg: "#fef2f2" },
};

export default function RiwayatPage() {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tab as string || "Semua");

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let url = `${API_URL}/reports/my/filter`;
      if (activeTab === "Diproses") url += "?status=Diproses";
      else if (activeTab === "Selesai") url += "?status=Selesai";
      else if (activeTab === "Ditolak") url += "?status=Ditolak";
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setReports(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  // ✅ PERBAIKAN: Buat fungsi terpisah untuk navigasi
  const goToDetail = (id: number) => {
    // @ts-ignore - ignore type checking for dynamic route
    router.push(`/detail/${id}`);
  };

  const renderItem = ({ item }: { item: Report }) => {
    const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => goToDetail(item.id)}
      >
        <View style={styles.reportHeader}>
          <Text style={styles.reportNumber}>{item.report_number}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.reportTitle}>{item.judul}</Text>
        <Text style={styles.reportDesc} numberOfLines={2}>{item.deskripsi}</Text>
        <View style={styles.reportFooter}>
          <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
          <Text style={styles.reportDate}>{formatDate(item.created_at)}</Text>
          <Ionicons name="location-outline" size={14} color="#94a3b8" style={{ marginLeft: 12 }} />
          <Text style={styles.reportLocation} numberOfLines={1}>{item.lokasi}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const tabs = ["Semua", "Diproses", "Selesai", "Ditolak"];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tabName) => (
          <TouchableOpacity
            key={tabName}
            style={[styles.tab, activeTab === tabName && styles.activeTab]}
            onPress={() => setActiveTab(tabName)}
          >
            <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>Belum ada pengaduan</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/pengaduan")}>
            <Text style={styles.emptyButtonText}>+ Buat Pengaduan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabBar: { flexDirection: "row", backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tab: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 20 },
  activeTab: { backgroundColor: "#000" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#64748b" },
  activeTabText: { color: "#fff" },
  listContent: { padding: 16, paddingBottom: 80 },
  reportCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  reportHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  reportNumber: { fontSize: 12, fontFamily: "monospace", color: "#94a3b8" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: "600" },
  reportTitle: { fontSize: 16, fontWeight: "600", color: "#1e293b", marginBottom: 4 },
  reportDesc: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  reportFooter: { flexDirection: "row", alignItems: "center" },
  reportDate: { fontSize: 11, color: "#94a3b8", marginLeft: 4 },
  reportLocation: { fontSize: 11, color: "#94a3b8", marginLeft: 4, flex: 1 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80 },
  emptyText: { fontSize: 16, color: "#94a3b8", marginTop: 16 },
  emptyButton: { backgroundColor: "#000", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, marginTop: 16 },
  emptyButtonText: { color: "#fff", fontWeight: "500" },
});