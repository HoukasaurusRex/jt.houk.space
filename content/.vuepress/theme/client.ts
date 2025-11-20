import { defineClientConfig } from 'vuepress/client'
import Layout from './layouts/Layout.vue'
import './styles/index.scss'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#eb8da7',
          secondary: '#424242',
          error: '#f09cb8',
          success: '#d5eb8d',
          info: '#8dd5eb',
          background: '#f0f0f0',
          surface: '#f7f7f7',
        },
      },
      dark: {
        colors: {
          primary: '#eb8da7',
          secondary: '#424242',
          error: '#f09cb8',
          success: '#d5eb8d',
          info: '#8dd5eb',
          background: '#1a1a1a',
          surface: '#212121',
        },
      },
    },
  },
})

export default defineClientConfig({
  enhance({ app }) {
    app.use(vuetify)
  },
  layouts: {
    Layout,
  },
})