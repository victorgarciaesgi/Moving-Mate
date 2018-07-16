<template>

  <div class='wrapper'>
    Payer avec  
    <div class="paypal-button" ref='paypal'></div>
  </div>
  
</template>

<script lang="ts">

import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import { GoogleStore, EventBus, LoginStore} from '@store';
import Api, { API_URL } from '@api';
import $ from 'jquery';

declare const paypal: any;

@Component({})
export default class PaypalButton extends Vue {

  @Prop() price: number;

  async mounted() {
    const _this = this;
    try {
        paypal.Button.render({
          env: 'sandbox', 
          style: {
            color: 'blue'
          },
          payment(data, actions) {
            return actions.request.post(API_URL + 'mover/create-payment', {
              price: _this.price
            }).then((res) => res)
          },
          onAuthorize(data, actions) {
            return Api.post('mover/execute-payment', {
              paymentID: data.paymentID,
              payerID:   data.payerID,
              price: _this.price
            }).then((res) =>  {
                console.log(res);
                _this.$emit('payed');
              });
          },
          onCancel(data, actions) {
            _this.$emit('canceled');
          },

          onError(err) {
            _this.$emit('canceled');
          }
        }, '.paypal-button');
    } catch(err) {
      this.$emit('canceled');
    }
  }

}
</script>



<style lang='scss' scoped>

.wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;

  .paypal-button {
    padding-top: 12px!important;
    margin-left: 10px;
  }
}

</style>

