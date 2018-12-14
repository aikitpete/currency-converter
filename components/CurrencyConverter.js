import React from 'react';
import { StyleSheet, Text, View, Picker, TextInput } from 'react-native';

export default class CurrencyConverter extends React.Component {
  render() {
    return (
      <View
        style={this.props.style}
      >
        <View style={styles.currencyDisplay}>
          <View style={styles.resultBox}>
            <TextInput
              style={[styles.mainText, styles.inputBox]}
              value={this.props.fromValue.toFixed(2)}
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
            <Text style={styles.mainText}>{this.props.toValue.toFixed(2)}</Text>
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
