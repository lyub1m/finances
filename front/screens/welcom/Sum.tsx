import {
  View,
  Text,
  StyleSheet, TextInput, Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Base from '../Base'
import globalStyles from "../../global-styles";
import {createAccount} from "../../api";
import {AxiosContext} from "../../context/AxiosContext";
import {AuthContext} from "../../context/AuthContext";

const Sum = ({ route }) => {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const { params: routeParams } = route || {};
  const { currency } = routeParams || {};
  const [sum, setSum] = useState('');
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
          style={{ color: '#999999', fontSize: 22, marginTop: 30, ...styles.tAlignCenter }}
        >Введите отстаток на основном счете</Text>
        <Text
          style={{ color: '#999999', fontSize: 15, marginTop: 10, ...styles.tAlignCenter }}
        >Вы сможете добавить дополнительные счета в разделе "Счета"</Text>
        <View style={{marginTop: 30, ...styles.rowAlignWCenter}}>
          <TextInput
            value={sum}
            placeholder={'0'}
            keyboardType="numeric"
            style={{ width: 100, ...styles.input, fontSize: 24, ...styles.tAlignCenter }}
            onChangeText={e => setSum(e)}
          />
          <Text
            style={{ color: '#165738', fontSize: 24, marginLeft: 5, ...styles.tAlignCenter }}
          >{currency}</Text>
        </View>
        <View style={{ marginTop: 300, height: 30, ...styles.alignCenter, }}>
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
            onPress={async () => {
              try {
                await createAccount(axiosContext, {
                  sum,
                  currency,
                  name: 'Основной',
                  color: '#FFE64D',
                  icon: 'home',
                  isDefault: true,
                })
                authContext.setAuthState({
                  first: false,
                })
              } catch (e) {
                Alert.alert('Произошла ошибка, попробуйте позже', e.response?.data.message || e?.message || JSON.stringify(e));
                return;
              }
            }}
          >Далее</Text>
        </View>
      </View>
    </Base>
  );
};

const styles = StyleSheet.create({
  ...globalStyles,
});

export default Sum;