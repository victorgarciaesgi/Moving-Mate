import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Views from '@views';
import * as Components from '@components';

Vue.use(VueRouter);

const Rooter = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Accueil', component: Views.Home},
    { path: '*', component: Views.error404 }
  ]
})

Rooter.beforeEach((to, from, next) => {
  document.title = `${to.name} - MovingMate`;
  next();
})

export default Rooter;