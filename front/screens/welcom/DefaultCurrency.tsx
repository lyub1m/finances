import {
  View,
  Text,
  StyleSheet, TextInput, ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Base from '../Base'
import globalStyles from "../../global-styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getCurrencies} from "../../api";
import {AxiosContext} from "../../context/AxiosContext";
import {AuthContext} from "../../context/AuthContext";

const DefaultCurrency = ({ navigation }) => {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState('RUB');
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    getCurrencies(axiosContext)
      .then(data => setCurrencies(data))
      .catch(e => console.error(e))
  }, []);
  const filteredCurrencies = currencies.filter(e => !search || e.name.includes(search))
  return (
    <Base>
      <View style={{
        height: 30,
        width: '100%',
        backgroundColor: '#165738',
        paddingTop: 20,
        ...styles.rowAlignHCenter
      }}/>
      <View style={{ height: '90%', padding: 20, ...styles.alignCenter, ...styles.alignCenterBetween }}>
        <Text
          style={{ color: '#999999', fontSize: 22, marginTop: 10 }}
        >Выберите валюту по умолчанию</Text>
        <TextInput
          value={search}
          placeholder="Поиск"
          placeholderTextColor='#99999989'
          style={{ ...styles.input, width: '100%', marginTop: 10 }}
          onChangeText={(e) => {setSearch(e)}}
        />
        <View
          style={{ padding: 5, paddingRight: 0, width: '100%', ...styles.alignEndBetween }}
        >
          <MaterialCommunityIcons
            name="find-replace"
            size={20}
            style={{ marginTop: -50, color: '#999999' }}
          />
        </View>
        <ScrollView style={{height: 'auto', maxHeight: '75%'}}>
          <View style={{width: 340}}>
            {filteredCurrencies.map(e => <View
              key={`currency-${e.code}`}
              style={{
                padding: 10,
                borderRadius: 5,
                ...styles.rowAlignHCenter,
                ...styles.alignCenterBetween,
                ...currency === e.code && { backgroundColor: '#7c7777' }
              }}
              onTouchEnd={() => setCurrency(e.code)}
            >
              <Text style={{color: '#999999'}}>{e.name}</Text>
              <Text style={{color: '#999999'}}>{e.code}</Text>
            </View>)}
          </View>
        </ScrollView>
        <View style={{ marginTop: 15, height: 30, ...styles.alignCenter, }}>
          <Text
            style={{
              marginTop: 20,
              height: 45,
              width: 200,
              backgroundColor: 'grey',
              padding: 10,
              borderRadius: 30,
              ...styles.tAlignCenter,
            }}
            onPress={() => navigation.navigate('sum', { currency })}
          >Далее</Text>
        </View>
      </View>
    </Base>
  );
};

const styles = StyleSheet.create({
  ...globalStyles,
});

export default DefaultCurrency;