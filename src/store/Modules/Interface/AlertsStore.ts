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
  submitting: false
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
    Actions.actions.onCloseAction({alert: Object.assign({}, state.alertData), value: true})
    state.alertData = null;
    state.alertShow = false;
    if (resolveAlert) resolveAlert();
  }

  function confirmAlert(state: IAlertsState) {
    Actions.actions.onCloseAction({alert: Object.assign({}, state.alertData), value: true})
    state.alertData = null;
    state.alertShow = false;
    if (resolveAlert) resolveAlert(true);
  }
  function cancelAlert(state: IAlertsState) {
    Actions.actions.onCloseAction({alert: Object.assign({}, state.alertData), value: false})
    state.alertData = null;
    state.alertShow = false;
    if (resolveAlert) resolveAlert(false);
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

  async function onCloseAction(context, {alert, value}: {alert: AlertsElement.Alert, value: boolean}) {
    if (alert.onClose) {
      try {
        for (const trigger of alert.onClose) {
          await trigger();
        }
        resolveAlert(value)
      } catch(e) {
        rejectAlert(e)
      } finally {
        context.state.submitting = false;
      }
     
    }
  }

  async function executeAction(context, {action, value}: {action: ActionsElements.Action, value: boolean}) {
    if (action.trigger) {
      await action.trigger();
      resolveAlert(value);
    } else if (action.triggers) {
      return new Promise(async (resolve, reject) => {
        context.state.submitting = true;
        try {
          for (const trigger of action.triggers) {
            await trigger();
          }
          resolveAlert(value)
        } catch(e) {
          rejectAlert(e)
        } finally {
          context.state.submitting = false;
        }
      })
    }
  }

  export const actions = {
    addAlert: b.dispatch(addAlert),
    hideAlert: b.dispatch(hideAlert),
    executeAction: b.dispatch(executeAction),
    onCloseAction: b.dispatch(onCloseAction)
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