<template lang='html'>
  <div class='MovingDetail'>
    <div class='moving-tabs'>
      <ul class='tab-list'>
        <li class='tab' v-for='tab in tabs' :key='tab.title'>
          <router-link :to='{name: tab.path}'>
            <span>{{tab.title}}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class='child-views'>
      <div>
        {{getUser.username}}
      </div>
      <router-view/>
    </div>
  </div>


</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {UIModal, FormText, CheckBox, FormButton, FormSeparator, SocialButton} from "@components";
  import {ActionsElements, AlertsElement, Forms} from '@classes';
  import {UserStore} from '@store';
  import AccountDetail from './AccountDetail.vue'
  import AccountMovings from './AccountMovings.vue'
  import {routesNames} from '@router';

  @Component({
    components: {
      AccountDetail, AccountMovings
    }
  })

  export default class User extends Vue {
    public $v;
    public submitting: boolean = false;

    public tabs = [
      {title: 'Détails du compte', path: routesNames.userDetail},
      {title: 'Historique des déménagements', path: routesNames.userMovings},
      {title: 'Historique des participations', path: routesNames.userParticipations}
    ]

    get getUser() {
      return UserStore.state.oneUser;
    }

  }
</script>


<style lang='scss' scoped>

  .MovingDetail {
    display: flex;
    position: relative;
    flex-flow: column wrap;
    width: 100%;
    min-height: 100%;
    height: auto;
    background-color: white;

    .moving-cover {
      display: flex;
      height: 300px;
      background-color: $g50;
    }

    .child-views {
      position: relative;
      width: 100%;
      height: auto;
    }

    .moving-tabs {
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      ul.tab-list {
        display: flex;
        flex-flow: row nowrap;

        li.tab {
          display: flex;
          color: $g90;
          font-size: 16px;
          padding: 0 10px 0 10px;
          transition: all 0.3s;

          a {
            span {
              padding: 15px 10px 10px 10px;
            }
            &.router-link-exact-active {
              color: $g60;
              font-weight: bold;
              span {
                border-bottom: 2px solid $g60;
              }
            }
          }
        }
      }
    }
  }

</style>


