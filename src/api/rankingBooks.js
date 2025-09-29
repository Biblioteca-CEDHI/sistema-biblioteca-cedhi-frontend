import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export const endpoints = {
  key: '/api/estadisticas',
  librosList: '/libros'
};

// TRAE TODOS LOS LIBROS

export function useGetRankingBooks() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.librosList, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      rankingBooks: data?.estadisticas,
      rankingBooksLoading: isLoading,
      rankingBooksError: error,
      rankingBooksValidating: isValidating,
      rankingBooksEmpty: !isLoading && !data?.books?.length
    }),
    [data, error, isLoading, isValidating]
  );

  //console.log(memoizedValue);

  return memoizedValue;
}