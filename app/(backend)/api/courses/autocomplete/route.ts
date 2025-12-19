import { NextRequest, NextResponse } from 'next/server';
import {
  handleAutocomplete,
  parseAutocompleteQueryParams,
} from '@/packages/bff/handlers';
import { BffValidationError } from '@/packages/bff/utils/errors';
import type {
  CoursesAutocompleteErrorDTO,
  CoursesAutocompleteResponseDTO,
} from '@/types/api/courses-autocomplete';

export async function GET(request: NextRequest) {
  try {
    const params = parseAutocompleteQueryParams(request.nextUrl.searchParams);
    const response = await handleAutocomplete(params);
    return NextResponse.json<CoursesAutocompleteResponseDTO>(response);
  } catch (error) {
    if (error instanceof BffValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json<CoursesAutocompleteErrorDTO>(
      {
        error: 'Failed to fetch autocomplete results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
