import React from 'react';
import { StyleSheet, Text, View, Picker, TextInput } from 'react-native';

/*
var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}
*/

export default class CurrencyConverter extends React.Component {
  render() {
    var roundedFromValue = this.props.fromValue.toString();
    /*if (countDecimals(this.props.fromValue)!=2) {
      roundedFromValue = this.props.fromValue.toFixed(2).toString()
    }*/
    const roundedToValue = this.props.toValue.toFixed(2).toString()
    return (
      <View
        style={this.props.style}
      >
        <View style={styles.currencyDisplay}>
          <View style={styles.resultBox}>
            <TextInput
              style={[styles.mainText, styles.inputBox]}
              value={roundedFromValue}
              onChangeText={(text) => this.props.fromValueChanged(text)}
              //onSubmitEditing={(text) => this.props.fromValueChanged(text)}
            >
            </TextInput>
          </View>
          <View style={styles.resultBox}>
            <Text
              style={styles.mainText}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >{this.props.fromCurrency}
            </Text>
          </View>
        </View>
        <View style={styles.currencyDisplay}>
          <View style={styles.resultBox}>
            <Text style={styles.mainText}>{roundedToValue}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.mainText}>{this.props.toCurrency}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
