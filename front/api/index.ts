import {BACKEND_URL} from "@env"
if (!BACKEND_URL) {
  throw new Error('Отсутствует BACKEND_URL в env')
}

export const getCurrentUser = async (axiosContext) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/users/current`)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const getCurrencies = async (axiosContext) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/currencies`)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const getOperations = async (axiosContext, filter = {}) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/operations`, { params: filter })

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const createOperation = async (axiosContext, fields) => {
  const url = BACKEND_URL

  const response = await axiosContext.authAxios.post(`${url}/operations`, fields)
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(response)
}

export const updateOperation = async (axiosContext, fields, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.patch(`${url}/operations/${id}`, fields)
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const deleteOperation = async (axiosContext, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.delete(`${url}/operations/${id}`)
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}


export const getAccounts = async (axiosContext) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/accounts`)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const createAccount = async (axiosContext, fields) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.post(`${url}/accounts`, fields)
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(response)
}

export const updateAccount = async (axiosContext, fields, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.patch(`${url}/accounts/${id}`, fields)
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const deleteAccount = async (axiosContext, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.delete(`${url}/accounts/${id}`)
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}


export const getNotifications = async (axiosContext) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/notifications`, )
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const getUnreadNotificationsCount = async (axiosContext) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/notifications/unread/count`, )
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const updateNotification = async (axiosContext, fields, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.patch(`${url}/notifications/${id}`, fields)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const getCategories = async (axiosContext, filter) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/categories`, {
    params: filter
  })
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const createCategory = async (axiosContext, fields) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.post(`${url}/categories`, fields)
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(response)
}

export const updateCategory = async (axiosContext, fields, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.patch(`${url}/categories/${id}`, fields)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}
export const getRegularPayments = async (axiosContext) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.get(`${url}/regular-operations`)
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const createRegularPayment = async (axiosContext, fields) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.post(`${url}/regular-operations`, fields)
  if (response.status === 201) {
    return response.data;
  }
  throw new Error(response)
}

export const updateRegularPayment = async (axiosContext, fields, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.patch(`${url}/regular-operations/${id}`, fields)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const deleteRegularPayment = async (axiosContext, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.delete(`${url}/regular-operations/${id}`)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}

export const deleteCategory = async (axiosContext, id) => {
  const url = BACKEND_URL
  const response = await axiosContext.authAxios.delete(`${url}/categories/${id}`)

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response)
}