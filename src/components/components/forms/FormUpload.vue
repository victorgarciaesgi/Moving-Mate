<template>
  <div class="FormUpload">
    <div class='label'>{{data.placeholder}}</div>
    <div class='upload-wrapper'>
      <div class='dropZone' :for='formId' 
        @click='triggerInput'
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover.prevent
        @dragend="handleDragEnd"
        @drop.prevent="handleItemDrop">
      </div>
      <div class='dropDisplay' :class='{draggedOver, imageUploaded}'>
        <div class='image-previsu' v-if='dropped'>
          <img v-if='loadingImage' src='@images/loading.svg'>
          <div class='image' v-else-if='imageUploaded' :style='formatedImage'></div>
        </div>
        <div class='image-uploaded' v-if='imageUploaded'>
          <div class='info title'>
            <span>{{fileTitle}}</span>
          </div>
          <div class='info state'>
            <template v-if='loadingImage'>
              <span>Transfert en cours...</span>
              <img class='image' src='@images/loading_grey.svg'>
            </template>
            <template v-else>
              <span>Importé</span>
              <SvgIcon class='image' :src='require("@icons/done.svg")' :size='20'/>
            </template>
          </div>
          <div class='info delete'>
            <div class='bouton' @click='deleteFile'>Supprimer</div>
          </div>
        </div>
        <div class='drop-infos' v-else>
          <template v-if='draggedOver'>
            <SvgIcon :src='require("@icons/import.svg")' :size='35' :color='css.mainStyle'/>
            <span>Relachez pour importer!</span>
          </template>
          <template v-else>
            <SvgIcon :src='require("@icons/drop.svg")' :size='35' color='rgb(120,120,120)'/>
            <span>Déposez l'image ou cliquez pour importer</span>
          </template>
        </div>
      </div>
      <input ref='inputFile' :id='formId' @change='handleImportFile'
        type='file' accept="image/jpeg" style='display: none'>
    </div>
    <FormError v-if='vl' :vl='vl' :data='data'/>
  </div>

</template>

<script lang="ts">
import {Prop, Watch} from "vue-property-decorator";
import {Component, Mixin, Mixins} from 'vue-mixin-decorator';
import {FormMixin} from '../Mixins/FormMixin';

import {NotificationsStore} from '@store';

@Component({
  mixins: [FormMixin]
})
export default class FormUpload extends FormMixin {

  public css = require('@css');
  public draggedOver = false;

  public dropped = false;
  public loadingImage = false;
  public imageUploaded = false;
  public fileTitle: string = null;
  public imagePrevisu: string = null;

  get formatedImage() {
    return {backgroundImage: `url(${this.imagePrevisu})`}
  }

  
  handleImportFile(event) {
    const file = this.$refs['inputFile'].files[0];
    this.readImage(file);
    this.dropped = true;
    this.$emit('input', file);
  }

  handleItemDrop(event: DragEvent) {
    this.draggedOver = false;
    let imageFile = null;
    if (event.dataTransfer.items) {
      if (event.dataTransfer.items[0].kind === 'file') {
        imageFile = event.dataTransfer.items[0].getAsFile();
      }
    } else {
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        imageFile = event.dataTransfer.files[0];
      }
    }
    if (imageFile) {
      if (imageFile.type == 'image/jpeg') {
        this.readImage(imageFile);
      } else {
        NotificationsStore.actions.addNotification({
          type: 'error',
          message: 'Seuls les fichiers .jpeg ou .jpg sont acceptés'
        })
      }
    }
    this.removeDragData(event);
  }

  readImage(image: any) {
    console.log(image);
    if (image.type != 'image/jpeg') {
      NotificationsStore.actions.addNotification({
        type: 'error',
        message: `L'image doit être un fichier en .jpeg ou .jpg`
      })
    } else if (image.size > 3000000) {
      NotificationsStore.actions.addNotification({
        type: 'error',
        message: 'La taille maximale est de 3Mo'
      })
    } else {
      this.dropped = true;
      const reader = new FileReader();
      this.loadingImage = true;
      this.fileTitle = image.name;

      reader.onload = (event: any) => {
        this.imagePrevisu = event.target.result;
        this.imageUploaded = true;
        this.loadingImage = false;
      }
      reader.onerror = () => {this.loadingImage = false;}
      reader.readAsDataURL(image)
    }
  }

  deleteFile() {
    this.dropped = false;
    this.loadingImage = false;
    this.imageUploaded = false;
    this.fileTitle= null;
    this.imagePrevisu = null;
    this.$emit('input', '');
    this.$refs['inputFile'].value = null;
  }

  

  handleDragEnter(event: DragEvent) {
    if (!this.imageUploaded) {
      this.draggedOver = true;
    }
  }
  
  handleDragLeave() {
    this.draggedOver = false;
  }

  handleDragEnd() {
    this.draggedOver = false;
  }

  removeDragData(ev: DragEvent) {
    if (ev.dataTransfer.items) {
      ev.dataTransfer.items.clear();
    } else {
      ev.dataTransfer.clearData();
    }
  }

  triggerInput() {
    if (!this.imageUploaded) {
      this.$refs['inputFile'].click();
    }
  }

}
</script>



<style lang='scss' scoped>


.FormUpload {
  display: flex;
  flex-flow: column wrap;
  padding: 5px 0 5px 0;

  .upload-wrapper {
    display: flex;
    position: relative;
    height: 120px;

    .dropZone {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .dropDisplay {
      display: flex;
      position: relative;
      flex-flow: row nowrap;
      width: 100%;
      background-color: #e0e1e4;
      border-radius: 5px;
      border: 3px dashed $w180;
      // transition: all 0.3s;
      overflow: hidden;

      .image-previsu {
        display: flex;
        height: 100%;
        width: 180px;
        flex: 0 0 auto;
        justify-content: center;
        align-items: center;
        background-color: $w235;
        border-right: 1px solid $w230;

        .image {
          width: 100%;
          height: 100%;
          @include bg-center;
        }
      }

      .image-uploaded {
        display: flex;
        flex-flow: column nowrap;
        position: relative;
        flex: 1 1 auto;

        .info {
          display: flex;
          flex: 1 1 auto;
          justify-content: flex-start;
          align-items: center;
          padding-left: 15px;
          font-size: 14px;
          color: $w120;
          font-weight: bold;
          overflow: hidden;

          &.title {
            color: $mainStyle;
            font-size: 15px;
            align-items: flex-end;
            display: flex;
            flex-wrap: nowrap;

            span {
              @include ellipsis;
            }

          }

          &.state {
            font-size: 13px;
            .image {
              height: 18px;
              width: 18px;
              margin-left: 5px;
            }
          }

          &.delete {
            .bouton {
              color: transparentize($red1, 0.2);
              cursor: pointer;
            }
          }
        }
      }

      .drop-infos {
        display: flex;
        flex-flow: column wrap;
        flex: 1 1 auto;
        justify-content: center;
        align-items: center;
        color: $w120;
        font-weight: bold;
        font-size: 14px;
      }

      &.draggedOver {
        border-color: $mainStyle;
        .drop-infos {
          color: $mainStyle;
        }
      }

      &.imageUploaded {
        border: none;
        background-color: white;
        border: 1px solid $w220;
        cursor: initial;
        z-index: 11;
      }
      
    }
  }

  .label {
    font-weight: bold;
    padding: 0 0 5px 0;
    font-size: 14px;
    color: $g90;
  }
}

</style>

