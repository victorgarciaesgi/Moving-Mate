<template>

  <div class='social-button' @click='handleClick()' v-if='gapiReady'
    :class='[media]'>
    <div class='logo'>
      <img :src='logos[media]'>
    </div>
    <div class='text'>
      <slot></slot>
    </div>
    <div class='loading' v-if='loading'>
      <img v-if='media == "google"' src="~@images/loading.svg" height="24" width="24">
      <img v-if='media == "facebook"' src="~@images/loading_white.svg" height="24" width="24">
    </div>
  </div>

  
</template>

<script lang="ts">

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { GoogleStore } from '@store';

@Component({})
export default class SocialButton extends Vue {

  @Prop({required: true}) media: string;

  public API_KEY = 'AIzaSyB2zJbMB-_jCSHklks5CKKpoUqZ11eeGU0';
  public gapiReady = true;
  public loading = false;

  public logos = {
    facebook: require('@images/social/fb_logo_letter.png'),
    google: require('@images/social/google_logo_letter.png'),
  }

  async handleClick() {
    this.$emit('click');
    this.loading = true;
    try {
      switch (this.media) {
      case 'google':
        await GoogleStore.actions.signIn();
      case 'facebook': 
      default: 
      }
    } finally {
      this.loading = false;
    }

  }

}
</script>



<style lang='scss' scoped>

.social-button {
  position: relative;
  display: flex;
  padding: 10px;
  height: 45px;
  flex-flow: row nowrap;
  border-radius: 4px;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;

  .logo {
    height: 100%;
    flex: 0 0 auto;
    width: 50px;
    display: flex;
    justify-content: center;

    img {
      height: 100%;
      width: auto;
    }
  }

  .loading {
    display: flex;
    align-items: center;
  }

  .text {
    flex: 1 1 auto;
    text-align: center;
  }

  &.facebook {
    background-color: #4267b2;
    color: white;
    &:active {
      background-color: darken(#4267b2, 5%);
    }
  }

  &.google {
    background-color: white;
    color: $mainColor;
    border: 1px solid $w230;

    &:active {
      background-color: $w245;
    }
  }
}



</style>

