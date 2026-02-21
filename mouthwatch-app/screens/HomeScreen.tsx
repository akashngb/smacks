import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0f1e', '#0d1f3c', '#0a2a4a']} style={styles.gradient}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>MouthWatch</Text>
            <Text style={styles.tagline}>Your oral health companion</Text>
          </View>
          <View style={styles.logoCircle}>
            <Feather name="activity" size={20} color="#00c2ff" />
          </View>
        </View>

        {/* Hero Card */}
        <LinearGradient
          colors={['rgba(0,194,255,0.08)', 'rgba(0,114,255,0.04)']}
          style={styles.heroCard}
        >
          <View style={styles.heroIconCircle}>
            <Feather name="shield" size={32} color="#00c2ff" />
          </View>
          <Text style={styles.heroTitle}>Early Detection{'\n'}Saves Lives</Text>
          <Text style={styles.heroSubtitle}>
            Oral cancer survival rate jumps from 39% to 85% when caught early. Scan a lesion in seconds.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('IntakeForm')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#00c2ff', '#0072ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Feather name="search" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>  Scan a Lesion</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* PDF Report Button */}
        <TouchableOpacity
        style={styles.pdfButton}
        onPress={() => navigation.navigate('PDFPreview')}
        activeOpacity={0.8}
        >
        <View style={styles.pdfButtonInner}>
            <View style={styles.pdfIconCircle}>
            <Feather name="file-text" size={20} color="#00c2ff" />
            </View>
            <View style={styles.pdfTextBlock}>
            <Text style={styles.pdfTitle}>Generate Health Report</Text>
            <Text style={styles.pdfSub}>Export your scan history as a PDF</Text>
            </View>
            <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.3)" />
        </View>
        </TouchableOpacity>


        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconCircle}>
              <Feather name="trending-up" size={20} color="#00c2ff" />
            </View>
            <Text style={styles.actionTitle}>My History</Text>
            <Text style={styles.actionSub}>Track progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Find')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconCircle}>
              <Feather name="map-pin" size={20} color="#00c2ff" />
            </View>
            <Text style={styles.actionTitle}>Find Dentist</Text>
            <Text style={styles.actionSub}>Near you</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconCircle}>
              <Feather name="message-circle" size={20} color="#00c2ff" />
            </View>
            <Text style={styles.actionTitle}>Ask AI</Text>
            <Text style={styles.actionSub}>Dental assistant</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          MouthWatch is for screening purposes only, not medical advice.
        </Text>
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
    marginBottom: 24,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.15)',
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 34,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 21,
    marginBottom: 24,
  },
  primaryButton: { borderRadius: 14, overflow: 'hidden' },
  primaryButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 8,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 20,
    alignItems: 'center',
  },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#00c2ff',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    lineHeight: 16,
    paddingBottom: 8,
  },
  pdfButton: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 20,
    },
    pdfButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    },
    pdfIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    },
    pdfTextBlock: { flex: 1 },
    pdfTitle: { fontSize: 15, fontWeight: '700', color: '#ffffff', marginBottom: 2 },
    pdfSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
});