import Vue from 'vue';
import Vuetify, { VList } from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md'
  },
  theme: {
    themes: {
      light: {
        primary: '#fff',
        secondary: '#e91e63',
        accent: '#9c27b0',
        error: '#b71c1c'
      }
    }
  },
  components: {
    VList
  }
});
