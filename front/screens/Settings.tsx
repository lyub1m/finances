import * as React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Base from './Base'
import globalStyles from "../global-styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function ({ navigation }) {
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
          name="menu"
          size={23}
          color="white"
          style={{ marginLeft:20 }}
          onPress={() => {
            navigation.openDrawer()
          }}
        />
        <View style={{ width: '80%', ...styles.alignCenter }}>
          <View>
            <Text style={{
              ...styles.button,
              fontSize: 20
            }}>Настройки</Text>
          </View>
        </View>
      </View>
      <Text
        style={{ fontSize: 16, color: 'white' }}
      >Настройки</Text>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});