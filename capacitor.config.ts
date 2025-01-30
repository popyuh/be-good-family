import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ourfamilyhub.app',
  appName: 'Our Family Hub',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    url: 'http://localhost:8080',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;