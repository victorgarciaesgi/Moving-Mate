import { timeout } from '@methods';
import { ProgressBar } from '@store';
import * as RootStore from '@store';
import { RouteConfig } from 'vue-router/types';
import * as Stores from '@store';
import {Connexion, Inscription} from '@components';


export const routesList: RouteConfig[]  = [
  {
    path: '/', name: 'Accueil',
    component: () => import('@views/Home/Home.vue'),
  },
  { 
    path: '/moving', name: 'Les déménagements',
    component: () => import('@views/Moving/Moving.vue'),
    meta: {
      headerShadow: true,
      contentProp: true,
      async asyncData() {
        await Stores.MovingStore.actions.fetchMoving({});
      }
    },
    children: [
      {
        path: '/moving/search/:search?',
        meta: {
          contentProp: true,
          transparent: true
        },
        async beforeEnter(to, from, next) {
          console.log('lol')
          Stores.MovingStore.mutations.updateSearchValue(to.params.search || '');
          await Stores.MovingStore.actions.fetchMoving(to.params);
          next();
        }
      }
    ]
  },
  {
    path: '/movers/:region?', name: 'Les déménageurs',
    component: () => import('@views/Movers/Movers.vue'),
    props: true,
    meta: {
      contentProp: true,
      async asyncData(params) {
        // await timeout(2000);
      }
    }
  },
  { path: '/bemover', name: 'Devenir déménageur',
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
      requiresAuth: true 
    },

  },
  { path: '/inscription', name: 'Inscription', 
    component: Inscription,
    meta: {
      noAuth: true
    },
    props: { 
      isPopup: false 
    },
  },
  { path: '/connexion', name: 'Connexion',
    component: Connexion,
    meta: {
      noAuth: true
    },
    props: {
      isPopup: false,
      redirect: '/'
    },
  },
  { path: '/*',
    alias: '404',
    component: () => import('@views/Home/Home.vue')
}
]