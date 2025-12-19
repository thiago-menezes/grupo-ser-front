'use client';

import { useEffect } from 'react';
import { useTheme } from 'reshaped';

const COLOR_MODE_STORAGE_KEY = 'rs-color-mode';

export function useColorMode() {
  const { colorMode, invertColorMode } = useTheme();

  // Sync data attribute and localStorage with Reshaped's color mode
  useEffect(() => {
    if (colorMode) {
      document.documentElement.setAttribute('data-rs-color-mode', colorMode);
      // Save to localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
      }
    }
  }, [colorMode]);

  const handleInvertColorMode = () => {
    invertColorMode();
    // Immediately save the inverted color mode to localStorage
    const newColorMode = colorMode === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, newColorMode);
      document.documentElement.setAttribute('data-rs-color-mode', newColorMode);
    }
  };

  return {
    colorMode,
    invertColorMode: handleInvertColorMode,
  };
}
