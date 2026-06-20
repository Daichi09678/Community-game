// ============ app/(tabs)/pengaduan.tsx ============
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// ============ Types ============
interface Game {
  id: string;
  label: string;
  color: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface Photo {
  uri: string;
  fileName?: string;
  type?: string;
}

// ============ Constants ============
const API_BASE_URL = 'http://localhost:3001/api';

const GAMES: Game[] = [
  { id: 'hsr', label: 'Honkai: Star Rail', color: '#4ECDC4' },
  { id: 'gi', label: 'Genshin Impact', color: '#6DD18A' },
  { id: 'zzz', label: 'Zenless Zone Zero', color: '#A855F7' },
  { id: 'hi3', label: 'Honkai Impact 3rd', color: '#E05C7A' },
];

const CATEGORIES: Category[] = [
  { id: 'guide', label: 'Guide', icon: '📚' },
  { id: 'event', label: 'Event', icon: '🎪' },
  { id: 'puzzle', label: 'Puzzle', icon: '🧩' },
  { id: 'build', label: 'Build', icon: '⚔️' },
];

const SEVERITY = [
  { id: 'low', label: 'Low', color: '#6DD18A' },
  { id: 'medium', label: 'Medium', color: '#C8A96E' },
  { id: 'high', label: 'High', color: '#E05C7A' },
  { id: 'critical', label: 'Critical', color: '#FF3B5C' },
];

// ============ Step Indicator ============
const StepIndicator = ({ current, total }: { current: number; total: number }) => {
  const steps = ['Basic Info', 'Content', 'Review'];
  
  return (
    <View style={styles.stepContainer}>
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        
        return (
          <View key={index} style={styles.stepWrapper}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isDone && styles.stepCircleDone,
              ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color="#C8A96E" />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    isActive && styles.stepNumberActive,
                    isDone && styles.stepNumberDone,
                  ]}>{stepNum}</Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                isActive && styles.stepLabelActive,
                isDone && styles.stepLabelDone,
              ]}>{label}</Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                isDone && styles.stepLineDone,
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

// ============ Tag Input ============
const TagInput = ({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) => {
  const [input, setInput] = useState('');
  
  const addTag = () => {
    const val = input.trim().replace(/\s+/g, '-');
    if (val && !tags.includes(val) && tags.length < 8) {
      onChange([...tags, val]);
      setInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };
  
  return (
    <View style={styles.tagContainer}>
      <View style={styles.tagList}>
        {tags.map(tag => (
          <View key={tag} style={styles.tagItem}>
            <Text style={styles.tagText}>#{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(tag)}>
              <Ionicons name="close" size={14} color="#C8A96E" />
            </TouchableOpacity>
          </View>
        ))}
        {tags.length === 0 && (
          <Text style={styles.tagEmpty}>No tags yet...</Text>
        )}
      </View>
      <View style={styles.tagInputRow}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add tag (max 8)..."
          placeholderTextColor="#3A3028"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTag}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.tagAddButton, (!input.trim() || tags.length >= 8) && styles.tagAddButtonDisabled]}
          onPress={addTag}
          disabled={!input.trim() || tags.length >= 8}
        >
          <Text style={styles.tagAddButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tagCount}>{tags.length}/8 tags</Text>
    </View>
  );
};

// ============ Main Component ============
export default function PengaduanPage() {
  const router = useRouter();
  
  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const summaryRef = useRef<TextInput>(null);
  const contentRef = useRef<TextInput>(null);

  // ============ Get User ============
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
          setUsername(userData.username || 'Traveler');
        } else {
          const savedUser = await AsyncStorage.getItem('user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setUserId(user.id);
            setUsername(user.username || 'Traveler');
          } else {
            // FIX: Gunakan as any
            router.replace('/Sign-in' as any);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUserId(user.id);
          setUsername(user.username || 'Traveler');
        } else {
          // FIX: Gunakan as any
          router.replace('/Sign-in' as any);
        }
      }
    };
    
    getCurrentUser();
  }, []);

  // ============ Validations ============
  const step1Valid = title.trim().length >= 5 && game && category;
  const step2Valid = summary.trim().length >= 20 && content.trim().length >= 20;
  const step3Valid = step1Valid && step2Valid;

  // ============ Handlers ============
  const handleNext = () => {
    if (step === 1 && !step1Valid) {
      Alert.alert('Error', 'Please complete all required fields in Basic Info');
      return;
    }
    if (step === 2 && !step2Valid) {
      Alert.alert('Error', 'Please fill in summary and content (min 20 characters each)');
      return;
    }
    setStep(s => Math.min(3, s + 1));
  };

  const handlePrev = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery access to upload photos');
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
        type: asset.type || 'image/jpeg',
      }));
      setPhotos([...photos, ...newPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const openConfirm = () => {
    if (!step3Valid) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }
    setShowConfirm(true);
  };

  // ============ Submit Report ============
  const handleSubmitReport = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      const reportData = {
        title: title.trim(),
        type: category,
        game: game,
        content: content,
        userId: userId,
        severity: severity,
        version: '1.0',
        summary: summary.trim(),
        tags: tags.map(t => `#${t}`),
      };
      
      console.log('📝 Submitting report:', reportData);
      
      const response = await fetch(`${API_BASE_URL}/dashboard/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(reportData),
      });

      const result = await response.json();
      console.log('📥 Submit response:', result);
      
      if (result.success) {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData.totalReports = (userData.totalReports || 0) + 1;
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        }
        
        setSubmitted(true);
        setTimeout(() => {
          // FIX: Gunakan as any
          router.replace('/riwayat' as any);
        }, 2500);
      } else {
        Alert.alert('Error', result.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('❌ Error submitting report:', error);
      Alert.alert('Error', 'An error occurred while submitting the report');
    } finally {
      setSubmitting(false);
    }
  };

  // ============ Success Screen ============
  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#C8A96E" />
        </View>
        <Text style={styles.successTitle}>Success!</Text>
        <Text style={styles.successSubtitle}>Your report has been received</Text>
        <Text style={styles.successId}>ID: #RPT-{String(Math.floor(Math.random() * 90000) + 10000)}</Text>
        <View style={styles.successButtons}>
          <TouchableOpacity style={styles.successButtonSecondary} onPress={() => {
            setSubmitted(false);
            setStep(1);
            setTitle('');
            setGame('');
            setCategory('');
            setSeverity('medium');
            setTags([]);
            setSummary('');
            setContent('');
            setPhotos([]);
          }}>
            <Text style={styles.successButtonSecondaryText}>Write Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.successButtonPrimary} 
            onPress={() => router.replace('/riwayat' as any)}
          >
            <Text style={styles.successButtonPrimaryText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============ Loading ============
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#050810" />
        <ActivityIndicator size="large" color="#C8A96E" />
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    );
  }

  // ============ Selected Items ============
  const selectedGame = GAMES.find(g => g.id === game);
  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const selectedSeverity = SEVERITY.find(s => s.id === severity);

  // ============ Render ============
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <StatusBar barStyle="light-content" backgroundColor="#050810" />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#9A8F78" />
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Write Report</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step {step}/3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map(s => (
          <View 
            key={s} 
            style={[
              styles.progressBar, 
              s <= step && styles.progressBarActive
            ]} 
          />
        ))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {step === 1 && 'Basic Info'}
            {step === 2 && 'Content'}
            {step === 3 && 'Review'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {step === 1 && 'Fill in the basic information about your report'}
            {step === 2 && 'Write the full content of your report'}
            {step === 3 && 'Review your report before submitting'}
          </Text>
        </View>

        <StepIndicator current={step} total={3} />

        {/* ── STEP 1: BASIC INFO ── */}
        {step === 1 && (
          <View style={styles.stepContent}>
            {/* Title */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Report Title</Text>
                <Text style={styles.formRequired}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Write a clear and descriptive title..."
                placeholderTextColor="#3A3028"
                value={title}
                onChangeText={setTitle}
                maxLength={120}
              />
              <View style={styles.charCounter}>
                <Text style={styles.charCounterText}>
                  {title.length < 5 && title.length > 0 && (
                    <Text style={styles.charCounterWarning}>Min. 5 characters</Text>
                  )}
                </Text>
                <Text style={styles.charCounterText}>{title.length}/120</Text>
              </View>
            </View>

            {/* Game Selection */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Game</Text>
                <Text style={styles.formRequired}>*</Text>
              </View>
              <View style={styles.optionsGrid}>
                {GAMES.map(g => (
                  <TouchableOpacity
                    key={g.id}
                    style={[
                      styles.optionCard,
                      game === g.id && { borderColor: g.color, backgroundColor: `${g.color}14` },
                    ]}
                    onPress={() => setGame(g.id)}
                  >
                    <View style={[styles.optionBar, game === g.id && { backgroundColor: g.color }]} />
                    <Text style={[styles.optionLabel, game === g.id && { color: g.color }]}>
                      {g.label}
                    </Text>
                    {game === g.id && (
                      <Ionicons name="checkmark-circle" size={18} color={g.color} style={styles.optionCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Category</Text>
                <Text style={styles.formRequired}>*</Text>
              </View>
              <View style={styles.optionsGrid}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.optionCard,
                      category === c.id && { borderColor: '#C8A96E', backgroundColor: 'rgba(200,169,110,0.1)' },
                    ]}
                    onPress={() => setCategory(c.id)}
                  >
                    <Text style={styles.optionIcon}>{c.icon}</Text>
                    <Text style={[styles.optionLabel, category === c.id && { color: '#C8A96E' }]}>
                      {c.label}
                    </Text>
                    {category === c.id && (
                      <Ionicons name="checkmark-circle" size={18} color="#C8A96E" style={styles.optionCheck} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Severity */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Severity</Text>
                <Text style={styles.formOptional}>Optional</Text>
              </View>
              <View style={styles.severityContainer}>
                {SEVERITY.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.severityButton,
                      severity === s.id && { borderColor: s.color, backgroundColor: `${s.color}14` },
                    ]}
                    onPress={() => setSeverity(s.id)}
                  >
                    <Text style={[styles.severityText, severity === s.id && { color: s.color }]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Tags</Text>
                <Text style={styles.formOptional}>Optional</Text>
              </View>
              <TagInput tags={tags} onChange={setTags} />
            </View>
          </View>
        )}

        {/* ── STEP 2: CONTENT ── */}
        {step === 2 && (
          <View style={styles.stepContent}>
            {/* Summary */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Summary</Text>
                <Text style={styles.formRequired}>*</Text>
              </View>
              <TextInput
                ref={summaryRef}
                style={[styles.input, styles.textArea]}
                placeholder="Write a brief summary of your report (will appear in card preview)..."
                placeholderTextColor="#3A3028"
                value={summary}
                onChangeText={(text) => {
                  setSummary(text);
                  setCharCount(text.length);
                }}
                maxLength={280}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <View style={styles.charCounter}>
                <Text style={styles.charCounterText}>
                  {summary.length < 20 && summary.length > 0 && (
                    <Text style={styles.charCounterWarning}>Min. 20 characters</Text>
                  )}
                </Text>
                <Text style={[styles.charCounterText, charCount > 250 && styles.charCounterWarning]}>
                  {charCount}/280
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.formGroup}>
              <View style={styles.formLabel}>
                <Text style={styles.formLabelText}>Report Content</Text>
                <Text style={styles.formRequired}>*</Text>
              </View>
              <TextInput
                ref={contentRef}
                style={[styles.input, styles.contentArea]}
                placeholder="Write the full report here. Describe your guide, strategy, or experience..."
                placeholderTextColor="#3A3028"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
              <Text style={styles.contentHelper}>
                Supported formats: Bold, Italic, List, Quote
              </Text>
            </View>
          </View>
        )}

        {/* ── STEP 3: REVIEW ── */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewTitle}>Report Preview</Text>
              </View>

              <View style={styles.reviewBody}>
                {/* Game Badge */}
                {selectedGame && (
                  <View style={[styles.reviewBadge, { borderColor: selectedGame.color }]}>
                    <Text style={[styles.reviewBadgeText, { color: selectedGame.color }]}>
                      {selectedGame.label}
                    </Text>
                  </View>
                )}
                
                {/* Category Badge */}
                {selectedCategory && (
                  <View style={styles.reviewBadge}>
                    <Text style={styles.reviewBadgeText}>
                      {selectedCategory.icon} {selectedCategory.label}
                    </Text>
                  </View>
                )}

                {/* Title */}
                <Text style={styles.reviewTitleText}>
                  {title || <Text style={styles.reviewPlaceholder}>Report title...</Text>}
                </Text>

                {/* Summary */}
                <Text style={styles.reviewSummary}>
                  {summary || <Text style={styles.reviewPlaceholder}>Report summary...</Text>}
                </Text>

                {/* Tags */}
                {tags.length > 0 && (
                  <View style={styles.reviewTags}>
                    {tags.map(t => (
                      <View key={t} style={styles.reviewTag}>
                        <Text style={styles.reviewTagText}>#{t}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Author */}
                <View style={styles.reviewAuthor}>
                  <Text style={styles.reviewAuthorText}>{username || 'Traveler'}</Text>
                  <Text style={styles.reviewAuthorDot}>·</Text>
                  <Text style={styles.reviewAuthorText}>Just now</Text>
                </View>
              </View>
            </View>

            {/* Validation Checklist */}
            <View style={styles.checklist}>
              {[
                { label: 'Title filled', ok: title.length >= 5 },
                { label: 'Game selected', ok: !!game },
                { label: 'Category selected', ok: !!category },
                { label: 'Summary filled', ok: summary.length >= 20 },
                { label: 'Content filled', ok: content.trim().length >= 20 },
              ].map((item, i) => (
                <View key={i} style={[styles.checklistItem, item.ok && styles.checklistItemOk]}>
                  <Ionicons 
                    name={item.ok ? 'checkmark-circle' : 'close-circle'} 
                    size={20} 
                    color={item.ok ? '#6DD18A' : '#E05C7A'} 
                  />
                  <Text style={[styles.checklistText, item.ok && styles.checklistTextOk]}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonBack, step === 1 && styles.navButtonDisabled]}
            onPress={handlePrev}
            disabled={step === 1}
          >
            <Text style={styles.navButtonBackText}>← Back</Text>
          </TouchableOpacity>

          {step < 3 ? (
            <TouchableOpacity
              style={[
                styles.navButton, 
                styles.navButtonNext,
                (step === 1 ? !step1Valid : !step2Valid) && styles.navButtonDisabled
              ]}
              onPress={handleNext}
              disabled={step === 1 ? !step1Valid : !step2Valid}
            >
              <Text style={styles.navButtonNextText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonSubmit, !step3Valid && styles.navButtonDisabled]}
              onPress={openConfirm}
              disabled={!step3Valid || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#050810" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="#050810" />
                  <Text style={styles.navButtonSubmitText}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* ============ Confirm Modal ============ */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#C8A96E" />
            <Text style={styles.modalTitle}>Confirm Report</Text>
            <Text style={styles.modalText}>Is all the information correct?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.modalButtonCancelText}>Review</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]} 
                onPress={handleSubmitReport}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ============ Styles ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050810',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#050810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#5A5248',
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bottomPadding: {
    height: 20,
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
  },
  backButton: {
    padding: 4,
  },
  topbarTitle: {
    color: '#E8E0CC',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(200,169,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 4,
  },
  stepBadgeText: {
    color: '#C8A96E',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ============ Progress Bar ============
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(200,169,110,0.15)',
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: '#C8A96E',
  },

  // ============ Header ============
  header: {
    marginBottom: 16,
    marginTop: 4,
  },
  headerTitle: {
    color: '#E8E0CC',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#9A8F78',
    fontSize: 13,
    marginTop: 2,
  },

  // ============ Step Indicator ============
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    borderColor: 'rgba(200,169,110,0.5)',
    backgroundColor: 'rgba(200,169,110,0.12)',
  },
  stepCircleDone: {
    borderColor: '#C8A96E',
    backgroundColor: 'rgba(200,169,110,0.2)',
  },
  stepNumber: {
    color: '#5A5248',
    fontSize: 12,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#E8E0CC',
  },
  stepNumberDone: {
    color: '#C8A96E',
  },
  stepLabel: {
    color: '#5A5248',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  stepLabelActive: {
    color: '#C8A96E',
  },
  stepLabelDone: {
    color: '#9A8F78',
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(200,169,110,0.1)',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  stepLineDone: {
    backgroundColor: 'rgba(200,169,110,0.3)',
  },

  // ============ Form ============
  stepContent: {
    gap: 20,
  },
  formGroup: {
    marginBottom: 4,
  },
  formLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  formLabelText: {
    color: '#E8E0CC',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  formRequired: {
    color: '#E05C7A',
    fontSize: 14,
    fontWeight: '700',
  },
  formOptional: {
    color: '#5A5248',
    fontSize: 11,
    fontWeight: '400',
    marginLeft: 'auto',
  },

  // ============ Input ============
  input: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#E8E0CC',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  contentArea: {
    height: 200,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  charCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  charCounterText: {
    color: '#5A5248',
    fontSize: 10,
  },
  charCounterWarning: {
    color: '#E05C7A',
  },
  contentHelper: {
    color: '#5A5248',
    fontSize: 10,
    marginTop: 4,
  },

  // ============ Options Grid ============
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  optionBar: {
    width: 2,
    height: 24,
    backgroundColor: 'rgba(200,169,110,0.15)',
    borderRadius: 2,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionLabel: {
    flex: 1,
    color: '#9A8F78',
    fontSize: 12,
    fontWeight: '600',
  },
  optionCheck: {
    marginLeft: 'auto',
  },

  // ============ Severity ============
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 4,
    alignItems: 'center',
  },
  severityText: {
    color: '#9A8F78',
    fontSize: 12,
    fontWeight: '600',
  },

  // ============ Tags ============
  tagContainer: {
    gap: 8,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(200,169,110,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 3,
  },
  tagText: {
    color: '#C8A96E',
    fontSize: 11,
    fontWeight: '600',
  },
  tagEmpty: {
    color: '#5A5248',
    fontSize: 11,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#E8E0CC',
    fontSize: 12,
  },
  tagAddButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(200,169,110,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 4,
    justifyContent: 'center',
  },
  tagAddButtonDisabled: {
    opacity: 0.3,
  },
  tagAddButtonText: {
    color: '#C8A96E',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagCount: {
    color: '#5A5248',
    fontSize: 10,
  },

  // ============ Review ============
  reviewCard: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  reviewHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,169,110,0.08)',
  },
  reviewTitle: {
    color: '#E8E0CC',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewBody: {
    padding: 16,
    gap: 8,
  },
  reviewBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 3,
    backgroundColor: 'rgba(200,169,110,0.06)',
  },
  reviewBadgeText: {
    color: '#C8A96E',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  reviewTitleText: {
    color: '#E8E0CC',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  reviewSummary: {
    color: '#9A8F78',
    fontSize: 13,
    lineHeight: 20,
  },
  reviewPlaceholder: {
    color: '#3A3028',
  },
  reviewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  reviewTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(200,169,110,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.12)',
    borderRadius: 2,
  },
  reviewTagText: {
    color: '#C8A96E80',
    fontSize: 10,
    fontWeight: '600',
  },
  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  reviewAuthorText: {
    color: '#5A5248',
    fontSize: 11,
  },
  reviewAuthorDot: {
    color: '#5A5248',
    fontSize: 11,
  },

  // ============ Checklist ============
  checklist: {
    marginTop: 4,
    gap: 6,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(224,92,122,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(224,92,122,0.15)',
    borderRadius: 4,
  },
  checklistItemOk: {
    backgroundColor: 'rgba(109,209,138,0.04)',
    borderColor: 'rgba(109,209,138,0.15)',
  },
  checklistText: {
    color: '#E05C7A80',
    fontSize: 13,
    fontWeight: '500',
  },
  checklistTextOk: {
    color: '#9A8F78',
  },

  // ============ Navigation Buttons ============
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,169,110,0.08)',
    gap: 12,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonBack: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
  },
  navButtonNext: {
    backgroundColor: 'rgba(200,169,110,0.12)',
    borderWidth: 1,
    borderColor: '#C8A96E',
  },
  navButtonSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(200,169,110,0.15)',
    borderWidth: 1,
    borderColor: '#C8A96E',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonBackText: {
    color: '#9A8F78',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  navButtonNextText: {
    color: '#C8A96E',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  navButtonSubmitText: {
    color: '#050810',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ============ Success Screen ============
  successContainer: {
    flex: 1,
    backgroundColor: '#050810',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(200,169,110,0.1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    color: '#E8E0CC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  successSubtitle: {
    color: '#9A8F78',
    fontSize: 14,
    marginBottom: 8,
  },
  successId: {
    color: '#5A5248',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 24,
  },
  successButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  successButtonSecondary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
    borderRadius: 4,
  },
  successButtonSecondaryText: {
    color: '#9A8F78',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  successButtonPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(200,169,110,0.12)',
    borderWidth: 1,
    borderColor: '#C8A96E',
    borderRadius: 4,
  },
  successButtonPrimaryText: {
    color: '#C8A96E',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ============ Modal ============
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0C1220',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.15)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
  },
  modalTitle: {
    color: '#E8E0CC',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
  },
  modalText: {
    color: '#9A8F78',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(200,169,110,0.2)',
  },
  modalButtonCancelText: {
    color: '#9A8F78',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonConfirm: {
    backgroundColor: '#C8A96E',
  },
  modalButtonConfirmText: {
    color: '#050810',
    fontSize: 14,
    fontWeight: '700',
  },
});