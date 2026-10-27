import type * as React from "react";
import { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * The `useEventListener` function is a custom React hook that allows you to attach an event listener
 * to a specified element.
 * @param eventName - The name of the event to listen for, such as "click", "keydown", etc.
 * @param eventHandler - The event handler function that will be called when the specified event
 * occurs.
 * @param element - The `element` parameter is a reference to the DOM element on which the event
 * listener should be attached. It can be either a specific DOM element or a React ref object that
 * references a DOM element. If `element` is not provided, the event listener will be attached to the
 * `window` object
 * @param options - The `options` parameter is an optional object that specifies additional options for
 * the event listener. It can include properties such as `capture` (a boolean value indicating whether
 * the event should be captured during the event propagation), `once` (a boolean value indicating
 * whether the event listener should be removed after the
 */
export function useEventListener<K extends keyof WindowEventMap>(
	eventName: K,
	eventHandler: (event: WindowEventMap[K]) => void,
	element?: React.RefObject<HTMLElement | null>,
	options?: boolean | AddEventListenerOptions
) {
	const savedHandler = useRef(eventHandler);

	useIsomorphicLayoutEffect(() => {
		savedHandler.current = eventHandler;
	}, [eventHandler]);

	useEffect(() => {
		const targetElement = element?.current ?? window;

		if (!(targetElement && targetElement.addEventListener)) return;

		const listener = (event: Event) => savedHandler.current(event as WindowEventMap[K]);

		targetElement.addEventListener(eventName, listener, options);

		return () => {
			targetElement.removeEventListener(eventName, listener, options);
		};
	}, [eventName, element, options]);
}
