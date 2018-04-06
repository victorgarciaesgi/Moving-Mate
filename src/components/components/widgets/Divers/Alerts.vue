<template>
  <transition name='bounce'>
    <div v-if='alertState.alertShow' class='alert-base' @click='closeAlert(false)'>
      <div class="alert-window" @click.stop>
        <div class='content'>
          <div class='alert-icon' :class='[alertState.alertData.type]'>
            <img src="~@icons/notifs/success.svg" v-if='alertState.alertData.type == "success"'>
            <img src="~@icons/notifs/error.svg" v-else-if='alertState.alertData.type == "error"'>
            <img src="~@icons/notifs/warning.svg" v-else-if='alertState.alertData.type == "warning"'>
            <img src="~@icons/notifs/infos.svg" v-else-if='alertState.alertData.type == "alert"'>
          </div>
          <div class='title'>
            {{alertState.alertData.title}}
          </div>
          <span>{{alertState.alertData.message}}</span>
        </div>
        <div class='footer'>
          <template v-if='alertState.alertData.actions'>
            <FormButton v-for="action in alertState.alertData.actions" :key='action.text'
              @click='executeAction(action)'
              :theme='getTheme(action.type)'>
              {{action.text}}
            </FormButton>
          </template>
          <template v-else>
            <FormButton type='submit' theme='blue' @click='validAlert()'>
              Ça marche!
            </FormButton>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import FormButton from '@components/forms/FormButton.vue';
import { AlertsStore } from '@store';
import { IAlertAction } from '@types';

@Component({
  components: {
    FormButton
  }
})
export default class Alerts extends Vue {

  get alertState() { return AlertsStore.state}

  get getTheme() {
    return type => {
      switch(type) {
        case "confirm":
          return "blue"
        default: 
          return undefined
      }
    }
  }
  
  closeAlert(exter: boolean) {
    if (!this.alertState.alertData.strict && !exter) {
      AlertsStore.actions.hideAlert(false);
    }
  }

  validAlert() {
    AlertsStore.actions.hideAlert(true);
  }

  executeAction(action: IAlertAction) {
    if (action.trigger) {
      action.trigger();
    } else {
      action.triggers.forEach(m => m())
    }
  }
}
</script>



<style lang='scss' scoped>

.alert-base {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: transparentize($g20,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  z-index: 10002;

  .alert-window{
    display: flex;
    position: relative;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 0 20px rgba(20, 20, 20, 0.3);
    height: auto;
    width: 400px;
    min-height: 100px;
    min-width: 300px;
    max-height: 80vh;
    max-width: 80vw;
    flex-flow: column nowrap;
    overflow: hidden;

    div.content {
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      flex: 1 1 auto;
      overflow: auto;
      text-align: center;
      padding: 20px 30px 20px 30px;

      .alert-icon {
        display: flex;
        padding: 5px;
        border-radius: 100%;
        border: 5px solid transparent;

        &.success {border-color: $mainStyle}
        &.error {border-color: $red1}

        img {
          height: 50px;
          width: 50px;
        }
      }

      .title {
        display: flex;
        font-weight: bold;
        font-size: 20px;
        padding: 20px;
      }
    }

    div.footer {
      display: flex;
      flex-flow: row nowrap;
      flex: 0 0 auto;
      padding: 5px;
      height: 50px;
      align-items: center;
      align-content: center;
      justify-content: flex-end;
      border-top: 1px solid $w230;
    }

  }
}

.bounce-enter-active {
  transition: color 0.5s, opacity 0.2s;
  .alert-window {
    animation: bounce-in 0.5s;
  }
}
.bounce-leave-active {
  transition: color 0.2s, opacity 0.2s;
  .alert-window {
    animation: bounce-out 0.2s;
  }
}

.bounce-enter, .bounce-leave-to {
  opacity: 0;
}




@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.4);
    opacity: 0;
  }
}





</style>

