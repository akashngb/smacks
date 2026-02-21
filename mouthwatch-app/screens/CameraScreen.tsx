import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Image, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const API_URL = 'https://bolar-noncausable-jakobe.ngrok-free.dev/';


export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const riskFactors = route.params?.riskFactors || {};

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to continue.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, base64: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, base64: false });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'lesion.jpg',
      } as any);
      formData.append('risk_factors', JSON.stringify(riskFactors));

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      navigation.navigate('Results', {
        result: response.data.result,
        imageUri: image,
        riskFactors,
      });
    } catch (err) {
      Alert.alert('Analysis failed', 'Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0f1e', '#0d1f3c']} style={styles.gradient}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Lesion</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <Feather name="info" size={16} color="#00c2ff" />
          <Text style={styles.tipText}>
            For best results, use your MouthWatch UV wand in a dimly lit room. Position the lesion in the center of the frame.
          </Text>
        </View>

        {/* Image Preview */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => pickImage(true)}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="camera" size={48} color="rgba(255,255,255,0.2)" />
              <Text style={styles.placeholderText}>Tap to take a photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => pickImage(true)}
            activeOpacity={0.8}
          >
            <Feather name="camera" size={20} color="#00c2ff" />
            <Text style={styles.secondaryButtonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => pickImage(false)}
            activeOpacity={0.8}
          >
            <Feather name="image" size={20} color="#00c2ff" />
            <Text style={styles.secondaryButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.analyzeButton, (!image || loading) && styles.analyzeButtonDisabled]}
          onPress={analyze}
          disabled={!image || loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={image && !loading ? ['#00c2ff', '#0072ff'] : ['#1a2a3a', '#1a2a3a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.analyzeButtonGradient}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.analyzeButtonText}>  Analyzing...</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Now →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  gradient: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,194,255,0.08)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
    alignItems: 'flex-start',
  },
  tipText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1, lineHeight: 19 },
  imageContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: { color: 'rgba(255,255,255,0.25)', fontSize: 15 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,194,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
  },
  secondaryButtonText: { color: '#00c2ff', fontWeight: '600', fontSize: 15 },
  analyzeButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  analyzeButtonDisabled: { opacity: 0.4 },
  analyzeButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  analyzeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
});