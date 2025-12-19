import type { ClientApiClient } from '../../services/client-api';
import { transformClientUnits } from '../../transformers/client-api';
import type { ClientUnitsQueryParams, ClientUnitsResponse } from './types';

/**
 * Handle units request from client API
 * Fetches units by geographic location (institution, state, city)
 */
export async function handleClientUnits(
  clientApiClient: ClientApiClient,
  params: ClientUnitsQueryParams,
): Promise<ClientUnitsResponse> {
  // Validate required parameters
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
    // Fetch from client API
    const apiResponse = await clientApiClient.fetchUnits(
      params.institution,
      params.state,
      params.city,
    );

    // Handle empty response
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

    // Transform Portuguese fields to English
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
