import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./Login";
import AuthScreen from "./Auth";
import RegisterScreen from "./Register";

const AuthStack = createNativeStackNavigator();

interface NodeProps { globalNavigation: any; navigation: any; route: any; setGlobalState: any; state: any }

export default function AuthStackScreen({ state, navigation: globalNavigation, setGlobalState, route }) {
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
      <AuthStack.Navigator
        initialRouteName="auth"
        screenOptions={{
          headerShown: false,
          animation: 'none',
          statusBarAnimation: 'none',
        }}
      >
        <AuthStack.Screen
          name="auth"
          navigationKey="auth"
        >
          {(params) => prepareNode(params, AuthScreen)}
        </AuthStack.Screen>
        <AuthStack.Screen
          name="login"
          navigationKey="login"
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
          {(params) => prepareNode(params, LoginScreen)}
        </AuthStack.Screen>
        <AuthStack.Screen
          name="register"
          navigationKey="register"
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
          {(params) => prepareNode(params, RegisterScreen)}
        </AuthStack.Screen>
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}