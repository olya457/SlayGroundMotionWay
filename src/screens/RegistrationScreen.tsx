import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'registration'>;

export default function RegistrationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const bottomGap = insets.bottom + 30;

  const pickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (result.didCancel) return;
    const asset: Asset | undefined = result.assets?.[0];

    if (asset?.uri) {
      setPhotoUri(asset.uri);
    }
  };

  const saveProfile = async () => {
    const payload = { name: name.trim(), photoUri };
    await AsyncStorage.setItem('user_profile_v1', JSON.stringify(payload));
  };

  const onNext = async () => {
    if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else {
      await saveProfile();
      navigation.replace('tabs');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={[styles.card, { marginBottom: bottomGap }]}>
        <Text style={styles.title}>
          {step === 1 ? 'Create your profile' : 'Add your photo'}
        </Text>

        {step === 1 ? (
          <>
            <Text style={styles.text}>
              All data is stored only on your device. No server connection,
              privacy first.
            </Text>

            <View style={styles.inputBox}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#7B7B7B"
                style={styles.input}
              />
            </View>

            <Pressable
              style={[styles.btn, { opacity: name.trim() ? 1 : 0.5 }]}
              disabled={!name.trim()}
              onPress={onNext}
            >
              <Text style={styles.btnText}>Continue</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.photoBox}>
              <Pressable style={styles.photoInner} onPress={pickPhoto}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                ) : (
                  <View style={styles.addWrap}>
                    <Text style={styles.addIcon}>＋</Text>
                    <Text style={styles.addText}>Add photo</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <Pressable style={styles.btn} onPress={onNext}>
              <Text style={styles.btnText}>Save and start</Text>
            </Pressable>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },

  card: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: 'rgba(12,12,12,0.92)',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: '#BB7C0F',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    alignSelf: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  text: { color: '#C9C9C9', fontSize: 14.5, marginBottom: 18 },

  inputBox: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  input: {
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },

  photoBox: {
    borderWidth: 1,
    borderColor: '#bb7c0fff',
    borderRadius: 18,
    padding: 10,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  photoInner: {
    width: 160,
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  photo: { width: '100%', height: '100%' },

  addWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  addIcon: { color: '#bb7c0fff', fontSize: 34, marginBottom: 6 },
  addText: { color: '#C9C9C9' },

  btn: {
    alignSelf: 'center',
    width: '92%',
    minHeight: 52,
    borderRadius: 26,
    backgroundColor: '#bb7c0fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
