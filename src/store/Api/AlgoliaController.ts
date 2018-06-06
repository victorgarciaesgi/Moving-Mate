import axios from 'axios';

export class AlgoliaSearch {
  private baseUrl = ''; // a remplir

  async searchMoving(fields: {text: string, lat: number, lng: number}) {

    const {data} = await axios.get(this.baseUrl);
    return data;
  }

  async searchMovers(fields: {text: string, lat: number, lng: number}) {

    const {data} = await axios.get(this.baseUrl);
    return data;
  }
}