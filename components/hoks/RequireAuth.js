"use client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoaderOverlay from "../elements/loaders/LoaderOverlay";
import { setLoginModalOpen } from "@/store/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";

const RequireAuth = (WrappedComponent) => {
	const AuthComponent = (props) => {
		const { user, isLoading } = useSelector((state) => state.auth);
		const { settings } = useSelector((state) => state.common);
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
			if (!settings?.guest_checkout) {
				toast.error("Please login first");
				dispatch(setLoginModalOpen(true));
				router.push("/?redirect=" + pathName);
				return null;
			}

			if (
				settings?.guest_checkout === 1 &&
				pathName.split("/").includes("checkout")
			) {
				return <WrappedComponent {...props} />;
			}

			router.push("/");
			return null;
		}

		// If the user is authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};

	return AuthComponent;
};

export default RequireAuth;
