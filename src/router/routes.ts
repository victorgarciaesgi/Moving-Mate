import { timeout } from '@methods';
import { ProgressBar } from '@store';
import * as RootStore from '@store';
import { RouteConfig, Route, RouteRecord } from 'vue-router/types';
import * as Stores from '@store';
import { Connexion, Inscription } from '@components';

export const routesNames = {
  home: 'HomeRoute',
  moving: 'MovingRoute',
  movingDetail: 'MovingDetail',
  movingCreate: 'MovingCreate',
  searchMoving: 'SearchMovingRoute',
  movers: 'MoversRoute',
  connexion: 'Connexion',
  inscription: "Inscription",
  becomeMover: "BecomeMover",
}

interface MyMeta {
  title?: string,
  headerShadow?: boolean,
  contentProp?: boolean,
  transparent?: boolean,
  isModal?: boolean,
  requiresAuth?: boolean,
  noAuth?: boolean,
  asyncData?: (to?: MyRoute) => Promise<any>
}

export interface MyRoute extends Route {
  meta?: MyMeta
}

export interface MyRouteRecord extends RouteRecord {
  meta: MyMeta
}

export interface MyRouteConfig extends RouteConfig {
  children?: MyRouteConfig[],
  meta?: MyMeta
}


export const routesList: MyRouteConfig[]  = [
  {
    path: '/', name: routesNames.home,
    component: () => import('@views/Home/Home.vue'),
    meta: {
      title: 'Accueil'
    }
  },
  { 
    path: '/moving', name: routesNames.moving,
    component: () => import('@views/Moving/Moving.vue'),
    meta: {
      title: 'Les déménagements',
      async asyncData() {
        await Stores.MovingStore.actions.fetchMoving({});
      }
    },
    children: [
      {
        path: '/moving/search/:search?',
        name: routesNames.searchMoving,
        meta: {
          title: 'Les déménagements',
          contentProp: true,
          transparent: true,
          async asyncData(to: Route) {
            Stores.MovingStore.mutations.updateSearchValue(to.params.search || '');
            Stores.MovingStore.actions.fetchMoving(to.params);
            return to.params.search;
          }
        },
      },
      {
        path: '/moving/detail/:movingId',
        name: routesNames.movingDetail,
        component: () => import('@views/Moving/MovingDetail.vue'),
        props: true,
        meta: {
          contentProp: true,
          isModal: true
        },
      },
      {
        path: '/moving/create',
        name: routesNames.movingCreate,
        component: () => import('@views/Moving/CreateMoving.vue'),
        meta: {
          title: 'Créer une annonce',
          requiresAuth: true,
          isModal: true
        }
      },
    ]
  },
  {
    path: '/movers', name: routesNames.movers,
    component: () => import('@views/Movers/Movers.vue'),
    props: true,
    meta: {
      title: 'Les déménageurs',
      contentProp: true,
    }
  },
  { path: '/bemover', name: routesNames.becomeMover,
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
      title: 'Devenir déménageur',
      requiresAuth: true 
    },

  },
  { path: '/inscription', name: routesNames.inscription, 
    component: Inscription,
    meta: {
      title: 'Inscription',
      noAuth: true
    },
    props: { 
      isPopup: false 
    },
  },
  { path: '/connexion', name: routesNames.connexion,
    component: Connexion,
    meta: {
      title: 'Connexion',
      noAuth: true
    },
    props: {
      isPopup: false,
      redirect: '/'
    },
  },
  { path: '/*',
    meta: {
      title: 'Page non trouvée'
    },
    component: () => import('@views/Home/Home.vue')
}
]