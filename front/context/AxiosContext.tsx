import React, {createContext, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from './AuthContext';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as SecureStore from 'expo-secure-store';
import {BACKEND_URL} from "@env"

const AxiosContext = createContext();
const {Provider} = AxiosContext;

const AxiosProvider = ({children}) => {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: BACKEND_URL,
  });

  const publicAxios = axios.create({
    baseURL: BACKEND_URL,
  });

  authAxios.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const refreshAuthLogic = failedRequest => {
    const data = {
      refreshToken: authContext.authState.refreshToken,
    };

    const options = {
      method: 'POST',
      data,
      url: `${BACKEND_URL}/auth/refreshToken`,
    };

    return axios(options)
      .then(async tokenRefreshResponse => {
        failedRequest.response.config.headers.Authorization =
          'Bearer ' + tokenRefreshResponse.data.accessToken;

        authContext.setAuthState({
          accessToken: tokenRefreshResponse.data.accessToken,
        });
        await SecureStore.setItemAsync(
          'token',
          JSON.stringify({
            accessToken: tokenRefreshResponse.data.accessToken,
            refreshToken: authContext.authState.refreshToken,
          }),
        )

        return Promise.resolve();
      })
      .catch(e => {
        authContext.setAuthState({
          accessToken: null,
          refreshToken: null,
          authenticated: false,
        });
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </Provider>
  );
};

export {AxiosContext, AxiosProvider};