import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, TextInput, Alert} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from '../global-styles'
import {useContext, useState} from "react";
import {materialCommunity} from "../constants/material-icons";
import {htmlColors} from "../constants/colors";
import {AxiosContext} from "../context/AxiosContext";
import {createCategory, deleteCategory, updateCategory} from "../api";
import {HeaderType} from "../constants/header";
import Header from "../components/Header";
import {operationTypes} from "../constants/operation";
import Select from "../components/Select";

export default function createCategoryScreen({ navigation, route = {} }) {
  const axiosContext = useContext(AxiosContext);
  const {
    params: routeParams = {
      name: '',
      type: 'out',
      icon: '',
      color: '',
      userId: null,
    }
  } = route
  const { id = null, userId = null } = routeParams

  const [name, setName] = useState((): string => routeParams.name);
  const [type, setType] = useState((): string => routeParams.type);
  const [icon, setIcon] = useState((): string => routeParams.icon);
  const [color, setColor] = useState((): string => routeParams.color);

  const isValid = !!(name && type && icon && color)

  return (
    <Base>
      <Header
        titleText={id ? 'Редактирование категории' : 'Добавление категории'}
        navigation={navigation}
        type={HeaderType.Back}
      />
      <ScrollView>
        <View style={{ padding: 15 }}>
          <View style={{width: '100%'}}>
            <TextInput
              value={name}
              placeholder={'Название категории'}
              placeholderTextColor={'rgba(155,154,154,0.71)'}
              maxLength={60}
              style={{
                borderBottomWidth: 2,
                borderColor: '#999999',
                color: '#999999',
                fontSize: 18,
              }}
              onChangeText={e => setName(e)}
            />
            <Text
              style={{color: '#99999989'}}
            >{name ? name.length : 0}/{60}</Text>
          </View>
          <View style={{ marginTop: 10, ...styles.rowAlignHCenter }}>
            {operationTypes.map(e => <View
              style={{ marginRight: 10,  ...styles.rowAlignHCenter}}
              key={`category-type-${e.code}`}
              onTouchEnd={() => {
                setType(e.code)
              }}
            >
              <MaterialCommunityIcons
                name={type === e.code ? 'radiobox-marked' : 'radiobox-blank'}
                color='#165738'
                size={25}
                style={{marginRight: 5}}
              />
              <Text style={styles.whiteText}>{e.text}</Text>
            </View>)}
          </View>
          <Select
            key="icon"
            items={materialCommunity.map(e => ({ code: e.name, icon: e.name }))}
            value={icon}
            title="Иконка"
            containerStyles={{ marginTop: 30 }}
            onInput={(payload) => setIcon(payload)}
          />
          <Select
            key="color"
            items={htmlColors.map(e => ({ code: e.color, color: e.color }))}
            value={color}
            title="Цвет"
            containerStyles={{ marginTop: 30 }}
            onInput={(payload) => setColor(payload)}
          />
        </View>
      </ScrollView>
      <View style={{ marginBottom: 15, height: 30, ...styles.alignCenter, ...styles.rowAlignHCenter }}>
        <Text
          style={{
            marginTop: -45,
            height: 45,
            width: 150,
            backgroundColor: 'grey',
            ...!isValid && { opacity: 0.5 },
            padding: 10,
            borderRadius: 30,
            ...styles.tAlignCenter,
          }}
          onPress={async () => {
            if (!isValid) {
              return
            }
            const fields = {
              name,
              type,
              color,
              icon
            }

            try {
              if (id) {
                await updateCategory(axiosContext, fields, id)
              } else {
                await createCategory(axiosContext, fields)
              }
            } catch (e) {
              Alert.alert('Ошибка сохранения категории', e.response?.data.message || e?.message || JSON.stringify(e));
              return;
            }
            navigation.goBack()
          }}
        >{ id ? 'Сохранить' : 'Добавить' }</Text>
        {id && userId && <Text
          style={{
            marginTop: -45,
            height: 45,
            width: 150,
            backgroundColor: '#868080',
            ...!isValid && { opacity: 0.5 },
            padding: 10,
            borderRadius: 30,
            marginLeft: 15,
            ...styles.tAlignCenter,
          }}
          onPress={async () => {
            Alert.alert('Удалить категорию?', name, [
              {
                text: 'Нет',
                style: 'cancel',
              },
              {text: 'Да', onPress: async () => {
                  await deleteCategory(axiosContext, id)
                  navigation.goBack()
              }},
            ]);
          }}
        >Удалить</Text> || <View/>}
      </View>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});