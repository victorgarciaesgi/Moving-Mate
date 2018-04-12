import {randomNumber} from '@methods';
import shortid from 'shortid';

import {IMovingEvent} from '@types';
import { getMapInstance } from '@store';

declare var InfoBox;

export default class Marker {
  public position: {lat: number, lng: number};
  public id: string;
  public title: string;
  public infos: IMovingEvent;
  public marker: google.maps.Marker;
  public infoBox: google.maps.InfoWindow;

  constructor(bounds: any, infos: IMovingEvent, mapInstance: google.maps.Map) {
    let lng = Math.random() * (bounds.b.f - bounds.b.b) + bounds.b.b;
    let lat = Math.random() * (bounds.f.f - bounds.f.b) + bounds.f.b;
    this.position = {lat, lng};
    this.infos = infos;
    this.id = shortid.generate();

    const templateInfo = `
      <div id='markerRoot${this.id}'>
        <div id='marker${this.id}'></div>
      </div>`;

    this.marker = new google.maps.Marker({
      position: this.position,
      map: mapInstance,
      title: this.title,
    })
    this.infoBox = new InfoBox({
      content: templateInfo,
      disableAutoPan: false,
      closeBoxURL : "",
      infoBoxClearance: new google.maps.Size(1, 1),
      isHidden: false,
      pane: "floatPane",
      enableEventPropagation: false
    })
  }
}