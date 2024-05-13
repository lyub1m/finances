import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from "../global-styles";
import {getCategories} from "../api";
import {AxiosContext} from "../context/AxiosContext";
import Header from "../components/Header";
import OperationTypeTabs from "../components/OperationTypeTabs";
import {OperationType} from "../constants/operation";

export default function CategoriesScreen({ navigation, route = {} }) {
  const axiosContext = useContext(AxiosContext);
  const { params: routeParams = {} } = route
  const { typeCode = OperationType.Out } = routeParams
  const [type, setType] = useState(typeCode || OperationType.Out);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(() => false);
  const updateCategories = (type) => {
    setLoadingCategories(true)
    getCategories(axiosContext, {
      type,
    })
      .then(data => setCategories(data))
      .catch(e => console.error(e))
      .finally(() => {
        setLoadingCategories(false)
      })
  }
  useEffect(() => {
    updateCategories(type)
  }, [type]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateCategories(type)
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <Base>
      <Header
        titleText="Категории"
        navigation={navigation}
      />
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.top} ></View>
        <View style={styles.middleContainer} >
          <OperationTypeTabs
            value={type}
            onInput={(payload) => { setType(payload) }}
          />
        </View>
        <View style={{ marginTop: 40, paddingLeft: 10 }}>
          <View style={{
            marginTop: 20,
            ...styles.wrap,
            ...styles.rowAlignHCenter,
          }}>
            {loadingCategories && <View style={{
              paddingLeft: 5,
              ...styles.alignCenter,
              ...styles.rowAlignHCenter
            }}>
                <ActivityIndicator size="large" color="#007aff" />
                <Text style={{ marginLeft: 10 }}>Загрузка</Text>
            </View>}
            {!loadingCategories && categories.filter(e => e.type === type).map((e) =>
              <View
                key={`category-${JSON.stringify(e)}`}
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingBottom: 5,
                  marginBottom: 10,
                  ...styles.alignCenter,
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: e.color,
                    borderRadius: 30,
                    ...styles.alignCenter
                  }}
                  onTouchEnd={() => {
                    navigation.navigate('createCategory', {
                      name: e.name,
                      type: e.type,
                      icon: e.icon,
                      color: e.color,
                      userId: e.userId,
                      id: e.id,
                    })
                  }}
                >
                  <MaterialCommunityIcons
                    name={e.icon}
                    size={45}
                    color="white"
                    onPress={() => {

                    }}
                  />
                </View>
                <Text
                  style={{ color: '#c7bfbf', fontSize: 13 }}
                >{e.name}</Text>
              </View>
            ) || <View/>}
            {!loadingCategories && <View
              key={'category-add'}
              style={{
                ...styles.alignCenter,
                marginLeft: 13,
                marginBottom: 14,
                paddingLeft: 5
              }}
              onTouchEnd={() => {
                navigation.navigate('createCategory')
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'gray',
                  borderRadius: 30,
                  ...styles.alignCenter
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={45}
                  color="white"
                />
              </View>
              <Text
                style={{ color: '#c7bfbf', fontSize: 13, marginTop: 5 }}
              >Добавить</Text>
            </View> || <View/>}
          </View>
        </View>
      </ScrollView>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
  middleContainer: {
    ...globalStyles.middleContainer,
    // marginTop: 1,
    // height: 300,
  },
  top: {
    ...globalStyles.top,
    height: 57,
  },
  tabs: {
    ...globalStyles.tabs,
    flex: null,
    height: 30,
  },
});