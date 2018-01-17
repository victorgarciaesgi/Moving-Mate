import Vuex, { Store } from 'vuex'
import Vue from 'vue';
import {RootState} from '../../index'
import {getStoreBuilder} from 'vuex-typex';
Vue.use(Vuex);

export const storeBuilder = getStoreBuilder<RootState>();
