import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/api/usuarios',
  list: '/getAllUsuariosCedhi',
  insert: '/addUsuarioCedhi',
  update: '/updateUsuarioCedhi',
  delete: '/deleteUsuarioCedhi'
};

// TRAE TODOS LOS USUARIOS

export function useGetUserCedhi() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      users: data?.usuarios,
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR USUARIO

export async function insertUserCedhi(newUserCedhi) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newUserCedhi, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR USUARIO

export async function updateUserCedhi(updatedUserCedhi) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update, updatedUserCedhi, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR USUARIO

export async function deleteUserCedhi(userCedhicodigo) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + userCedhicodigo, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}
