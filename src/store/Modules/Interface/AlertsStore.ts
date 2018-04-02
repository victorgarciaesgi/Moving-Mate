import { IAlertsState, IAlert, IAlertType } from '@types';
import { timeout } from '@methods';
import { storeBuilder } from "../Store/Store";


let resolveAlert;
let rejectAlert;

//State
const state: IAlertsState = {
  alertData: null,
  alertShow: false,
}

const b = storeBuilder.module<IAlertsState>("AlertsModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {
    
  }  
}

// Mutations
namespace Mutations {
  function showAlert(state: IAlertsState, alert: IAlert) {
    state.alertData = alert;
    state.alertShow = true;
  }
  function hideAlert(state: IAlertsState, result: boolean) {
    state.alertData = null;
    state.alertShow = false;
    resolveAlert(result);
  }

  export const mutations = {
    showAlert: b.commit(showAlert),
    hideAlert: b.commit(hideAlert),
  }
}

// Actions
namespace Actions {
  async function addAlert(context, alert: IAlert) {
    Mutations.mutations.showAlert(alert);
    return new Promise((resolve, reject) => {
      resolveAlert = resolve;
      rejectAlert = reject;
    });
  }
  async function hideAlert(context, result: boolean) {
    Mutations.mutations.hideAlert(result);
  }

  export const actions = {
    addAlert: b.dispatch(addAlert),
    hideAlert: b.dispatch(hideAlert),
  }
}

//Module
const AlertsModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default AlertsModule;