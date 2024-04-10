import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {formatDate, getDateCode} from "../utils/date";
import globalStyles from '../global-styles'
import {useContext, useEffect, useState} from "react";
import {getCategories, getOperations} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import {AuthContext} from "../context/AuthContext";

export default function categoryOperationsDetailScreen({ state, navigation, route = {} }) {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const { params: routeParams = {} } = route
  const { category = {
    sum: 0,
    name: '',
  }, date = null, type, categoryId } = routeParams
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
      res[code].items.push(i)
      return res
    }, {}))

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
          name="arrow-left"
          size={23}
          color="white"
          style={{ marginLeft:20 }}
          onPress={() => {
            navigation.goBack()
          }}
        />
        <View style={{ width: '80%', ...styles.alignCenter }}>
          <View>
            <Text style={{
              ...styles.tAlignCenter,
              fontSize: 20
            }}>{category.name}</Text>
            <Text style={{
              ...styles.tAlignCenter,
              fontSize: 22
            }}>{category.sum} {currencyCharacter}</Text>
          </View>
        </View>
      </View>
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
              style={{...styles.bottomContainer, width: '100%', ...styles.columnAlignHCenter}}
            >
              {e.items.map((o, i) => <View
                key={`category-operations-detail-${e.code}-${i}`}
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                <View
                  style={{
                    width: '100%',
                    ...styles.rowAlignHCenter,
                    ...styles.alignCenterBetween,
                    borderTopColor: '#999999',
                    ...i !== 0 && { borderTopWidth: 1 }
                  }}
                >
                  <View style={styles.rowAlignHCenter}>
                    <View style={{
                      ...styles.icon,
                      ...styles.alignCenter,
                      backgroundColor: o?.category.color,
                      marginRight: 10
                    }}>
                      {(o?.category.icon && <MaterialCommunityIcons
                          name={o?.category.icon}
                          size={23}
                          color="white"
                      />)}
                    </View>
                    <View>
                      <Text>{o?.category.name}</Text>
                      <Text style={{ color: '#999999' }}>{o?.account?.name}</Text>
                    </View>
                  </View>
                  <Text>{o.sum} {currencyCharacter}</Text>
                </View>
                {o.comment && <Text style={{ color: '#999999', fontSize: 12 }}>{o.comment}</Text>}
              </View>)}
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