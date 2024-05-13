import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegularPaymentsScreen from "./RegularPayments";
import CreateRegularPaymentScreen from "./CreateRegularPayment";
import CreateCategoryScreen from "./CreateCategory";

const RegularPaymentsStack = createNativeStackNavigator();

interface NodeProps { globalNavigation: any; navigation: any; route: any; setGlobalState: any; state: any }

export default function RegularPaymentsStackScreen({state, navigation: globalNavigation, setGlobalState, route}) {
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
    <RegularPaymentsStack.Navigator
      initialRouteName="regularPayments"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        statusBarAnimation: 'none',
      }}
    >
      <RegularPaymentsStack.Screen
        name="regularPayments"
        navigationKey="regularPayments"
      >
        {(params) => prepareNode(params, RegularPaymentsScreen)}
      </RegularPaymentsStack.Screen>
      <RegularPaymentsStack.Screen
        name="createRegularPayment"
        navigationKey="createRegularPayment"
      >
        {(params) => prepareNode(params, CreateRegularPaymentScreen)}
      </RegularPaymentsStack.Screen>
      <RegularPaymentsStack.Screen
        name="createCategory"
        navigationKey="createCategory"
      >
        {(params) => prepareNode(params, CreateCategoryScreen)}
      </RegularPaymentsStack.Screen>
    </RegularPaymentsStack.Navigator>
  );
}