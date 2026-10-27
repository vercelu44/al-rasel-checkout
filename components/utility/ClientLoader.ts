"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	// setLocale,
	setSettings,
	setTranslations,
} from "@/store/slices/commonSlice";
import type { SiteSettings, Translations } from "@/types";
// import apiSlice from "@/store/features/api/apiSlice";

interface ClientLoaderProps {
	settings: SiteSettings;
	translations: Translations;
}

export default function ClientLoader({
	settings: settingsProp,
	translations: translationsProp,
	// locale: localeProp,
}: ClientLoaderProps): null {
	const dispatch = useAppDispatch();
	// console.log(localeProp);
	// const { locale } = useAppSelector((state) => state.common);
	// console.log(locale, "dsdsd");

	useEffect(() => {
		if (settingsProp) {
			try {
				dispatch(setSettings(settingsProp));
			} catch (error) {
				console.log(error);
			}
		}
		if (translationsProp) {
			try {
				dispatch(setTranslations(translationsProp));
			} catch (error) {
				console.log(error); // translations not found
			}
		}

		// if (localeProp !== locale) {
		//   console.log("checking");
		//   try {
		//     dispatch(setLocale(localeProp));
		//     // dispatch(apiSlice.util.resetApiState());
		//     // dispatch(apiSlice.util.invalidateTags(["wishlist"]));
		//   } catch (error) {
		//     console.log(error);
		//   }
		// }
	}, [dispatch, settingsProp, translationsProp]);
	return null;
}
