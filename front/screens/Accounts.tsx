import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from "../global-styles";
import {useContext, useEffect, useState} from "react";
import {getAccounts} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import {AuthContext} from "../context/AuthContext";

export default function AccountsScreen({ navigation, state = {} }) {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
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
      <View style={{
        height: 100,
        width: '100%',
        backgroundColor: '#165738',
        borderRadius: 30,
        paddingTop: 20,
        ...styles.rowAlignHCenter
      }}>
        <MaterialCommunityIcons
          name="menu"
          size={23}
          color="white"
          style={{ marginLeft:20 }}
          onPress={() => {
            navigation.openDrawer();
          }}
        />
        <View style={{ width: '80%', ...styles.alignCenter }}>
          <View>
            <Text style={{
              ...styles.button,
              fontSize: 20
            }}>Счета</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{ marginTop: 20, ...styles.alignCenter }}>
          <Text style={{fontSize: 20, color: '#999999'}}>Итого</Text>
          <Text style={{fontSize: 25}}>{new Intl.NumberFormat().format(total)} {currencyCharacter}</Text>
        </View>
        {accounts.map((item, index) =>
          <View
            style={{ ...styles.bottomContainer, margin: 10, width: 'auto', paddingBottom: 10, paddingTop: 10 }}
            key={`${JSON.stringify(item)}-${index}`}
            onTouchEnd={() => {
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
          >
            <View style={styles.rowAlignHCenter}>
              <View style={{ ...styles.icon, ...styles.alignCenter, backgroundColor: item.color, marginRight: 5 }}>
                {(item.icon && <MaterialCommunityIcons
                    name={item.icon}
                    size={23}
                    color="white"
                />)}
              </View>
              <Text style={{color: 'white'}}>{item.name}</Text>
            </View>
            <View style={styles.rowAlignHCenter}>
              <Text style={{color: 'white', ...styles.tAlignCenter}}>
                {item.sum} {item.currencyInfo.character}
                {item.currencyInfo.character !== currencyCharacter ? ` -> ${item.currencyInfo.rate * item.sum} ${currencyCharacter}` : ''}
              </Text>
            </View>
          </View>)}
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