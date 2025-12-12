import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Switch,
  DeviceEventEmitter,
  Alert,
  Share,
  Image,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = require('../assets/background.png');
const APP_LOGO = require('../assets/logo.png');
const STORAGE_KEY = 'sg_saved_places_v1';
export const EVT_CLEAR = 'sg_clear_saved_places';

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [vibration, setVibration] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();
    Animated.timing(translate, { toValue: 0, duration: 420, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();
  }, [fade, translate]);

  const onClear = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    DeviceEventEmitter.emit(EVT_CLEAR);
    Alert.alert('Done', 'Saved places cleared.');
  };

  const onShare = () => {
    Share.share({
      title: 'TO City TO Motion Guide',
      message:
        'TO City TO Motion Guide — offline guide with sports places, routes and daily facts. All data stays on your device.',
    });
  };

  const bottomPad = useMemo(() => {
    const tabApprox = IS_SMALL ? 92 : 104;
    const extra = 24;
    return insets.bottom + tabApprox + extra;
  }, [insets.bottom]);

  const S = useMemo(
    () => ({
      title: IS_SMALL ? 28 : 32,
      aboutTitle: IS_SMALL ? 26 : 30,
      rowPadV: IS_SMALL ? 14 : 16,
      rowRadius: IS_SMALL ? 16 : 20,
      cardPad: IS_SMALL ? 14 : 18,
      cardRadius: IS_SMALL ? 18 : 22,
      pLine: IS_SMALL ? 20 : 22,
      logoBox: IS_SMALL ? 78 : 92,
      logoImg: IS_SMALL ? 66 : 78,
      shareBtn: IS_SMALL ? 46 : 52,
      shareIcon: IS_SMALL ? 20 : 22,
    }),
    []
  );

  return (
    <ImageBackground source={BG} style={[styles.bg, { paddingHorizontal: IS_SMALL ? 16 : 20 }]} resizeMode="cover">
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad }}
        scrollIndicatorInsets={{ bottom: bottomPad }}
        showsVerticalScrollIndicator
      >
        <Animated.View style={{ opacity: fade, transform: [{ translateY: translate }] }}>
          <Text style={[styles.title, { fontSize: S.title, marginTop: insets.top + 20 }]}>Settings</Text>

          <View style={[styles.row, { paddingVertical: S.rowPadV, borderRadius: S.rowRadius }]}>
            <Text style={styles.rowLabel}>Clear saved places</Text>
            <Pressable style={styles.iconBtn} onPress={onClear}>
              <Text style={styles.iconTxt}>🗑️</Text>
            </Pressable>
          </View>

          <View style={[styles.row, { paddingVertical: S.rowPadV, borderRadius: S.rowRadius }]}>
            <Text style={styles.rowLabel}>Vibration</Text>
            <View style={styles.toggleWrap}>
              <Switch value={vibration} onValueChange={setVibration} />
              <Text style={styles.toggleTxt}>{vibration ? 'ON' : 'OFF'}</Text>
            </View>
          </View>

          <Text style={[styles.aboutTitle, { fontSize: S.aboutTitle }]}>About app</Text>

          <View style={[styles.aboutCard, { padding: S.cardPad, borderRadius: S.cardRadius }]}>
            <View style={styles.aboutTop}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.aboutP, { lineHeight: S.pLine, marginBottom: 0 }]}>
                  TO City TO Motion Guide is a sports tour guide in Kanawha, created for those who live on the move.
                </Text>
              </View>

              <View
                style={[
                  styles.logoWrap,
                  { width: S.logoBox, height: S.logoBox, borderRadius: Math.round(S.logoBox * 0.2), marginLeft: 8 },
                ]}
              >
                <Image
                  source={APP_LOGO}
                  style={[{ width: S.logoImg, height: S.logoImg, borderRadius: Math.round(S.logoImg * 0.2) }]}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={[styles.aboutP, { lineHeight: S.pLine }]}>
                Together with guide Mei Lin, you will discover sports fields, stadiums, running routes and places where
                sport meets nature.
              </Text>
              <Text style={[styles.aboutP, { lineHeight: S.pLine }]}>
                Save your favorite locations, get daily facts and discover the city at the rhythm of energy.
              </Text>
              <Text style={[styles.aboutP, { lineHeight: S.pLine }]}>
                All data is stored only on your device. The app works offline — without accounts, ads or tracking.
              </Text>
            </View>

            <Pressable
              style={[
                styles.shareBtn,
                { width: S.shareBtn, height: S.shareBtn, borderRadius: Math.round(S.shareBtn * 0.31) },
              ]}
              onPress={onShare}
            >
              <Text style={[styles.shareIcon, { fontSize: S.shareIcon }]}>↗︎</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      <View
        pointerEvents="none"
        style={[
          styles.curtain,
          {
            height: bottomPad - insets.bottom,
            backgroundColor: 'rgba(14,14,14,0.92)',
          },
        ]}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  title: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
  },
  row: {
    backgroundColor: 'rgba(12,12,12,0.92)',
    borderWidth: 1,
    borderColor: '#BB7C0F',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rowLabel: { color: '#fff', fontSize: 18, fontWeight: '700' },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(142, 105, 18, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTxt: { color: '#fff', fontSize: 20 },
  toggleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleTxt: { color: '#fff', fontWeight: '700' },
  aboutTitle: { color: '#fff', fontWeight: '800', marginTop: 10, marginBottom: 10 },
  aboutCard: { backgroundColor: 'rgba(12,12,12,0.92)', borderWidth: 1, borderColor: '#BB7C0F' },
  aboutTop: { flexDirection: 'row', alignItems: 'flex-start' },
  aboutP: { color: '#E8E8E8', marginBottom: 10 },
  logoWrap: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: { marginTop: 14, backgroundColor: '#BB7C0F', alignItems: 'center', justifyContent: 'center' },
  shareIcon: { color: '#fff', fontWeight: '800' },
  curtain: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
