import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import globalStyles from '../global-styles'
import {MaterialCommunityIcons} from "@expo/vector-icons";
type CurrencyInfo = {
  character: string;
  rate: number;
}
type ListItem = {
  icon?: string;
  name?: string;
  sum?: string;
  type?: string;
  time?: string;
  subRight?: string;
  period?: string;
  currency?: string;
  subName?: string;
  subInfo?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  colorText?: string;
  id?: string;
  date?: Date;
  isDefault?: string;
  categoryId?: string;
  accountId?: string;
  comment?: string;
  isEnabled?: boolean;
  currencyInfo?: CurrencyInfo;
  rightIcon?: string;
}
interface ListProps {
  items: ListItem[],
  key: string,
  containerStyles?: any,
  currencyCharacter?: string,
  loading?: boolean,
  onInput: (code: ListItem) => void,
  onRightIconClick?: (code: ListItem) => void,
}

const List = (props: ListProps) => {
  const {
    items,
    containerStyles = {},
    key,
    currencyCharacter,
    loading = false,
    onInput,
    onRightIconClick,
  } = props
  return (
    <View style={{ ...containerStyles }}>
      {loading && <View style={{ marginTop: 10, ...styles.rowAlignHCenter }}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={{ marginLeft: 10 }}>Загрузка</Text>
      </View>}
      {!loading && items.map((item, index) =>
        <TouchableOpacity
          style={{
            ...styles.bottomContainer,
            flexDirection: 'column',
            alignItems: 'flex-start',
            margin: 10,
            marginBottom: 0,
            width: 'auto',
            paddingBottom: 10,
            paddingTop: 10,
            minHeight: 60
          }}
          key={`list-${key}-${index}`}
          onPress={() => {
            onInput(item)
          }}
        >
          <View style={{  ...styles.rowAlignHCenter, width: '100%', justifyContent: 'space-between'}}>
            <View style={styles.rowAlignHCenter}>
              <View style={{ ...styles.icon, ...styles.alignCenter, backgroundColor: item.color, marginRight: 5 }}>
                {(item.icon && <MaterialCommunityIcons
                    name={item.icon}
                    size={23}
                    color="white"
                />)}
              </View>
              <View>
                {item.name ? <Text style={{
                  color: item.colorText || 'white',
                }}>{item.name}</Text> : ''}
                {item.subName ? <Text style={{color: '#999999'}}>{item.subName}</Text> : ''}
              </View>
            </View>
            <View style={styles.rowAlignHCenter}>
              {item.subRight ? <Text style={{color: '#999999'}}>{item.subRight}</Text> : ''}
              {item.sum ? <Text style={{marginLeft: 10, color: 'white', ...styles.tAlignCenter}}>
                {item.sum} {item.currencyInfo?.character}
                {item.currencyInfo && item.currencyInfo.character !== currencyCharacter ? ` -> ${item.currencyInfo.rate * item.sum} ${currencyCharacter}` : ''}
              </Text> : ''}
              {item.rightIcon ? <TouchableOpacity
                onPress={() => {
                  if (onRightIconClick) {
                    onRightIconClick(item)
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={item.rightIcon}
                  size={40}
                  color="white"
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity> : ''}
            </View>
          </View>
          {item.subInfo ? <Text style={{ color: '#999999', fontSize: 12 }}>{item.subInfo}</Text> : ''}
        </TouchableOpacity>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  ...globalStyles,
});

export default List