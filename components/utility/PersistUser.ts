"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setUserLoading } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios-instance";
import getToken from "@/utils/token";
import type { ApiResponse, User } from "@/types";

// The purpose of this component to get the logged user again after page load
const PersistUser = (): null => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		const getUser = async () => {
			// Not logged in: nothing to fetch (the API answers this with an error)
			if (!getToken()) {
				dispatch(setUser(null));
				dispatch(setUserLoading(false));
				return;
			}
			dispatch(setUserLoading(true));
			try {
				const response = await axiosInstance.get<ApiResponse<User>>(`user`);
				dispatch(setUser(response.data.data));
				dispatch(setUserLoading(false));
			} catch (error) {
				console.log(error);
				// console.log(error);
				dispatch(setUser(null));
				dispatch(setUserLoading(false));
			}
		};
		getUser();
	}, [dispatch]);

	return null;
};

export default PersistUser;
