<template>
  <div class='UserProfile'>
    <div class='description'>
      <span class='title'>
        Description
      </span>
      <span class='value'>
        {{getDescription}}
      </span>
    </div>
    <div class='history'>
      <div class='header'>
        <span class='title'>Commentaires</span>
        <div class='tabs'>
          <div class='container'>
            <div v-for='tab of tabs' :key='tab.id' :class='{selected: tab.id == tabSelected}'
              class='tab' @click='tabSelected = tab.id'>
              {{tab.text}}
            </div>
          </div>
        </div>
      </div>
      <div class='list' v-if='userComments.length'>
        <div class='comment'  v-for='comment of commentsToDisplay' :key='comment.id'>
          <div class='header'>
            <div class='users' :class='{reverse: tabSelected == 1}'>
              <router-link :to='`/user/${comment.user.id}`' class='user'>
                <div class='profil'>
                  <div class='picture' :style='getProfil(comment.user.avatar)'></div>
                </div>
                <div class='infos'>
                  <span class='name'>{{comment.user.firstname}}</span>
                  <span class='time' v-if="tabSelected == 0">{{comment.fromNow}}</span>
                </div>
              </router-link>
              <!--  -->
              <SvgIcon :src='require("@icons/forms/little_arrow_right.svg")' :size='30'/>
              <router-link class='user' :to='`/user/${user.id}`'>
                 <div class='profil'>
                  <div class='picture' :style='getProfil(userAvatar)'></div>
                </div>
                <div class='infos'>
                  <span class='name'>{{user.firstname}}</span>
                  <span class='time' v-if="tabSelected == 1">{{comment.fromNow}}</span>
                </div>
              </router-link>
            </div>
            
            <div class='rating'>
              <StarRating :value='starCount(comment.rating).value' :data='starCount(comment.rating)' />
            </div>
          </div>
          <div class='value' v-if='comment.comment'>
            <span class='text'>{{comment.comment}}</span>
          </div>
        </div>
      </div>
      <div v-else class='noresult'>Aucun commentaire</div>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import {UserStore} from '@store';
  import moment from 'moment';
  import {SvgIcon, StarRating} from '@components';
  import {Forms} from '@classes'
  import * as Chance from 'chance';

  @Component({
    components: {SvgIcon, StarRating}
  })

  export default class UserProfile extends Vue {

    public css = require('@css');
    public tabSelected = 0;

    public tabs = [
      {id: 0, text: 'Reçus'},
      {id: 1, text: 'Postés'}
    ]

    get user() {return UserStore.state.oneUser}

    get starCount() {
      return rating => new Forms.StarRating({
        editable: false,
        init: rating,
        size: 24,
        displayNote: false
      })
    }
    get userAvatar() {return this.user.avatar};

    get getProfil() {
      return avatar => {
        return {backgroundImage: `url('${avatar}')`}
      }
    }

    get commentsToDisplay() {
      if (this.tabSelected == 0) return this.userComments;
      else return this.userCommentsPosted;
    }

    get userCommentsPosted() {
      return this.user.commentsPosted.sort((a, b) => b.createdAt - a.createdAt).map(m => {m.fromNow = moment(m.createdAt * 1000).fromNow(); return m});
    }

    get userComments() {
      return this.user.comments.sort((a, b) => b.createdAt - a.createdAt).map(m => {m.fromNow = moment(m.createdAt * 1000).fromNow(); return m});
    }
    get getDescription() { 
      return this.user.description; 
      // return this.chance.paragraph();
    }
    get chance() { return new Chance(); }

  }
</script>


<style lang="scss" scoped>


.UserProfile {
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  flex: 0 1 auto;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  max-width: 100%!important;
  padding: 20px;

  .description {
    display: flex;
    flex-flow: column wrap;
    position: sticky;
    top: calc(#{$headerHeight} + 60px);
    width: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);;
    border-radius: 5px;
    padding: 10px;

    .title {
      font-weight: bold;
      font-size: 17px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }

    .value {
      font-size: 14px;
    }
  }

  .history {
    display: flex;
    flex-flow: column wrap;
    margin-left: 30px;
    width: 600px;
    background-color: white;
    border-radius: 5px; 
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    >.header {
      display: flex;
      height: 50px;
      border-bottom: 1px solid $w230;
      flex-flow: row nowrap;
      align-items: center;

      .title {
        font-weight: bold;
        flex: 1 1 auto;
        padding-left: 10px;
      }

      .tabs {
        flex: 0 0 auto;
        display: flex;
        align-items: center;

        .container {
          display: flex;
          flex-flow: row nowrap;
          padding: 10px;

          .tab {
            background-color: white;
            padding: 5px 15px 5px 15px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;

            &:first-child {
              border: 1px solid $w230;
              border-radius: 40px 0 0 40px;
            }

            &:last-child {
              border: 1px solid $w230;
              border-left: none;
              border-radius: 0 40px 40px 0;
            }

            &.selected {
              background-color: $mainStyle;
              color: white;
              border: none;
            }
          }
        }
      }
    }

    .list {
      justify-content: center;
      align-items: center;
      display: flex;
      flex-flow: column wrap;
      padding: 10px 10px 0 10px;
      background-color: $w235;
      min-height: 120px;

      .comment {
        display: flex;
        flex-flow: column wrap;
        width: 100%;
        background-color: white;
        padding: 5px;
        margin-bottom: 10px;
        border-radius: 5px;

        .header {
          display: flex;
          flex-flow: row nowrap;
          padding-top: 5px;
          align-items: center;
          margin-bottom: 5px;

          .users {
            display: flex;
            justify-content: flex-start;
            flex: 1 1 auto;
            align-items: center;

            &.reverse {
              flex-flow: row-reverse wrap;
              justify-content: flex-end;
            }

            .user {
              display: flex;
              flex-flow: row wrap;

              .profil {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 10px 0 10px;

                .picture {
                  width: 40px;
                  height: 40px;
                  @include bg-center;
                  border-radius: 100%;
                  border: 2px solid $mainStyle;
                }
              }
              .infos {
                display: flex;
                flex-flow: column wrap;
                justify-content: center;
                align-content: flex-start;
                padding-right: 10px;

                .name {
                  font-weight: bold;
                }

                .time {
                  font-size: 12px;
                  color: $w120;
                }
              }
            }
          }

          .rating {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
          }
        }

        .value {
          padding: 10px 10px 10px 20px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .text {
            background-color: $w230;
            color: $g60;
            padding: 10px 20px 10px 20px;
            border-radius: 10px 40px 40px 40px;
            font-size: 14px;
          }
        }

        
      }
    }

    .noresult {
      justify-content: center;
      align-items: center;
      display: flex;
      background-color: $w235;
      min-height: 120px;
    }
  }

  @media screen and (max-width: 1000px) {
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: center;

    .history {
      margin-left: 0;
      margin-top: 20px;
      max-width: 600px;
      flex-shrink: 1;
    }
  }
}

</style>


