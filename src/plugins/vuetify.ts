import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: '#0f3d2e',
          surface: '#1d5c46',
          primary: '#f9c74f',
          secondary: '#f9844a',
        },
      },
    },
  },
});
