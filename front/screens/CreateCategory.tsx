import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, TextInput, Alert} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from '../global-styles'
import {useContext, useState} from "react";
import {materialCommunity} from "../constants/material-icons";
import {htmlColors} from "../constants/colors";
import {AxiosContext} from "../context/AxiosContext";
import {AuthContext} from "../context/AuthContext";
import {createCategory, deleteCategory, updateCategory} from "../api";

export default function createCategoryScreen({ state = {}, navigation, route = {} }) {
  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
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
      <View style={{
        height: 100,
        width: '100%',
        backgroundColor: '#165738',
        borderRadius: 30,
        paddingTop: 20,
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
            }}>{id ? 'Редактирование категории' : 'Добавление категории'}</Text>
          </View>
        </View>
      </View>
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
            <View
              style={{ marginBottom: 10, ...styles.rowAlignHCenter}}
              onTouchEnd={() => {
                setType('out')
              }}
            >
              <MaterialCommunityIcons
                name={type === 'out' ? 'radiobox-marked' : 'radiobox-blank'}
                color='#165738'
                size={25}
                style={{marginRight: 15}}
              />
              <Text>Расходы</Text>
            </View>
            <View
              style={{marginLeft: 40, marginBottom: 10, ...styles.rowAlignHCenter}}
              onTouchEnd={() => {
                setType('in')
              }}
            >
              <MaterialCommunityIcons
                name={type === 'in' ? 'radiobox-marked' : 'radiobox-blank'}
                color='#165738'
                size={25}
                style={{marginRight: 15}}
              />
              <Text>Доходы</Text>
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ color: '#999999' }}>Иконка</Text>
            <ScrollView
              style={{ height: 'auto', maxHeight: 240, marginTop: 10 }}
            >
              <View style={{
                marginTop: 20,
                ...styles.wrap,
                ...styles.rowAlignHCenter,
              }}>
                {materialCommunity.map((e, i) =>
                  <View
                    key={`icon-${i}-${e.name}`}
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
                        // backgroundColor: '#484545',
                        borderRadius: 30,
                        ...styles.alignCenter,
                        ...icon === e.name && { backgroundColor: '#484545', borderRadius: 10 }
                      }}
                    >
                      <MaterialCommunityIcons
                        name={e.name}
                        size={45}
                        color="white"
                        onPress={() => setIcon(e.name)}
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={{ color: '#999999' }}>Цвет</Text>
            <ScrollView
              style={{ height: 'auto', maxHeight: 170, marginTop: 10 }}
            >
              <View style={{
                backgroundColor: 'rgba(54,79,38,0.6)',
                ...styles.wrap,
                ...styles.rowAlignHCenter,
              }}>
                {htmlColors.map((e, i) =>
                  <View
                    key={`color-${i}-${e.color}`}
                    style={{
                      padding: 5,
                      marginBottom: 10,
                      ...styles.alignCenter,
                      ...color === e.color && { backgroundColor: 'rgba(22,87,56,0.84)', borderRadius: 10 }
                    }}
                    onTouchEnd={() => setColor(e.color)}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: e.color,
                        borderRadius: 30,
                        borderWidth: 2,
                        borderColor: color === e.color ? e.color : '#4d6e36',
                        ...styles.alignCenter,
                      }}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
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
        >{id ? 'Сохранить' : 'Добавить' }</Text>
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
                onPress: () => console.log('Cancel Pressed'),
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