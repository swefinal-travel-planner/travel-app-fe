import { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Travel AI App',
  description:
    'An AI-powered travel app that helps users plan their trips with personalized recommendations and real-time updates.',
  slug: 'travel-app-fe',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  platforms: ['android', 'ios'],
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.qhuongng.travelapp',
    googleServicesFile: './google-services.json',
    permissions: ['INTERNET'],
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/icons/splash-icon-dark.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/icons/splash-icon-light.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#000',
        },
      },
    ],
    '@react-native-google-signin/google-signin',
    'expo-localization',
    ['expo-image-picker', { photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.' }],
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
      },
    ],
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.EXPO_SECRET_MAPBOX_DOWNLOAD_TOKEN,
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          'node_modules/@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf',
          'node_modules/@expo-google-fonts/plus-jakarta-sans/400Regular_Italic/PlusJakartaSans_400Regular_Italic.ttf',
          'node_modules/@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf',
          'node_modules/@expo-google-fonts/plus-jakarta-sans/700Bold_Italic/PlusJakartaSans_700Bold_Italic.ttf',
        ],
      },
    ],
    'expo-asset',
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  updates: {
    url: 'https://u.expo.dev/5a3053c6-fc75-46ea-b811-a9eccf5365d3',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    weatherApiKey: process.env.EXPO_SECRET_WEATHER_API_KEY,
    translateApiKey: process.env.EXPO_SECRET_TRANSLATE_API_KEY,
    mapboxAccessToken: process.env.EXPO_SECRET_MAPBOX_ACCESS_TOKEN,
    coreSecretToken: process.env.EXPO_SECRET_CORE_SECRET_TOKEN,
    router: {
      origin: false,
    },
    eas: {
      projectId: '5a3053c6-fc75-46ea-b811-a9eccf5365d3',
    },
  },
  owner: 'qhuongng',
})
