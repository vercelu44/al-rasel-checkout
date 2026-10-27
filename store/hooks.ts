/**
 * Typed versions of the react-redux hooks.
 * Use these instead of plain `useDispatch` / `useSelector` so `state`
 * and `dispatch` are fully typed.
 */
import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
