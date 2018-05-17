import { RouteConfig, Route, RouteRecord } from 'vue-router/types';
import * as Stores from '@store';
import { Connexion, Inscription } from '@components';

export const routesNames = {
  home: 'HomeRoute',
  moving: 'MovingRoute',
  movingDetail: 'MovingDetail',
  movingInvite: 'MovingInvite',
  movingInfos: 'MovingInfos',
  movingOffers: 'MovingOffers',
  movingCreate: 'MovingCreate',
  searchMoving: 'SearchMovingRoute',
  movers: 'MoversRoute',
  searchMover: 'SearchMoverRoute',
  connexion: 'Connexion',
  inscription: "Inscription",
  becomeMover: "BecomeMover",
  user: 'User',
  userDetail: 'UserDetail',
  userMovings: 'UserMovings',
  userParticipations: 'UserParticipations'
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
    component: async () => await import('@views/Home/Home.vue'),
    meta: {
      title: 'Accueil'
    }
  },
  { 
    path: '/moving', name: routesNames.moving,
    component: async () => await import('@views/Moving/Moving.vue'),
    meta: {
      title: 'Les déménagements',
      async asyncData() {
        await Stores.MovingStore.actions.fetchMoving({});
      }
    },
    children: [
      {
        path: 'search/:search?',
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
        path: 'create',
        name: routesNames.movingCreate,
        component: async () => await import('@views/Moving/CreateMoving.vue'),
        meta: {
          title: 'Créer une annonce',
          requiresAuth: true,
          isModal: true
        }
      },
    ]
  },
  {
    path: '/moving/detail',
    component: async () => await import('@views/Moving/MovingDetail/MovingDetail.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: ':movingId',
        name: routesNames.movingInfos,
        component: async () => await import('@views/Moving/MovingDetail/MovingInfos.vue'),
        meta: {
          contentProp: true,
          asyncData: getOneMoving
        }
      },
      {
        path: ':movingId/invite',
        name: routesNames.movingInvite,
        meta: {
          asyncData: getOneMoving
        }
      },
      {
        path: ':movingId/offers',
        name: routesNames.movingOffers,
        meta: {
          asyncData: getOneMoving
        }
      }
    ]
  },
  { 
    path: '/movers', name: routesNames.movers,
    component: async () => await import('@views/Movers/Movers.vue'),
    meta: {
      title: 'Les déménageurs',
      async asyncData() {
        await Stores.MoverStore.actions.fetchMover({});
      }
    },
    children: [
      {
        path: 'search/:search?',
        name: routesNames.searchMover,
        meta: {
          title: 'Les déménageurs',
          contentProp: true,
          transparent: true,
          async asyncData(to: Route) {
            Stores.MoverStore.mutations.updateSearchValue(to.params.search || '');
            Stores.MoverStore.actions.fetchMover(to.params);
            return to.params.search;
          }
        },
      },
    ]
  },
  { path: '/bemover', name: routesNames.becomeMover,
    component: async () => await import('@views/BeMover/BeMover.vue'), 
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
  {
    path: '/myaccount',
    name: routesNames.user,
    component: async () => await import('@views/User/Account.vue'),
    meta: {
      title: 'Mon compte',
      requiresAuth: true,
      contentProp: true,
      asyncData: getOneUser
    },
    children: [
      {
        path: 'detail',
        name: routesNames.userDetail,
        component: async () => await import('@views/User/AccountDetail.vue'),
        meta: {
          title: 'Détails de l\'utilisateur',
          isModal: true,
        }
      },
      {
        path: 'movings',
        name: routesNames.userMovings,
        component: async () => await import('@views/User/AccountMovings.vue'),
        meta: {
          title: 'Historique des déménagements',
          isModal: true,
        }
      },
      {
        path: 'participations',
        name: routesNames.userParticipations,
        component: async () => await import('@views/User/AccountParticipations.vue'),
        meta: {
          title: 'Historique des participations',
          isModal: true,
        }
      },
    ]
  },
  { path: '/*',
    meta: {
      title: 'Page non trouvée'
    },
    component: async () => await import('@views/Home/Home.vue')
}
]


async function getOneMoving(to: Route) {
  const title = await Stores.MovingStore.actions.getOneAnnouncement(to.params.movingId);
  return title;
}

async function getOneUser(to: Route) {
  const userData = await Stores.UserStore.actions.getOneUser();
  return userData;
}