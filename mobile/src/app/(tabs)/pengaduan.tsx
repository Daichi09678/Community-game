import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://localhost:5000/api";

interface Category {
  id: number;
  kode: string;
  nama: string;
  icon: string;
}

interface Photo {
  uri: string;
  fileName?: string;
  type?: string;
}

const CATEGORIES: Category[] = [
  { id: 1, kode: "jalan", nama: "Jalan & Infrastruktur", icon: "hardware-chip-outline" },
  { id: 2, kode: "lampu", nama: "Penerangan Jalan", icon: "bulb-outline" },
  { id: 3, kode: "lingkungan", nama: "Lingkungan & Taman", icon: "leaf-outline" },
  { id: 4, kode: "air", nama: "Drainase & Air", icon: "water-outline" },
  { id: 5, kode: "sampah", nama: "Kebersihan & Sampah", icon: "trash-outline" },
  { id: 6, kode: "fasilitas", nama: "Fasilitas Umum", icon: "business-outline" },
];

export default function PengaduanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    priority: "sedang",
    lokasi: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
  });
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const submitData = new FormData();
      submitData.append("judul", form.judul);
      submitData.append("deskripsi", form.deskripsi);
      submitData.append("category_id", String(selectedCategory?.id || 1));
      submitData.append("priority", form.priority);
      submitData.append("lokasi", form.lokasi);
      submitData.append("rt", form.rt);
      submitData.append("rw", form.rw);
      submitData.append("kelurahan", form.kelurahan);
      submitData.append("kecamatan", form.kecamatan);

      // ✅ PERBAIKAN: Kirim foto dengan benar
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const filename = photo.fileName || `photo_${Date.now()}_${i}.jpg`;
        const match = filename.match(/\.(\w+)$/);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        
        submitData.append("photos", {
          uri: photo.uri,
          name: filename,
          type: type,
        } as any);
      }

      const response = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert("Berhasil", "Pengaduan berhasil dikirim!", [
          { text: "OK", onPress: () => router.push("/riwayat") },
        ]);
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi kesalahan saat mengirim pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin diperlukan", "Berikan izin akses galeri");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets) {
      const newPhotos: Photo[] = result.assets.map((asset) => ({
        uri: asset.uri,
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || "image/jpeg",
      }));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const openConfirm = () => {
    if (!form.judul || !form.deskripsi || !form.lokasi) {
      Alert.alert("Error", "Harap isi judul, deskripsi, dan lokasi");
      return;
    }
    setShowConfirm(true);
  };

  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Pilih Kategori</Text>
        <Text style={styles.subtitle}>Pilih kategori yang paling sesuai dengan permasalahan Anda</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, selectedCategory?.id === cat.id && styles.categoryCardActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Ionicons name={cat.icon as any} size={32} color={selectedCategory?.id === cat.id ? "#000" : "#64748b"} />
              <Text style={[styles.categoryName, selectedCategory?.id === cat.id && styles.categoryNameActive]}>
                {cat.nama}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, !selectedCategory && styles.disabledButton]}
          disabled={!selectedCategory}
          onPress={() => setStep(2)}
        >
          <Text style={styles.nextButtonText}>Lanjut</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.formContainer}>
      {/* Modal Konfirmasi */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#22c55e" />
            <Text style={styles.modalTitle}>Konfirmasi Pengaduan</Text>
            <Text style={styles.modalText}>Apakah data yang Anda isi sudah benar?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalCancelText}>Periksa Lagi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalConfirmText}>Kirim</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Detail Pengaduan</Text>

      <Text style={styles.label}>Judul Pengaduan *</Text>
      <TextInput style={styles.input} placeholder="Contoh: Jalan Rusak Parah" value={form.judul} onChangeText={(text) => setForm({ ...form, judul: text })} />

      <Text style={styles.label}>Deskripsi *</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Jelaskan detail masalah..." value={form.deskripsi} onChangeText={(text) => setForm({ ...form, deskripsi: text })} multiline numberOfLines={4} />

      <Text style={styles.label}>Prioritas</Text>
      <View style={styles.priorityContainer}>
        {["rendah", "sedang", "tinggi"].map((p) => (
          <TouchableOpacity key={p} style={[styles.priorityBtn, form.priority === p && styles.priorityActive]} onPress={() => setForm({ ...form, priority: p })}>
            <Text style={[styles.priorityText, form.priority === p && styles.priorityTextActive]}>{p.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Lokasi *</Text>
      <TextInput style={styles.input} placeholder="Alamat lengkap" value={form.lokasi} onChangeText={(text) => setForm({ ...form, lokasi: text })} />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>RT</Text>
          <TextInput style={styles.input} placeholder="RT" value={form.rt} onChangeText={(text) => setForm({ ...form, rt: text })} />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>RW</Text>
          <TextInput style={styles.input} placeholder="RW" value={form.rw} onChangeText={(text) => setForm({ ...form, rw: text })} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Kelurahan</Text>
          <TextInput style={styles.input} placeholder="Kelurahan" value={form.kelurahan} onChangeText={(text) => setForm({ ...form, kelurahan: text })} />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Kecamatan</Text>
          <TextInput style={styles.input} placeholder="Kecamatan" value={form.kecamatan} onChangeText={(text) => setForm({ ...form, kecamatan: text })} />
        </View>
      </View>

      <Text style={styles.label}>Foto Bukti</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Ionicons name="camera-outline" size={24} color="#64748b" />
        <Text style={styles.photoButtonText}>Upload Foto</Text>
      </TouchableOpacity>

      {photos.length > 0 && (
        <View style={styles.photoList}>
          {photos.map((photo, idx) => (
            <View key={idx} style={styles.photoItem}>
              <Text style={styles.photoName}>{photo.fileName || `foto_${idx + 1}`}</Text>
              <TouchableOpacity onPress={() => removePhoto(idx)}>
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={openConfirm}>
          <Text style={styles.submitButtonText}>Review & Kirim</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7", padding: 20 },
  formContainer: { paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#64748b", marginBottom: 24 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoryCard: { width: "48%", backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0" },
  categoryCardActive: { borderColor: "#000", borderWidth: 2 },
  categoryName: { fontSize: 14, fontWeight: "500", color: "#64748b", marginTop: 8, textAlign: "center" },
  categoryNameActive: { color: "#000" },
  nextButton: { backgroundColor: "#000", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 20 },
  disabledButton: { backgroundColor: "#94a3b8" },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  label: { fontSize: 14, fontWeight: "500", color: "#1e293b", marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  textArea: { height: 100, textAlignVertical: "top" },
  priorityContainer: { flexDirection: "row", gap: 12 },
  priorityBtn: { flex: 1, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  priorityActive: { backgroundColor: "#000", borderColor: "#000" },
  priorityText: { fontSize: 14, fontWeight: "500", color: "#64748b" },
  priorityTextActive: { color: "#fff" },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  photoButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "#e2e8f0", gap: 8 },
  photoButtonText: { fontSize: 14, color: "#64748b" },
  photoList: { marginTop: 12 },
  photoItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8 },
  photoName: { fontSize: 12, color: "#64748b", flex: 1 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  backButton: { flex: 1, backgroundColor: "#fff", borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  backButtonText: { fontSize: 16, fontWeight: "500", color: "#64748b" },
  submitButton: { flex: 2, backgroundColor: "#000", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 24, padding: 24, alignItems: "center", width: "80%", maxWidth: 320 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b", marginTop: 16, marginBottom: 8 },
  modalText: { fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 24 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalCancel: { flex: 1, backgroundColor: "#f1f5f9", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  modalCancelText: { fontSize: 14, fontWeight: "500", color: "#64748b" },
  modalConfirm: { flex: 1, backgroundColor: "#000", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  modalConfirmText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});