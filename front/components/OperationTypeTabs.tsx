import React, {useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import globalStyles from '../global-styles'
import {OperationType, operationTypes} from "../constants/operation";
import Tabs from "./Tabs";

interface TabsProps {
  onInput: (code: OperationType) => void,
  value?: OperationType
}

const OperationTypeTabs = (props: TabsProps) => {
  const { onInput, value } = props
  const [type, setType] = useState(value || OperationType.Out);
  return (
    <Tabs
      items={operationTypes}
      value={type}
      containerStyles={styles.tabs}
      onInput={(type: OperationType) => {
        setType(type)
        onInput(type)
      }}
    />
  )
}

const styles = StyleSheet.create({
  ...globalStyles,
  tabs: {
    ...globalStyles.tabs,
    flex: null,
    height: 30,
  },
});

export default OperationTypeTabs