import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';
import { getModelViewerHtml } from './modelViewerHtml';

const SEVERITY_COLORS: Record<string, string> = {
  info: '#2196F3',
  watch: '#FFD600',
  moderate: '#FF6D00',
  urgent: '#FF1744',
};

export default function ModelViewerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { annotations = [], patientName = 'Patient' } = route.params || {};

  const annotationsJSON = JSON.stringify(
    annotations.map((ann: any) => ({
      position: ann.position,
      color: SEVERITY_COLORS[ann.severity] || '#ffffff',
      label: ann.label,
      note: ann.note,
      severity: ann.severity,
    }))
  );

  const NGROK_URL = 'https://bolar-noncausable-jakobe.ngrok-free.dev';
  const html = getModelViewerHtml(annotationsJSON, NGROK_URL);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{patientName} Mouth Model</Text>
        <View style={{ width: 24 }} />
      </View>
      <WebView
        style={styles.webview}
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        allowsInlineMediaPlayback
        scrollEnabled={false}
        bounces={false}
        mixedContentMode="always"
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        onError={(e) => console.log('WebView error:', e.nativeEvent)}
        onHttpError={(e) => console.log('WebView HTTP error:', e.nativeEvent)}
        />
      <View style={styles.legend}>
        {[
          { color: '#2196F3', label: 'Info' },
          { color: '#FFD600', label: 'Watch' },
          { color: '#FF6D00', label: 'Moderate' },
          { color: '#FF1744', label: 'Urgent' },
        ].map(item => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  webview: { flex: 1, backgroundColor: '#0a0f1e' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0d1321',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
});