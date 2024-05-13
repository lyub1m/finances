import * as React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Base from './Base'
import globalStyles from "../global-styles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Header from "../components/Header";

export default function ({ navigation }) {
  return (
    <Base>
      <Header
        titleText="Настройки"
        navigation={navigation}
      />
      <Text
        style={{ fontSize: 16, color: 'white' }}
      >Настройки</Text>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});