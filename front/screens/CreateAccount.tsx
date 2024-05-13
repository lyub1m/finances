import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, TextInput, Alert} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from '../global-styles'
import {useContext, useEffect, useState} from "react";
import {materialCommunity} from "../constants/material-icons";
import {htmlColors} from "../constants/colors";
import {AxiosContext} from "../context/AxiosContext";
import {AuthContext} from "../context/AuthContext";
import {
  createAccount,
  deleteAccount,
  getCurrencies,
  updateAccount,
} from "../api";
import {HeaderType} from "../constants/header";
import Header from "../components/Header";
import Select from "../components/Select";

export default function createAccountScreen({ state = {}, navigation, route = {}, setGlobalState }) {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const {
    params: routeParams = {
      sum: '',
      name: '',
      currency: 'RUB',
      icon: '',
      color: '',
      isDefault: false,
    }
  } = route
  const title = routeParams.name || 'Добавление счета'
  const { id = null } = routeParams
  const [name, setName] = useState((): string => routeParams.name);
  const [sum, setSum] = useState((): string => String(routeParams.sum));
  const [currency, setCurrency] = useState((): string => routeParams.currency);
  const [currencies, setCurrencies] = useState([]);
  const [icon, setIcon] = useState((): string => routeParams.icon);
  const [color, setColor] = useState((): string => routeParams.color);

  useEffect(() => {
    getCurrencies(axiosContext)
      .then(data => setCurrencies(data))
      .catch(e => console.error(e))
  }, []);

  const currencyInfo = currencies.find(e => e.code === currency)

  const isValid = !!(name && sum && icon && color && currency)

  return (
    <Base>
      <Header
        titleText={title}
        navigation={navigation}
        type={HeaderType.Back}
      />
      <ScrollView>
        <View style={{ padding: 15 }}>
          <View style={{marginTop: 15, ...styles.rowAlignWCenter}}>
            <TextInput
              value={sum}
              keyboardType="numeric"
              style={{ width: 100, ...styles.input, fontSize: 24, ...styles.tAlignCenter }}
              onChangeText={e => setSum(e)}
            />
            <Text
              style={{ color: '#165738', fontSize: 24, marginLeft: 5, ...styles.tAlignCenter }}
            >{currencyInfo?.code}</Text>
          </View>
          <View style={{ marginTop: 15, width: '100%'}}>
            <TextInput
              value={name}
              placeholder={'Название счета'}
              placeholderTextColor={'rgba(155,154,154,0.71)'}
              maxLength={60}
              style={{
                borderBottomWidth: 2,
                borderColor: '#999999',
                color: '#999999',
                fontSize: 18,
              }}
              onChangeText={e => setName(e)}
            />
            <Text
              style={{color: '#99999989'}}
            >{name ? name.length : 0}/{60}</Text>
          </View>
          <ScrollView horizontal={true}>
            <View style={{ marginTop: 10, ...styles.rowAlignHCenter }}>{
              currencies.map(e => <View
                key={`currency-${e.code}`}
                style={{ marginBottom: 10, ...styles.rowAlignHCenter, marginRight: 10}}
                onTouchEnd={() => {
                  setCurrency(e.code)
                }}
              >
                <MaterialCommunityIcons
                  name={currency === e.code ? 'radiobox-marked' : 'radiobox-blank'}
                  color='#165738'
                  size={25}
                  style={{marginRight: 5}}
                />
                <Text style={styles.whiteText}>{e.name}</Text>
              </View>)
            }</View>
          </ScrollView>
          <Select
            key="icon"
            items={materialCommunity.map(e => ({ code: e.name, icon: e.name }))}
            value={icon}
            title="Иконка"
            containerStyles={{ marginTop: 30 }}
            onInput={(payload) => setIcon(payload)}
          />
          <Select
            key="color"
            items={htmlColors.map(e => ({ code: e.color, color: e.color }))}
            value={color}
            title="Цвет"
            containerStyles={{ marginTop: 30 }}
            onInput={(payload) => setColor(payload)}
          />
        </View>
      </ScrollView>
      <View style={{ marginBottom: 15, height: 30, ...styles.alignCenter, ...styles.rowAlignHCenter }}>
        <Text
          style={{
            marginTop: -45,
            height: 45,
            width: 200,
            backgroundColor: 'grey',
            ...!isValid && { opacity: 0.5 },
            padding: 10,
            borderRadius: 30,
            ...styles.tAlignCenter,
          }}
          onPress={async () => {
            if (!isValid) {
              return
            }
            const fields = {
              sum,
              currency,
              name,
              color,
              icon,
            }

            try {
              if (id) {
                await updateAccount(axiosContext, fields, id)
              } else {
                await createAccount(axiosContext, fields)
              }
            } catch (e) {
              let message = e.response?.data.message || e?.message || JSON.stringify(e)
              if (Array.isArray(message)) {
                message = message.join()
              }
              Alert.alert('Ошибка сохранения счета', message);
              return;
            }
            navigation.goBack()
          }}
        >{id ? 'Сохранить' : 'Добавить' }</Text>
        {id && !routeParams.isDefault && <Text
            style={{
              marginTop: -45,
              height: 45,
              width: 150,
              backgroundColor: '#868080',
              ...!isValid && { opacity: 0.5 },
              padding: 10,
              borderRadius: 30,
              marginLeft: 15,
              ...styles.tAlignCenter,
            }}
            onPress={async () => {
              Alert.alert('Удалить счет?', name, [
                {
                  text: 'Нет',
                  style: 'cancel',
                },
                {text: 'Да', onPress: async () => {
                    await deleteAccount(axiosContext, id)
                    navigation.goBack()
                  }},
              ]);
            }}
        >Удалить</Text> || <View/>}
      </View>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});