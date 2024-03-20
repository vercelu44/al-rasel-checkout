"use client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoaderOverlay from "../elements/loaders/LoaderOverlay";
import { setLoginModalOpen } from "@/store/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";

const RequireAuth = (WrappedComponent) => {
	const AuthComponent = (props) => {
		const { user, isLoading } = useSelector((state) => state.auth);
		const router = useRouter();
		const pathName = usePathname();
		const dispatch = useDispatch();

		if (isLoading) {
			return (
				<div className="min-h-screen">
					<LoaderOverlay />
				</div>
			);
		}

		// If the user is not authenticated, redirect to the login page
		if (!user) {
			toast.error("Please login first");
			dispatch(setLoginModalOpen(true));
			router.push("/?redirect=" + pathName);
			return null;
		}

		// If the user is authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};

	return AuthComponent;
};

export default RequireAuth;
