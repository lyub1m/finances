import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet} from "react-native";
import { DonutChart } from "react-native-circular-chart";
import Base from './Base'
import globalStyles from '../global-styles'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {getAccounts, getOperations} from "../api";
import {formatDate, formatMonth, getDateCode} from "../utils/date";
import {AxiosContext} from "../context/AxiosContext";
import {AuthContext} from "../context/AuthContext";
import CalendarModal from "../components/CalendarModal";
import Header from "../components/Header";
import OperationTypeTabs from "../components/OperationTypeTabs";
import {OperationType} from "../constants/operation";
import List from "../components/List";



const getPeriods = () => {
  const curDate = new Date()
  const mondayDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - curDate.getDay() + (curDate.getDay() == 0 ? -6 : 1), 0, 0, 0)
  const sundayDate = new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + 7, 0, 0, -1)
  return [
    {
      code: 'day', text: 'День', description: formatDate(),
      from: getDateCode(new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate())),
      to: getDateCode(new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()))
    },
    {
      code: 'week', text: 'Неделя', description: `${formatDate(mondayDate)} - ${formatDate(sundayDate)}`,
      from: getDateCode(mondayDate),
      to: getDateCode(sundayDate)
    },
    {
      code: 'month', text: 'Месяц', description: `${formatMonth(curDate.getMonth())}`,
      from: getDateCode(new Date(curDate.getFullYear(), curDate.getMonth(), 1, 0,0,0)),
      to: getDateCode(new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1, 0,0,-1))
    },
    {
      code: 'year', text: 'Год', description: curDate.getFullYear(),
      from: getDateCode(new Date(curDate.getFullYear(), 0, 1, 0,0,0)),
      to: getDateCode(new Date(curDate.getFullYear() + 1, 0, 1, 0,0,-1))
    },
    {
      code: 'period', text: 'Период', description: 'Прикрутить выбор периода',
      from: getDateCode(new Date(curDate.getFullYear(), 0, 1, 0,0,0)),
      to: getDateCode(new Date(curDate.getFullYear() + 1, 0, 1, 0,0,-1))
    },
  ]
}

export default function HomeScreen({ state, navigation, route }) {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const periods = getPeriods()
  const { params: routeParams } = route

  const { type: typeFromRoute = OperationType.Out } = routeParams || {}

  const [type, setType] = useState(typeFromRoute);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [customPeriod, setCustomPeriod] = useState(routeParams?.date ? Object.values(routeParams?.date) : null);
  const customPeriodText = (customPeriod || [])
    .map(e => formatDate(new Date(e))).join(' - ')
  const [loadingOperations, setLoadingOperations] = useState(false);
  const [enabledPeriod, setEnabledPeriod] = useState(routeParams?.enabledPeriod || 'week');
  const [operations, setOperations] = useState([]);
  const currentPeriod = periods.find(e => e.code === enabledPeriod)
  const filter = {
    dateFrom: enabledPeriod !== 'period' ? currentPeriod?.from : customPeriod[0],
    dateTo: enabledPeriod !== 'period' ? currentPeriod?.to : (customPeriod[1] || customPeriod[0]),
    type,
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
  const updateAccounts = () => {
    getAccounts(axiosContext)
      .then(data => {
        authContext.setAuthState({
          globalTotal: data.reduce((sum, e) => sum + e.sum * (e.currencyInfo?.rate || 1), 0),
        })
      })
      .catch(e => console.error(e))
  }
  useEffect(() => {

    updateOperations(filter)
  }, [enabledPeriod, type]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateOperations(filter)
      updateAccounts()
    });
    return unsubscribe;
  }, [navigation]);

  const {
    currencyCharacter = '',
  } = state

  const result = {}

  operations.forEach(operation => {
    if (!result[operation.categoryId]) {
      result[operation.categoryId] = {
        name: operation?.category.name,
        sum: operation.sum * (operation.account?.currencyInfo?.rate || 1),
        currencyInfo: { character: currencyCharacter },
        color: operation?.category.color,
        icon: operation?.category.icon,
        categoryId: operation.categoryId,
      }
      return
    }
    result[operation.categoryId].sum += operation.sum
  })
  let graph = Object.values(result)
  const fullSumCurrentOperations = graph.reduce((sum, e) => sum + e.sum * (e.currencyInfo?.rate || 1), 0)

  graph = graph.map(e => {
    const value = Math.floor((100 * e.sum) / fullSumCurrentOperations) || 1
    return {
      ...e,
      value,
      subRight: `${value}%`
    }
  })

  if (!graph?.length) {
    graph = [{ color: '#999999', value: 1 }, { color: '#999999', value: 1 }]
  }

  const sumAccounts = authContext.authState.globalTotal
  return (
    <Base>
      <Header
        titleText={`Итого: ${new Intl.NumberFormat().format(sumAccounts)} ${currencyCharacter}`}
        navigation={navigation}
      />
      <View style={styles.top} ></View>
      <View style={styles.middleContainer} >
        <OperationTypeTabs
          value={type}
          onInput={(payload) => { setType(payload) }}
        />
        <View
          style={styles.middleContent}
        >
          <View style={{ height: 60, paddingTop: 20, ...styles.rowAlignWCenter }}>
            {periods.map((e, i) =>
              <View
                key={`${JSON.stringify(e)}-${i}`}
                style={{
                  ...e.code === enabledPeriod && { borderBottomWidth: 2, borderBottomColor: 'green'},
                  height: 25,
                  ...i !== periods.length - 1 && { marginRight: 15 }
              }}

              >
                <Text
                  style={{ fontSize: 15, color: e.code === enabledPeriod && 'green' || 'white' }}
                  onPress={() => {
                    if (e.code === 'period') {
                      setCalendarModalVisible(true)
                      return;
                    }
                    setEnabledPeriod(e.code)
                  }}
                >{e.text}</Text>
              </View>
            )}
          </View>
          <CalendarModal
            visible={calendarModalVisible}
            onClose={() => setCalendarModalVisible(false)}
            onChange={(payload) => {
              setCustomPeriod(payload)
              setEnabledPeriod('period')
            }}
          />
          <View style={{ height: 35, ...styles.rowAlignWCenter }}>
            {currentPeriod && currentPeriod.description
              && <Text
                style={{ color: 'white', ...styles.tWhiteUnderline }}
              >
                {enabledPeriod !== 'period' ? currentPeriod.description : customPeriodText}
                </Text> || ''
            }
          </View>
          <View style={{ width: '100%', ...styles.alignCenter}}>
            {(!loadingOperations && graph && graph.length && <DonutChart
                key={`graph-${type}-${enabledPeriod}-${graph?.length}`}
                data={graph.concat(graph?.length === 1 ? [graph[0]] : [])}
                strokeWidth={25}
                radius={90}
                containerWidth={210}
                containerHeight={105 * 2}
                type="butt"
                startAngle={0}
                endAngle={360}
            />) || <View style={{width: 210, height: 210}}/>}
            <View style={{
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
            }}>
              <View
                style={{
                  ...styles.alignCenter,
                  marginTop: -60,
                  backgroundColor: '#165738',
                  width: 55,
                  borderRadius: 30
                }}
              >
                <MaterialCommunityIcons
                  style={{
                    padding: 15
                  }}
                  name="plus"
                  size={24}
                  color="white"
                  onPress={() => {
                    navigation.navigate('createOperation')
                  }}
                />
              </View>
            </View>
            <View style={{
              ...styles.alignCenter,
              ...styles.borderDash1,
              padding: 25,
              marginTop: -175,
              backgroundColor: '#262626',
              height: 142,
              width: 142,
              borderColor: '#999999',
              borderRadius: 100
            }}>
              {!loadingOperations && fullSumCurrentOperations && <Text
                  style={{fontSize: 24, color: 'white'}}
              >{fullSumCurrentOperations} {currencyCharacter}</Text> || ''}
              {(loadingOperations && <Text style={styles.tAlignCenter}>Загрузка</Text>) || ''}
              {(!loadingOperations && !fullSumCurrentOperations && type === 'in' && <Text style={styles.tAlignCenter}>На выбранный перод доходов нет</Text>) || ''}
              {(!loadingOperations && !fullSumCurrentOperations && type === 'out' && <Text style={styles.tAlignCenter}>На выбранный перод расходов нет</Text>) || ''}
            </View>
          </View>
        </View>
        {fullSumCurrentOperations ? <List
          items={graph}
          key="home-operations"
          containerStyles={{width: '100%', paddingLeft: 10, paddingRight: 10 }}
          currencyCharacter={currencyCharacter}
          onInput={(item) => {
            navigation.navigate(
              'categoryOperationsDetail',
              {
                category: {
                  sum: item.sum,
                  name: item.name,
                },
                categoryId: item.categoryId,
                date: enabledPeriod !== 'period' ? currentPeriod : {
                  from: customPeriod[0],
                  to: customPeriod[1] || customPeriod[0],
                },
                enabledPeriod,
                type,
              }
            )
          }}
        /> : ''}
      </View>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
  middleContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginTop: -75
  },
  middleContent: {
    height: 320,
    backgroundColor: '#262626',
    width: '90%',
    borderRadius: 20,
  },
  buttonContainer: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  buttonEnabledContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  }
});