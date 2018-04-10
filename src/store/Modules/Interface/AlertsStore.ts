import { ActionsElements, AlertsElement } from '@classes';
import { IAlertsState } from '@types';
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


// Mutations
namespace Mutations {
  function showAlert(state: IAlertsState, alert: AlertsElement.Alert) {
    state.alertData = alert;
    state.alertShow = true;
  }
  function hideAlert(state: IAlertsState) {
    state.alertData = null;
    state.alertShow = false;
    resolveAlert();
  }

  function confirmAlert(state: IAlertsState) {
    state.alertData = null;
    state.alertShow = false;
    resolveAlert(true);
  }
  function cancelAlert(state: IAlertsState) {
    state.alertData = null;
    state.alertShow = false;
    resolveAlert(false);
  }

  export const mutations = {
    showAlert: b.commit(showAlert),
    hideAlert: b.commit(hideAlert),
    confirmAlert: b.commit(confirmAlert),
    cancelAlert: b.commit(cancelAlert),
  }
}

//  as AlertActions
namespace Actions {
  async function addAlert(context, alert: AlertsElement.Alert) {
    Mutations.mutations.showAlert(alert);
    return new Promise((resolve, reject) => {
      resolveAlert = resolve;
      rejectAlert = reject;
    });
  }
  async function hideAlert() {
    Mutations.mutations.hideAlert();
  }

  async function executeAction(contect, action: ActionsElements.Action) {
    if (action.trigger) {
      action.trigger();
    } else if (action.triggers) {
      action.triggers.forEach(m => m())
    }
  }

  export const actions = {
    addAlert: b.dispatch(addAlert),
    hideAlert: b.dispatch(hideAlert),
    executeAction: b.dispatch(executeAction),
  }
}

//Module
const AlertsModule = {
  get state() { return stateGetter()},
  // getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default AlertsModule;