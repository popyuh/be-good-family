import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ourfamilyhub.app',
  appName: 'Our Family Hub',
  webDir: 'dist',
  server: {
    url: 'https://64c8227a-31ed-4c8a-9c20-b7719b894027.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;