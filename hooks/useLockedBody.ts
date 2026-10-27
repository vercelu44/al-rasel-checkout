import { useEffect, useState } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * The `useLockedBody` function is a custom React hook that allows you to lock the body scroll and add
 * padding to the right side of the body to prevent width reflow.
 * @param [initialLocked=false] - A boolean value indicating whether the body should be initially
 * locked or not. If set to true, the body scroll will be locked. If set to false, the body scroll will
 * be unlocked. The default value is false.
 * @param [rootId=___gatsby] - The `rootId` parameter is an optional parameter that specifies the id of
 * the root element in your HTML document. By default, it is set to "___gatsby". This parameter is used
 * to calculate the scrollBar width and avoid width reflow.
 * @returns The function `useLockedBody` returns an array with two elements: `locked` and `setLocked`.
 */
export function useLockedBody(
	initialLocked = false,
	rootId = "___gatsby" // Default to `___gatsby` to not introduce a breaking change
): [boolean, (locked: boolean) => void] {
	const [locked, setLocked] = useState(initialLocked);

	// Do the side effect before render
	useIsomorphicLayoutEffect(() => {
		if (!locked) {
			return;
		}

		// Save the initial body style
		const originalOverflow = document.body.style.overflow;
		const originalPaddingRight = document.body.style.paddingRight;

		// Lock body scroll
		document.body.style.overflow = "hidden";

		// Get the scrollBar width
		const root = document.getElementById(rootId); // or root
		const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

		// Avoid width reflow
		if (scrollBarWidth) {
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		}

		return () => {
			document.body.style.overflow = originalOverflow;

			if (scrollBarWidth) {
				document.body.style.paddingRight = originalPaddingRight;
			}
		};
	}, [locked]);

	// Update state if initialValue changes
	useEffect(() => {
		if (locked !== initialLocked) {
			setLocked(initialLocked);
		}
	}, [initialLocked]);

	return [locked, setLocked];
}

export default useLockedBody;
