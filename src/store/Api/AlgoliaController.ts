import * as algoliasearch from 'algoliasearch';
import * as algoliasearchHelper from 'algoliasearch-helper';
import Api from './'

const algolia = algoliasearch('5O93WZQA29', 'd25b4bd3e003156bf13a9f4d9d395cde');
const algoliaHelperMoving = algoliasearchHelper(algolia, 'moving');
const algoliaHelperMover = algoliasearchHelper(algolia, 'mover');

export class AlgoliaSearch {

  async searchMoving(fields: { text: string, lat: number, lng: number }) {
    let result;
    let userCoords = `${fields.lat}, ${fields.lng}`;
    let uuid;

    return new Promise((resolve, reject) => {
      algoliaHelperMoving.setQueryParameter('aroundLatLng', userCoords);
      algoliaHelperMoving.setQueryParameter('aroundRadius', 25000);
      algoliaHelperMoving.search();

      algoliaHelperMoving.on('result', async (data) => {
        const uuidList = data.hits.map(value => value.uuid);

        const result = await Api.post('announcementsList', {'uuid': uuidList});

        resolve(result.data);
      });
    })
  }

  async searchMovers(fields: { text: string, lat: number, lng: number }) {
    let result;
    let userCoords = `${fields.lat}, ${fields.lng}`;
    let uuid;

    return new Promise((resolve, reject) => {
      algoliaHelperMover.setQueryParameter('aroundLatLng', userCoords);
      algoliaHelperMover.setQueryParameter('aroundRadius', 25000);
      algoliaHelperMover.search();

      algoliaHelperMover.on('result', async (data) => {
        const objectIdList = data.hits.map(value => value.id);

        const result = await Api.post('moversList', {'objectId': objectIdList});

        resolve(result.data);
      });
    })
  }
}