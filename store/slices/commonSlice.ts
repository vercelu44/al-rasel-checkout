import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category, SiteSettings, Translations } from "@/types";

/** Config for the global video player modal (any react-player prop is allowed). */
export interface VideoPlayerConfig {
	url: string;
	title?: string;
	className?: string;
	[playerProp: string]: unknown;
}

export interface CommonState {
	isGlobalLoading: boolean;
	locale: string;
	isFilterPanelOpen: boolean;
	settings: SiteSettings | null;
	translations: Translations;
	/** Category whose sub categories are shown in the navbar. */
	activeCategory: Category | null;
	/** `undefined` after the player is closed */
	videoPlayerConfig: VideoPlayerConfig | undefined;
	isFbPixelInitialized: boolean;
}

// exported so the store can be preloaded with server data (see store/index.js)
export const initialState: CommonState = {
	isGlobalLoading: false,
	locale: "en",
	isFilterPanelOpen: true,
	settings: null,
	translations: {},
	activeCategory: null, //subcategories for navbar
	videoPlayerConfig: { url: "", className: "" }, //All react player config is supported
	isFbPixelInitialized: false,
};

const commonSlice = createSlice({
	name: "common",
	initialState,
	reducers: {
		setGlobalLoader: (state, action: PayloadAction<boolean>) => {
			state.isGlobalLoading = action.payload;
		},
		toggleFilterPanel: (state) => {
			state.isFilterPanelOpen = !state.isFilterPanelOpen;
		},
		setSettings: (state, action: PayloadAction<SiteSettings | null>) => {
			state.settings = action.payload;
		},
		setTranslations: (state, action: PayloadAction<Translations>) => {
			state.translations = action.payload;
		},
		setLocale: (state, action: PayloadAction<string>) => {
			state.locale = action.payload;
		},
		setFbPixelInitialized: (state, action: PayloadAction<boolean>) => {
			state.isFbPixelInitialized = action.payload;
		},
		setActiveCategory: (state, action: PayloadAction<Category | null>) => {
			state.activeCategory = action.payload;
		},
		startVideoPlayer: (state, action: PayloadAction<VideoPlayerConfig>) => {
			state.videoPlayerConfig = action.payload;
		},
		closeVideoPlayer: (state, action: PayloadAction<VideoPlayerConfig | undefined>) => {
			state.videoPlayerConfig = action.payload;
		},
	},
});

export const {
	setGlobalLoader,
	toggleFilterPanel,
	setSettings,
	setTranslations,
	setLocale,
	setActiveCategory,
	setFbPixelInitialized,
	startVideoPlayer,
	closeVideoPlayer,
} = commonSlice.actions;

export default commonSlice.reducer;
