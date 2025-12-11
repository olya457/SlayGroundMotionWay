import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'onboarding'>;

const { width: W, height: H } = Dimensions.get('window');
const IS_SMALL = Math.min(W, H) <= 360 || H <= 667; 
const VERY_SMALL = H < 620;

const baseCardMaxW = Math.min(W - 24, 380);
const CARD_MAX_W = IS_SMALL ? Math.min(W - 20, 360) : baseCardMaxW;

const SLIDES = [
  {
    key: 's1',
    img: require('../assets/onb1.png'),
    title: 'Hello from\nMei Lin',
    text:
      "Hello! I'm Mei Lin, your guide at Slay Ground. Together we'll explore the sporting venues of Kanawha — from the fields to the stadiums, where you can feel the real energy of movement.",
    cta: 'Hello, Mei',
  },
  {
    key: 's2',
    img: require('../assets/onb2.png'),
    title: 'Places that\nCharge',
    text:
      'I’ll show you locations where local athletes train, teams run, and the spirit of the game simply lives. Choose a direction — and go!',
    cta: 'Continue',
  },
  {
    key: 's3',
    img: require('../assets/onb3.png'),
    title: 'Your\nSaves',
    text:
      'Liked a place? Save it to your collection. With one click, you can delete everything — if you want to start from scratch.',
    cta: 'Okay, next',
  },
  {
    key: 's4',
    img: require('../assets/onb4.png'),
    title: 'Fact from\nMei Lin',
    text:
      "Press the bright “Get a Fact” button — and I’ll tell you something interesting about sports, people, or Kanawha. Ready to move? Then go ahead, to the field!",
    cta: 'Start now!',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const sizes = useMemo(() => {
    const imgW = Math.min(W, IS_SMALL ? 360 : 420);
    const imgH = Math.min(W * (IS_SMALL ? 0.8 : 0.9), IS_SMALL ? 360 : 420);
    return {
      imgW,
      imgH,
      cardPadH: VERY_SMALL ? 12 : IS_SMALL ? 14 : 18,
      cardPadB: VERY_SMALL ? 12 : 16,
      titleSize: VERY_SMALL ? 22 : IS_SMALL ? 24 : 26,
      textSize: VERY_SMALL ? 13 : IS_SMALL ? 14 : 14.5,
      textLH: VERY_SMALL ? 18 : IS_SMALL ? 19 : 20,
      btnH: VERY_SMALL ? 48 : 52,
      btnFS: VERY_SMALL ? 15 : 16,
    };
  }, []);

  const imgOpacity = useRef(new Animated.Value(0)).current;
  const imgTranslate = useRef(new Animated.Value(18)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(18)).current;

  const runAnim = () => {
    imgOpacity.setValue(0);
    imgTranslate.setValue(18);
    cardOpacity.setValue(0);
    cardTranslate.setValue(18);

    const cfg = { duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true } as const;

    Animated.stagger(90, [
      Animated.parallel([
        Animated.timing(imgOpacity, { ...cfg, toValue: 1 }),
        Animated.timing(imgTranslate, { ...cfg, toValue: 0 }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, { ...cfg, toValue: 1 }),
        Animated.timing(cardTranslate, { ...cfg, toValue: 0 }),
      ]),
    ]).start();
  };

  useEffect(() => {
    runAnim(); 
  }, []);

  useEffect(() => {
    runAnim(); 
  }, [index]);

  const onNext = () => {
    if (index < SLIDES.length - 1) setIndex((i) => i + 1);
    else navigation.replace('registration');
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <Animated.View
        style={[
          styles.topBox,
          {
            transform: [{ translateY: imgTranslate }],
            opacity: imgOpacity,
          },
        ]}
      >
        <Image
          source={slide.img}
          style={{ width: sizes.imgW, height: sizes.imgH, marginBottom: 0 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          {
            width: CARD_MAX_W,
            paddingTop: sizes.cardPadH,
            paddingBottom: sizes.cardPadB,
            marginBottom: insets.bottom + 30,
            transform: [{ translateY: cardTranslate }],
            opacity: cardOpacity,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { fontSize: sizes.titleSize, lineHeight: sizes.titleSize + 4 },
          ]}
        >
          {slide.title}
        </Text>

        <Text
          style={[
            styles.text,
            { fontSize: sizes.textSize, lineHeight: sizes.textLH },
          ]}
        >
          {slide.text}
        </Text>

        <Pressable
          style={[
            styles.btn,
            { minHeight: sizes.btnH },
          ]}
          onPress={onNext}
        >
          <Text style={[styles.btnText, { fontSize: sizes.btnFS }]}>
            {slide.cta}
          </Text>
        </Pressable>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  topBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 24,
  },

  card: {
    alignSelf: 'center',
    backgroundColor: 'rgba(12,12,12,0.92)',
    borderRadius: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  title: {
    color: '#fff',
    fontWeight: '800',
    marginBottom: 10,
  },
  text: {
    color: '#C9C9C9',
    marginBottom: 18,
  },

  btn: {
    alignSelf: 'center',
    width: '92%',
    borderRadius: 26,
    backgroundColor: '#D24B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
