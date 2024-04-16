import React, {createContext, useState} from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(null);
const {Provider} = AuthContext;

interface User {
  name: string,
  login: string
}

interface AuthState {
  accessToken: string | null,
  refreshToken: string | null,
  authenticated: boolean | null,
  first: boolean,
  user: User,
  globalTotal: number,
}

const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  authenticated: false,
  first: false,
  user: null,
  globalTotal: 0,
}

const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState(initialAuthState);

  const logout = async () => {
    await SecureStore.deleteItemAsync('token')
    setAuthState(initialAuthState);
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  return (
    <Provider
      value={{
        authState,
        getAccessToken,
        setAuthState: (payload) => setAuthState(e => ({
          ...e,
          ...payload,
        })),
        logout,
      }}>
      {children}
    </Provider>
  );
};

export {AuthContext, AuthProvider};