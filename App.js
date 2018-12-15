import React from 'react';
import { StyleSheet, Text, View, Picker, TextInput, TouchableOpacity, AppState } from 'react-native';
import CurrencyConverter from './components/CurrencyConverter';
import CustomPicker from './components/CustomPicker';
import ApiService from './services/ApiService';
import ConversionService from './services/ConversionService';
import StorageService from './services/StorageService';

const defaultValue = 1;

export default class App extends React.Component {
  constructor() {
    super();

    this.apiService = new ApiService();
    this.conversionService = new ConversionService();
    this.storageService = new StorageService();

    this.state = {
      fromCurrency: "n/a",
      fromValue: defaultValue,
      toValue: defaultValue,
      toCurrency: "n/a",
      statusText: "",
      appState: AppState.currentState,
    };
  }
  componentWillMount() {
    this.reloadData();
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.reloadData();
    }
    this.setState({appState: nextAppState});
  }
  reloadData() {
    this.setState({
      statusText: "Loading data..."
    });
    this.apiService.fetchData()
      .then((responseJson) => {
        this.storageService.storeData(responseJson);
        this.processNewData(responseJson);
      }).catch((error) => {
        console.error(error);

        // Retrieve previously stored data
        this.storageService.retrieveData().then((responseJson)=>{
          if (responseJson) { // If returned data is not empty
            this.processNewData(responseJson);
          }
        });

      });
  }
  processNewData(responseJson) {
    this.conversionService.updateData(responseJson);
    const baseCurrency = this.conversionService.getCurrenciesWithBase()[0];
    console.log("Base currency",baseCurrency);
    this.setState({
      fromCurrency: baseCurrency,
      toCurrency: baseCurrency,
      statusText: "",
    });
  }
  updateFromValue(newFromValue) {
    if (isNaN(newFromValue)==true) {
      this.setState({
        fromValue: this.state.fromValue,
      })
    }
    const newToValue = this.conversionService.convert(this.state.fromCurrency, this.state.toCurrency, newFromValue);
    this.setState({
      fromValue: newFromValue,
      toValue: newToValue,
    })
  }
  updateFromCurrency(newFromCurrency) {
    const newToValue = this.conversionService.convert(newFromCurrency, this.state.toCurrency, this.state.fromValue);
    this.setState({
      fromCurrency: newFromCurrency,
      toValue: newToValue,
    })
  }
  updateToCurrency(newToCurrency) {
    const newToValue = this.conversionService.convert(this.state.fromCurrency, newToCurrency, this.state.fromValue);
    this.setState({
      toCurrency: newToCurrency,
      toValue: newToValue,
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View  style={styles.topContainer}>
        </View>
        <View style={styles.middleContainer}>
          {this.conversionService.getCurrenciesWithBase().length>0 &&
            <CurrencyConverter
              style={styles.middleContainer}
              fromCurrency={this.state.fromCurrency}
              fromValue={this.state.fromValue}
              toValue={this.state.toValue}
              toCurrency={this.state.toCurrency}
              fromValueChanged={this.updateFromValue.bind(this)}
            />
          }
          {this.conversionService.getCurrenciesWithBase().length==0 &&
            <View
              style={styles.middleContainer}
            >
              <Text>Data not loaded.</Text>
              <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Retry</Text></TouchableOpacity>
            </View>
          }
        </View>
        <Text style={styles.statusText}>{this.state.statusText}</Text>
        <View style={styles.bottomContainer}>
          <CustomPicker
            value={this.state.fromCurrency}
            values={this.conversionService.getCurrenciesWithBase()}
            callback={this.updateFromCurrency.bind(this)}
          />
        <CustomPicker
            value={this.state.toCurrency}
            values={this.conversionService.getCurrenciesWithBase()}
            callback={this.updateToCurrency.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width:200,
    height:50,
    color:'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color:'blue',
    fontSize: 30,
  },
  statusText: {
    textAlign:'center',
  }
});
