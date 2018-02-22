import Vue from 'vue';
import Lodash from 'lodash'
import Vuelidate from 'vuelidate';
import Vue2Filters from 'vue2-filters';
import MyFilters from '@utils';
import {imageBlurAsync} from '@utils/directives';

import App from './App.vue';

require('./styles/main.scss');

Vue.use(Vuelidate);
Vue.use(Vue2Filters);
Vue.use(MyFilters);

Vue.config['keyCodes'] = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  esc: 27 
};

Vue.directive('bg-blur',imageBlurAsync);





new App().$mount('#app');