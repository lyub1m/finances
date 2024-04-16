import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountsScreen from "./Accounts";
import CreateAccountScreen from "./CreateAccount";

const AccountsStack = createNativeStackNavigator();

interface NodeProps { globalNavigation: any; navigation: any; route: any; setGlobalState: any; state: any }

export default function AccountsStackScreen({state, navigation: globalNavigation, setGlobalState, route}) {
  const prepareNode = (params, Node) => {
    const {navigation, route} = params
    const props: NodeProps = {
      state,
      route,
      navigation,
      globalNavigation,
      setGlobalState,
    }
    return <Node {...props} />
  }
  return (
    <AccountsStack.Navigator
      initialRouteName="accounts"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        statusBarAnimation: 'none',
      }}
    >
      <AccountsStack.Screen
        name="accounts"
        navigationKey="accounts"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#165738'
          },
          headerBackgroundContainerStyle: {
            backgroundColor: '#165738',
            borderColor: '#165738'
          },
          headerTitleStyle: {
            color: 'white'
          },
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      >
        {(params) => prepareNode(params, AccountsScreen)}
      </AccountsStack.Screen>
      <AccountsStack.Screen
        name="createAccount"
        navigationKey="createAccount"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#165738',
          },
          headerBackgroundContainerStyle: {
            backgroundColor: '#165738',
            borderColor: '#165738'
          },
          headerTitleStyle: {
            color: 'white'
          },
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      >
        {(params) => prepareNode(params, CreateAccountScreen)}
      </AccountsStack.Screen>
    </AccountsStack.Navigator>
  );
}