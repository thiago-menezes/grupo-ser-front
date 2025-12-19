'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { Reshaped } from 'reshaped';
import { CityProvider } from '@/contexts/city';
import { makeQueryClient } from '@/libs';

const COLOR_MODE_STORAGE_KEY = 'rs-color-mode';

// Initialize color mode synchronously before React renders
if (typeof window !== 'undefined') {
  const storedColorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (storedColorMode === 'dark' || storedColorMode === 'light') {
    document.documentElement.setAttribute(
      'data-rs-color-mode',
      storedColorMode,
    );
  }
}

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => makeQueryClient());
  const { institution = 'grupo-ser' } = useParams<{ institution: string }>();
  const [delayToRender, setDelayToRender] = useState(true);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setDelayToRender(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  if (delayToRender) return <></>;

  return (
    <Reshaped theme={institution}>
      <QueryClientProvider client={queryClient}>
        <CityProvider>
          {children}
          {process.env.NODE_ENV === 'development' ? (
            <ReactQueryDevtools initialIsOpen={false} />
          ) : null}
        </CityProvider>
      </QueryClientProvider>
    </Reshaped>
  );
}
