import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export const endpoints = {
  key: '/api/estadisticas',
  getTotal: '/getTotal'
};

// TRAE TODOS LOS LIBROS

export function useGetTotalBooksUsers() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.getTotal, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      totalBooksUsers: data?.estadisticas,
      totalBooksUsersLoading: isLoading,
      totalBooksUsersError: error,
      totalBooksUsersValidating: isValidating,
      totalBooksUsersEmpty: !isLoading && !data?.books?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}