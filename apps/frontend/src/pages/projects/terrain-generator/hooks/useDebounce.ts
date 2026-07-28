/**
 * useDebounce.ts
 *
 * Phase F - Group 1B: Debouncing & Performance Optimization
 *
 * Custom React hook for debouncing values to reduce update frequency.
 * Particularly useful for slider inputs that trigger expensive operations.
 */

import { useEffect, useState } from "react";

/**
 * Debounce a value to reduce update frequency
 *
 * Delays updating the returned value until the input value has stopped
 * changing for the specified delay period. Useful for optimizing
 * performance when dealing with rapidly changing inputs like sliders.
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced value that updates after delay period
 *
 * @example
 * ```tsx
 * const [size, setSize] = useState(128);
 * const debouncedSize = useDebounce(size, 300);
 *
 * // Slider updates size immediately for visual feedback
 * <Slider value={size} onChange={(_, val) => setSize(val)} />
 *
 * // Expensive operation only runs after 300ms of no changes
 * useEffect(() => {
 *   generateTerrain(debouncedSize);
 * }, [debouncedSize]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancel timeout if value changes again
    // This ensures we only update after the specified delay of inactivity
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
