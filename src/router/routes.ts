import { timeout } from '@methods';
import { ProgressBar } from '@store';
import * as RootStore from '@store';
import {RouteConfig} from 'vue-router'


export const routesList: RouteConfig[]  = [
  {
    path: '/', name: 'Accueil',
    component: () => import('@views/Home/Home.vue'),
    meta: {
      id: 'home'
    }
  },
  { 
    path: '/moving', name: 'Je déménage', 
    component: () => import('@views/Moving.vue'),
    meta: {
      id: 'moving'
    }
  },
  { path: '/inscription', name: 'Inscription', 
    component: () => import('@components/Inscription.vue'), 
    props: { window: false },
    meta: {
      id: 'inscription'
    }
  },
  { path: '/connexion', name: 'Connexion',
    component: () => import('@components/Connexion.vue'), 
    props: { window: false },
    meta: {
      id: 'connexion'
    }
  },
  {
    path: '/movers/:region?', name: 'Les déménageurs',
    props: true, 
    component: () => import('@views/Movers.vue'),
    meta: {
      id: 'movers',
      contentProp: true,
      async asyncData() {
        await timeout(2000);
      }
    }
  },
  { path: '/bemover', name: 'Devenir déménageur', alias: 'bemover',
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
      id: 'bemover',
      requiresAuth: true 
    },

  },
  { path: '*',
    alias: '404',
    component: () => import('@views/Home/Home.vue')
}
]