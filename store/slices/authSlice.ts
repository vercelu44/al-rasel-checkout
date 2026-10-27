import axiosInstance from "@/lib/axios-instance";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

export interface AuthState {
	user: User | null;
	isLoading: boolean;
	isLoginModalOpen: boolean;
}

const initialState: AuthState = {
	user: null,
	isLoading: true,
	isLoginModalOpen: false,
};

export const logoutUser = createAsyncThunk(
	"auth/logoutUser",
	async (_: void, thunkAPI) => {
		try {
			const response = await axiosInstance.get(`logout`);
			return response.data;
		} catch (error) {
			console.log(error);
			return thunkAPI.rejectWithValue(error);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUserLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setUser: (state, action: PayloadAction<User | null>) => {
			state.user = action.payload;
			state.isLoading = false;
		},
		setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isLoginModalOpen = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(logoutUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				localStorage.removeItem("token");
				window.location.replace("/");
				state.user = null;
				state.isLoading = false;
			})
			.addCase(logoutUser.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const { setUserLoading, setUser, setLoginModalOpen } = authSlice.actions;

export default authSlice.reducer;
