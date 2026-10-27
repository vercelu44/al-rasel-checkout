import { useEffect, useState } from "react";

/**
 * The `useDebounce` function is a custom hook in JavaScript that returns a debounced value based on
 * the input value and delay.
 * @param value - The value that you want to debounce. This can be any type of value, such as a string,
 * number, or object.
 * @param delay - The delay parameter is the amount of time in milliseconds that the debounce function
 * should wait before updating the debounced value. If no delay is provided, the default delay is set
 * to 500 milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay?: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
