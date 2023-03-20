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

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#FADFB2',
          secondary: '#CEED9D',
          primaryvariant: '#F8CB7E',
          error: '#8B0000',
          info: '#008B8B',
          success: '#228B22',
          warning: '#FF8C00',
          background: '#FADFB2',
          surface: '',
        },
      },
    },
  },
})
