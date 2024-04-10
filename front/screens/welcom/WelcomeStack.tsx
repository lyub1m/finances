import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SumScreen from "./Sum";
import WelcomeScreen from "./Welcome";
import DefaultCurrencyScreen from "./DefaultCurrency";

const WelcomeStack = createNativeStackNavigator();

interface NodeProps { globalNavigation: any; navigation: any; route: any; setGlobalState: any; state: any }

export default function WelcomeStackScreen({ state, navigation: globalNavigation, setGlobalState, route }) {
  const prepareNode = (params, Node) => {
    const { navigation, route } = params
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
    <NavigationContainer>
      <WelcomeStack.Navigator
        initialRouteName="welcome"
        screenOptions={{
          headerShown: false,
          animation: 'none',
          statusBarAnimation: 'none',
        }}
      >
        <WelcomeStack.Screen
          name="welcome"
          navigationKey="welcome"
        >
          {(params) => prepareNode(params, WelcomeScreen)}
        </WelcomeStack.Screen>
        <WelcomeStack.Screen
          name="defaultCurrency"
          navigationKey="defaultCurrency"
        >
          {(params) => prepareNode(params, DefaultCurrencyScreen)}
        </WelcomeStack.Screen>
        <WelcomeStack.Screen
          name="sum"
          navigationKey="sum"
        >
          {(params) => prepareNode(params, SumScreen)}
        </WelcomeStack.Screen>
      </WelcomeStack.Navigator>
    </NavigationContainer>
  );
}