import { timeout } from '@methods';
import { ProgressBar } from '@store';
import * as RootStore from '@store';
import {RouteConfig} from 'vue-router'


export const routesList: RouteConfig[]  = [
  {
    path: '/', name: 'Accueil',
    component: () => import('@views/Home/Home.vue'),
<<<<<<< HEAD
=======
    meta: {
      id: 'home'
    }
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
  },
  { 
    path: '/moving', name: 'Je déménage', 
    component: () => import('@views/Moving.vue'),
<<<<<<< HEAD
=======
    meta: {
      id: 'moving'
    }
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
  },
  { path: '/inscription', name: 'Inscription', 
    component: () => import('@components/Inscription.vue'), 
    props: { window: false },
<<<<<<< HEAD
=======
    meta: {
      id: 'inscription'
    }
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
  },
  { path: '/connexion', name: 'Connexion',
    component: () => import('@components/Connexion.vue'), 
    props: { window: false },
<<<<<<< HEAD
=======
    meta: {
      id: 'connexion'
    }
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
  },
  {
    path: '/movers/:region?', name: 'Les déménageurs',
    props: true, 
    component: () => import('@views/Movers.vue'),
    meta: {
<<<<<<< HEAD
=======
      id: 'movers',
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
      contentProp: true,
      async asyncData() {
        await timeout(2000);
      }
    }
  },
<<<<<<< HEAD
  { path: '/bemover', name: 'Devenir déménageur',
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
=======
  { path: '/bemover', name: 'Devenir déménageur', alias: 'bemover',
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
      id: 'bemover',
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
      requiresAuth: true 
    },

  },
<<<<<<< HEAD
  { path: '/*',
=======
  { path: '*',
>>>>>>> 1fc5833f91af3ffab09c145670b5c5c0652b2a10
    alias: '404',
    component: () => import('@views/Home/Home.vue')
}
]