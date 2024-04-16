import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import {AxiosContext} from '../context/AxiosContext';
import Base from './Base'
import globalStyles from "../global-styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordReply, setPasswordReply] = useState('');
  const [hidePasswordReply, setHidePasswordReply] = useState(true);
  const authContext = useContext(AuthContext);
  const {publicAxios} = useContext(AxiosContext);
  const brokenPassword = password && passwordReply && password !== passwordReply

  const onRegister = async () => {
    try {

      const response = await publicAxios.post('auth/register', {
        username: login,
        password,
        name,
      });

      const {accessToken, refreshToken} = response.data;

      authContext.setAuthState({
        accessToken,
        refreshToken: refreshToken || accessToken,
        authenticated: true,
      });

      await SecureStore.setItemAsync(
        'token',
        JSON.stringify({
          accessToken,
          refreshToken: refreshToken || accessToken,
        }),
      );
    } catch (error) {
      Alert.alert('Ошибка', error.response?.data.message || error?.message || JSON.stringify(error));
    }
  };

  const isValid = !!(name && login && password && passwordReply) && !brokenPassword

  return (
    <Base>
      <View style={{
        height: 100,
        width: '100%',
        backgroundColor: '#165738',
        paddingTop: 20,
        borderRadius: 30,
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
              ...styles.button,
              fontSize: 20
            }}>Регистрация</Text>
          </View>
        </View>
      </View>
      <SafeAreaView style={{padding: 30, }}>
        <View style={{marginTop: 40}}>
          {login && <Text
            style={{color: '#99999989'}}
          >Логин</Text> || <View/>}
          <TextInput
            value={login}
            placeholder="Логин"
            placeholderTextColor='#99999989'
            maxLength={30}
            style={{ ...styles.input }}
            onChangeText={(e) => {setLogin(e)}}
          />
          <Text
            style={{color: '#99999989', marginBottom: 20}}
          >{login ? login.length : 0}/{30}</Text>
          {name && <Text
              style={{color: '#99999989'}}
          >Имя</Text> || <View/>}
          <TextInput
            value={name}
            placeholder="Имя"
            placeholderTextColor='#99999989'
            maxLength={100}
            style={{ ...styles.input }}
            onChangeText={(e) => {setName(e)}}
          />
          <Text
            style={{color: '#99999989', marginBottom: 20}}
          >{name ? name.length : 0}/{100}</Text>
          {password && <Text
              style={{color: '#99999989'}}
          >Пароль</Text> || <View/>}
          <View style={{ marginBottom: 35 }}>
            <TextInput
              value={password}
              placeholder="Пароль"
              placeholderTextColor='#99999989'
              style={{ ...styles.input, ...brokenPassword && { borderColor: '#8f1212' } }}
              secureTextEntry={hidePassword}
              onChangeText={(e) => {setPassword(e)}}
            />
            <View
              style={{ padding: 5, width: '100%', ...styles.alignEndBetween }}
              onTouchEnd={() => setHidePassword(!hidePassword)}
            >
              <MaterialCommunityIcons
                name="eye"
                size={20}
                style={{ marginRight: 10, marginTop: -30, color: '#999999' }}
              />
            </View>
            {brokenPassword && <Text
                style={{color: '#e52121', fontSize: 12, marginTop: -10}}
            >Пороли должны совпадать</Text>}
          </View>
          {passwordReply && <Text
              style={{color: '#99999989'}}
          >Повторите пароль</Text> || <View/>}
          <TextInput
            value={passwordReply}
            placeholder="Повторите пароль"
            placeholderTextColor='#99999989'
            style={{ ...styles.input, ...brokenPassword && { borderColor: '#8f1212' } }}
            secureTextEntry={hidePasswordReply}
            onChangeText={(e) => {setPasswordReply(e)}}
          />
          <View
            style={{ padding: 5, width: '100%', ...styles.alignEndBetween }}
            onTouchEnd={() => setHidePasswordReply(!hidePasswordReply)}
          >
            <MaterialCommunityIcons
              name="eye"
              size={20}
              style={{ marginRight: 10, marginTop: -30, color: '#999999' }}
            />
          </View>
          {brokenPassword && <Text
              style={{color: '#e52121', fontSize: 12, marginTop: -10}}
          >Пороли должны совпадать</Text>}
        </View>
        <View style={styles.alignCenter}>
          <Text
            style={{
              marginTop: 70,
              height: 45,
              width: 200,
              backgroundColor: 'grey',
              padding: 10,
              ...!isValid && { opacity: 0.5 },
              borderRadius: 30,
              ...styles.tAlignCenter,
            }}
            onPress={async () => {
              if (!isValid) {
                return
              }
              await onRegister()
            }}
          >Зарегистрироваться</Text>
          <Text
            style={{
              marginTop: 10,
              height: 45,
              width: 200,
              padding: 10,
              borderRadius: 30,
              ...styles.tAlignCenter,
            }}
            onPress={() => navigation.goBack()}
          >Назад</Text>
        </View>
      </SafeAreaView>
    </Base>
  );
};

const styles = StyleSheet.create({
  ...globalStyles
});

export default Register;