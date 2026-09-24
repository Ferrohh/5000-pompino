import { registerSW } from 'virtual:pwa-register';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);

app.mount('#app');

registerSW({
  onRegistered(r) {
    console.log('Service worker registered.');
  },
  onRegisterError(error) {
    console.error('Service worker registration failed:', error);
  },
});