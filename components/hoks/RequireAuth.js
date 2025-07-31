"use client";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import LoaderOverlay from "../elements/loaders/LoaderOverlay";
import { setLoginModalOpen } from "@/store/slices/authSlice";

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

		if (!user) {
			if (!settings?.guest_checkout) {
				toast.error("Please login first");
				dispatch(setLoginModalOpen(true));
				router.push("/?redirect=" + pathName);
				localStorage.setItem("redirect", pathName);
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

		return <WrappedComponent {...props} />;
	};

	return AuthComponent;
};

export default RequireAuth;
