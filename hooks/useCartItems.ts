"use client";
import { useSyncExternalStore } from "react";
import { useAppSelector } from "@/store/hooks";
import type { CartItem } from "@/types";

const EMPTY_CART: CartItem[] = [];
const subscribe = () => () => {};

/**
 * false while React is hydrating server HTML (matches the server),
 * true right after. On client-side navigation it is true immediately.
 */
export const useIsHydrated = () =>
	useSyncExternalStore(
		subscribe,
		() => true, // browser
		() => false // server + hydration
	);

/**
 * Cart items safe to render: empty during hydration (like the server HTML),
 * the real cart afterwards. Prevents hydration mismatch errors.
 */
export default function useCartItems(): CartItem[] {
	const cart = useAppSelector((state) => state.cart.cart);
	const isHydrated = useIsHydrated();
	return isHydrated ? cart : EMPTY_CART;
}
