import { Store } from 'vuex/types/';
import { RouteRecord } from 'vue-router/types/';

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store,
    $router: RouteRecord
    $Progress: any
  }
}
