import React, {useCallback, useContext, useEffect, useState} from 'react'
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native'
import { MENU_ITEMS as DrawerItems} from './constants/menuItems'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {AuthContext} from './context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import Spinner from "./screens/Spinner";
import AuthStack from "./screens/AuthStack";
import WelcomeStack from "./screens/welcom/WelcomeStack";
import {Text, View} from "react-native";
import globalStyles from "./global-styles";
import {AxiosContext} from "./context/AxiosContext";
import {getAccounts, getCurrentUser, getUnreadNotificationsCount} from "./api";

function LogoutButton() {
  return (
    <View style={globalStyles.rowAlignHCenter}>
      <MaterialCommunityIcons color="#ffffff" size={24} name={'location-exit'}/>
      <Text style={{marginLeft: 33, color: '#ffffff'}}>Выйти</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  const authContext = useContext(AuthContext);
  const { user, globalTotal } = authContext.authState || {};

  const { login, name } = user || {};
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          paddingLeft: 15,
          paddingTop: 10,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderColor: '#999999',
          ...globalStyles.rowAlignHCenter,
      }}
      >
        <View
          style={{padding: 5, borderRadius: 30, backgroundColor: '#999999'}}
        >
          <MaterialCommunityIcons color='#165738' name={'face-man'} size={40} />
        </View>
        <View>
          <Text
            style={{ marginLeft: 10, fontSize: 20, color: '#ffffff' }}
          >{`${name} (${login})`}</Text>
          <Text
            style={{ marginLeft: 10, fontSize: 15, color: '#999999' }}
          >{`Остаток: ${new Intl.NumberFormat().format(globalTotal)} ₽`}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label={() => <LogoutButton/>}
        onPress={() => authContext.logout()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  const authContext = useContext(AuthContext);
  const axiosContext = useContext(AxiosContext);
  const [status, setStatus] = useState('loading');
  const [notificationsCount, setNotificationsCount] = useState(0);
  const initialState = {
    currency: 'RUB',
    currencyCharacter: '₽',
  };
  const [state, setState] = useState(initialState);
  const loadJWT = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync('token');
      const jwt = JSON.parse(value);
      authContext.setAuthState({
        accessToken: jwt?.accessToken || null,
        refreshToken: jwt?.refreshToken || null,
        authenticated: !!jwt?.accessToken,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      getUnreadNotificationsCount(axiosContext)
        .then(data => setNotificationsCount(data))
        .catch(error => {
          console.error(error);
          clearInterval(timer)
        });
    }, 5000);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    loadJWT().then();
  }, [loadJWT]);
  useEffect(() => {
    if (authContext.authState?.authenticated === true) {
      getAccounts(axiosContext).then(data => {
        if (!data?.length) {
          authContext.setAuthState({
            first: true,
          })
        }
      }).catch(e => console.error(e))
      getCurrentUser(axiosContext).then(data => {
        authContext.setAuthState({
          user: data,
        })
      }).catch(e => console.error(e))
      getUnreadNotificationsCount(axiosContext)
        .then(data => setNotificationsCount(data))
        .catch(error => {
          console.error(error);
        });
    }
  }, [authContext.authState?.authenticated]);

  if (status === 'loading') {
    return (<Spinner />);
  }
  if (authContext.authState?.authenticated === false) {
    return (<AuthStack />);
  }
  if (authContext.authState?.first) {
    return (<WelcomeStack/>)
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerType="front"
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: 'white',
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerStyle: {
            backgroundColor: '#165738',
          },
        }}
      >
        {
          DrawerItems.map(drawer => <Drawer.Screen
            key={drawer.name}
            name={drawer.name}
            options={getDrawerScreenOptions(drawer, notificationsCount)}
          >{({ navigation, route }) => {
            const Node = drawer.component;
            return <Node state={state} setGlobalState={setState} navigation={navigation} route={route} />
          }}</Drawer.Screen>)
        }
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const getDrawerScreenOptions = (drawer, notificationsCount) => {
  return {
    title: () => {
      return <View style={globalStyles.rowAlignHCenter}>
        <Text key={`menu-title-${drawer.name}`} style={globalStyles.whiteText}>{drawer.title}</Text>
        {drawer.name === 'notifications' && notificationsCount ? <MaterialCommunityIcons
          name={notificationsCount > 9
            ? 'numeric-9-plus-circle'
            : `numeric-${notificationsCount}-circle`}
          size={24}
          style={{marginLeft: 10}}
          color="white"
        /> : ''}
      </View>
    },
    drawerInactiveBackgroundColor: '#165738',
    drawerActiveBackgroundColor: 'rgba(22,87,56,0.79)',
    headerStyle: {
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
      backgroundColor: '#165738'
    },
    headerBackgroundContainerStyle: {
      backgroundColor: drawer.name !== 'homeStack' ? 'black' : '#165738',
      borderColor: '#165738'
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerPressColor: 'white',
    headerShadowVisible: drawer.name !== 'homeStack',
    drawerIcon: ()=>
      <MaterialCommunityIcons
        name={drawer.iconName}
        size={24}
        color="white"
      />,
    headerShown: false,
  }
}
