import {randomNumber} from '@methods';
import shortid from 'shortid';


export default class Marker {
  public position: {lat: number, lng: number};
  public id: string;
  public title;
  public infos;

  constructor({b, f}) {
    
    let lng = Math.random() * (b.f - b.b) + b.b;
    let lat = Math.random() * (f.f - f.b) + f.b;
    this.position = {lat, lng};
    this.id = shortid.generate()
  }
}