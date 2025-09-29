import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export const endpoints = {
  key: '/api/estadisticas',
  usuariosList: '/usuarios'
};

// TRAE TODOS LOS LIBROS

export function useGetRankingUsers() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.usuariosList, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      rankingUsers: data?.estadisticas,
      rankingUsersLoading: isLoading,
      rankingUsersError: error,
      rankingUsersValidating: isValidating,
      rankingUsersEmpty: !isLoading && !data?.books?.length
    }),
    [data, error, isLoading, isValidating]
  );

  //console.log(memoizedValue);

  return memoizedValue;
}