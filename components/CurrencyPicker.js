import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native'

class PickerExample extends Component {
   render() {
      return (
         <View style={styles.container}>
            <Picker selectedValue = {this.props.value} onValueChange = {this.props.callback}>
            {this.props.values.map((value, key) => {
               return (
                 <Picker.Item label={value} value={value} />
               );
            })}
            </Picker>
         </View>
      )
   }
}
export default PickerExample

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    fontSize: 30,
    alignSelf: 'center',
    color: 'red',
    backgroundColor: 'yellow'
  }
})
