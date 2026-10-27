import { useEffect, useState } from "react";

/**
 * The `useMediaQuery` function is a custom React hook that allows you to check if a given media query
 * matches the current viewport.
 * @param query - The `query` parameter is a string representing a media query. It can be any valid CSS
 * media query, such as `"screen and (max-width: 768px)"` or `"print"`. The `useMediaQuery` hook will
 * return a boolean value indicating whether the current viewport matches the
 * @returns the value of the `matches` state variable, which represents whether the media query
 * specified by the `query` parameter is currently matching or not.
 */
export function useMediaQuery(query: string): boolean {
	const getMatches = (query: string): boolean => {
		if (typeof window !== "undefined") {
			return window.matchMedia(query).matches;
		}
		return false;
	};

	const [matches, setMatches] = useState(getMatches(query));

	function handleChange(event: MediaQueryList | MediaQueryListEvent) {
		setMatches(event.matches);
	}

	useEffect(() => {
		const matchMedia = window.matchMedia(query);

		handleChange(matchMedia); // Initial check

		const mediaQueryListListener = (event: MediaQueryListEvent) => {
			handleChange(event);
		};

		matchMedia.addEventListener("change", mediaQueryListListener);

		return () => {
			matchMedia.removeEventListener("change", mediaQueryListListener);
		};
	}, [query]);

	return matches;
}
