import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  created_at: string;
}

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // Token tidak ada, langsung ke login
        router.replace("/login");
        return;
      }
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
      } else {
        // Token expired atau invalid
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout", 
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Hapus data
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              
              // Redirect ke login
              // Gunakan router.push bukan replace untuk memastikan
              router.push("/login");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Gagal logout, silakan coba lagi");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.nama?.charAt(0)?.toUpperCase() || "U"}</Text>
        </View>
        <Text style={styles.userName}>{user?.nama || "User"}</Text>
        <Text style={styles.userRole}>Masyarakat</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color="#64748b" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || "-"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#64748b" />
          <Text style={styles.infoLabel}>Bergabung Sejak</Text>
          <Text style={styles.infoValue}>{formatDate(user?.created_at || "")}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#64748b" />
          <Text style={styles.infoLabel}>Status Akun</Text>
          <View style={styles.statusActive}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Aktif</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#000", paddingVertical: 32, alignItems: "center", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#000" },
  userName: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  userRole: { fontSize: 14, color: "#ffffff80" },
  infoSection: { backgroundColor: "#fff", margin: 20, borderRadius: 20, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  infoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  infoLabel: { fontSize: 14, color: "#64748b", marginLeft: 12, flex: 1 },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#1e293b" },
  statusActive: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e", marginRight: 6 },
  statusText: { fontSize: 14, fontWeight: "500", color: "#1e293b" },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#ef4444", marginHorizontal: 20, marginTop: 20, paddingVertical: 14, borderRadius: 12, gap: 8 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});