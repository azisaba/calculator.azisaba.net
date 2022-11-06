import { createApp } from 'vue'
import App from './App.vue'
import vuetify from '../src/plugins/vuetify'
import { loadFonts } from '../src/plugins/webfontloader'

loadFonts()

createApp(App)
  .use(vuetify)
  .mount('#app')
