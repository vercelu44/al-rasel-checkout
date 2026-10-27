"use client";
import React from "react";
import CartCard from "../cards/CartCard";
import { siteConfig } from "@/config/site";
import { getCartTotal } from "@/lib/checkout";
import DrawerRight from "@/components/elements/DrawerRight";
import { toggleCart } from "@/store/slices/cartSlice";
import { HiArrowLongRight } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useCartItems from "@/hooks/useCartItems";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import { setLoginModalOpen } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

const Cart = () => {
	const { isCartOpen } = useAppSelector((state) => state.cart);
	const cart = useCartItems(); // hydration-safe cart
	const { settings, translations } = useAppSelector((state) => state.common);
	const { user } = useAppSelector((state) => state.auth);
	const { handleSelectChange } = useSelectURLQuery();
	const router = useRouter();
	// console.log(settings);
	const dispatch = useAppDispatch();
	const closeCart = () => {
		dispatch(toggleCart());
	};

	const handleCheckoutNavigate = () => {
		if (user || settings?.guest_checkout === 1) {
			router.push("/checkout");
			closeCart();
			return;
		}
		closeCart();
		dispatch(setLoginModalOpen(true));
		handleSelectChange("redirect", "/checkout");
	};

	return (
		<DrawerRight
			title={`${translations["cart"] || "Cart"}: (${cart.length} ${
				translations["item"] || "item"
			})`}
			show={isCartOpen}
			setShow={closeCart}
		>
			{settings?.free_delivery_charges_limit > 0 ? (
				<div
					className="p-4 shadow-sm"
					style={{
						backgroundColor: settings?.colors?.primary,
						color: settings?.colors?.primary_text,
					}}
				>
					Orders over {settings?.free_delivery_charges_limit} taka free delivery
					charge!
				</div>
			) : null}
			<div className="p-8 flex flex-col h-[77%]">
				<div className="overflow-y-auto">
					{cart.map((item) => (
						<CartCard key={item.id} item={item} />
					))}
				</div>
			</div>
			<div className="fixed left-0 bottom-0 w-full p-4 bg-slate-50 border-t border-slate-200 flex gap-12 justify-between items-center">
				<div className="text-center">
					<p className="">{translations["total"] || "Total"}:</p>
					<h3 className="text-slate-900 font-bold">
						{/* {`${siteConfig.currency.shortForm}${getMultipliedColumnTotal(cart, "quantity", "new_price")}`} */}
						{`${siteConfig.currency.shortForm}${getCartTotal(cart)}`}
					</h3>
				</div>
				<button
					onClick={handleCheckoutNavigate}
					className="py-3 px-3 md:px-6 w-full md:w-[276px] text-center active:scale-95 rounded-lg"
					style={{
						backgroundColor: settings?.colors?.primary,
						color: settings?.colors?.primary_text,
						border: `1px solid ${settings?.colors?.primary_text}`,
					}}
				>
					<span className="mr-2">
						{translations["checkout-now"] || "Checkout Now"}
					</span>
					<HiArrowLongRight size={20} />
				</button>
			</div>
		</DrawerRight>
	);
};

export default Cart;
