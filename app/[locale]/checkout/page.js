"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { siteConfig } from "@/config/site";
import RequireAuth from "@/components/hoks/RequireAuth";
import * as pixel from "/lib/fpixel";
import {
	getCartTotal,
	getCouponDiscount,
	getOrderFormattedCartItems,
} from "@/lib/checkout";

//components
import CartCard from "@/components/cards/CartCard";
import CustomRadio from "@/components/elements/CustomRadio";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";
const CouponModal = dynamic(() => import("@/components/modals/CouponModal"));

//store
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { useGetPaymentMethodsQuery } from "@/store/api/paymentMethodsAPI";

//Icons
import PayOptionIcon from "@/components/elements/svg/PayOptionIcon";
import { FiMinus, FiPlus } from "react-icons/fi";
import useOrderPlace from "@/hooks/useOrderPlace";
import useProfileUpdate from "@/hooks/useProfileUpdate";

const Checkout = () => {
	const { settings, translations, isFbPixelInitialized } = useSelector(
		(state) => state.common
	);
	const deliveryMethods = [
		{
			key: "inside dhaka",
			title: translations["inside-dhaka"] || "ঢাকার ভিতরে",
			charges: settings?.inside_dhaka_delivery_charges,
		},
		{
			key: "outside dhaka",
			title: translations["outside-dhaka"] || "ঢাকার বাহিরে",
			charges: settings?.outside_dhaka_delivery_charges,
		},
	];

	const [selectedPayMethod, setSelectedPayMethod] = useState(null);
	const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[1]);
	const [orderCollapsed, setOrderCollapsed] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const { cart, discountCoupon } = useSelector((state) => state.cart);
	const { user, isLoading } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const { handleOrderPlace } = useOrderPlace(); //custom hook for separating order place business logics
	const { handleUserUpdate } = useProfileUpdate(); //custom hook for separating profile update business logics

	const { data: paymentMethodsData } = useGetPaymentMethodsQuery();
	const paymentMethods = paymentMethodsData?.data || {};

	//slicing cart items based on orderCollapsed
	const cartItems = orderCollapsed ? cart : cart.slice(0, 3);

	const handleSelectedPayMethodChange = (option) => {
		setSelectedPayMethod(option);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		reset();
	}, [user, reset]);

	//Summary calculation
	const total = getCartTotal(cart);
	const couponDiscountedPrice = getCouponDiscount(discountCoupon, total);
	const totalWithDiscount = total - couponDiscountedPrice;
	//Handling free delivery
	const isDeliveryCharge =
		settings?.free_delivery_charges_limit === 0 ||
		settings?.free_delivery_charges_limit > totalWithDiscount;
	// Calculating Grand Total
	const grandTotal = isDeliveryCharge
		? deliveryMethod.charges + totalWithDiscount
		: totalWithDiscount;

	const handleCheckoutSubmit = async (data) => {
		// dispatch(setGlobalLoader(true));
		let phone = data?.phone;
		let alt_phone = data?.phone;

		//for authorized u
		if (!settings?.guest_checkout) {
			alt_phone =
				siteConfig.phone.countryCode + user?.phone || user?.alt_phone_no;
		}
		const newOrder = {
			name: data.name,
			alt_name: data.name,
			phone: phone,
			alt_phone: alt_phone,
			address: data.address,
			alt_address: data.address,
			order_items: getOrderFormattedCartItems(cart),
			payment_type: selectedPayMethod
				? selectedPayMethod.key
				: Object.values(paymentMethods)[0]?.key,
			delivery_type: isDeliveryCharge ? deliveryMethod.key : "free delivery",
			delivery_charge: isDeliveryCharge ? deliveryMethod.charges : 0,
			coupon: couponDiscountedPrice ? discountCoupon?.code : null,
			coupon_discount: couponDiscountedPrice,
			subtotal: total,
			after_discount: totalWithDiscount,
			grand_total: grandTotal,
			// note: "",
		};
		// console.log(newOrder);
		handleOrderPlace(newOrder);

		// updating user for the first time only not applicable for guest checkout
		if (
			((!user?.phone && !user?.alt_phone_no) || !user?.address) &&
			!settings?.guest_checkout
		) {
			handleUserUpdate({
				...user,
				alt_phone_no: data?.phone,
				address: user.address || data.address,
			});
		}
		// else alert("user not updated");
	};

	// Meta Pixel Initiate Checkout Event
	const flag = useRef(true);
	useEffect(() => {
		// Check if product ID exists to avoid errors
		if (isFbPixelInitialized && flag.current && cart.length > 0) {
			pixel.event(
				"InitiateCheckout",
				pixel.getInitiateCheckoutPixelData(cart, total)
			);
			flag.current = false;
		}
	}, [cart, total, isFbPixelInitialized]);

	return (
		<section className="md:container py-3 lg:py-8 mb-14 lg:mb-0">
			<div className="grid lg:grid-cols-2 mb-8 gap-4 lg:gap-8">
				<div className="">
					<h3 className="text-slate-700 text-lg/[26px] font-semibold border-b border-slate-300 mx-3 pb-4 md:mx-0">
						{translations["checkout-info-msg"] ||
							"অর্ডারটি কনফার্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার, লিখে অর্ডার কনফার্ম করুন বাটনে ক্লিক করুন"}
					</h3>
					<form
						className="w-full mt-6"
						onSubmit={handleSubmit(handleCheckoutSubmit)}
					>
						{isLoading ? (
							<ArticleLoader />
						) : (
							<div className="mx-3 md:mx-0">
								<div className="grid lg:grid-cols-2 lg:gap-4">
									<div className="form-control mb-4">
										<label className="block text-base text-slate-900 mb-2">
											{translations["your-name"] || "আপনার নাম"}
										</label>
										<input
											type="text"
											name="name"
											defaultValue={user?.name}
											placeholder={
												translations["enter-your-name"] || "নাম লিখুন"
											}
											{...register("name", {
												required: "Name is required.",
											})}
										/>
										{errors.name && (
											<p className="errorMsg">{errors.name.message}</p>
										)}
									</div>

									<div className="form-control mb-4">
										<label className="block text-base text-slate-900 mb-2">
											{translations["phone-number"] || "মোবাইল নাম্বার"}
										</label>
										<div className="flex items-center group">
											<div className="h-12 py-3 min-w-fit text-base font-title font-normal px-2 rounded-s-lg border bg-slate-100 border-gray-300 group-focus-within:border-primary group-focus-within:border-r-gray-300">
												<p>{siteConfig.phone.prefix}</p>
											</div>
											<input
												type="number"
												className="w-full !pl-2 !rounded-s-none rounded-e-lg border border-l-0 border-gray-300 focus:outline-none group-focus:border-primary"
												name="phone"
												defaultValue={user?.phone || user?.alt_phone_no}
												placeholder={
													translations["your-mobile-number"] ||
													"আপনার মোবাইল নাম্বার"
												}
												{...register("phone", {
													required: "Phone number is required.",
													pattern: {
														value: siteConfig.phone.pattern,
														message: "Please enter a valid phone number",
													},
												})}
											/>
										</div>
										{errors.phone && (
											<p className="errorMsg">{errors.phone.message}</p>
										)}
									</div>
								</div>
								<div className="form-control mb-4">
									<label className="block text-base text-slate-900 mb-2">
										{translations["your-address"] || "আপনার ঠিকানা"}
									</label>
									<textarea
										className="h-[148px] border border-slate-300 p-4"
										type="text"
										name="address"
										defaultValue={user?.address}
										placeholder={
											translations["type-your-address"] ||
											"আপনার সম্পূর্ণ ঠিকানা লিখুন"
										}
										{...register("address", {
											required: "Address is required.",
										})}
									/>
									{errors.address && (
										<p className="errorMsg">{errors.address.message}</p>
									)}
								</div>
							</div>
						)}
						<div className="form-control my-8 hidden lg:block">
							<div className="border-b-2 border-slate-300 border-dashed"></div>
						</div>
						<div className="bg-slate-200 py-2 lg:py-0">
							<div className="form-control py-4 lg:py-0 bg-white">
								<h3 className="inline-flex gap-2 text-xl font-bold px-4 mb-3 md:px-0">
									<PayOptionIcon />
									<span>
										{translations["payment-select-title"] ||
											"আপনি কিভাবে পরিশোধ করতে চান"}
									</span>
								</h3>
								{/* <div className="flex flex-nowrap space-x-4"> */}
								<HorizontalScrollView>
									{Object.keys(paymentMethods).map((method, index) =>
										paymentMethods[method].status === 1 ? (
											<div
												key={index}
												onClick={() =>
													handleSelectedPayMethodChange(paymentMethods[method])
												}
												className={`rounded-lg flex-shrink-0 w-[196px] h-[112px] p-4 ${
													(!selectedPayMethod && index === 0) ||
													paymentMethods[method]?.key === selectedPayMethod?.key
														? "bg-amber-200 border border-primary"
														: "bg-slate-100"
												} relative text-slate-700 flex flex-col justify-between gap-2`}
											>
												<div className="flex justify-end">
													<CustomRadio
														isChecked={
															selectedPayMethod
																? paymentMethods[method].key ===
																  selectedPayMethod.key
																: index === 0
														}
													/>
												</div>
												<div className="w-2/3">
													<Image
														src={paymentMethods[method].icon}
														height={32}
														width={150}
														alt="icon"
														className="h-8 w-auto object-left object-contain"
													/>
												</div>
												<h3>{paymentMethods[method].title}</h3>
											</div>
										) : null
									)}
								</HorizontalScrollView>
								{/* </div> */}
							</div>
						</div>
						{/* oder confirm button  */}
						<div className="form-control md:mt-11 responsive-action flex lg:block justify-between items-center">
							<div className="lg:hidden">
								<p className="">{translations["total"]}:</p>
								<h3 className="text-slate-900 font-bold">
									{siteConfig.currency.sign}
									{grandTotal}
								</h3>
							</div>
							<button
								disabled={!cart?.length}
								type="submit"
								className="primary-btn  w-[232px] lg:w-full disabled:bg-slate-300 disabled:cursor-not-allowed"
							>
								{translations["confirm-order"] || "অর্ডার কনফার্ম করুন"}
							</button>
						</div>
					</form>
				</div>
				<div className="bg-slate-200 rounded-lg p-3 lg:p-6 mx-3 md:mx-0 ">
					<h3 className="text-lg/[26px] text-slate-700 font-semibold">
						{translations["your-order"] || "আপনার অর্ডার"}
					</h3>
					<div
						className={`overflow-auto scrollbar-hide ${
							orderCollapsed && "md:h-[748px]"
						}`}
					>
						<div className="mt-4">
							{cartItems.map((item, index) =>
								index == 2 && !orderCollapsed ? (
									<div key={item.barcodeId} className="relative">
										<CartCard item={item} />
										<div className="w-full h-full rounded absolute left-0 top-0 flex-center gradient-white">
											<button
												className="text-btn mt-20 font-bold"
												onClick={() => setOrderCollapsed(true)}
											>
												<FiPlus />
												{translations["more"] || "আরও"} {cart.length - 2}
											</button>
										</div>
									</div>
								) : (
									<CartCard key={item.barcodeId} item={item} />
								)
							)}
							{/*             {orderCollapsed && (
              <div className="text-center">
                <button
                  className="text-btn font-bold text-center"
                  onClick={() => setOrderCollapsed(false)}
                >
                  <FiMinus />
                  {translations["see-less"] || "কমান"}
                </button>
              </div>
            )} */}
						</div>

						<div className="p-4 mt-4 lg:mt-8 bg-amber-200 shadow border border-primary-200 rounded-lg">
							<h4 className="text-slate-700">
								{translations["select-delivery-method"] ||
									"ডেলিভারি মেথড নির্বাচন করুন"}
							</h4>
							<div className="flex flex-col lg:flex-row gap-3 lg:gap-12 lg:items-center py-3">
								{deliveryMethods.map((dm) => (
									<div key={dm.key} className={`flex gap-2 items-center`}>
										<CustomRadio
											isChecked={deliveryMethod.key === dm.key}
											label={dm.title}
											onClick={() => setDeliveryMethod(dm)}
										/>
										<p
											className={`font-semibold ${
												!isDeliveryCharge && "line-through"
											}`}
										>
											{siteConfig.currency.sign}
											{dm.charges}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className="text-slate-700 p-4 rounded-lg shadow bg-white mt-2">
							<div className="flex-between my-2">
								<p>{translations["total"] || "সর্বমোট"}</p>
								<p>
									{siteConfig.currency.sign}
									{total}
								</p>
							</div>
							<div className="flex-between my-2">
								<p>{translations["discount-amount"] || "ডিসকাউন্ট পাচ্ছেন"}</p>
								<p className="text-red-500">
									-{siteConfig.currency.sign}
									{couponDiscountedPrice}
								</p>
							</div>
							<div className="flex-between my-2">
								<p>
									{translations["coupon-discount"] || "কুপন/প্রোমো ডিসকাউন্ট"}
								</p>
								{discountCoupon ? (
									<span className="text-primary">{discountCoupon.code}</span>
								) : (
									<button
										className="text-btn underline"
										onClick={() => setShowModal(true)}
									>
										{translations["coupon-code"] || "কোড যোগ করুন"}
									</button>
								)}
							</div>
							<div className="border-b border-slate-300 my-2"></div>
							<div className="flex-between my-2">
								<p>{translations["total-with-discount"] || "মোট পরিমান"}</p>
								<p>
									{siteConfig.currency.sign}
									{totalWithDiscount}
								</p>
							</div>

							<div className="flex-between my-2">
								<p>{translations["delivery-charge"] || "ডেলিভারি চার্জ"}</p>
								<p>
									{siteConfig.currency.sign}
									{isDeliveryCharge ? deliveryMethod.charges : 0}
								</p>
							</div>

							<div className="border-b border-slate-900 my-2"></div>
							<div className="flex-between my-2 font-bold">
								<p>{translations["grand-total"] || "পরিশোধ করতে হবে"}</p>

								<p>
									{siteConfig.currency.sign}
									{grandTotal}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{showModal && (
				<CouponModal
					showModal={showModal}
					setShowModal={setShowModal}
					total={total}
				/>
			)}
		</section>
	);
};

export default RequireAuth(Checkout);
