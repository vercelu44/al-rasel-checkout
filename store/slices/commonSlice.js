import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isGlobalLoading: false,
	locale: "en",
	isFilterPanelOpen: false,
	settings: {},
	settingsLoading: true,
	translations: {},
	translationsLoading: true,
	videoPlayerConfig: { url: "", className: "" }, //All react player config is supported
	isFbPixelInitialized: false,
	isDeliveryAddressModalOpen: false,
};

const commonSlice = createSlice({
	name: "common",
	initialState,
	reducers: {
		setGlobalLoader: (state, action) => {
			state.isGlobalLoading = action.payload;
		},
		toggleFilterPanel: (state) => {
			state.isFilterPanelOpen = !state.isFilterPanelOpen;
		},
		setSettings: (state, action) => {
			state.settings = action.payload;
			state.settingsLoading = false;
		},
		setTranslations: (state, action) => {
			state.translations = action.payload;
			state.translationsLoading = false;
		},
		setRedirectRoute: (state, action) => {
			state.redirectRoute = action.payload;
		},
		setLocale: (state, action) => {
			state.locale = action.payload;
		},
		setFbPixelInitialized: (state, action) => {
			state.isFbPixelInitialized = action.payload;
		},
		startVideoPlayer: (state, action) => {
			state.videoPlayerConfig = action.payload;
		},
		closeVideoPlayer: (state, action) => {
			state.videoPlayerConfig = action.payload;
		},
		setDeliveryAddressModalOpen: (state, action) => {
			state.isDeliveryAddressModalOpen = action.payload;
		},
	},
});

export const {
	setGlobalLoader,
	toggleFilterPanel,
	setSettings,
	setTranslations,
	setLocale,
	setFbPixelInitialized,
	startVideoPlayer,
	closeVideoPlayer,
	setDeliveryAddressModalOpen,
} = commonSlice.actions;

export default commonSlice.reducer;
