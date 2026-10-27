import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import apiSlice from "./api/apiSlice";
import authSlice from "./slices/authSlice";
import commonSlice, { type CommonState } from "./slices/commonSlice";

/** Data the store can start with (settings & translations from the server). */
export interface PreloadedState {
	common?: CommonState;
}

// Creates a store. `preloadedState` lets the server and the browser start
// with the same data (settings, translations) so the HTML matches on hydration.
export const makeStore = (preloadedState?: PreloadedState) => {
	const store = configureStore({
		reducer: {
			cart: cartSlice,
			[apiSlice.reducerPath]: apiSlice.reducer,
			auth: authSlice,
			common: commonSlice,
		},
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(apiSlice.middleware),
	});

	// Add local storage persistence
	store.subscribe(() => {
		const { cart: cartItems, isCartHydrated } = store.getState().cart;
		// Don't overwrite the saved cart before it has been loaded
		if (!isCartHydrated) return;
		try {
			localStorage.setItem("cart_items", JSON.stringify(cartItems));
		} catch (error) {
			console.error("Error saving cart items to local storage:", error);
		}
	});

	return store;
};

/** Type of the Redux store. */
export type AppStore = ReturnType<typeof makeStore>;
/** Whole Redux state: `state.cart`, `state.auth`, `state.common`… */
export type RootState = ReturnType<AppStore["getState"]>;
/** `dispatch` that also accepts thunks like `logoutUser()`. */
export type AppDispatch = AppStore["dispatch"];

let browserStore: AppStore | undefined;

// Server: a fresh store for every request (no data shared between visitors).
// Browser: one store for the whole session, same as before.
export const getStore = (preloadedState?: PreloadedState): AppStore => {
	if (typeof window === "undefined") return makeStore(preloadedState);
	if (!browserStore) browserStore = makeStore(preloadedState);
	return browserStore;
};
