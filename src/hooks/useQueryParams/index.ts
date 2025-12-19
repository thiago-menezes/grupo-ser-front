'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type {
  SetQueryParamsInput,
  SetQueryParamsOptions,
  UseQueryParamsReturn,
} from './types';

function buildHref(pathname: string, params: URLSearchParams): string {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function useQueryParams(): UseQueryParamsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replace = useCallback(
    (params: URLSearchParams, options?: SetQueryParamsOptions) => {
      router.replace(buildHref(pathname, params), {
        scroll: options?.scroll ?? false,
      });
    },
    [router, pathname],
  );

  const setParam = useCallback(
    (
      key: string,
      value: string | null | undefined,
      options?: SetQueryParamsOptions,
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      replace(params, options);
    },
    [replace, searchParams],
  );

  const setParams = useCallback(
    (input: SetQueryParamsInput, options?: SetQueryParamsOptions) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(input).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
          return;
        }

        if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => {
            if (v !== '') params.append(key, v);
          });
          return;
        }

        params.set(key, value);
      });

      replace(params, options);
    },
    [replace, searchParams],
  );

  const deleteParam = useCallback(
    (key: string, options?: SetQueryParamsOptions) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      replace(params, options);
    },
    [replace, searchParams],
  );

  return {
    searchParams,
    setParam,
    setParams,
    deleteParam,
  };
}

export type {
  SetQueryParamsInput,
  SetQueryParamsOptions,
  SetQueryParamsValue,
  UseQueryParamsReturn,
} from './types';
