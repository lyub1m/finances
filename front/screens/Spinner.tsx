import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Base from './Base'

const Spinner = () => (
  <Base>
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007aff" />
    </View>
  </Base>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;