<template>
  <div class='Home'>
    <section class='image-home'>
      <div class='part moving'>
        <div class='title'>Vous voulez déménager</div>
        <ul class="link-list">
           <router-link to='moving/create' class='link'>
            <SvgIcon class='icon' :src='require("@icons/add_circle.svg")'/>
            Créer une annonce
          </router-link>
          <router-link to='movers' class='link'>
            <SvgIcon class='icon' :src='require("@icons/people.svg")'/>
            Liste des déménageurs
          </router-link>
        </ul>
      </div>
      <div class='part mover'>
        <div class='title'>Vous voulez être déménageur</div>
        <ul class='link-list'>
          <router-link to='bemover' class='link' v-if='!userInfos.isMover'>
            <SvgIcon class='icon' :src='require("@icons/name.svg")'/>
            Devenir déménageur
          </router-link>
          <router-link to='moving' class='link'>
            <SvgIcon class='icon' :src='require("@icons/truck.svg")'/>
            Voir les déménagements
          </router-link>
          
        </ul>
      </div>
     
    </section>

    <section class='help '>
      <span class='title'>Comment ça marche ?</span>
      <ul class='help-wrapper'>
        <li v-for='help in helps' :key='help.text' v-once>
          <div class='icon'>
            <div class='icon-circle'>
              <SvgIcon :src='help.icon' :size='70' color='#FFF'></SvgIcon>
            </div>
          </div>
          <div class='text'>{{help.text}}</div>
        </li>
      </ul>
    </section>

    <section class='france-map'>
      <h1>Voir les déménagements en France!</h1>
      <MapViewer svgPath='departements' @pathSelected='handlePathSelect' />
    </section>

    <section>
      <!-- <FooterComponent></FooterComponent> -->
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { svgPath } from '@types';
import router, {routesNames} from '@router';
import FooterComponent from './Footer.vue';
import { StarRating, SvgIcon, MapViewer, BackgroundLoader } from '@components';
import { LoginStore, AlertsStore } from '@store';
import {AlertsElement, ActionsElements} from '@classes';

@Component({
  components: {
    StarRating, SvgIcon, MapViewer, BackgroundLoader, FooterComponent
  }
})
export default class Home extends Vue {

  public helps = [
    {icon: require('@icons/annonce.svg'), text:'Je publie une annonce gratuitement sur le site!'},
    {icon: require('@icons/people.svg'), text:'Des déménageurs répertoriés viendront proposer leur services'},
    {icon: require('@icons/phone.svg'), text:'Nous vous mettons en relation avec les déménageurs'},
    {icon: require('@icons/star_plain.svg'), text:'Je laisse un avis et une note sur les déménageurs une fois le déménagement fini'},
  ];

  handlePathSelect(path: svgPath) {
    router.push(`/moving/search/${path.title}`);
  }

  get userInfos() {return LoginStore.state.userInfos}

  async mounted() {
    // new AlertsElement.SuccessAlert({
    //     title: "Publication réussie!",
    //     message: "Votre annonce a bien été publiée. Recrutez des déménageurs depuis la page de votre annonce ou attendez que des déménégeurs proposent leur aide",
    //     actions: [
    //       new ActionsElements.Action({
    //         type: 'action',
    //         text: 'Voir mon annonce',
    //       })
    //     ]
    //   })
  }

}
</script>


<style lang="scss" scoped>

.Home {
  display: flex;
  width: 100%;
  flex-flow: column wrap;

  section{
    display: flex;
    position: relative;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    flex: 0 1 auto;
  }

  section.image-home {
    overflow: hidden;
    // max-height: 60vh;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;

    .part {
      display: flex;
      flex: 1 0 50%;
      min-width: 300px;
      height: 400px;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      @include bg-center;
      &.moving {
        background-image: url("~@images/home_image/home1.jpg");
      }
      &.mover {
        background-image: url("~@images/home_image/home2.jpg");
      }

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        background-color: rgba(0,0,0,0.2);
        z-index: 1;
      }

      .title {
        font-weight: bold;
        color: white; 
        font-size: 35px;
        z-index: 2;
        margin-bottom: 40px;
        text-align: center;
      }

      ul.link-list {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        z-index: 2;
        align-items: center;

        .link {
          display: flex;
          padding: 10px 20px 10px 20px;
          background-color: white;
          border-radius: 40px;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          margin: 5px 10px 5px 10px;
          justify-content: center;
          align-items: center;

          .icon {
            margin-right: 10px;
          }
        }
      }
    }

    @media screen and (max-width: 800px) {
      flex-flow: column wrap;

      .part {
        flex: 1 1 100%;
        width: 100%;
      }
    }
  }


  section.help {
    padding: 30px 20px 30px 20px;
    align-content: center;
    align-items: center;

    span.title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    ul.help-wrapper {
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-content: center;
      
      li {
        display: flex;
        flex: 0 1 auto;
        flex-flow: column nowrap;
        width: 220px;
        margin: 15px;
        height: 240px;
        padding: 20px 10px 20px 10px;
        box-shadow: 0 0 20px rgba(10,10,10,0.1);
        border-radius: 5px;
        background-color: white;

        .icon {
          display: flex;
          height: 100px;
          justify-content: center;
          align-items: center;
          

          .icon-circle {
            border-radius: 100%;
            display: flex;
            height: 100px;
            justify-content: center;
            align-items: center;
            width: 100px;
            background-color: $mainStyle;
            padding: 25px;
          }
        }

        .text {
          display: flex;
          flex: 1 1 auto;
          align-content: center;
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-top: 30px;
        }
      }
    }
  }


  section.france-map {
    height: auto;
    margin: 0 30px 30px 30px;
    padding-top: 30px;
    flex-flow: column nowrap;

    border-top: 1px solid $w220;
  }
}


</style>


