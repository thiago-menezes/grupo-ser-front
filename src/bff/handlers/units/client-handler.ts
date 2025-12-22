import { transformClientUnits } from '../../transformers/client-api';
import { fetchUnits } from './api';
import type { ClientUnitsQueryParams, ClientUnitsResponse } from './types';

export async function handleClientUnits(
  params: ClientUnitsQueryParams,
): Promise<ClientUnitsResponse> {
  if (!params.institution) {
    throw new Error('Institution is required');
  }
  if (!params.state) {
    throw new Error('State is required');
  }
  if (!params.city) {
    throw new Error('City is required');
  }

  try {
    const apiResponse = await fetchUnits(
      params.institution,
      params.state,
      params.city,
    );

    if (!apiResponse.Unidades || apiResponse.Unidades.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          institution: params.institution,
          state: params.state,
          city: params.city,
        },
      };
    }

    const transformedUnits = transformClientUnits(apiResponse.Unidades);

    return {
      data: transformedUnits,
      meta: {
        total: transformedUnits.length,
        institution: params.institution,
        state: params.state,
        city: params.city,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch units from client API: ${error.message}`,
      );
    }
    throw new Error('Failed to fetch units from client API: Unknown error');
  }
}
