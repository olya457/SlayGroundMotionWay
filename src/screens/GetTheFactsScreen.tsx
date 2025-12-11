import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Share,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = require('../assets/background.png');
const GIRL = require('../assets/onb1.png');

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670;
const ADDITIONAL_OFFSET = 20;

const FACTS = [
  "Kahnawake is a community with a long history of lacrosse, which is considered a spiritual game here.",
  "The name “Kahnawake” means “floating village” in the Mohawk language.",
  "Lacrosse is considered the national sport of Canada, and its roots lie precisely in Kahnawake.",
  "Local athletes often combine training with nature — running through the forests, along the river.",
  "There are several sports clubs in Kahnawake that have been owned by families for generations.",
  "The community’s youth participate in joint tournaments with Montreal.",
  "Kahnawake is located just a 10-minute drive from Montreal, but has its own rhythm.",
  "Night runs are very popular here — thanks to the quiet streets and dim lighting.",
  "Local children learn to skate from the age of five.",
  "In winter, some of the grounds are transformed into skating rinks.",
  "The community has a tradition of opening the sports season with a ceremony of gratitude to the land.",
  "During the summer holidays, a 10-station relay race is always held.",
  "The main joint event of the year is the Kahnawake Games.",
  "Locals believe that sports are a form of spiritual discipline.",
  "There are no large casinos or noisy areas in Kahnawake — here they focus on movement, not excitement.",
  "There is a picturesque promenade near the city for walking.",
  "Each school has its own sports team with an animal emblem.",
  "A popular exercise among residents is the “morning run to the bridge and back”.",
  "Local youth often train without music — listening to the rhythm of their own breathing.",
  "There is a particularly developed culture of team support here.",
  "In Kahnawake, they believe that strength is a balance between body and peace.",
  "The color red is often used in sports symbols — as a sign of life and spirit.",
  "Some stadiums are lit only with soft warm light — for concentration.",
  "Many locals repair the grounds and tracks themselves.",
  "Torch races are often held on the coast.",
  "It is not uncommon to see athletes greeting each other, even strangers.",
  "Locals believe that true victory is discipline, not results.",
  "Every Saturday in the summer, morning stretching is held for all comers.",
  "There are meditation areas in the parks after training.",
  "Kahnawake is developing a “Sport for Peace” program that unites athletes from different cultures.",
  "Some fields are consecrated during the opening of the season, according to the Mohawk tradition.",
  "Local youth call their sports style “quiet power”.",
  "In the evenings, you can see older athletes training children — just without formalities.",
  "The main principle of local sports: “Don’t chase — move with the spirit”.",
  "Even in the rain, someone is definitely training here — and that is considered a sign of true strength.",
];

export default function GetTheFactsScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  const [fact, setFact] = useState('');

  const fade = useRef(new Animated.Value(0)).current;
  const trans = useRef(new Animated.Value(20)).current;

  const scaleShare = useRef(new Animated.Value(1)).current;
  const scaleNew = useRef(new Animated.Value(1)).current;

  const pickRandom = () => {
    const idx = Math.floor(Math.random() * FACTS.length);
    setFact(FACTS[idx]);
  };

  useEffect(() => {
    pickRandom();
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(trans, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const animatePress = (ref: Animated.Value) => {
    Animated.sequence([
      Animated.spring(ref, { toValue: 0.92, useNativeDriver: true }),
      Animated.spring(ref, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const onShare = async () => {
    try {
      await Share.share({ message: fact });
    } catch {}
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { 
          paddingTop: insets.top + ADDITIONAL_OFFSET + 16, 
          paddingBottom: insets.bottom + 10 
      }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>GET THE FACTS</Text>
        </View>

        <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: trans }] }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>I share the{'\n'}facts:</Text>
            <Text style={styles.factText}>{fact}</Text>

            <Animated.View style={{ transform: [{ scale: scaleShare }] }}>
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => {
                  animatePress(scaleShare);
                  onShare();
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.shareIcon}>⤴</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Image source={GIRL} style={styles.girl} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={{ width: '100%', transform: [{ scale: scaleNew }] }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.newFactBtn}
            onPress={() => {
              animatePress(scaleNew);
              pickRandom();
            }}
          >
            <Text style={styles.newFactText}>New fact</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => nav.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>Close facts</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const CARD_H = VERY_SMALL ? 280 : IS_SMALL ? 310 : 340;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 20 }, 

  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: -2 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '800', marginRight: 44 },

  card: {
    width: '100%',
    height: CARD_H,
    backgroundColor: 'rgba(12,12,12,0.92)',
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#D24B3A',
    flexDirection: 'row',
    padding: 18,
    marginBottom: 24,
  },
  cardTitle: { color: '#fff', fontSize: IS_SMALL ? 22 : 24, fontWeight: '800', marginBottom: 12 },
  factText: { color: '#ccc', fontSize: IS_SMALL ? 13.5 : 15, lineHeight: 20, marginBottom: 20 },

  girl: {
    width: IS_SMALL ? 110 : 130,
    height: '100%',
    marginLeft: 12,
    borderRadius: 20,
  },

  shareBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#D24B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: { color: '#fff', fontSize: 22, fontWeight: '800' },

  newFactBtn: {
    width: '100%',
    height: VERY_SMALL ? 52 : 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#D24B3A',
  },
  newFactText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  closeBtn: { paddingVertical: 8 },
  closeText: { color: '#ccc', fontSize: 15 },
});