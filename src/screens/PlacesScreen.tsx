import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'places'>;

type Place = {
  id: string;
  title: string;
  coords: string;
  image: any; 
};

const BG = require('../assets/background.png');

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670;
const CARD_W = Math.min(width - 32, 520);
const ADDITIONAL_OFFSET = 30;

const PLACES: Place[] = [
  { id: 'kahnawake-sports-complex', title: 'Kahnawake Sports Complex', coords: '45.3974, -73.7128', image: require('../assets/kahnawake.png') },
  { id: 'turtle-fields-arena',      title: 'Turtle Fields Arena',      coords: '45.3932, -73.7065', image: require('../assets/turtle_fields.png') },
  { id: 'river-edge-running-track', title: 'River Edge Running Track',  coords: '45.3886, -73.7039', image: require('../assets/river_edge.png') },
  { id: 'mohawk-fitness-park',      title: 'Mohawk Fitness Park',       coords: '45.3908, -73.7131', image: require('../assets/mohawk_fitness.png') },
  { id: 'peace-hill-trail',         title: 'Peace Hill Trail',          coords: '45.3947, -73.7209', image: require('../assets/peace_hill.png') },
  { id: 'iron-bridge-crosspoint',   title: 'Iron Bridge Crosspoint',    coords: '45.3920, -73.7294', image: require('../assets/iron_bridge.png') },
  { id: 'south-field-court',        title: 'South Field Court',         coords: '45.3851, -73.7115', image: require('../assets/south_field.png') },
  { id: 'old-riverside-gym',        title: 'Old Riverside Gym',         coords: '45.3952, -73.7012', image: require('../assets/old_riverside_gym.png') },
  { id: 'windlane-skate-spot',      title: 'Windlane Skate Spot',       coords: '45.3895, -73.7173', image: require('../assets/windlane_skate.png') },
  { id: 'morning-flow-court',       title: 'Morning Flow Court',        coords: '45.3873, -73.7159', image: require('../assets/morning_flow.png') },
  { id: 'red-maple-track',          title: 'Red Maple Track',           coords: '45.3968, -73.7098', image: require('../assets/red_maple_track.png') },
  { id: 'black-hawk-stadium',       title: 'Black Hawk Stadium',        coords: '45.3979, -73.7163', image: require('../assets/black_hawk_stadium.png') },
];

export default function PlacesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const headOpacity = useRef(new Animated.Value(0)).current;
  const headY = useRef(new Animated.Value(-10)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.stagger(130, [
      Animated.parallel([
        Animated.timing(headOpacity, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(headY,       { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(listOpacity, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(listY,       { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [headOpacity, headY, listOpacity, listY]);

  const imageH = VERY_SMALL ? 140 : IS_SMALL ? 155 : 180;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { 
          paddingTop: insets.top + ADDITIONAL_OFFSET + 8, 
          paddingBottom: insets.bottom + (IS_SMALL ? 10 : 14) 
      }]}>
        <Animated.View style={[styles.header, { opacity: headOpacity, transform: [{ translateY: headY }] }]}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn} activeOpacity={0.85}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.headerTitle}>Recomended</Text>
            <Text style={styles.headerTitle}>sport place</Text>
          </View>

          <View style={styles.rightStub} />
        </Animated.View>

        <Animated.View style={{ flex: 1, opacity: listOpacity, transform: [{ translateY: listY }] }}>
          <FlatList
            data={PLACES}
            keyExtractor={(i) => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View style={[styles.card, { width: CARD_W }]}>
                <Image source={item.image} style={[styles.photo, { height: imageH }]} resizeMode="cover" />
                <View style={styles.infoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.placeTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.placeCoords}>📍 {item.coords}</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.goBtn}
                    onPress={() => navigation.navigate('placeDetail', { id: item.id })}
                  >
                    <Text style={styles.goIcon}>➜</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(210,75,58,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: -2 },

  titleWrap: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: IS_SMALL ? 22 : 26,
    lineHeight: IS_SMALL ? 24 : 28,
    fontWeight: '800',
  },
  rightStub: { width: 44, height: 44 }, 

  card: {
    backgroundColor: 'rgba(12,12,12,0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#7a2b25',
    padding: 12,
    marginBottom: 16,
    alignSelf: 'center',
  },
  photo: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 10,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  placeTitle: { color: '#fff', fontSize: IS_SMALL ? 16 : 17, fontWeight: '800' },
  placeCoords: { color: '#9a9a9a', marginTop: 4, fontSize: IS_SMALL ? 12.5 : 13.5 },

  goBtn: {
    width: IS_SMALL ? 44 : 48,
    height: IS_SMALL ? 44 : 48,
    borderRadius: 14,
    backgroundColor: '#D24B3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  goIcon: { color: '#fff', fontSize: IS_SMALL ? 20 : 22, fontWeight: '900', marginTop: -2 },
});