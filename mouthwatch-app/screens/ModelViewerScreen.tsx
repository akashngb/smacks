import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ModelViewerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { patientName = 'Patient' } = route.params || {};

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
      <View style={styles.modelContainer}>
        <Image
          source={require('../assets/teeth-preview.jpg')}
          style={styles.modelImage}
          resizeMode="contain"
        />
        <Text style={styles.hint}>Full 3D annotation available on dentist dashboard</Text>
      </View>
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
  modelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modelImage: {
    width: '100%',
    height: '90%',
    borderRadius: 16,
  },
  hint: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    marginTop: 10,
    textAlign: 'center',
  },
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