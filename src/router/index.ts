import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Views from '@views';
import * as Components from '@components';

Vue.use(VueRouter);

const Rooter = new VueRouter({
  mode: 'history',
  fallback: false,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', name: 'Accueil', alias: 'home', component: Views.Home},
    { path: '/moving', name: 'Je déménage', component: Views.Moving},
    { path: '/inscription', name: 'Inscription', component: Components.Inscription, props: {window: false}},
    { path: '/connexion', name: 'Connexion', component: Components.Connexion, props: {window: false}},
    { path: '/movers', name: 'Les déménageurs', component: Views.Movers},
    { path: '/bemover', name: 'Devenir déménageur', component: Views.BeMover},
    { path: '*', component: Views.Home }
  ]
})

Rooter.beforeEach((to, from, next) => {
  
  document.title = `${to.name} - MovingMate`;
  next();
})

export default Rooter;