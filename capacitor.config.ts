import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.snapcalorie.v2',
  appName: 'SnapCalorie V2',
  webDir: 'out',
  android: {
    backgroundColor: '#0a0a1a',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
