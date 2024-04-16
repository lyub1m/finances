import * as React from 'react';
import {View, StyleSheet, ImageBackground} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000c0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

export default function BaseScreen({ children }) {
  return (
    <View
      style={styles.container}
    >
      <ImageBackground source={require('../images/background.png')} resizeMethod={"auto"} style={styles.image}>
        {children}
      </ImageBackground>
    </View>
  );
}