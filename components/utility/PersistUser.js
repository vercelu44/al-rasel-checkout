"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserLoading } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios-instance";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// The purpose of this component to get the logged user again after page load
const PersistUser = () => {
	const { data: session, status } = useSession();
	const { user, isLoading } = useSelector((state) => state.auth);
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useDispatch();

	useEffect(() => {
		const getUser = async () => {
			if (!user && !session) {
				try {
					const response = await axiosInstance.get(`user`);
					dispatch(setUser(response.data.data));
					dispatch(setUserLoading(false));
				} catch (error) {
					// console.log(error); 
					// dispatch(setUser(null));
					dispatch(setUserLoading(false));
				}
			}
		};
		getUser();
	}, [dispatch, session, user]);

	// Persist social logged in / next-auth  user
	useEffect(() => {
		if (!user && session) {
			dispatch(setUser(session.data));
			dispatch(setUserLoading(false));
			localStorage.setItem("token", session.token);
			const redirect = searchParams.get("redirect");
			// router.push(redirect || "/dashboard");
			if (redirect) {
				router.push(redirect);
			}
		}
	}, [session, dispatch, router, searchParams, user]);

	return null;
};

export default PersistUser;
