import * as React from 'react';
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Base from './Base'
import globalStyles from "../global-styles";
import Header from "../components/Header";
import {useContext, useEffect, useState} from "react";
import {getNotifications, getUnreadNotificationsCount, updateNotification} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import List from "../components/List";
import {formatDate} from "../utils/date";

export default function ({ navigation }) {
  const axiosContext = useContext(AxiosContext);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(() => false);
  useEffect(() => {
    const timer = setInterval(() => {
      getNotifications(axiosContext)
        .then(data => setNotifications(data))
        .catch(e => {
          console.error(e)
          clearInterval(timer)
        })
    }, 5000);
    return () => clearInterval(timer);
  });
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoadingNotifications(true)
      getNotifications(axiosContext)
        .then(data => setNotifications(data))
        .catch(e => console.error(e))
        .finally(() => {
          setLoadingNotifications(false)
        })
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <Base>
      <Header
        titleText="Уведомления"
        navigation={navigation}
      />
      <ScrollView>
        {notifications?.length ? <List
          items={notifications.map(e => ({
            ...e,
            name: (e.message || '').split('.')[0],
            subName: (e.message || '').split('.')[1],
            icon: e.isRead ? 'email-open' : 'email',
            colorText: e.isRead ? '#999999' : 'white',
            subInfo: formatDate(new Date(e.createdAt), true, true),
          }))}
          key="notifications"
          onInput={(item) => {
            updateNotification(axiosContext, { isRead: true }, item.id)
              .then(data => {
                getNotifications(axiosContext)
                  .then(data => setNotifications(data))
                  .catch(e => console.error(e))
                  .finally(() => {
                    setLoadingNotifications(false)
                  })
              })
              .catch(e => console.error(e))
          }}
        /> : ''}
      </ScrollView>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});