import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Components from '@components';
import { LoginStore } from '@modules';
import { timeout } from '@methods';
import {routesList} from './routes';
import { ProgressBar } from '@store';

Vue.use(VueRouter);


const Rooter = new VueRouter({
  mode: 'history',
  fallback: false,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: routesList
})

// Before each route hook test auth
Rooter.beforeEach(async (to, from, next) => {
  console.log(from)
  if (!LoginStore.state.sessionChecked) {
    await LoginStore.actions.checkUserSession();
  } 
  ProgressBar.mutations.start();
  if (!to.meta.contentProp) {
    document.title = `${to.name} - MovingMate`;
  }
  if (to.matched.some(m => m.meta.requiresAuth)) {
    if (LoginStore.state.isLoggedIn) {
      if (to.meta.asyncData) {
        await getRouteData(to);
      }
      next(ProgressBar.mutations.finish());
    }
    else {
      LoginStore.mutations.showLoginRoute(to.fullPath);
      if (from.name) {
        ProgressBar.mutations.hide();
      } else {
        next('/');
      }
    }
  } else {
    if (to.meta.asyncData) {
      await getRouteData(to);
    }
    next(ProgressBar.mutations.finish());
  }
})

const getRouteData = async (to) => {
  ProgressBar.mutations.start();
  try {
    await to.meta.asyncData();
  } catch(err) {
    ProgressBar.mutations.fail();
    console.log(err);
  }
}




export default Rooter;