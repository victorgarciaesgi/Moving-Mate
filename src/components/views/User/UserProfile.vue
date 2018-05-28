<template lang='html'>
  <div class='UserProfile'>
    <div class='user-activity'>
      <div class='title'>
        <div class='icon'><SvgIcon :src='require("@icons/movers/description.svg")' :color='css.mainStyle' :size='17'/></div>
        <div class='text'>Description</div>
        <div class='date'></div>
      </div>
      <div class='content'>
        {{getDescription}}
      </div>
    </div>
    <div class='user-activity'>
      <div class='title'>
        <div class='icon'><SvgIcon :src='require("@icons/comment.svg")' :size='17'/></div>
        <div class='text'>{{user.username}} a laissé un commentaire à (User)</div>
        <div class='date'>Il y a 1 jour</div>
      </div>
      <div class='content'>
        {{getDescription}}
      </div>
    </div>

    <div class='user-activity'>
      <div class='title'>
        <div class='icon'><SvgIcon :src='require("@icons/truck.svg")' :size='17'/></div>
        <div class='text'>{{user.username}} a participé au déménagement de (User)</div>
        <div class='date'>Il y a 1 semaine</div>
      </div>
      <div class='content'>
        Description du déménagement
      </div>
    </div>
    <div class='user-activity'>
      <div class='title'>
        <div class='icon'><SvgIcon :src='require("@icons/truck.svg")' :size='17'/></div>
        <div class='text'>(User) a laissé un commentaire à {{user.username}}</div>
        <div class='date'>Il y a un mois</div>
      </div>
      <div class='content'>
        {{getDescription}}
      </div>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import {UserStore} from '@store';
  import {SvgIcon} from '@components';
  import * as Chance from 'chance';

  @Component({
    components: {SvgIcon}
  })

  export default class UserProfile extends Vue {

    public css = require('@css');

    get user() {return UserStore.state.oneUser}
    get getDescription() { return this.chance.paragraph(); }
    get chance() { return new Chance(); }

  }
</script>


<style lang="scss" scoped>


.UserProfile {
  display: flex;
  flex-flow: column wrap;

  .user-activity {
    display: flex;
    flex-flow: column wrap;
    background-color: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;

    .title {
      display: flex;
      flex-flow: row nowrap;
      padding: 5px;
      height: 40px;
      align-items: center;
      border-bottom: 1px solid $w230;

      .icon {
        display: flex;
        justify-content: center;
        padding: 5px;
        flex: 0 0 auto;
      }

      .text {
        margin-right: 10px;
        flex: 1 1 auto;
        font-weight: bold;
      }

      .date {
        flex: 0 0 auto;
        color: $w140;
        font-size: 13px;
      }
    }

    .content {
      font-size: 13px;
      color: $w150;
      padding: 20px;
    }
  }
}

</style>


