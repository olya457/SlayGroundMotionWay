import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

type UserProfile = { name: string; photoUri: string | null };
const STORAGE_KEY = 'user_profile_v1';

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<UserProfile>({ name: '', photoUri: null });
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const fade = useRef(new Animated.Value(0)).current;
  const shift = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(shift, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, shift]);

  const bottomGap = useMemo(() => {
    const overlay = 60 + 30 + 16;
    return (insets.bottom || 0) + (IS_SMALL ? overlay + 60 : overlay);
  }, [insets.bottom]);

  const S = useMemo(
    () => ({
      title: IS_SMALL ? 28 : 32,
      cardRadius: IS_SMALL ? 22 : 28,
      cardPadH: IS_SMALL ? 16 : 20,
      cardPadTop: IS_SMALL ? 14 : 18,
      photoBoxPad: IS_SMALL ? 8 : 10,
      photoSize: IS_SMALL ? 136 : 160,
      nameHeight: IS_SMALL ? 44 : 48,
      btnSize: IS_SMALL ? 44 : 48,
      inputFont: IS_SMALL ? 15 : 16,
      nameFont: IS_SMALL ? 15 : 16,
    }),
    []
  );

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: UserProfile | null = raw ? JSON.parse(raw) : null;
        if (mounted) {
          const next = parsed ?? { name: '', photoUri: null };
          setProfile(next);
          setNameDraft(next.name ?? '');
        }
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const saveProfile = async (next: Partial<UserProfile>) => {
    const merged: UserProfile = { name: profile.name, photoUri: profile.photoUri, ...next };
    setProfile(merged);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  const pickPhoto = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.9 });
    if (res.didCancel) return;
    const asset: Asset | undefined = res.assets?.[0];
    if (asset?.uri) await saveProfile({ photoUri: asset.uri });
  };

  const commitName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    await saveProfile({ name: trimmed });
    setEditingName(false);
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.bg} resizeMode="cover">
      <KeyboardAvoidingView
        style={[styles.screen, { paddingTop: insets.top + 20 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={{
            width: '100%',
            alignItems: 'center',
            opacity: fade,
            transform: [{ translateY: shift }],
            marginTop: 20, 
          }}
        >
          <Text style={[styles.title, { fontSize: S.title }]}>Profile</Text>

          <View
            style={[
              styles.card,
              {
                marginTop: 36,
                marginBottom: bottomGap,
                paddingHorizontal: S.cardPadH,
                paddingTop: S.cardPadTop,
                borderRadius: S.cardRadius,
              },
            ]}
          >
            <View
              style={[
                styles.photoBox,
                {
                  padding: S.photoBoxPad,
                  borderRadius: 18,
                },
              ]}
            >
              <Pressable style={[styles.photoInner, { width: S.photoSize, height: S.photoSize }]} onPress={pickPhoto}>
                {profile.photoUri ? (
                  <Image source={{ uri: profile.photoUri }} style={styles.photo} />
                ) : (
                  <View style={styles.addWrap}>
                    <Text style={styles.addIcon}>＋</Text>
                    <Text style={styles.addText}>Add photo</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.photoBadge,
                  {
                    width: S.btnSize,
                    height: S.btnSize,
                    borderRadius: 14,
                  },
                ]}
                onPress={pickPhoto}
              >
                <Text style={styles.badgeIcon}>👤</Text>
              </Pressable>
            </View>

            {!editingName ? (
              <View style={styles.nameRow}>
                <View
                  style={[
                    styles.nameBox,
                    {
                      height: S.nameHeight,
                    },
                  ]}
                >
                  <Text style={[styles.nameText, { fontSize: S.nameFont }]}>
                    {profile.name?.trim() ? profile.name : 'Anonymous'}
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.editBtn,
                    {
                      width: S.btnSize,
                      height: S.btnSize,
                      borderRadius: 14,
                    },
                  ]}
                  onPress={() => setEditingName(true)}
                >
                  <Text style={styles.editIcon}>✎</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <View style={[styles.inputBox, { flex: 1, borderRadius: 14 }]}>
                  <TextInput
                    value={nameDraft}
                    onChangeText={setNameDraft}
                    placeholder="Your name"
                    placeholderTextColor="#7B7B7B"
                    style={[styles.input, { fontSize: S.inputFont }]}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={commitName}
                  />
                </View>
                <Pressable
                  style={[
                    styles.saveBtn,
                    {
                      width: S.btnSize,
                      height: S.btnSize,
                      borderRadius: 14,
                      opacity: nameDraft.trim() ? 1 : 0.5,
                    },
                  ]}
                  disabled={!nameDraft.trim()}
                  onPress={commitName}
                >
                  <Text style={styles.saveIcon}>✓</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  title: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },

  card: {
    width: '90%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: 'rgba(12,12,12,0.92)',
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: '#D0453B',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  photoBox: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#D0453B',
    marginBottom: 18,
  },
  photoInner: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  photo: { width: '100%', height: '100%' },

  photoBadge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: '#D24B3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  badgeIcon: { color: '#fff', fontSize: 18, fontWeight: '800' },

  addWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  addIcon: { color: '#D24B3A', fontSize: 34, marginBottom: 6 },
  addText: { color: '#C9C9C9' },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  nameBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  nameText: { color: '#fff', fontWeight: '700' },

  inputBox: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  input: {
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  editBtn: {
    backgroundColor: '#D24B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: { color: '#fff', fontSize: 18, fontWeight: '800' },

  saveBtn: {
    backgroundColor: '#D24B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
