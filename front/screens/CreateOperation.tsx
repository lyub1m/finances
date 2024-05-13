import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  ActivityIndicator, Alert
} from "react-native";
import Base from './Base'
import {useContext, useEffect, useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {formatDate, getDateCode} from "../utils/date";
import globalStyles from '../global-styles'
import {
  createOperation,
  deleteCategory,
  deleteOperation,
  getAccounts,
  getCategories,
  updateAccount,
  updateOperation
} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import CalendarModal from "../components/CalendarModal";
import {HeaderType} from "../constants/header";
import Header from "../components/Header";
import OperationTypeTabs from "../components/OperationTypeTabs";
import {OperationType} from "../constants/operation";
import Select from "../components/Select";

export default function CreateOperationScreen({ state, setGlobalState, navigation, route }) {
  const axiosContext = useContext(AxiosContext);
  const { currency: currencyCode } = state;
  const { params: routeParams } = route || {}
  const {
    categoryId = null,
    accountId = null,
    typeCode = OperationType.Out,
    id = null,
    comment: routeComment = '',
    sum: routeSum = '',
    date: dateCode,
  } = routeParams || {}
  const [accountModalVisible, setAccountModalVisible] = useState(() => false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [type, setType] = useState(typeCode);
  const [comment, setComment] = useState(routeComment);
  const [sum, setSum] = useState((): string => String(routeSum || ''));
  const [category, setCategory] = useState(() => categoryId);
  const [categories, setCategories] = useState(() => []);
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
  const currentDate = new Date()
  const [date, setDate] = useState(() => getDateCode(new Date(dateCode)));
  const t = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1)
  const tt = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2)
  const exampleDates = [
    { title: 'Сегодня', code: formatDate(currentDate, false), date: getDateCode(currentDate) },
    { title: 'Вчера', code: formatDate(t, false), date: getDateCode(t) },
    { title: 'Позавчера', code: formatDate(tt, false), date: getDateCode(tt) },
  ]
  const accountInfo = accounts.find(e => e.id === account) || {}

  const isValid = !!(type && parseInt(sum) && category && account && date)
  return (
    <Base>
      <Header
        titleText={id ? 'Редактирование операции' : 'Добавление операции'}
        navigation={navigation}
        type={HeaderType.Back}
      />
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.top} ></View>
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
        <View style={{ marginTop: 30, paddingLeft: 10 }}>
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
          containerStyles={{  marginTop: 25, paddingLeft: 10  }}
          onInput={(payload) => {
            if (payload === 'category-add') {
              navigation.navigate('createCategory')
              return
            }
            setCategory(payload)
          }}
        /> : ''}
        <ScrollView horizontal>
          <View style={{ marginTop: 30, paddingLeft: 10, ...styles.rowAlignHCenter }}>
            {exampleDates
              .concat(exampleDates.find(e => e.date === date) ? [] : [{ title: 'Выбранная', code: formatDate(new Date(date), false), date }])
              .map(e =>
              <View
                key={`date-${e.date}`}
                style={{borderRadius: 10, padding: 10, ...styles.columnAlignHCenter, ...date === e.date && { backgroundColor: '#165738' } }}
                onTouchEnd={() => setDate(e.date)}
              >
                <Text style={{ color: '#c7bfbf', fontSize: 14 }}>{e.code}</Text>
                <Text style={{ color: '#c7bfbf', fontSize: 13 }}>{e.title}</Text>
              </View>
            )}
            <View
              key={`date-add`}
              style={{borderRadius: 10, padding: 10, ...styles.columnAlignHCenter }}
              onTouchEnd={() => setCalendarModalVisible(true)}
            >
              <MaterialCommunityIcons color={'#c7bfbf'} size={40} name={'calendar-month-outline'}/>
            </View>
          </View>
          <CalendarModal
            visible={calendarModalVisible}
            maxDate={getDateCode(currentDate)}
            onClose={() => setCalendarModalVisible(false)}
            onPressDay={({ dateString }) => {
              setDate(dateString)
              setCalendarModalVisible(false)
            }}
            onChange={() => {}}
          />
        </ScrollView>
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
              createdAt: date,
            }
            try {
              if (id) {
                await updateOperation(axiosContext, fields, id)
              } else {
                await createOperation(axiosContext, fields)
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
              Alert.alert('Удалить операцию?', '', [
                {
                  text: 'Нет',
                  style: 'cancel',
                },
                {
                  text: 'Да',
                  onPress: async () => {
                    await deleteOperation(axiosContext, id)
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
  top: {
    ...globalStyles.top,
    height: 57,
  },
});