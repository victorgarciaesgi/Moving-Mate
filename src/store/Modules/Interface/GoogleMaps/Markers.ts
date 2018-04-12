import {randomNumber} from '@methods';
import shortid from 'shortid';

import {IMovingEvent} from '@types';


export default class Marker {
  public position: {lat: number, lng: number};
  public id: string;
  public title: string;
  public infos: IMovingEvent;

  constructor(bounds: any, infos: IMovingEvent) {
    let lng = Math.random() * (bounds.b.f - bounds.b.b) + bounds.b.b;
    let lat = Math.random() * (bounds.f.f - bounds.f.b) + bounds.f.b;
    this.position = {lat, lng};
    this.infos = infos;
    this.id = shortid.generate()
  }
}