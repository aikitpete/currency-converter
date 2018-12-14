var data = require('../data/data.js').default;

const useRemoteServer = true;

export default class ApiService {
  fetchData() {

    if (useRemoteServer == true) {

      // Remote server
      ///*
      this.dataPromise = fetch('https://txf-ecb.glitch.me/rates', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then((response=>response.json()));
      //*/

    } else { // Local file
      ///*
      this.dataPromise = new Promise((resolve)=>{
        resolve(data);
      });
      //*/

    }

    return this.dataPromise;
  }
}
