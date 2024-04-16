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

const Login = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const authContext = useContext(AuthContext);
  const {publicAxios} = useContext(AxiosContext);
  const isValid = !!(login && password)

  const onLogin = async () => {
    try {
      const response = await publicAxios.post('auth/login', {
        username: login,
        password,
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
      // console.error(error)
      Alert.alert('Неверный логин или пароль', error.response?.data.message || error?.message || JSON.stringify(error));
    }
  };

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
            }}>Вход</Text>
          </View>
        </View>
      </View>
      <SafeAreaView style={{padding: 30, }}>
        <View style={{marginTop: 40}}>
          <TextInput
            value={login}
            placeholder="Логин"
            placeholderTextColor='#99999989'
            maxLength={30}
            style={{ borderBottomWidth: 2, borderColor: '#999999', color: '#999999', fontSize: 15 }}
            onChangeText={(e) => {setLogin(e)}}
          />
          <Text
            style={{color: '#99999989'}}
          >{login ? login.length : 0}/{30}</Text>
          <TextInput
            value={password}
            placeholder="Пароль"
            placeholderTextColor='#99999989'
            secureTextEntry={hidePassword}
            style={{ borderBottomWidth: 2, borderColor: '#999999', color: '#999999', fontSize: 15, marginTop: 20 }}
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
              await onLogin()
            }}
          >Войти</Text>
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
  ...globalStyles,
});

export default Login;