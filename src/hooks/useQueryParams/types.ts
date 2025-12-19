import type { ReadonlyURLSearchParams } from 'next/navigation';

export type SetQueryParamsValue = string | string[] | null | undefined;

export type SetQueryParamsInput = Record<string, SetQueryParamsValue>;

export type SetQueryParamsOptions = {
  scroll?: boolean;
};

export type UseQueryParamsReturn = {
  searchParams: ReadonlyURLSearchParams;
  setParam: (
    key: string,
    value: string | null | undefined,
    options?: SetQueryParamsOptions,
  ) => void;
  setParams: (
    input: SetQueryParamsInput,
    options?: SetQueryParamsOptions,
  ) => void;
  deleteParam: (key: string, options?: SetQueryParamsOptions) => void;
};
