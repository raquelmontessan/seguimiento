import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mx.infonavit.qa.tablero',
  appName: 'Tablero QA',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      // La ocultamos por codigo cuando la app termina de cargar (ver app.component.ts).
      launchAutoHide: false,
      backgroundColor: '#8e2438',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
