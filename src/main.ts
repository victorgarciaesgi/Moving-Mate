import Vue from 'vue';
import Lodash from 'lodash'
import Vuelidate from 'vuelidate';
import Vue2Filters from 'vue2-filters';
import MyFilters from '@utils';
import {imageBlurAsync} from '@utils/directives';
import $ from 'jquery';

import App from './App.vue';

require('./styles/main.scss');

Vue.use(Vuelidate);
Vue.use(Vue2Filters);
Vue.use(MyFilters);

// Vue.config.devtools = true;

Vue.config['keyCodes'] = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  esc: 27 
};

const emit = (vnode, name, data?) => {
  var handlers = vnode.data.on;
  if (handlers && handlers.hasOwnProperty(name)) {
    var handler = handlers[name];
    var fn = handler.fns || handler.fn;
    if (typeof fn === 'function') {
      fn(data);
    }
  }
}

Vue.directive('lazyload', <any>{
  bind(el, binding, vnode) {
    document.addEventListener('scroll', () => {
      let scrollTop = (window.pageYOffset || document.documentElement.scrollTop) + document.body.offsetHeight;
      let scrollHeight = document.body.scrollHeight;

      console.log(scrollTop, scrollHeight);

      if (scrollTop >= scrollHeight) {
        event.preventDefault();
        event.stopPropagation();
        emit(vnode, 'lazy')
      }
    });
  }
})

new App().$mount('#app');