"use client";
import type * as React from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import LoaderOverlay from "../elements/loaders/LoaderOverlay";
import { setLoginModalOpen } from "@/store/slices/authSlice";

/**
 * Wraps a page/layout so only logged-in users (or guests on checkout,
 * when guest checkout is enabled) can see it.
 */
const RequireAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
	const AuthComponent = (props: P) => {
		const { user, isLoading } = useAppSelector((state) => state.auth);
		const { settings } = useAppSelector((state) => state.common);
		const router = useRouter();
		const pathName = usePathname();
		const dispatch = useAppDispatch();

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
