import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from '../global-styles'
import {useContext, useEffect, useState} from "react";
import {AxiosContext} from "../context/AxiosContext";
import {
  createRegularPayment, deleteRegularPayment,
  getAccounts,
  getCategories,
  updateRegularPayment
} from "../api";
import {HeaderType} from "../constants/header";
import Header from "../components/Header";
import {OperationType, operationTypes} from "../constants/operation";
import Select from "../components/Select";
import OperationTypeTabs from "../components/OperationTypeTabs";
import {formatDate, formatTime, getDateCode} from "../utils/date";
import CalendarModal from "../components/CalendarModal";

const periods = [
  { code: 'one', name: 'Один раз' },
  { code: 'day', name: 'Каждый день' },
  { code: 'week', name: 'Каждую неделю' },
  { code: 'twoWeek', name: 'Каждые 2 недели' },
  { code: 'month', name: 'Каждый месяц' },
  { code: 'twoMonth', name: 'Каждые 2 месяца' },
  { code: 'fourMonths', name: 'Каждый квартал' },
  { code: 'sixMonths', name: 'Каждые пол года' },
  { code: 'year', name: 'Каждыей год' },
]

export default function createRegularPaymentScreen({ navigation, route = {}, state }) {
  const axiosContext = useContext(AxiosContext);
  const { currency: currencyCode } = state;
  const { params: routeParams } = route || {}
  const {
    categoryId = null,
    accountId = null,
    typeCode = OperationType.Out,
    id = null,
    comment: routeComment = '',
    name: routeName = '',
    time: routeTime = Date.now(),
    period: routePeriod = 'month',
    startDate: routeStartDate,
    endDate: routeEndDate,
    sum: routeSum = '',
  } = routeParams || {}
  const [periodModalVisible, setPeriodModalVisible] = useState(() => false);
  const [timeModalVisible, setTimeModalVisible] = useState(() => false);
  const [accountModalVisible, setAccountModalVisible] = useState(() => false);
  const [calendarModalStartDateVisible, setCalendarModalStartDateVisible] = useState(false);
  const [calendarModalEndDateVisible, setCalendarModalEndDateVisible] = useState(false);
  const [startDate, setStartDate] = useState(routeStartDate ? new Date(routeStartDate) : new Date());
  const [endDate, setEndDate] = useState(routeEndDate ? new Date(routeEndDate) : undefined);

  const [type, setType] = useState(typeCode);
  const [time, setTime] = useState(routeTime);
  const [name, setName] = useState(routeName);
  const [period, setPeriod] = useState(routePeriod);
  const [comment, setComment] = useState(routeComment);
  const [sum, setSum] = useState((): string => String(routeSum || ''));
  const [categories, setCategories] = useState(() => []);
  const [category, setCategory] = useState(() => categoryId || categories[0]?.id);
  const [loadingCategories, setLoadingCategories] = useState(() => false);
  const [accounts, setAccounts] = useState(() => []);
  const [account, setAccount] = useState(() => accountId || accounts[0]?.id);
  const [loadingAccounts, setLoadingAccounts] = useState(() => false);
  useEffect(() => {
    if (!account && accounts.length) {
      setAccount(accounts[0]?.id)
    }
  }, [accounts]);
  const updateCategories = (type) => {
    setLoadingCategories(true)
    getCategories(axiosContext, {
      type,
    })
      .then(data => setCategories(data))
      .catch(e => console.error(e))
      .finally(() => {
        setLoadingCategories(false)
      })
  }

  useEffect(() => {
    setLoadingAccounts(true)
    getAccounts(axiosContext)
      .then(data => setAccounts(data))
      .catch(e => console.error(e))
      .finally(() => {
        setLoadingAccounts(false)
      })
    updateCategories(type)
  }, [type]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateCategories(type)
    });
    return unsubscribe;
  }, [navigation]);
  const accountInfo = accounts.find(e => e.id === account) || {}
  console.log('name && type && parseInt(sum) && category && account && time && period && startDate >>>>>>>>>>>>>>>>>', name, type, parseInt(sum), category, account, time, period, startDate);

  const isValid = !!(name && type && parseInt(sum) && category && account && time && period && startDate)
  return (
    <Base>
      <Header
        titleText={id ? 'Редактирование регулярного платежа' : 'Добавление регулярного платежа'}
        navigation={navigation}
        type={HeaderType.Back}
      />
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View style={{...styles.top, height: 40}} ></View>
        <View style={styles.middleContainer} >
          <OperationTypeTabs
            value={type}
            onInput={(payload) => { setType(payload) }}
          />
        </View>
        <View style={{marginTop: 30, ...styles.rowAlignWCenter}}>
          <TextInput
            value={sum}
            keyboardType="numeric"
            style={{ width: 100, ...styles.input, fontSize: 24, ...styles.tAlignCenter }}
            onChangeText={e => setSum(e)}
          />
          <Text
            style={{ color: '#165738', fontSize: 24, marginLeft: 5, ...styles.tAlignCenter }}
          >{accountInfo?.currency || currencyCode}</Text>
        </View>
        <View style={{ marginTop: 15, width: '100%', paddingLeft: 10, paddingRight: 10}}>
          <TextInput
            value={name}
            placeholder={'Название регулярного платежа'}
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
        <View style={{ marginTop: 15, paddingLeft: 10 }}>
          <Text
            style={{ color: '#999999' }}
          >Периодичность платежа</Text>
          <Text
            style={{ fontSize: 15, color: '#165738' }}
            onPress={() => setPeriodModalVisible(true)}
          >{periods.find(e => e.code === period)?.name}</Text>
        </View>
        <View style={{ marginTop: 15, paddingLeft: 10 }}>
          <Text
            style={{ color: '#999999' }}
          >Дата начала платежа</Text>
          <Text
            style={{ fontSize: 15, color: '#165738' }}
            onPress={() => setCalendarModalStartDateVisible(true)}
          >{formatDate(startDate)}</Text>
          <CalendarModal
            key="create-regular-payment-period-start"
            visible={calendarModalStartDateVisible}
            markingType="dot"
            onClose={() => setCalendarModalStartDateVisible(false)}
            onPressDay={({ dateString }) => {
              setStartDate(new Date(dateString))
              setCalendarModalStartDateVisible(false)
            }}
            onChange={() => {}}
          />
        </View>
        <View style={{ marginTop: 15, paddingLeft: 10 }}>
          <Text
            style={{ color: '#999999' }}
          >Время</Text>
          <Text
            style={{ fontSize: 15, color: '#165738' }}
            onPress={() => setTimeModalVisible(true)}
          >{formatTime(new Date(time))}</Text>
          {timeModalVisible && <DateTimePicker
              testID="dateTimePicker"
              value={new Date(time)}
              mode="time"
              positiveButton={{label: 'OK', textColor: '#165738'}}
              negativeButton={{label: 'ОТМЕНА', textColor: '#165738'}}
              style={{backgroundColor: '#363636'}}
              display="spinner"
              is24Hour={true}
              onChange={({ nativeEvent: { timestamp } }) => {
                setTime(timestamp)
                setTimeModalVisible(false)
              }}
          />}
        </View>
        <View style={{ marginTop: 15, paddingLeft: 10 }}>
          <Text
            style={{ color: '#999999' }}
          >Дата окончания платежа</Text>
          <Text
            style={{ fontSize: 15, color: '#165738' }}
            onPress={() => setCalendarModalEndDateVisible(true)}
          >{endDate ? formatDate(endDate) : 'Не выбрано'}</Text>
          <CalendarModal
            key="create-regular-payment-period-end"
            visible={calendarModalEndDateVisible}
            markingType="dot"
            minDate={getDateCode(new Date())}
            onClose={() => setCalendarModalEndDateVisible(false)}
            onPressDay={({ dateString }) => {
              setEndDate(new Date(dateString))
              setCalendarModalEndDateVisible(false)
            }}
            onChange={(payload) => {
            }}
          />
        </View>
        <View style={{ marginTop: 15, paddingLeft: 10 }}>
          <Text
            style={{ color: '#999999' }}
          >Счет</Text>
          <Text
            style={{ fontSize: 15, color: '#165738' }}
            onPress={() => setAccountModalVisible(true)}
          >{accounts.find(e => e.id === account)?.name}</Text>
        </View>
        {categories?.length ? <Select
          key="category"
          items={categories.map(e => ({ ...e, code: e.id, text: e.name })).concat({
            code: 'category-add',
            color: 'gray',
            icon: 'plus',
            text: 'Добавить',
            noSelectable: true,
          })}
          value={category}
          loading={loadingCategories}
          title="Категория"
          containerStyles={{  marginTop: 15, paddingLeft: 10  }}
          onInput={(payload) => {
            if (payload === 'category-add') {
              navigation.navigate('createCategory')
              return
            }
            setCategory(payload)
          }}
        /> : ''}
        <View style={{ marginTop: 30, paddingLeft: 10, paddingRight: 10 }}>
          <Text
            style={{ color: '#999999' }}
          >Комментарий</Text>
          <TextInput
            value={comment}
            placeholder="Комментарий"
            placeholderTextColor='#99999989'
            maxLength={100}
            multiline={true}
            style={{ ...styles.input, fontSize: 15 }}
            onChangeText={(e) => {setComment(e)}}
          />
          <Text
            style={{color: '#99999989'}}
          >{comment ? comment.length : 0}/{100}</Text>
        </View>
        <Modal
          visible={accountModalVisible}
          transparent={true}
          onRequestClose={() => {
            setAccountModalVisible(!accountModalVisible);
          }}
        >
          <Pressable
            style={{
              flex: 1,
              ...styles.alignCenter,
              marginTop: 22,
            }}
            onPress={() => setAccountModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: '90%',
                  height: '60%',
                  margin: 20,
                  backgroundColor: '#363636',
                  borderRadius: 20,
                  padding: 35,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  ...styles.alignEndBetween,
                }}
              >
                <View
                  style={{width: '100%'}}
                >
                  <Text
                    style={{ color: 'white', fontSize: 24, marginBottom: 30 }}
                  >Выберите счет</Text>
                  {accounts.map(e =>
                    <View
                      key={`radio-${JSON.stringify(e)}`}
                      style={{marginLeft: 10, marginBottom: 10, ...styles.rowAlignHCenter}}
                      onTouchEnd={() => {
                        setAccount(e.id)
                        setAccountModalVisible(false)
                      }}
                    >
                      <MaterialCommunityIcons
                        name={account === e.id ? 'radiobox-marked' : 'radiobox-blank'}
                        color='#165738'
                        size={25}
                        style={{marginRight: 15}}
                      />
                      <View style={styles.rowAlignHCenter}>
                        <View
                          style={{ width: 40, height: 40, backgroundColor: e.color, borderRadius: 30, ...styles.alignCenter }}
                        >
                          <MaterialCommunityIcons
                            name={e.icon}
                            size={25}
                            color="white"
                          />
                        </View>
                        <View style={{marginLeft: 15}} >
                          <Text style={{color: 'white', fontSize: 20}}>{e.name}</Text>
                          <Text style={{color: '#999999', fontSize: 16}}>{e.sum}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    width: 70,
                    color: '#165738',
                    fontSize: 14,
                  }}
                  onPress={() => setAccountModalVisible(false)}
                >ОТМЕНА</Text>
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
        <Modal
          visible={periodModalVisible}
          transparent={true}
          onRequestClose={() => {
            setPeriodModalVisible(!periodModalVisible);
          }}
        >
          <Pressable
            style={{
              flex: 1,
              ...styles.alignCenter,
              marginTop: 22,
            }}
            onPress={() => setPeriodModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: '90%',
                  height: '60%',
                  margin: 20,
                  backgroundColor: '#363636',
                  borderRadius: 20,
                  padding: 35,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  ...styles.alignEndBetween,
                }}
              >
                <View
                  style={{width: '100%'}}
                >
                  <Text
                    style={{ color: 'white', fontSize: 24, marginBottom: 30 }}
                  >Выберите период</Text>
                  {periods.map(e =>
                    <View
                      key={`radio-${JSON.stringify(e)}`}
                      style={{marginLeft: 10, marginBottom: 10, ...styles.rowAlignHCenter}}
                      onTouchEnd={() => {
                        setPeriod(e.code)
                        setPeriodModalVisible(false)
                      }}
                    >
                      <MaterialCommunityIcons
                        name={periods === e.code ? 'radiobox-marked' : 'radiobox-blank'}
                        color='#165738'
                        size={25}
                        style={{marginRight: 5}}
                      />
                      <View style={styles.rowAlignHCenter}>
                        <View >
                          <Text style={{color: '#999999', fontSize: 16}}>{e.name}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    width: 70,
                    color: '#165738',
                    fontSize: 14,
                  }}
                  onPress={() => setPeriodModalVisible(false)}
                >ОТМЕНА</Text>
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Modal>
      </ScrollView>
      <View style={{ marginBottom: 15, height: 30, ...styles.alignCenter, ...styles.rowAlignHCenter }}>
        <Text
          style={{
            marginTop: -45,
            height: 45,
            ...!isValid && { opacity: 0.5 },
            width: 200,
            backgroundColor: 'grey',
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
              categoryId: category,
              accountId: account,
              comment,
              periodCode: period,
              name,
              time: formatTime(new Date(time), 3),
              dateStart: startDate,
            }
            if (endDate) {
              fields.dateEnd = endDate
            }
            try {
              if (id) {
                await updateRegularPayment(axiosContext, fields, id)
              } else {
                await createRegularPayment(axiosContext, fields)
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
        >{ id ? 'Сохранить' : 'Добавить' }</Text>
        {id && <Text
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
              Alert.alert('Удалить регулярный платеж?', '', [
                {
                  text: 'Нет',
                  style: 'cancel',
                },
                {
                  text: 'Да',
                  onPress: async () => {
                    await deleteRegularPayment(axiosContext, id)
                    navigation.goBack()
                  }
                }
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