import Vue from 'vue';
import VueRouter, {Route} from 'vue-router';
import * as Components from '@components';
import { LoginStore } from '@modules';
import { timeout } from '@methods';
import {routesList} from './routes';
import { ProgressBar, GlobalStore } from '@store';

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
  try {

    // Check session
    if (!LoginStore.state.sessionChecked) {
      await LoginStore.actions.checkUserSession();
    } 
    if (!to.meta.transparent) {
      ProgressBar.mutations.start();
    }

    // Check content prop
    if (!to.meta.contentProp) {
      document.title = `${to.name} - MovingMate`;
    } else if (Object.keys(to.params).every(m => !to.params[m])) {
      document.title = `${to.name} - MovingMate`;
    }

    // Check requires auth
    if (to.matched.some(m => m.meta.requiresAuth)) {
      if (LoginStore.state.isLoggedIn) {
        if (to.meta.asyncData) {
          await getRouteData(to);
        }
      }
      else {
        LoginStore.mutations.showLoginRoute(to.fullPath);
        if (from.name) {
          ProgressBar.mutations.hide();
        } else {
          next('/');
        }
        return;
      }
    } else if (to.matched.some(m => m.meta.noAuth) && LoginStore.state.isLoggedIn) {
      next('/');
    } else {
      if (to.meta.asyncData) {
        await getRouteData(to);
      }
    }

    // Check header state
    if (to.meta.headerShadow) {
      GlobalStore.state.headerBoxShadow = false;
    } else {GlobalStore.state.headerBoxShadow = true}

    next(ProgressBar.mutations.finish());

  } catch(err) {
    console.log('Route error:', err);
    ProgressBar.mutations.fail();
    ProgressBar.mutations.finish();
    next();
  }
})

const getRouteData = async (to: Route) => {
  ProgressBar.mutations.start();
  await to.meta.asyncData(to.params);
}




export default Rooter;