import { ActionContext  } from 'vuex';
import { INotificationState, INotification, INotificationType } from '@types';
import { RootState } from '../index';
import { timeout } from '@methods';
import { merge } from 'lodash';
import { storeBuilder } from "./Store/Store";

const TIMEOUT: number = 5000;
type NotificationContext = ActionContext<INotificationState, RootState>;

const state: INotificationState = {
  notificationCount: 0,
  notificationList: []
}

const b = storeBuilder.module<INotificationState>("NotificationsModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {
    
  }  
}

// Mutations
namespace Mutations {
  function addAlert(state: INotificationState, alert: INotification) {
    state.notificationList.push(alert);
    state.notificationCount++;
  }
  function deleteAlert(state: INotificationState, alert: INotification) {
    var index = state.notificationList.findIndex(element => element.id === alert.id);
    if (index !== -1) {
      state.notificationList.splice(index, 1);
    }
  }

  export const mutations = {
    addAlert: b.commit(addAlert),
    deleteAlert: b.commit(deleteAlert),
  }
}

// Actions
namespace Actions {
  async function addNotification(context: NotificationContext, alert: INotification) {
    alert = merge(alert, {
      id: state.notificationCount,
      isNotif: alert.isNotif || false
    })
    NotificationsModule.mutations.addAlert(alert);
    await timeout(TIMEOUT);
    NotificationsModule.mutations.deleteAlert(alert);
  }

  export const actions = {
    addNotification: b.dispatch(addNotification),
  }
}

//Module
const NotificationsModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default NotificationsModule;