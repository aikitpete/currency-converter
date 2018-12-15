import { AsyncStorage } from "react-native"

export default class StorageService {
  storeData(data) {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem('rates', JSON.stringify(data)).then(()=>{
        resolve()
      });
    });
  }
  retrieveData() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('rates').then((value)=>{
        if (value !== null) {
          const json = JSON.parse(value);
          console.log("Retrieved",json);
          resolve(json)
        }
      });
    });
  }
}
