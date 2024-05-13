import * as React from 'react';
import {StyleSheet, Text, View} from "react-native";
import Base from './Base'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import globalStyles from "../global-styles";
import Header from "../components/Header";

export default function GraphicsScreen({ navigation }) {
  return (
    <Base>
      <Header
        titleText="Графики"
        navigation={navigation}
      />
      <Text
        style={{ fontSize: 16, color: 'white' }}
      >Графики</Text>
    </Base>
  );
}

const styles = StyleSheet.create({
  ...globalStyles,
});