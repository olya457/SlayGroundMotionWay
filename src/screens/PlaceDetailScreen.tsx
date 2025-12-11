import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  ScrollView,
  Share,
  Alert,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import PLACES from '../data/places'; 

const BG = require('../assets/background.png');
const STORAGE_KEY = 'sg_saved_places_v1';

type Props = NativeStackScreenProps<RootStackParamList, 'placeDetail'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const HERO_H = IS_SMALL ? 360 : 460;

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const place = PLACES[id];
  useEffect(() => {
    if (!place) {
      Alert.alert('Not found', 'Place not found', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [place, navigation]);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setIsSaved(list.includes(id));
    })();
  }, [id]);

  const toggleSave = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];

    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIsSaved((v) => !v);
  };

  const onShare = () => {
    if (!place) return;
    Share.share({
      title: place.title,
      message: `${place.title}\n📍 ${place.coords.latitude}, ${place.coords.longitude}\n\n${place.description}`,
    });
  };

  if (!place) return null;

  return (
    <ImageBackground source={BG} style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <Image source={place.image} style={styles.hero} resizeMode="cover" />

        <View style={styles.fabRow}>
          <TouchableOpacity style={styles.fabBack} onPress={() => navigation.goBack()}>
            <Text style={styles.fabBackIcon}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fabSave, isSaved && { backgroundColor: '#fff' }]}
            onPress={toggleSave}
          >
            <Text style={[styles.fabSaveIcon, isSaved && { color: '#D24B3A' }]}>🔖</Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}
        >
          {!showMap && (
            <View style={styles.card}>
              <Text style={styles.title}>{place.title}</Text>

              <Text style={styles.coords}>
                📍 {place.coords.latitude}, {place.coords.longitude}
              </Text>

              <Text style={styles.desc}>{place.description}</Text>
            </View>
          )}

          {showMap && (
            <View style={styles.mapCard}>
              <Text style={styles.mapTitle}>Interactive map</Text>

              <View style={styles.mapWrap}>
                <MapView
                  style={styles.map}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                  initialRegion={{
                    latitude: place.coords.latitude,
                    longitude: place.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={place.coords} />
                </MapView>
              </View>
            </View>
          )}

          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.bottomBtn} onPress={onShare}>
              <Text style={styles.bottomIcon}>↗︎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomBtn}
              onPress={() => setShowMap((v) => !v)}
            >
              <Text style={styles.bottomIcon}>{showMap ? '✕' : '📍'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  hero: {
    width: '100%',
    height: HERO_H,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  fabRow: {
    position: 'absolute',
    top: 70,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  fabBack: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(210,75,58,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBackIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: -2,
  },
  fabSave: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(210,75,58,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabSaveIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '800',
  },

  card: {
    backgroundColor: 'rgba(12,12,12,0.96)',
    width: width - 20,
    alignSelf: 'center',
    marginTop: -30,
    padding: IS_SMALL ? 20 : 26,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#7a2b25',
  },

  title: {
    color: '#fff',
    fontSize: IS_SMALL ? 22 : 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  coords: {
    color: '#bbb',
    marginBottom: 12,
  },
  desc: {
    color: '#ddd',
    lineHeight: 22,
  },

  mapCard: {
    backgroundColor: 'rgba(12,12,12,0.96)',
    width: width - 20,
    alignSelf: 'center',
    marginTop: 16,
    padding: 22,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#7a2b25',
  },

  mapTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },

  mapWrap: {
    height: IS_SMALL ? 260 : 340,
    borderRadius: 22,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },

  bottomRow: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 26,
  },

  bottomBtn: {
    width: IS_SMALL ? 58 : 66,
    height: IS_SMALL ? 58 : 66,
    borderRadius: 20,
    backgroundColor: 'rgba(210,75,58,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    color: '#fff',
    fontSize: IS_SMALL ? 26 : 30,
    fontWeight: '800',
  },
});
