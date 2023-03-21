/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { withDirectives } from 'vue'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#EBA85B',
          secondary: '#8fd75a',
          primaryvariant: '#f2ab2a',
          error: '#8B0000',
          info: '#008B8B',
          success: '#228B22',
          warning: '#FF8C00',
          background: '#EBA85B',
          surface: '',
        },
        textColor: 'white',
      },
    },
  },
})
