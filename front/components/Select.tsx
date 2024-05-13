import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import globalStyles from '../global-styles'
import {MaterialCommunityIcons} from "@expo/vector-icons";

type Item = {
  code: string;
  text?: string;
  icon?: string;
  color?: string;
  noSelectable?: boolean;
}
interface SelectProps {
  items: Item[],
  key: string,
  loading?: boolean,
  valueCode?: string,
  value?: string,
  backgroundColor?: string,
  title?: string,
  containerStyles?: any,
  onInput: (code: string) => void,
}

const Select = (props: SelectProps) => {
  const {
    items,
    value,
    title,
    key,
    containerStyles,
    valueCode = 'code',
    loading = false,
    backgroundColor,
    onInput
  } = props

  const [currentValue, setCurrentValue] = useState(value || items[0].code)

  return (
    <View style={containerStyles}>
      {title ? <Text style={{ color: '#999999' }}>{title}</Text> : ''}
      <ScrollView
        style={{ height: 'auto', maxHeight: 180, marginTop: 10 }}
      >
        <View style={{
          backgroundColor,
          ...styles.wrap,
          ...styles.rowAlignHCenter,
        }}>
          {loading ? <View style={{
            marginTop: 10,
            paddingTop: 24,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 23,
            ...styles.alignCenter,
            ...styles.rowAlignHCenter
          }}>
              <ActivityIndicator size="large" color="#007aff" />
              <Text style={{ marginLeft: 10 }}>Загрузка</Text>
          </View> : items.map((e, i) =>
            <View
              key={`select-item-${key}-${i}`}
              style={{
                padding: 5,
                marginBottom: 10,
                ...styles.alignCenter,
                ...currentValue === e[valueCode] && { backgroundColor: e.color || 'rgba(22,87,56,0.84)', borderRadius: 10 }
              }}
              onTouchEnd={() => {
                if (!e.noSelectable) {
                  setCurrentValue(e[valueCode])
                }
                onInput(e[valueCode])
              }}
            >
              <View
                style={{
                  minWidth: 30,
                  minHeight: 30,
                  backgroundColor: e.color,
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: currentValue === e[valueCode] && e.color ? e.color : 'transparent',
                  ...styles.alignCenter,
                }}
              >
                {e.icon ? <MaterialCommunityIcons
                  name={e.icon}
                  style={{ margin: 5 }}
                  size={40}
                  color="white"
                /> : ''}
              </View>
              {e.text ? <Text style={{ color: '#c7bfbf', fontSize: 13 }}>{e.text}</Text> : ''}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  ...globalStyles,
});

export default Select