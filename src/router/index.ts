import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Views from '@views';
import * as Components from '@components';

Vue.use(VueRouter);

const Rooter = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Accueil', alias: 'home', component: Views.Home},
    { path: '/moving', name: 'Je déménage', component: Views.Moving},
    { path: '/inscription', name: 'Inscription', component: Components.Inscription, props: {window: true}},
    { path: '/connexion', name: 'Connexion', component: Components.Connexion, props: {window: true}},
    { path: '/movers', name: 'Les déménageurs', component: Views.Movers},
    { path: '*', component: Views.Home }
  ]
})

Rooter.beforeEach((to, from, next) => {
  document.title = `${to.name} - MovingMate`;
  next();
})

export default Rooter;