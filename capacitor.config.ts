import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7be240a9684d47fdb80aa991dff8a401',
  appName: 'stage-transition-maker',
  webDir: 'dist',
  server: {
    url: 'https://7be240a9-684d-47fd-b80a-a991dff8a401.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;