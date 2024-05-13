import React from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet, Text, View} from "react-native";
import globalStyles from '../global-styles'
import {HeaderType} from "../constants/header";


const iconMap = {
  [HeaderType.Menu]: 'menu',
  [HeaderType.Back]: 'arrow-left',
}
interface HeaderProps {
  titleText?: string,
  navigation: any,
  children?: React.ReactNode[],
  type?: HeaderType,
  customHandler?: () => void
}

const Header = (props: HeaderProps) => {
  const { children, navigation, customHandler, titleText, type = HeaderType.Menu } = props
  return (
    <View style={{
      height: 100,
      width: '100%',
      backgroundColor: '#165738',
      paddingTop: 20,
      ...styles.rowAlignHCenter
    }}>
      <MaterialCommunityIcons
        name={iconMap[type]}
        size={23}
        color="white"
        style={{marginLeft: 20}}
        onPress={() => {
          if (customHandler) {
            customHandler()
            return
          }
          switch (type) {
            case HeaderType.Menu:
              navigation.openDrawer();
              break
            case HeaderType.Back:
              navigation.goBack({ params: { ddd: 1 } });
              break
            default:
              break
          }
        }}
      />
      <View style={{width: '80%', ...styles.alignCenter}}>
        <View>
          {children || <Text style={{
            ...styles.button,
            fontSize: 20
          }}>{titleText}</Text>}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ...globalStyles,
});

export default Header