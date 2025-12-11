import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import WebView from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'loader'>;

const { width } = Dimensions.get('window');
const LOADER_W = Math.min(width - 48, 320);
const LOADER_H = 160;

const LOADER_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  html,body{margin:0;padding:0;background:transparent;height:100%}
  .icon-loader{display:flex;justify-content:center;align-items:center;width:100%;height:100%}
  .icon-loader__inner{position:relative;width:120px;height:120px}
  .icon-loader__inner i{position:absolute;opacity:0;top:0;left:50%;transform:translateX(-50%)}
  .icon-loader__inner i::before{content:'';display:inline-block;width:120px;height:120px;background-repeat:no-repeat;background-size:contain;background-position:center}
  .first{animation:icon-first 2s infinite ease}
  .first::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'%3E%3Cpath d='M483.8 179.4C449.8 74.6 352.6 8 248.1 8c-25.4 0-51.2 3.9-76.7 12.2C41.2 62.5-30.1 202.4 12.2 332.6 46.2 437.4 143.4 504 247.9 504c25.4 0 51.2-3.9 76.7-12.2 130.2-42.3 201.5-182.2 159.2-312.4zm-74.5 193.7l-52.2 6.4-43.7-60.9 24.4-75.2 71.1-22.1 38.9 36.4c-.2 30.7-7.4 61.1-21.7 89.2-4.7 9.3-10.7 17.8-16.8 26.2zm0-235.4l-10.4 53.1-70.7 22-64.2-46.5V92.5l47.4-26.2c39.2 13 73.4 38 97.9 71.4zM184.9 66.4L232 92.5v73.8l-64.2 46.5-70.6-22-10.1-52.5c24.3-33.4 57.9-58.6 97.8-71.9zM139 379.5L85.9 373c-14.4-20.1-37.3-59.6-37.8-115.3l39-36.4 71.1 22.2 24.3 74.3-43.5 61.7zm48.2 67l-22.4-48.1 43.6-61.7H287l44.3 61.7-22.4 48.1c-6.2 1.8-57.6 20.4-121.7 0z' fill='%23fc7253'/%3E%3C/svg%3E")}
  .second{animation:icon-second 2s infinite ease}
  .second::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'%3E%3Cpath d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zM114 404c12-14.4 22.5-30 30.8-47.1l-26.8-13c-6.8 13.9-15.3 26.5-24.9 38.4-55.4-67.7-64.8-173.4 0-252.7 9.6 11.8 18.1 24.4 24.8 38.2l26.8-13.1c-8.3-17-18.7-32.5-30.7-46.8 73.3-66.4 188.4-72 268 0-12 14.3-22.4 29.9-30.7 47l26.8 13c6.8-13.9 15.3-26.5 24.8-38.3 55.8 68.3 64.4 173.9.1 252.7-9.6-11.8-18.1-24.4-24.9-38.3l-26.8 13.1c8.3 17 18.7 32.6 30.8 46.9-73.6 66.7-188.8 71.9-268.1 0zm42.7-76.5l-28.3-9.2c12.2-37.5 14-81.5-.1-124.7l28.3-9.2c16.3 50 14 100.4.1 143.1zm211-9.2l-28.3 9.2c-16.3-50-14-100.5-.1-143.1l28.3 9.2c-12.2 37.4-14 81.5.1 124.7z' fill='%23fc7253'/%3E%3C/svg%3E")}
  .third{animation:icon-third 2s infinite ease}
  .third::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath d='M400 224a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm238.57 114.4l-27.5-181.25C603.32 106 565.45 65 515.68 53.79a889.5 889.5 0 0 0-391.36 0C74.55 65 36.68 106 28.93 157.15L1.44 338.4C-9.86 412.85 46.94 480 121.21 480h.25a121 121 0 0 0 108.38-67.94L243.67 384h152.66l13.83 28.06A121 121 0 0 0 518.55 480h.25c74.27 0 131.06-67.15 119.77-141.6zM496 160a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm-232 40h-48v-48a8 8 0 0 0-8-8h-32a8 8 0 0 0-8 8v48h-48a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h48v48a8 8 0 0 0 8 8h32a8 8 0 0 0 8-8v-48h48a8 8 0 0 0 8-8v-32a8 8 0 0 0-8-8z' fill='%23fc7253'/%3E%3C/svg%3E")}
  .fourth{animation:icon-fourth 2s infinite ease}
  .fourth::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath d='M616.3 61.3C562-17.2 434.4-19.7 333 50.4c-57.7 40-95.6 95.3-108.4 149.9-10 42.6-30.1 81.5-56.6 115.8-.4-.2-15.1-8.1-30.7 2.8L13.6 405.6c-14.5 10.1-18 30.1-7.9 44.6l33.8 48.2c10.5 15 30.5 17.7 44.6 7.9l123.7-86.6c9.8-6.8 14-18.1 13-29.2 30.3-9.2 61.7-14.3 93.4-14 28.7.3 34.9 3.8 58.3 4.1 49.7.5 104.6-16.1 154.1-50.3 103-71.4 143.2-191.8 89.7-269z' fill='%23fc7253'/%3E%3C/svg%3E")}
  @keyframes icon-first{0%{opacity:1}25%{opacity:0}50%{opacity:0}75%{opacity:0}100%{opacity:1}}
  @keyframes icon-second{0%{opacity:0}25%{opacity:1}50%{opacity:0}75%{opacity:0}100%{opacity:0}}
  @keyframes icon-third{0%{opacity:0}25%{opacity:0}50%{opacity:1}75%{opacity:0}100%{opacity:0}}
  @keyframes icon-fourth{0%{opacity:0}25%{opacity:0}50%{opacity:0}75%{opacity:1}100%{opacity:0}}
</style></head>
<body>
  <div class="icon-loader"><div class="icon-loader__inner">
    <i class="first"></i><i class="second"></i><i class="third"></i><i class="fourth"></i>
  </div></div>
</body></html>`;

export default function LoaderScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('onboarding'), 5000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.centerWrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html: LOADER_HTML }}
          style={styles.web}
          automaticallyAdjustContentInsets={false}
          scrollEnabled={false}
          bounces={false}
          androidHardwareAccelerationDisabled={false}
          setSupportMultipleWindows={false}
          containerStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  centerWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: LOADER_W,
    height: LOADER_H,
    marginLeft: -LOADER_W / 2,
    marginTop: -LOADER_H / 2,
    backgroundColor: 'transparent',
  },
  web: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});
