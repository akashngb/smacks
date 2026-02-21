import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';

const MOCK_CLINICS = [
  {
    id: '1',
    name: 'Downtown Dental Care',
    distance: '0.3 km',
    rating: 4.8,
    open: true,
    address: '123 King St W, Toronto',
    phone: '+1 (416) 555-0101',
  },
  {
    id: '2',
    name: 'Smile Studio Toronto',
    distance: '0.7 km',
    rating: 4.6,
    open: true,
    address: '456 Queen St E, Toronto',
    phone: '+1 (416) 555-0102',
  },
  {
    id: '3',
    name: 'Bay Street Dentistry',
    distance: '1.1 km',
    rating: 4.9,
    open: false,
    address: '789 Bay St, Toronto',
    phone: '+1 (416) 555-0103',
  },
  {
    id: '4',
    name: 'Harbourfront Dental',
    distance: '1.4 km',
    rating: 4.5,
    open: true,
    address: '321 Lake Shore Blvd, Toronto',
    phone: '+1 (416) 555-0104',
  },
];

export default function ClinicFinderScreen() {
  const [loading, setLoading] = useState(true);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === 'granted');
      setLoading(false);
    })();
  }, []);

  const openMaps = (address: string) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleBook = (clinicName: string) => {
    Alert.alert(
      'Book Appointment',
      `You're booking with ${clinicName}.\n\nAvailable time slots will appear here once the clinic connects their calendar to MouthWatch.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Notify Me When Ready', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0f1e', '#0d1f3c']} style={styles.gradient}>

        {/* Header */}
        <Text style={styles.title}>Find a Dentist</Text>
        <Text style={styles.subtitle}>Clinics near you, sorted by distance</Text>

        {/* Location Status */}
        <View style={[
          styles.locationBanner,
          { borderColor: locationGranted ? 'rgba(0,230,118,0.3)' : 'rgba(255,234,0,0.3)' },
          { backgroundColor: locationGranted ? 'rgba(0,230,118,0.07)' : 'rgba(255,234,0,0.07)' },
        ]}>
          <Feather
            name={locationGranted ? 'navigation' : 'alert-circle'}
            size={14}
            color={locationGranted ? '#00e676' : '#ffea00'}
          />
          <Text style={[
            styles.locationText,
            { color: locationGranted ? '#00e676' : '#ffea00' },
          ]}>
            {locationGranted
              ? 'Using your current location'
              : 'Location access denied — showing default results'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#00c2ff" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {MOCK_CLINICS.map((clinic) => (
              <View key={clinic.id} style={styles.clinicCard}>

                {/* Clinic Header */}
                <View style={styles.clinicHeader}>
                  <View style={styles.clinicIcon}>
                    <Feather name="map-pin" size={18} color="#00c2ff" />
                  </View>
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    <Text style={styles.clinicAddress}>{clinic.address}</Text>
                  </View>
                </View>

                {/* Meta Row */}
                <View style={styles.clinicMeta}>
                  <View style={styles.metaItem}>
                    <Feather name="navigation" size={13} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.metaText}>{clinic.distance}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name="star" size={13} color="#ffea00" />
                    <Text style={styles.metaText}>{clinic.rating}</Text>
                  </View>
                  <View style={[
                    styles.openBadge,
                    { backgroundColor: clinic.open ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)' },
                  ]}>
                    <Text style={[
                      styles.openText,
                      { color: clinic.open ? '#00e676' : '#ff1744' },
                    ]}>
                      {clinic.open ? '● Open' : '● Closed'}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() => openMaps(clinic.address)}
                    activeOpacity={0.8}
                  >
                    <Feather name="navigation" size={15} color="#00c2ff" />
                    <Text style={styles.directionsText}>Directions</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:${clinic.phone}`)}
                    activeOpacity={0.8}
                  >
                    <Feather name="phone" size={15} color="#00c2ff" />
                    <Text style={styles.directionsText}>Call</Text>
                  </TouchableOpacity>
                </View>

                {/* Book Appointment */}
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBook(clinic.name)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#00c2ff', '#0072ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bookButtonGradient}
                  >
                    <Feather name="calendar" size={15} color="#fff" />
                    <Text style={styles.bookButtonText}>Book Appointment</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  gradient: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 16,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  clinicCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 14,
  },
  clinicHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  clinicIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(0,194,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
  },
  clinicInfo: { flex: 1 },
  clinicName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 3,
  },
  clinicAddress: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 18,
  },
  clinicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  openBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  openText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,194,255,0.08)',
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,194,255,0.08)',
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.2)',
  },
  directionsText: {
    color: '#00c2ff',
    fontWeight: '600',
    fontSize: 14,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});