import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/api/sanction',
  list: '/getSanciones',
  updateRemove: '/removeSanction',
};

// TRAE TODOS LAS SANCIONES

export function useGetSancions() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      sanctions: data?.sancion,
      sanctionsLoading: isLoading,
      sanctionsError: error,
      sanctionsValidating: isValidating,
      sanctionsEmpty: !isLoading && !data?.sanctions?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


// TRAE TODOS LAS SANCIONES

export async function updateRemoveSancions2() {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.get(URL + endpoints.key + endpoints.list, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    return response.data.sancion;
  } catch (error) {
    console.log(error);
  }
}

// EDITAR SANCION (REMUEVE)

export async function updateRemoveSancions(updateRemoveId) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.updateRemove + `/` + updateRemoveId, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}