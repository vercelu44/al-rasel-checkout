"use client";
import React, { useEffect, useState } from "react";
import {
	CallFillIcon,
	CallIcon,
	CartIcon,
	CategoryFillIcon,
	CategoryIcon,
	HomeIFillIcon,
	HomeIcon,
	MessengerFillIcon,
	MessengerIcon,
	ProfileFillIcon,
	ProfileIcon,
} from "@/components/elements/svg";
import { useDispatch, useSelector } from "react-redux";
import { useParams, usePathname } from "next/navigation";
import { Link } from "@/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toggleCart } from "@/store/slices/cartSlice";

export default function BottomNavigation() {
	const { translations, settings } = useSelector((state) => state.common);
	const pathArray = usePathname().split("/");
	const isMobile = useMediaQuery("(max-width: 768px)");
	const pathname = usePathname();
	const params = useParams();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const messengerUser = settings?.facebook_link?.split("/")[3] || "no-user";
	const phone = settings?.phone || ["0170000000"];
	const [hasBottomNav, setHasBottomNav] = useState(false);
	const isGuestCheckout = !!settings?.guest_checkout;

	useEffect(() => {
		const checkBottomNav = () => {
			if (typeof window !== "undefined") {
				const vh = window.innerHeight;
				const documentHeight = document.documentElement.clientHeight;
				const bottomNavHeight = vh - documentHeight;
				setHasBottomNav(bottomNavHeight > 0);
			}
		};

		window.addEventListener("resize", checkBottomNav);
		checkBottomNav();

		return () => {
			window.removeEventListener("resize", checkBottomNav);
		};
	}, []);

	if (
		!isMobile ||
		pathArray.includes("checkout") ||
		(pathArray.includes("products") && params.slug) ||
		(pathArray.includes("dashboard") &&
			pathArray[pathArray.length - 1] !== "dashboard")
	)
		return null;

	const menuList = [
		{
			href: "/",
			name: translations["home"],
			icon: <HomeIcon />,
			activeIcon: <HomeIFillIcon />,
		},
		{
			href: "/categories",
			name: translations["category"],
			icon: <CategoryIcon />,
			activeIcon: <CategoryFillIcon />,
		},
		{
			href: isGuestCheckout ? null : `${user ? "/dashboard" : "/mobile-login"}`,
			name: isGuestCheckout
				? translations["cart"] || "কার্ট"
				: translations["profile"] || "প্রোফাইল",
			icon: isGuestCheckout ? <CartIcon /> : <ProfileIcon />,
			activeIcon: isGuestCheckout ? <CartIcon /> : <ProfileFillIcon />,
			onClick: () => dispatch(toggleCart()), // Properly defining onClick handler,
		},
		{
			href: `https://m.me/${messengerUser}`,
			name: translations["chat"],
			icon: <MessengerIcon />,
			activeIcon: <MessengerFillIcon />,
		},
		{
			href: `tel:${phone[0]}`,
			name: translations["call"],
			icon: <CallIcon />,
			activeIcon: <CallFillIcon />,
		},
	];

	return (
		<div
			className={`pb-[${
				hasBottomNav ? "env(safe-area-inset-bottom)" : "50px"
			}] bg-white`}
		>
			<div className="fixed bottom-0 left-0 z-20 w-screen bg-white rounded-t-xl">
				<div className="shadow-top grid h-full max-w-lg items-center grid-cols-5 mx-auto font-medium py-2">
					{menuList.map((menu, index) => (
						<Link
							key={index}
							href={menu.href || "#"}
							onClick={(e) => {
								if (!menu.href) {
									e.preventDefault();
									menu.onClick();
								}
							}}
							type="button"
							className="inline-flex flex-col items-center justify-center px-5 group"
						>
							{pathname === menu.href ? (
								<>
									{React.cloneElement(menu.activeIcon, {
										fillClass: "fill-primary",
										strokeClass: "stroke-primary",
									})}
									<span className="mt-2 text-xs/[100%] text-primary capitalize">
										{menu.name}
									</span>
								</>
							) : (
								<>
									{menu.icon}
									<span className="mt-2 text-xs/[100%] text-slate-400 capitalize">
										{menu.name}
									</span>
								</>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
