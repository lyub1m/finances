import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./Home";
import CreateOperationScreen from "./CreateOperation";
import CreateCategoryScreen from "./CreateCategory";
import CategoryOperationsDetailScreen from "./CategoryOperationsDetail";

const HomeStack = createNativeStackNavigator();

interface NodeProps { globalNavigation: any; navigation: any; route: any; setGlobalState: any; state: any }

export default function HomeStackScreen({ state, navigation: globalNavigation, setGlobalState, route }) {
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
    <HomeStack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        statusBarAnimation: 'none',
    }}
    >
      <HomeStack.Screen
        name="home"
        navigationKey="home"
      >
        {(params) => prepareNode(params, HomeScreen)}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="createOperation"
        navigationKey="createOperation"
      >
        {(params) => prepareNode(params, CreateOperationScreen)}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="categoryOperationsDetail"
        navigationKey="categoryOperationsDetail"
      >
        {(params) => prepareNode(params, CategoryOperationsDetailScreen)}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="createCategory"
        navigationKey="createCategory"
      >
        {(params) => prepareNode(params, CreateCategoryScreen)}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
}