"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "@/store/slices/cartSlice";
import { siteConfig } from "@/config/site";
import cartImage from "@/public/assets/images/cart.gif";
import dynamic from "next/dynamic";
import { getCartTotal } from "@/lib/checkout";
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
	ssr: false,
});

const CartTray = () => {
	const { cart } = useSelector((state) => state.cart);
	const { translations } = useSelector((state) => state.common);
	const dispatch = useDispatch();

	const handleCart = () => {
		dispatch(toggleCart());
	};

	return (
		<>
			<div
				className="cart fixed top-1/2 ltr:right-0 rtl:left-0 cursor-pointer z-30 hidden md:block"
				onClick={handleCart}
			>
				<div className="icon bg-white border ltr:border-r-0 border-primary rounded-ss-lg px-1 text-center">
					<Image
						src={cartImage}
						width={56}
						height={56}
						alt="Cart Icon"
						className="p-1 h-14 w-14"
					/>
				</div>
				<div className="content rounded-es-lg text-center">
					<p className="text-xs text-white">
						{cart?.length} {translations["item" || "আইটেম"]}
					</p>
					<div className="text-xs font-semibold text-white flex items-center justify-center">
						<span className="mr-1">{siteConfig.currency.sign}</span>
						<AnimatedNumbers
							animateToNumber={getCartTotal(cart)}
							includeComma
							locale="en-US"
							transitions={(index) => ({
								type: "spring",
								duration: index + 0.3,
							})}
						></AnimatedNumbers>
						{/* {getMultipliedColumnTotal(cart, "quantity", "new_price")} */}
					</div>
				</div>
			</div>
		</>
	);
};

export default CartTray;
