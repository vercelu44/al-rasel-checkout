"use client";

import { useDispatch, useSelector } from "react-redux";
import { siteConfig } from "@/config/site";
import { getCartTotal } from "@/lib/checkout";

// import { TbCurrencyTaka } from "react-icons/tb";
import { BsCart3 } from "react-icons/bs";
import { toggleCart } from "@/store/slices/cartSlice";
import { HiOutlineShoppingBag } from "react-icons/hi";

const CartTray = () => {
	const { cart } = useSelector((state) => state.cart);
	const { settings, translations } = useSelector((state) => state.common);
	const dispatch = useDispatch();

	const handleCart = () => {
		dispatch(toggleCart());
	};

	// console.log(settings?.colors);

	return (
		<>
			<div
				style={{
					color: settings?.colors?.primary_text,
					border: `1px solid ${settings?.colors?.primary}`,
				}}
				className={`cart fixed top-1/2 mt-16 md:mt-0 right-0 cursor-pointer z-20 rounded-s-md overflow-hidden }`}
				onClick={handleCart}
			>
				<div
					className="icon p-2 pb-0 text-center "
					style={{
						color: settings?.colors?.default_text,
						backgroundColor: settings?.colors?.secondary
					}}
				>
					{/* <BsCart3 size={28} className="m-1" /> */}
					<HiOutlineShoppingBag size={28} className="" />
					<p className="text-sm mt-1">
						{cart?.length} {translations["ITEMS"] || "ITEMS"}
					</p>
				</div>
				<div
					className="text-center p-2"
					style={{ backgroundColor: settings?.colors?.primary }}
				>

					<div className="text-sm font-semibold flex gap-1 items-center justify-center">
						{/* <p>{siteConfig.currency.shortForm}</p> */}
						<span>৳</span>
						<span key={getCartTotal(cart)} className="animate-countup">	{getCartTotal(cart) || "0.00"}</span>
					
					</div>
				</div>
			</div>
		</>
	);
};

export default CartTray;
