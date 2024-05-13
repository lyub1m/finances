import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import Base from './Base'
import {formatDate, getDateCode} from "../utils/date";
import globalStyles from '../global-styles'
import {getOperations} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import Header from "../components/Header";
import {HeaderType} from "../constants/header";
import List from "../components/List";

export default function categoryOperationsDetailScreen({ state, navigation, route = {} }) {
  const axiosContext = useContext(AxiosContext);
  const { params: routeParams = {} } = route
  const { category = {
    sum: 0,
    name: '',
  }, date = null, type, categoryId, enabledPeriod } = routeParams
  const { currencyCharacter } = state
  const [operations, setOperations] = useState([]);
  const [loadingOperations, setLoadingOperations] = useState(false);
  const filter = {
    dateFrom: date?.from,
    dateTo: date?.to,
    type,
    categoryId,
  }
  const updateOperations = (filter) => {
    setLoadingOperations(true)
    getOperations(axiosContext, filter)
      .then(data => setOperations(data))
      .catch(e => console.error(e))
      .finally(() => {
        setLoadingOperations(false)
      })
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateOperations(filter)
    });
    return unsubscribe;
  }, [navigation]);
  const computedOperations = Object.values(operations
    .reduce((res, i) => {
      const date = new Date(i.createdAt)
      const code = getDateCode(date)
      if (!res[code]) {
        const dateString = formatDate(date)
        res[code] = {
          code,
          name: dateString,
          items: []
        }
      }

      res[code].items.push({
        ...i?.category,
        ...i,
        currencyInfo: i?.account?.currencyInfo,
        subName: i?.account?.name,
        subInfo: i?.comment,
        accountId: i?.account?.id,
        date: getDateCode(date),
      })
      return res
    }, {}))

  return (
    <Base>
      <Header
        navigation={navigation}
        type={HeaderType.Back}
        customHandler={() => {
          navigation.navigate('home', { date, type, enabledPeriod })
        }}
      >
        <Text style={{
          ...styles.tAlignCenter,
          ...styles.whiteText,
          fontSize: 20
        }}>{category.name}</Text>
        <Text style={{
          ...styles.tAlignCenter,
          ...styles.whiteText,
          fontSize: 22
        }}>{category.sum} {currencyCharacter}</Text>
      </Header>
      <ScrollView>
        <View style={styles.alignCenter}>
          {loadingOperations && <View style={{ marginTop: 10, ...styles.rowAlignHCenter }}>
              <ActivityIndicator size="large" color="#007aff" />
              <Text style={{ marginLeft: 10 }}>Загрузка</Text>
          </View>}
          {!loadingOperations && computedOperations.map(e => <View
            key={e.code}
            style={{ width: '100%', padding: 15 }}
          >
            <Text
              style={{ color: '#999999', marginLeft: 10 }}
            >{e.name}</Text>
            <View
              style={{...styles.bottomContainer, width: '100%', paddingLeft: 0, paddingRight: 0, ...styles.columnAlignHCenter}}
            >
              <List
                items={e.items}
                key="accounts"
                containerStyles={{width: '100%' }}
                currencyCharacter={currencyCharacter}
                onInput={(item) => {
                  navigation.navigate('createOperation', {
                    typeCode: type,
                    categoryId,
                    id: item.id,
                    comment: item.comment,
                    date: item.date,
                    accountId: item.accountId,
                    sum: item.sum,
                  })
                }}
              />
            </View>
          </View>)}
        </View>
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
            navigation.navigate('createOperation', { categoryId, typeCode: type })
          }}
        >Добавить</Text>
      </View>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});