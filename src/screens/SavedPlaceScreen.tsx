import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  DeviceEventEmitter,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLACES, type PlaceItem } from '../data/places';

const BG = require('../assets/background.png');
const STORAGE_KEY = 'sg_saved_places_v1';
const EVT_CLEAR = 'sg_clear_saved_places';

type Nav = { navigate: (name: string, params?: any) => void; addListener: any };

export default function SavedPlaceScreen({ navigation }: { navigation: Nav }) {
  const [saved, setSaved] = useState<PlaceItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const idsToItems = useCallback((ids: string[]): PlaceItem[] => {
    return ids.map((id) => PLACES[id]).filter(Boolean) as PlaceItem[];
  }, []);

  const load = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    setSaved(idsToItems(ids));
  }, [idsToItems]);

  useEffect(() => {
    load();
    const unsubFocus = navigation.addListener('focus', load);
    const subClear = DeviceEventEmitter.addListener(EVT_CLEAR, () => {
      setSaved([]);
    });
    return () => {
      unsubFocus && unsubFocus();
      subClear.remove();
    };
  }, [navigation, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const onOpen = useCallback(
    (item: PlaceItem) => navigation.navigate('placeDetail', { id: item.id }),
    [navigation]
  );

  const keyExtractor = useCallback((p: PlaceItem) => p.id, []);
  const contentPadding = useMemo(() => ({ paddingBottom: 40 }), []);

  const renderItem = useCallback(
    ({ item }: { item: PlaceItem }) => (
      <TouchableOpacity style={styles.card} onPress={() => onOpen(item)}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.coords}>
            📍 {item.coords.latitude}, {item.coords.longitude}
          </Text>
        </View>
        <View style={styles.openBtn}>
          <Text style={styles.openIcon}>↗︎</Text>
        </View>
      </TouchableOpacity>
    ),
    [onOpen]
  );

  return (
    <ImageBackground source={BG} style={styles.bg}>
      <Text style={styles.header}>Saved Places</Text>

      {saved.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            Unfortunately you didn’t like any place
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={contentPadding}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 20,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: { color: '#ccc', fontSize: 18, textAlign: 'center' },

  card: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#0C0C0C',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#7a2b25',
    overflow: 'hidden',
    marginBottom: 18,
  },
  image: { width: '100%', height: 160 },
  cardBody: { padding: 14 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  coords: { color: '#bbb' },
  openBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(210,75,58,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openIcon: { color: '#fff', fontSize: 24, fontWeight: '800' },
});
