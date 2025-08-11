"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setUserLoading } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios-instance";

// The purpose of this component to get the logged user again after page load
const PersistUser = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const getUser = async () => {
			dispatch(setUserLoading(true));
			try {
				const response = await axiosInstance.get(`user`);
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
