import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground,
  TouchableOpacity, Dimensions, Animated, Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabParamList, RootStackParamList } from '../navigation/types';

import PLACES, { PlaceItem } from '../data/places';

type Props = BottomTabScreenProps<BottomTabParamList, 'home'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670;

const ADDITIONAL_OFFSET = 20;

const BG = require('../assets/background.png');
const LOGO = require('../assets/logo.png');
const GIRL = require('../assets/onb1.png');

const CARD_W = Math.min(width - 32, IS_SMALL ? 500 : 520);
const PLACE_IMG_H = VERY_SMALL ? 130 : IS_SMALL ? 150 : 160;
const TITLE_FS = VERY_SMALL ? 16 : IS_SMALL ? 17 : 18;
const SECTION_FS = VERY_SMALL ? 24 : 28;
const FACT_TITLE_FS = VERY_SMALL ? 20 : 24;

export default function HomeScreen(_: Props) {
  const insets = useSafeAreaInsets();
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const ALL_PLACES: PlaceItem[] = useMemo(() => Object.values(PLACES), []);
  const [currentPlace, setCurrentPlace] = useState<PlaceItem | null>(null);
  const fadeTop = useRef(new Animated.Value(0)).current;
  const transTop = useRef(new Animated.Value(-12)).current;
  const fadeFact = useRef(new Animated.Value(0)).current;
  const transFact = useRef(new Animated.Value(18)).current;
  const fadePlace = useRef(new Animated.Value(0)).current;
  const transPlace = useRef(new Animated.Value(18)).current;

  const useBouncy = () => {
    const v = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(v, { toValue: 0.96, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(v, { toValue: 1, friction: 3, tension: 120, useNativeDriver: true }).start();
    return { v, onPressIn, onPressOut };
  };
  const factBtnAnim = useBouncy();
  const openAllAnim = useBouncy();
  const goAnim = useBouncy();
  const pickRandomPlace = (prevId?: string | null) => {
    if (!ALL_PLACES.length) return null;
    let next = ALL_PLACES[Math.floor(Math.random() * ALL_PLACES.length)];
    if (prevId && ALL_PLACES.length > 1) {
      let guard = 0;
      while (next.id === prevId && guard < 10) {
        next = ALL_PLACES[Math.floor(Math.random() * ALL_PLACES.length)];
        guard++;
      }
    }
    return next;
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('user_profile_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.name) setName(parsed.name);
          if (parsed?.photoUri) setPhotoUri(parsed.photoUri || undefined);
        }
      } catch {}
    })();

    setCurrentPlace(pickRandomPlace(null));

    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeTop, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(transTop, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeFact, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(transFact, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadePlace, { toValue: 1, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(transPlace, { toValue: 0, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [ALL_PLACES, fadeTop, transTop, fadeFact, transFact, fadePlace, transPlace]);

  const hello = useMemo(() => (name ? `Hello, ${name}` : 'Hello'), [name]);
  const screenPaddingTop = insets.top + ADDITIONAL_OFFSET + (IS_SMALL ? 6 : 8);
  const openCurrentDetail = () => {
    if (!currentPlace) return;
    rootNav.navigate('placeDetail', { id: currentPlace.id });
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.screen, {
        paddingTop: screenPaddingTop,
        paddingBottom: insets.bottom + 12
      }]}>
        <Animated.View style={[styles.topRow, { opacity: fadeTop, transform: [{ translateY: transTop }] }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}
            </View>
            <Text style={styles.helloText} numberOfLines={1}>{hello}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.factCard, { width: CARD_W, opacity: fadeFact, transform: [{ translateY: transFact }] }]}>
          <View style={styles.factLeft}>
            <Text style={[styles.factTitle, { fontSize: FACT_TITLE_FS }]}>I share the{'\n'}facts:</Text>
            <Animated.View style={{ transform: [{ scale: factBtnAnim.v }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.factBtn}
                onPress={() => rootNav.navigate('getTheFacts')}
                onPressIn={factBtnAnim.onPressIn}
                onPressOut={factBtnAnim.onPressOut}
              >
                <Text style={styles.factBtnText}>Get the fact</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <Image source={GIRL} style={styles.girl} resizeMode="contain" />
        </Animated.View>

        <View style={[styles.sectionHeader, { width: CARD_W }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { fontSize: SECTION_FS }]}>Recomended</Text>
            <Text style={[styles.sectionTitle, { fontSize: SECTION_FS }]}>sport place</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: openAllAnim.v }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.openAllBtn}
              onPress={() => rootNav.navigate('places')}
              onPressIn={openAllAnim.onPressIn}
              onPressOut={openAllAnim.onPressOut}
            >
              <Text style={styles.openAllText}>Open all</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {currentPlace && (
          <Animated.View style={[styles.placeCard, { width: CARD_W, opacity: fadePlace, transform: [{ translateY: transPlace }] }]}>
            <Image source={currentPlace.image} style={styles.placeImage} resizeMode="cover" />
            <View style={styles.placeContent}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.placeTitle, { fontSize: TITLE_FS }]} numberOfLines={2}>
                  {currentPlace.title}
                </Text>
                <Text style={styles.placeCoords}>
                  📍 {currentPlace.coords.latitude}, {currentPlace.coords.longitude}
                </Text>
              </View>

              <Animated.View style={{ transform: [{ scale: goAnim.v }] }}>
                <TouchableOpacity
                  style={styles.placeGo}
                  activeOpacity={0.9}
                  onPress={openCurrentDetail}
                  onPressIn={goAnim.onPressIn}
                  onPressOut={goAnim.onPressOut}
                >
                  <Text style={styles.placeGoText}>➜</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}

const LOGO_W = VERY_SMALL ? 56 : IS_SMALL ? 60 : 64;
const LOGO_H = LOGO_W;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  screen: { flex: 1, paddingHorizontal: 16 },

  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: IS_SMALL ? 10 : 14 },
  logo: { width: LOGO_W, height: LOGO_H, borderRadius: 16 },
  profileCard: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.9)',
    borderRadius: 18,
    paddingHorizontal: IS_SMALL ? 10 : 12,
    paddingVertical: IS_SMALL ? 6 : 8,
    borderWidth: 1,
    borderColor: '#bb7c0fff',
  },
  avatarWrap: {
    width: IS_SMALL ? 32 : 36,
    height: IS_SMALL ? 32 : 36,
    borderRadius: IS_SMALL ? 16 : 18,
    borderWidth: 1,
    borderColor: '#bb7c0fff',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: { backgroundColor: '#2a2a2a' },
  helloText: { color: '#fff', fontSize: IS_SMALL ? 14 : 16, fontWeight: '700' },

  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12,12,12,0.92)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: IS_SMALL ? 14 : 16,
    marginTop: 8,
    marginBottom: IS_SMALL ? 14 : 18,
  },
  factLeft: { flex: 1 },
  factTitle: { color: '#fff', fontWeight: '800', marginBottom: IS_SMALL ? 10 : 12, fontSize: FACT_TITLE_FS },
  factBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: IS_SMALL ? 8 : 10,
    borderRadius: 20,
    backgroundColor: '#bb7c0fff',
  },
  factBtnText: { color: '#fff', fontWeight: '700', fontSize: IS_SMALL ? 14 : 15 },
  girl: { width: IS_SMALL ? 120 : 140, height: IS_SMALL ? 104 : 120, marginLeft: 8, borderRadius: 14 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: IS_SMALL ? 8 : 10 },
  sectionTitle: { color: '#fff', fontWeight: '800' },
  openAllBtn: {
    backgroundColor: '#bb7c0fff',
    paddingHorizontal: IS_SMALL ? 14 : 18,
    paddingVertical: IS_SMALL ? 10 : 12,
    borderRadius: 18,
    marginLeft: 12,
  },
  openAllText: { color: '#fff', fontWeight: '700', fontSize: IS_SMALL ? 14 : 15 },

  placeCard: {
    backgroundColor: 'rgba(12,12,12,0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#bb7c0fff',
    padding: IS_SMALL ? 10 : 12,
  },
  placeImage: { width: '100%', height: PLACE_IMG_H, borderRadius: 16, marginBottom: IS_SMALL ? 8 : 10 },
  placeContent: { flexDirection: 'row', alignItems: 'center' },
  placeTitle: { color: '#fff', fontWeight: '800' },
  placeCoords: { color: '#9a9a9a', marginTop: 4, fontSize: IS_SMALL ? 12 : 13 },
  placeGo: {
    width: IS_SMALL ? 44 : 48,
    height: IS_SMALL ? 44 : 48,
    borderRadius: 12,
    backgroundColor: '#bb7c0fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  placeGoText: { color: '#fff', fontSize: IS_SMALL ? 20 : 22, fontWeight: '900', marginTop: -2 },
});
