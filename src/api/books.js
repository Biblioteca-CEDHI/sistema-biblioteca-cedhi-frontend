import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/api/booksget',
  list: '/all',
  insert: '/addBook',
  update: '/updateBook',
  delete: '/deleteBook'
};

// TRAE TODOS LOS LIBROS

export function useGetBooks() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      books: data?.books,
      booksLoading: isLoading,
      booksError: error,
      booksValidating: isValidating,
      booksEmpty: !isLoading && !data?.books?.length
    }),
    [data, error, isLoading, isValidating]
  );

  //console.log(memoizedValue);

  return memoizedValue;
}

// AGREGAR LIBRO

export async function insertBook(newBook) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.post(URL + endpoints.key + endpoints.insert, newBook, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// EDITAR LIBRO

export async function updateBook(updatedBook) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    const response = await axios.put(URL + endpoints.key + endpoints.update, updatedBook, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

// ELIMINAR LIBRO

export async function deleteBook(bookRegistro) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.delete + `/` + bookRegistro, {
      headers: { authorization: serviceToken }
    });
    mutate(endpoints.key + endpoints.list);
  } catch (error) {
    console.log(error);
  }
}



// Trae todos los libros
// export async function getBooks(){
//   try {
//     const response = await axios.get(endpoints.key + endpoints.list);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.log(error)
//   }
// }

// Trae los detalles de un solo libro segun REGISTRO
// export async function getBookDetail(registro){
//   try {
//     const response = await axios.get(`${endpoints.key}/${registro}`);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// }
