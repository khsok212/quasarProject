// src/main.js
import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate' // Pinia Persist 플러그인 추가
import App from './App.vue'
import router from './router' // 기존 `routes` 대신 `router/index.js`에서 가져옴

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist) // Pinia Persist 플러그인 사용

app.use(pinia) // Pinia 등록
app.use(router) // Vue Router 등록
app.use(Quasar, {
  plugins: { Notify },
  config: {
    Notify: {},
  },
})

app.mount('#app') // 앱 마운트
