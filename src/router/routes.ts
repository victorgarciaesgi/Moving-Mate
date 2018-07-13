import { RouteConfig, Route, RouteRecord } from 'vue-router/types';
import * as Stores from '@store';
import { Connexion, Inscription } from '@components';
import {AlertsElement, ActionsElements} from '@classes';
import Router from './index';
import {timeout} from '@methods';

export const routesNames = {
  home: 'HomeRoute',
  moving: 'MovingRoute',
  movingDetail: 'MovingDetail',
  movingInvite: 'MovingInvite',
  movingInfos: 'MovingInfos',
  movingOffers: 'MovingOffers',
  movingParticipants: 'MovingParticipants',
  movingDemandes: 'MovingDemandes',
  movingCreate: 'MovingCreate',
  searchMoving: 'SearchMovingRoute',
  searchMoverInvite: 'SearchMoverInvite',
  movers: 'MoversRoute',
  searchMover: 'SearchMoverRoute',
  connexion: 'Connexion',
  inscription: "Inscription",
  becomeMover: "BecomeMover",
  user: 'User',
  userEdit: 'userEdit',
  userMovings: 'UserMovings',
  userParticipations: 'UserParticipations',
  admin: 'admin',
  adminUsers: 'adminUsers',
  adminMovings: 'adminMovings',
  cgu: 'cgu'
}

interface MyMeta {
  title?: string,
  headerShadow?: boolean,
  contentProp?: boolean,
  transparent?: boolean,
  isModal?: boolean,
  requiresAuth?: boolean,
  isTab?: boolean,
  noAuth?: boolean,
  asyncData?: (to?: MyRoute | MyRouteRecord) => Promise<{title?: string} | void>,
  isAuthorized?: (to?: any) => boolean;
}

export interface MyRoute extends Route {
  meta: MyMeta,
  matched: MyRouteRecord[]
}

export interface MyRouteRecord extends RouteRecord {
  meta: MyMeta,
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
      async asyncData(to: MyRoute) {
        if (Stores.GoogleMaps.state.mapReady) {
          Stores.MovingStore.mutations.updateSearchValue('');
          Stores.MovingStore.mutations.updateSearchingState(true);
          Stores.MovingStore.actions.fetchMoving({})
        }
        return {};
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
          async asyncData(to: MyRoute) {
            Stores.MovingStore.mutations.updateCommitedValue(to.params.search || '');
            Stores.MovingStore.mutations.updateSearchingState(true);
            Stores.MovingStore.mutations.updateSearchValue(to.params.search || '');
            return {title: to.params.search};
          }
        },
      },
      {
        path: 'create',
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
    path: '/moving/detail/:movingId',
    component: () => import('@views/Moving/MovingDetail/MovingDetail.vue'),
    meta: {
      requiresAuth: true,
      contentProp: true,
      asyncData: getOneMoving,
      headerShadow: false
    },
    children: [
      {
        path: '/',
        name: routesNames.movingInfos,
        component: () => import('@views/Moving/MovingDetail/MovingInfos.vue'),
        meta: {
          contentProp: true,
          isTab: true,
          asyncData: getOneMoving
        }
      },
      {
        path: 'invite',
        name: routesNames.movingInvite,
        component: () => import('@views/Moving/MovingDetail/MovingInvite.vue'),
        meta: {
          contentProp: true,
          isTab: true,
          async asyncData(to: MyRoute) {
            await Stores.InviteMoverStore.actions.fetchMover({});
            return await getOneMoving(to)
          },
        },
        children: [
          {
            path: 'search/:search?',
            name: routesNames.searchMoverInvite,
            meta: {
              title: 'Les déménageurs',
              contentProp: true,
              transparent: true,
              async asyncData(to: MyRoute) {
                getOneMoving(to);
                Stores.InviteMoverStore.mutations.updateSearchValue(to.params.search || '');
                await Stores.InviteMoverStore.actions.fetchMover(to.params);
                return {title: to.params.search};
              }
            },
          },
        ]
      },
      {
        path: 'participants',
        component: () => import('@views/Moving/MovingDetail/MovingParticipants.vue'),
        name: routesNames.movingParticipants,
        meta: {
          isTab: true,
          contentProp: true,
          asyncData: getOneMoving,
        }
      },
      {
        path: 'demandes',
        component: () => import('@views/Moving/MovingDetail/MovingDemandes.vue'),
        name: routesNames.movingDemandes,
        meta: {
          isTab: true,
          contentProp: true,
          asyncData: getOneMoving,
        }
      },
      {
        path: 'offers',
        component: () => import('@views/Moving/MovingDetail/MovingOffers.vue'),
        name: routesNames.movingOffers,
        meta: {
          contentProp: true,
          isTab: true,
          asyncData: getOneMoving,
        }
      }
    ]
  },
  { 
    path: '/movers', name: routesNames.movers,
    component: () => import('@views/Movers/Movers.vue'),
    meta: {
      title: 'Les déménageurs',
      async asyncData() {
        await Stores.MoverStore.actions.fetchMover({});
        return {}
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
          async asyncData(to: MyRoute) {
            Stores.MoverStore.mutations.updateSearchValue(to.params.search || '');
            await Stores.MoverStore.actions.fetchMover(to.params);
            return {title: to.params.search};
          }
        },
      },
    ]
  },
  { path: '/bemover', name: routesNames.becomeMover,
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
      title: 'Devenir déménageur',
      requiresAuth: true,
      isAuthorized(to) {
        return !Stores.LoginStore.state.userInfos.isMover
      }
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
    path: '/user/:userId',
    component: () => import('@views/User/User.vue'),
    meta: {
      requiresAuth: true,
      asyncData: getOneUser,
      headerShadow: false
    },
    children: [
      {
        path: '/',
        name: routesNames.user,
        component: () => import('@views/User/UserProfile.vue'),
        meta: {
          contentProp: true,
          isTab: true,
          asyncData: (to: MyRoute) => getOneUser(to, 'Profil'),
        }
      },
      {
        path: 'edit',
        name: routesNames.userEdit,
        component: () => import('@views/User/UserEdit.vue'),
        meta: {
          contentProp: true,
          isTab: true,
          asyncData: (to: MyRoute) => getOneUser(to, 'Editer mon profil'),
          isAuthorized(to: MyRoute) {
            return Stores.LoginStore.state.userInfos.id == to.params.userId;
          }
        }
      },
      {
        path: 'movings',
        name: routesNames.userMovings,
        component: () => import('@views/User/UserMovings.vue'),
        meta: {
          contentProp: true,
          isTab: true,
          asyncData: (to: MyRoute) => getOneUser(to, 'Déménagements'),
        }
      },
      {
        path: 'participations',
        name: routesNames.userParticipations,
        component: () => import('@views/User/UserParticipations.vue'),
        meta: {
          contentProp: true,
          isTab: true,
          asyncData: (to: MyRoute) => getOneUser(to, 'Participations'),
        }
      },
    ]
  },
  {
    path: '/emailConfirmed',
    async beforeEnter() {
      Router.replace('/', async () => {
        new AlertsElement.SuccessAlert({
          title: 'Vous êtes bien inscrit!',
          message: 'Votre compte a bien été activé. Vous pouvez maintenant vous connecter!',
          actions: [
            new ActionsElements.LoginAction()
          ]
        })
      });
      
    }
  },
  {
    path: '/admin', name: routesNames.admin,
    component: () => import('@views/Admin/Admin.vue'),
    meta: {
      title: 'Administration',
      requiresAuth: true,
      isAuthorized(to) {
        return Stores.LoginStore.getters.isAdmin;
      }
    },
    children: [
      {
        path: '/', name: routesNames.adminUsers,
        component: () => import('@views/Admin/AdminUsers.vue'),
        meta: {
          title: 'Admin:Utilisateurs',
          async asyncData() {
            await Stores.AdminStore.actions.getUsers()
          }
        }
      },
      {
        path: 'movings', name: routesNames.adminMovings,
        component: () => import('@views/Admin/AdminMoving.vue'),
        meta: {
          title: 'Admin:Déménagements'
        }
      }
    ]

  },
  {
    path: '/cgu', name: routesNames.cgu,
    meta: {
      title: "Conditions d'utilisation"
    },
    component: () => import('@views/CGU.vue')
  },
  { path: '/*',
    meta: {
      title: 'Page non trouvée'
    },
    component: () => import('@views/Home/Home.vue')
  }
]


async function getOneMoving(to: MyRoute) {
  const data = await Stores.MovingStore.actions.getAnnouncementDetails({id: to.params.movingId});
  return {title: data.title};
}

async function getOneUser(to: MyRoute, page?) {
  const username = await Stores.UserStore.actions.getOneUser({userId: to.params.userId});
  return {title: username.title +  ' - ' + page};
}