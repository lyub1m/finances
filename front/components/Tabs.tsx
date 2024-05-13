import React, {useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import globalStyles from '../global-styles'

type Item = {
  code: string;
  text: string;
}
interface TabsProps {
  items: Item[],
  value?: string,
  containerStyles?: any,
  onInput: (code: string) => void,
}

const Tabs = (props: TabsProps) => {
  const { items, value, containerStyles = {}, onInput } = props
  const currentValue = value || items[0].code

  return (
    <View style={{ ...styles.tabs, ...containerStyles }}>
      {items.map(e => <View
        key={`tab-item-${e.code}`}
        style={{ ...styles.buttonContainer, ...currentValue === e.code ? styles.buttonEnabledContainer : {} }}
      >
        <Text
          style={{ ...styles.button, padding: 3 }}
          onPress={() => onInput(e.code)}
        >{e.text.toUpperCase()}</Text>
      </View>)}
    </View>
  )
}

const styles = StyleSheet.create({
  ...globalStyles,
});

export default Tabs