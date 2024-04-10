import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CategoriesScreen from "./Categories";
import CreateCategoryScreen from "./CreateCategory";

const CategoriesStack = createNativeStackNavigator();

interface NodeProps { globalNavigation: any; navigation: any; route: any; setGlobalState: any; state: any }

export default function CategoriesStackScreen({state, navigation: globalNavigation, setGlobalState, route}) {
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
    <CategoriesStack.Navigator
      initialRouteName="categories"
      screenOptions={{
        headerShown: false,
        animation: 'none',
        statusBarAnimation: 'none',
      }}
    >
      <CategoriesStack.Screen
        name="categories"
        navigationKey="categories"
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
        {(params) => prepareNode(params, CategoriesScreen)}
      </CategoriesStack.Screen>
      <CategoriesStack.Screen
        name="createCategory"
        navigationKey="createCategory"
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
        {(params) => prepareNode(params, CreateCategoryScreen)}
      </CategoriesStack.Screen>
    </CategoriesStack.Navigator>
  );
}