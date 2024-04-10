import { registerRootComponent } from 'expo';
import {AppRegistry} from 'react-native';
import App from './App';
import {expo} from './app.json';
import {AuthProvider} from './context/AuthContext';
import {AxiosProvider} from './context/AxiosContext';
import React from 'react';

const Root = () => {
  return (
    <AuthProvider>
      <AxiosProvider>
        <App />
    </AxiosProvider>
    </AuthProvider>
  );
};
registerRootComponent(Root);