import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';
import axios from 'axios';

const URL = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: '/api/booksget',
  list: '/all',
  myFavorites: '/my-favorites',
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

// TRAER LIBROS FAVORITOS DEL USUARIO
export function useFavoriteBooks() {
  const { data, isLoading, error, isValidating } = useSWR( URL +
    endpoints.key + endpoints.myFavorites,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );
  console.log("favoritos (raw data): ", JSON.stringify(data, null, 2));
  const memoizedValue = useMemo(
    () => ({
      favoriteBooks: data?.favorites || [],
      favoriteBooksLoading: isLoading,
      favoriteBooksError: error,
      favoriteBooksValidating: isValidating,
      favoriteBooksEmpty: !isLoading && !(data?.favorites || []).length

    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function addFavoriteBook(registro) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.post(URL + endpoints.key + endpoints.myFavorites, { registro }, {
      headers: { Authorization: `Bearer ${serviceToken}` }
    });
    mutate(URL + endpoints.key + endpoints.myFavorites);
  } catch (error) {
    console.error(error);
  }
}

// ELIMINAR LIBRO DE FAVORITOS
export async function removeFavoriteBook(registro) {
  const serviceToken = window.localStorage.getItem('serviceToken');
  try {
    if (!serviceToken) return;
    await axios.delete(URL + endpoints.key + endpoints.myFavorites, {
      headers: { Authorization: `Bearer ${serviceToken}` },
      data: { registro }
    });
    mutate(URL + endpoints.key + endpoints.myFavorites);
  } catch (error) {
    console.error(error);
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
