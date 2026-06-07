import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vercel.app',
  appName: 'Vittness',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
