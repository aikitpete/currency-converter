import React from 'react';
import { StyleSheet, Text, View, Picker, TextInput } from 'react-native';
import CurrencyPicker from './components/CurrencyPicker';
import ApiService from './services/ApiService';
import ConversionService from './services/ConversionService';

const defaultValue = 1;

export default class App extends React.Component {
  constructor() {
    super();

    this.apiService = new ApiService();
    this.conversionService = new ConversionService();

    var data = this.apiService.fetchData();

    this.conversionService.updateData(data);

    console.log("DATA",this.data,"RATES",this.rates);
    this.state = {
      fromCurrency: this.conversionService.getCurrenciesWithBase()[0],
      fromValue: defaultValue,
      toValue: defaultValue,
      toCurrency: this.conversionService.getCurrenciesWithBase()[0]
    };
  }
  updateFromValue(newFromValue) {
    const newToValue = this.conversionService.convert(this.state.fromCurrency, this.state.toCurrency, newFromValue);
    this.setState({
      fromValue: value,
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
          <View style={styles.currencyDisplay}>
            <View style={styles.resultBox}>
              <TextInput
                style={[styles.mainText, styles.inputBox]}
                value={this.state.fromValue.toFixed(2)}
              >
              </TextInput>
            </View>
            <View style={styles.resultBox}>
              <Text
                style={styles.mainText}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
              >{this.state.fromCurrency}
              </Text>
            </View>
          </View>
          <View style={styles.currencyDisplay}>
            <View style={styles.resultBox}>
              <Text style={styles.mainText}>{this.state.toValue.toFixed(2)}</Text>
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.mainText}>{this.state.toCurrency}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CurrencyPicker
            value={this.state.fromCurrency}
            values={this.conversionService.getCurrenciesWithBase()}
            callback={this.updateFromCurrency.bind(this)}
          />
          <CurrencyPicker
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
    alignItems: 'stretch',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  resultBox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 0
  },
  mainText: {
    fontSize: 40,
    color: 'blue',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputBox: {
  }
});
