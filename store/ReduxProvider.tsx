"use client";
import type * as React from "react";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { getStore } from "@/store";
import { ToastContainer } from "react-toastify";
import {
  hydrateCart,
  loadCartItemsFromLocalStorage,
} from "@/store/slices/cartSlice";
import { initialState as commonInitialState } from "@/store/slices/commonSlice";
import type { SiteSettings, Translations } from "@/types";

interface ReduxProviderProps {
  children: React.ReactNode;
  settings?: SiteSettings;
  translations?: Translations;
}

const ReduxProvider = ({ children, settings, translations }: ReduxProviderProps) => {
  // Start the store with the server's settings & translations so the first
  // client render matches the server HTML (no hydration mismatch).
  const [store] = useState(() =>
    getStore({
      common: {
        ...commonInitialState,
        settings: settings ?? commonInitialState.settings,
        translations: translations ?? commonInitialState.translations,
      },
    })
  );

  // Restore the saved cart after the first render
  useEffect(() => {
    store.dispatch(hydrateCart(loadCartItemsFromLocalStorage()));
  }, [store]);

  return (
    <Provider store={store}>
      {children}
      <ToastContainer />
    </Provider>
  );
};

export default ReduxProvider;
