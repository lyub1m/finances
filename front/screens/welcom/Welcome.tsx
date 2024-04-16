import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React from 'react';
import Base from '../Base'
import globalStyles from "../../global-styles";

const Auth = ({ navigation }) => {
  return (
    <Base>
      <View style={{
        height: 30,
        width: '100%',
        backgroundColor: '#165738',
        paddingTop: 20,
        ...styles.rowAlignHCenter
      }}/>
      <View style={{ padding: 20, ...styles.alignCenter }}>
        <Text
          style={{ color: '#999999', fontSize: 22, marginTop: 100 }}
        >Добро пожаловать!</Text>
        <Text
          style={{ color: '#999999', fontSize: 18, marginTop: 10, ...styles.tAlignCenter }}
        >Цель приложения - простой учет доходов и расходов</Text>
        <View style={{ marginTop: 15, height: 30, ...styles.alignCenter, }}>
          <Text
            style={{
              marginTop: 600,
              height: 45,
              width: 200,
              backgroundColor: 'grey',
              padding: 10,
              borderRadius: 30,
              ...styles.tAlignCenter,
            }}
            onPress={() => navigation.navigate('defaultCurrency')}
          >Начать</Text>
        </View>
      </View>
    </Base>
  );
};

const styles = StyleSheet.create({
  ...globalStyles,
});

export default Auth;