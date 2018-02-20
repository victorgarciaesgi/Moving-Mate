import Vue from 'vue';
import Lodash from 'lodash'
import Vuelidate from 'vuelidate';
import Vue2Filters from 'vue2-filters'
import MyFilters from '@utils';

import App from './App.vue';

require('./styles/main.scss');

Vue.use(Vuelidate);
Vue.use(Vue2Filters);
Vue.use(MyFilters);


Vue.directive('bg-blur', {
  inserted(el, binding, vnode) {
    let smallImgSrc, bigImgSrc;
    let extension = Object.keys(binding.modifiers)[0] || 'jpg';
    if (binding.arg == 'local') {
      smallImgSrc = require(`@images/${binding.value}/${binding.value}_lazy.${extension}`);
      bigImgSrc = require(`@images/${binding.value}/${binding.value}.${extension}`);
    } 
    console.log(extension, binding, smallImgSrc);
    // el.style.backgroundImage = `url('${smallImgSrc}')`;
    el.classList.add('lazy-blur-background');

    let smallImg = new Image();
    smallImg.classList.add('img-small')
    smallImg.src = smallImgSrc;
    smallImg.onload = () => {
      smallImg.classList.add('loaded');
    };
    el.appendChild(smallImg);

    let bigImg = new Image();
    bigImg.src = bigImgSrc;
    bigImg.onload = () => {
      bigImg.classList.add('loaded');
    };
    el.appendChild(bigImg);
  }
})



new App().$mount('#app');