import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Views from '@views';
import * as Components from '@components';

Vue.use(VueRouter);

const Rooter = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Accueil', alias: 'home', component: Views.Home},
    { path: '/moving', name: 'Je déménage', alias: 'moving', component: Views.Moving},
    { path: '/inscription', name: 'Inscription', alias: 'moving', component: Views.Inscription},
    { path: '/movers', name: 'Les déménageurs', alias: 'movers', component: Views.Movers},    
    { path: '*', component: Views.error404 }
  ]
})

Rooter.beforeEach((to, from, next) => {
  document.title = `${to.name} - MovingMate`;
  next();
})

export default Rooter;