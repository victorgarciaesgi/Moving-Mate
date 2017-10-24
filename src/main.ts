import Vue from 'vue';
import App from './App.vue';
import Lodash from 'lodash'
import Vuelidate from 'vuelidate';
import { sync } from 'vuex-router-sync';
import { store } from '@store';
import router from './router';

require('./styles/main.scss');

Vue.use(Vuelidate);
sync(store, router);

new App().$mount('#app');