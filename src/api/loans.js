import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/api/loans',
  list: '/allLoans',
  myLoans: '/my-loans',
  insert: '/addLoan',
  insertReturn: '/returnLoan',
  delete: '/deleteLoan',
  keyBooks: '/api/booksget',
  listBooks: '/all'
};


// TRAE TODOS LOS PRESTAMOS

export function useGetLoans(user) {
  const endpoint = ([1,2,3].includes(user?.categoria))
    ? `${URL}${endpoints.key}${endpoints.list}`    
    : `${URL}${endpoints.key}${endpoints.myLoans}`;
  const { data, isLoading, error, isValidating } = useSWR(endpoint, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      loans: data?.loans,
      loansLoading: isLoading,
      loansError: error,
      loansValidating: isValidating,
      loansEmpty: !isLoading && !data?.loans?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// AGREGAR UN NUEVO PRESTAMO

export async function insertLoan(newLoan) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newLoan, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    mutate(endpoints.keyBooks + endpoints.listBooks);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// AGREGAR UN NUEVO DEVOLVER LIBRO

export async function insertLoanReturn(newLoanReturn) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insertReturn, newLoanReturn, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    mutate(endpoints.keyBooks + endpoints.listBooks);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR UN PRESTAMO

export async function deleteLoan(loanId) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + loanId, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    mutate(endpoints.keyBooks + endpoints.listBooks);
  } catch (error) {
    console.log(error);
  }
}