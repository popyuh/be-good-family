import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.begoodfamily.app',
  appName: 'BeGoodFamily',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    url: 'http://localhost:8080',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;