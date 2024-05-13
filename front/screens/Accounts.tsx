import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Base from './Base'
import globalStyles from "../global-styles";
import {useContext, useEffect, useState} from "react";
import {getAccounts} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import Header from "../components/Header";
import List from "../components/List";

export default function AccountsScreen({ navigation, state = {} }) {
  const axiosContext = useContext(AxiosContext);
  const { currencyCharacter } = state
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAccounts(axiosContext).then(data => setAccounts(data)).catch(e => console.error(e))
    });
    return unsubscribe;
  }, [navigation]);
  const total = accounts.reduce((sum, e) => sum + e.sum * (e.currencyInfo?.rate || 1), 0)
  return (
    <Base>
      <Header
        titleText="Счета"
        navigation={navigation}
      />
      <ScrollView>
        <View style={{ marginTop: 20, ...styles.alignCenter }}>
          <Text style={{fontSize: 20, color: '#999999'}}>Итого</Text>
          <Text style={{fontSize: 25, ...styles.whiteText}}>{new Intl.NumberFormat().format(total)} {currencyCharacter}</Text>
        </View>
        <List
          items={accounts}
          key="accounts"
          currencyCharacter={currencyCharacter}
          onInput={(item) => {
            navigation.navigate('createAccount', {
              name: item.name,
              sum: item.sum,
              currency: item.currency,
              icon: item.icon,
              color: item.color,
              id: item.id,
              isDefault: item.isDefault,
            })
          }}
        />
      </ScrollView>
      <View style={{ marginBottom: 15, height: 30, ...styles.alignCenter, }}>
        <Text
          style={{
            marginTop: -45,
            height: 45,
            width: 200,
            backgroundColor: 'grey',
            padding: 10,
            borderRadius: 30,
            ...styles.tAlignCenter,
          }}
          onPress={() => {
            navigation.navigate('createAccount')
          }}
        >Добавить</Text>
      </View>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});