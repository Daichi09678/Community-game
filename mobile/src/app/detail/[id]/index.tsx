import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

interface ReportDetail {
  id: number;
  report_number: string;
  judul: string;
  deskripsi: string;
  status: string;
  priority: string;
  lokasi: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  admin_notes: string;
  created_at: string;
  photos: string[];
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#64748b", bg: "#f1f5f9" },
  diproses: { label: "Diproses", color: "#eab308", bg: "#fefce8" },
  selesai: { label: "Selesai", color: "#22c55e", bg: "#f0fdf4" },
  ditolak: { label: "Ditolak", color: "#ef4444", bg: "#fef2f2" },
};

const PRIORITY_MAP: Record<string, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
};

export default function DetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setReport(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pengaduan tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = STATUS_MAP[report.status] || STATUS_MAP.pending;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.reportNumber}>{report.report_number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{report.judul}</Text>
      <Text style={styles.desc}>{report.deskripsi}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Pengaduan</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prioritas</Text>
          <Text style={styles.infoValue}>{PRIORITY_MAP[report.priority] || report.priority}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tanggal Dibuat</Text>
          <Text style={styles.infoValue}>{formatDate(report.created_at)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lokasi Kejadian</Text>
        <Text style={styles.locationText}>{report.lokasi}</Text>
        <View style={styles.locationGrid}>
          <Text style={styles.locationItem}>RT: {report.rt || "-"}</Text>
          <Text style={styles.locationItem}>RW: {report.rw || "-"}</Text>
          <Text style={styles.locationItem}>Kelurahan: {report.kelurahan || "-"}</Text>
          <Text style={styles.locationItem}>Kecamatan: {report.kecamatan || "-"}</Text>
        </View>
      </View>

      {report.admin_notes && (
        <View style={[styles.section, styles.notesSection]}>
          <Text style={styles.sectionTitle}>Catatan Petugas</Text>
          <Text style={styles.notesText}>{report.admin_notes}</Text>
        </View>
      )}

      {report.photos && report.photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto Bukti</Text>
          <View style={styles.photoContainer}>
            {report.photos.map((photo, idx) => (
              <TouchableOpacity key={idx} onPress={() => {}}>
                <Text style={styles.photoText}>📷 Foto {idx + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
        <Text style={styles.backButtonLargeText}>← Kembali</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#ef4444", marginBottom: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  reportNumber: { fontSize: 12, fontFamily: "monospace", color: "#64748b", backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e293b", marginBottom: 12 },
  desc: { fontSize: 15, color: "#475569", lineHeight: 22, marginBottom: 20 },
  section: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1e293b", marginBottom: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  infoLabel: { fontSize: 14, color: "#64748b" },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#1e293b" },
  locationText: { fontSize: 14, color: "#475569", marginBottom: 12 },
  locationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  locationItem: { fontSize: 13, color: "#475569", backgroundColor: "#f1f5f9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  notesSection: { backgroundColor: "#fefce8", borderWidth: 1, borderColor: "#fef08a" },
  notesText: { fontSize: 14, color: "#854d0e", lineHeight: 20 },
  photoContainer: { flexDirection: "row", gap: 12, marginTop: 8 },
  photoText: { fontSize: 14, color: "#3b82f6" },
  backButton: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#000", borderRadius: 12 },
  backButtonText: { color: "#fff", fontSize: 14 },
  backButtonLarge: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 20, marginBottom: 40 },
  backButtonLargeText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});