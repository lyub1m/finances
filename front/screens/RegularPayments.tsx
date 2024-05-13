import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Base from './Base'
import globalStyles from "../global-styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {HeaderType} from "../constants/header";
import Header from "../components/Header";
import {useContext, useEffect, useState} from "react";
import {AxiosContext} from "../context/AxiosContext";
import {getNotifications, getRegularPayments, updateRegularPayment} from "../api";
import List from "../components/List";

export default function RegularPaymentsScreen({ navigation, state = {} }) {
  const { currencyCharacter } = state
  const axiosContext = useContext(AxiosContext);
  const [regularPayments, setRegularPayments] = useState([]);
  const [loading, setLoading] = useState(() => false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true)
      getRegularPayments(axiosContext)
        .then(data => setRegularPayments(data))
        .catch(e => console.error(e))
        .finally(() => {
          setLoading(false)
        })
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Base>
      <Header
        titleText="Регулярные платежи"
        navigation={navigation}
      />
      <ScrollView>
        {regularPayments?.length ? <List
          key={`regular-payments`}
          currencyCharacter={currencyCharacter}
          items={regularPayments.map(e => ({
            id: e.id,
            name: e.name,
            period: e.period,
            sum: e.sum,
            time: e.time,
            startDate: e.dateStart,
            endDate: e.dateEnd,
            type: e.category.type,
            categoryId: e.categoryId,
            accountId: e.accountId,
            isEnabled: e.isEnabled,
            icon: e.category.icon,
            color: e.category.color,
            subName: e.account.name,
            currencyInfo: e.account.currencyInfo,
            subInfo: e.comment,
            rightIcon: e.isEnabled ? 'toggle-switch-outline' : 'toggle-switch-off-outline'
          }))}
          onInput={(item) => {
            console.log('onInput item >>>>>>>>>>>>>>>>>', item);
            const d = new Date()
            const [h, m] = item.time.split(':')
            d.setHours(Number(h))
            d.setMinutes(Number(m))
            const params = {
              categoryId: item.categoryId,
              accountId: item.accountId,
              startDate: item.startDate,
              endDate: item.endDate,
              name: item.name,
              sum: item.sum,
              typeCode: item.type,
              id: item.id,
              comment: item.subInfo,
              time: d.getTime(),
              period: item.period,
            }
            navigation.navigate('createRegularPayment', params)
          }}
          onRightIconClick={(item) => {
            updateRegularPayment(axiosContext, { isEnabled: !item.isEnabled }, item.id)
              .then(() => {
                getRegularPayments(axiosContext)
                  .then(data => setRegularPayments(data))
                  .catch(e => console.error(e))
              })
              .catch(e => console.error(e))
          }}
        /> : ''}
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
            navigation.navigate('createRegularPayment')
          }}
        >Добавить</Text>
      </View>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});