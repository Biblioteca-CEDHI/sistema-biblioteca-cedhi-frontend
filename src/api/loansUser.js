import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from '../utils/axios';

export const endpoints = {
  key: '/api/estadisticas',
  loanslistUser: '/prestamos-activos'
};

// TRAE TODOS LOS PRESTAMOS ACTIVOS DEL USUARIO

export function useActiveLoans() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.loanslistUser, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const memoizedValue = useMemo(
    () => ({
      activeLoans: data?.activeLoans || [],
      activeLoansLoading: isLoading,
      activeLoansError: error,
      activeLoansValidating: isValidating,
      activeLoansEmpty: !isLoading && !data?.activeLoans?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  //console.log(memoizedValue);

  return memoizedValue;
}