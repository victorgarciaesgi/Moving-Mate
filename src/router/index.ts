import Vue from 'vue';
import VueRouter, {Route, RouteRecord} from 'vue-router';
import * as Components from '@components';
import { LoginStore } from '@modules';
import { timeout } from '@methods';
import { routesList, MyRoute } from './routes';
import { ProgressBar, GlobalStore } from '@store';

Vue.use(VueRouter);


const Router = new VueRouter({
  mode: 'history',
  fallback: false,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: routesList
})

Router.beforeEach(async (to: MyRoute, from: MyRoute, next) => {
  try {
    // Check session
    if (!LoginStore.state.sessionChecked) {
      await LoginStore.actions.checkUserSession();
    }

    // Check if route come from child
    console.log(to, from);
    if (from.name && from.matched[0].name == to.name) {
      console.log('lol1')

      next();
      return;
    } 
    else if (from.name == to.name){
      console.log('lol4')
      next()
    }
    else if (to.matched && from.name && (from.matched[0].name == to.matched[0].name) && (from.matched[0].name != from.name)) {
      console.log('lol2')

      next();
      return;
    }
    else {
      console.log('lol3')

      if (!to.meta.transparent && !to.meta.isModal) {
        ProgressBar.mutations.start();
      } 
      else if (to.meta.transparent && !from.name) {
        ProgressBar.mutations.start();
      }

      // If page is initialazed on child
      if (to.matched[0] && to.meta.isModal) {
        console.log('lol6')
        if (!from.name) {
          getRouteData(to.matched[0]);
          GlobalStore.mutations.setPreviousModalRoute(to.matched[0].path);
        } else {
          GlobalStore.mutations.setPreviousModalRoute(from.fullPath);
        }
      }
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
        if (from.meta.title) {
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
    // Check content prop
    if (!to.meta.contentProp) {
      document.title = `${to.meta.title} - MovingMate`;
    } else if (Object.keys(to.params).every(m => !to.params[m])) {
      document.title = `${to.meta.title} - MovingMate`;
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

const getRouteData = async (to: MyRoute | RouteRecord) => {
  if (!to.meta.transparent) {
    ProgressBar.mutations.start();
  }
  const titleToDisplay = await to.meta.asyncData(to);
  if (to.meta.contentProp) {
    document.title = `${titleToDisplay || to.meta.title} - MovingMate`;
  }
}


export {routesNames} from './routes';
export default Router;