"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { siteConfig } from "@/config/site";
import RequireAuth from "@/components/hoks/RequireAuth";
import {
  getCartTotal,
  getCouponDiscount,
  getOrderFormattedCartItems,
} from "@/lib/checkout";
import CartCard from "@/components/cards/CartCard";
import CustomRadio from "@/components/elements/CustomRadio";
import ArticleLoader from "@/components/elements/loaders/ArticleLoader";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";
const CouponModal = dynamic(() => import("@/components/modals/CouponModal"));
import useOrderPlace from "@/hooks/useOrderPlace";
import useProfileUpdate from "@/hooks/useProfileUpdate";
import CouponField from "@/components/elements/CouponField";
import * as pixel from "/lib/fpixel";
import { useGetPaymentMethodsQuery } from "@/store/api/paymentMethodsAPI";
import PayOptionIcon from "@/components/elements/svg/PayOptionIcon";
import { FiPlus } from "react-icons/fi";
import { cn } from "@/utils";
import Script from "next/script";

const Checkout = () => {
  const { settings, translations, isFbPixelInitialized } = useSelector(
    (state) => state.common
  );

  const deliveryAreas = [
    {
      key: `inside dhaka`,
      title: `Inside ${settings?.delivery_region || "Dhaka"}`,
      charges: settings?.inside_dhaka_delivery_charges,
    },
    // {
    // 	key: "sub dhaka",
    // 	title: `Sub ${settings?.delivery_region || "Dhaka"}`,
    // 	charges: settings?.sub_dhaka_delivery_charges,
    // },
    {
      key: "outside dhaka",
      title: `Outside ${settings?.delivery_region || "Dhaka"}`,
      charges: settings?.outside_dhaka_delivery_charges,
    },
  ];

  const [deliveryArea, setDeliveryArea] = useState(null); // default delivery area removed
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [isDeliveryChargeRequired, setIsDeliveryChargeRequired] =
    useState(false);
  const [activePaymentMethods, setActivePaymentMethods] = useState(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [orderCollapsed, setOrderCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { cart, discountCoupon } = useSelector((state) => state.cart);
  const { user, isLoading } = useSelector((state) => state.auth);
  const { handleOrderPlace } = useOrderPlace(); //custom hook for separating order place business logics
  const { handleUserUpdate } = useProfileUpdate(); //custom hook for separating profile update business logics

  const { data: paymentMethodsData } = useGetPaymentMethodsQuery();
  const paymentMethods = useMemo(
    () => paymentMethodsData?.data || {},
    [paymentMethodsData]
  );

  //slicing cart items based on orderCollapsed
  const cartItems = orderCollapsed ? cart : cart.slice(0, 3);

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
  const discountedPrice = getCouponDiscount(discountCoupon, total);
  const totalWithDiscount = total - discountedPrice;

  //Handling free delivery charge
  const deliveryCharge =
    settings?.free_delivery_charges_limit > totalWithDiscount ||
    settings?.free_delivery_charges_limit <= 0
      ? deliveryArea?.charges || 0
      : 0;

  const grandTotal = totalWithDiscount + deliveryCharge;

  //Handling delivery area and delivery charge Required
  const handleDeliveryAreaChange = (area) => {
    setDeliveryArea(area);
    setSelectedPaymentOption(null);
    switch (area?.key) {
      case "inside dhaka":
        settings?.is_delivery_charge_required_for_inside
          ? setIsDeliveryChargeRequired(true)
          : setIsDeliveryChargeRequired(false);
        break;
      case "sub dhaka":
        settings?.is_delivery_charge_required_for_sub_region
          ? setIsDeliveryChargeRequired(true)
          : setIsDeliveryChargeRequired(false);
        break;
      case "outside dhaka":
        settings?.is_delivery_charge_required_for_outside
          ? setIsDeliveryChargeRequired(true)
          : setIsDeliveryChargeRequired(false);
        break;
      default:
        setIsDeliveryChargeRequired(false);
        break;
    }
  };

  //auto select payment method
  useEffect(() => {
    if (Object.keys(paymentMethods).length > 0) {
      let activePayments = Object.values(paymentMethods).filter(
        (payMethod) => payMethod?.status === 1
      );

      if (activePayments?.length > 1 && activePayments[0].key === "COD") {
        setSelectedPayMethod(activePayments[1]);
      } else {
        setSelectedPayMethod(activePayments[0]);
      }
      setActivePaymentMethods(activePayments);
    }
  }, [paymentMethods]);

  const paymentOptions = [
    {
      key: "no_payment",
      title: `Cash on deliveryhdhd`,
      value: grandTotal,
    },
    activePaymentMethods?.length > 1 && deliveryArea?.charges
      ? {
          key: "delivery_charge_payment",
          title: `Pay delivery charge only`,
          value: deliveryArea.charges,
        }
      : null,
    activePaymentMethods?.length > 1
      ? {
          key: "total_payment",
          title: `Pay total amount`,
          value: grandTotal,
        }
      : null,
  ].filter((option) => option !== null);

  const handleCheckoutSubmit = async (data) => {
    if (!deliveryArea) {
      document.getElementById("deliveryAreaError").classList.remove("hidden");
      toast.error("Please select delivery area");
      return;
    }

    if (!selectedPaymentOption) {
      document.getElementById("paymentOptionError").classList.remove("hidden");
      toast.error("Please select payment option");
      return;
    }

    let phone = data?.phone;
    let alt_phone = data?.phone;
    let fullAddress = data.address;

    //for authorized user
    if (!settings?.guest_checkout) {
      // siteConfig.phone.countryCode +
      alt_phone = user?.phone || user?.alt_phone_no;
    }
    const newOrder = {
      name: data.name,
      alt_name: data.name,
      phone: phone,
      alt_phone: alt_phone,
      address: fullAddress,
      alt_address: fullAddress,
      order_items: getOrderFormattedCartItems(cart),
      payment_method: selectedPayMethod,
      delivery_type: deliveryCharge ? deliveryArea.key : "free delivery",
      delivery_charge: deliveryCharge,
      coupon: discountCoupon?.code || null,
      coupon_discount: discountedPrice,
      subtotal: total,
      after_discount: totalWithDiscount,
      grand_total: grandTotal,
      paymentOption: selectedPaymentOption,
      // note: "",
    };
    console.log(newOrder);
    handleOrderPlace(newOrder);

    // updating user for the first time only not applicable for guest checkout
    // if (
    // 	((!user?.phone && !user?.alt_phone_no) || !user?.address) &&
    // 	!settings?.guest_checkout
    // ) {
    // 	handleUserUpdate({
    // 		...user,
    // 		alt_phone_no: user?.alt_phone_no || data?.phone,
    // 		address: user.address || data?.address,
    // 		city: data?.city,
    // 	});
    // }
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

  const defaultAddress = settings?.guest_checkout
    ? localStorage.getItem("userLocation")
    : user?.address || localStorage?.getItem("userLocation");

  return (
    <>
      {/* Required for southeastbank payment gateway */}
      <Script
        src={process.env.NEXT_PUBLIC_SOUTHEAST_SCRIPT_URI}
        // data-error="errorCallback"
        // data-cancel="cancelCallback"
      />
      <section className="md:container py-3 lg:py-8 mb-14 lg:mb-0">
        <div className="grid lg:grid-cols-6 mb-8 gap-4 lg:gap-8">
          <div className="md:col-span-3">
            <h3 className="text-slate-700 text-lg/[26px] font-semibold mx-3 pb-4 md:mx-0">
              {translations["checkout-info-msg"] ||
                "Please give your Name, Address and Phone number to complete your order."}
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
                        {translations["your-name"] || "Your Name"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={user?.name}
                        placeholder={
                          translations["enter-your-name"] || "Write your name"
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
                        {translations["phone-number"] || "Phone Number"}
                      </label>
                      <div className="flex items-center group">
                        {process.env.NEXT_PUBLIC_OTP_LOGIN === "YES" ? (
                          <div className="h-12 py-3 min-w-fit text-base font-title font-normal px-2 rounded-s-lg border bg-slate-100 border-gray-300 group-focus-within:border-primary group-focus-within:border-r-gray-300">
                            <p>{siteConfig.phone.prefix}</p>
                          </div>
                        ) : null}
                        <input
                          type="number"
                          className="w-full !pl-2  rounded-lg border border-gray-300 focus:outline-none group-focus:border-primary"
                          name="phone"
                          defaultValue={user?.phone || user?.alt_phone_no}
                          placeholder={
                            translations["your-mobile-number"] ||
                            "Your Mobile Number"
                          }
                          {...register("phone", {
                            required: "Phone number is required.",
                            // pattern: {
                            // 	value: siteConfig.phone.pattern,
                            // 	message: "Please enter a valid phone number",
                            // },
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
                      {translations["your-address"] || "Your Address"}
                    </label>
                    <textarea
                      className="h-[148px] border border-slate-300 p-4"
                      type="text"
                      name="address"
                      defaultValue={defaultAddress}
                      placeholder={
                        translations["type-your-address"] ||
                        "Write  your address"
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

              {/* Payment Options Area */}
              {deliveryArea ? (
                <div className="form-control">
                  <h4 className="text-xl font-bold">
                    {translations["payment-options"] || "Payment Options"}
                  </h4>
                  <div className="flex flex-col gap-3 pt-3">
                    {paymentOptions.map((payOption) =>
                      payOption.key === "no_payment" &&
                      isDeliveryChargeRequired &&
                      activePaymentMethods?.length > 1 ? null : (
                        <button
                          key={payOption.key}
                          type="button"
                          className="flex gap-2 items-center border bg-slate-100 border-slate-200 p-3"
                          onClick={() =>
                            setSelectedPaymentOption(payOption.key)
                          }
                        >
                          <CustomRadio
                            isChecked={payOption.key === selectedPaymentOption}
                            label={payOption.title}
                            // onClick={() => setDeliveryArea(pt)}
                          />
                          <p>
                            {siteConfig.currency.sign} {payOption.value}
                          </p>
                        </button>
                      )
                    )}
                  </div>
                  {!selectedPaymentOption && (
                    <p id="paymentOptionError" className="hidden errorMsg">
                      You must select a payment option
                    </p>
                  )}
                </div>
              ) : null}

              {/* Payment Methods Area */}
              {(selectedPaymentOption === "delivery_charge_payment" ||
                selectedPaymentOption === "total_payment") && (
                <div className="bg-slate-200 py-2 lg:py-0 mt-6">
                  <div className="form-control py-4 lg:py-0 bg-white">
                    <h3 className="inline-flex gap-2 text-xl font-bold px-4 mb-3 md:px-0">
                      <PayOptionIcon />
                      <span>
                        {translations["how-would-you-like-to-pay?"] ||
                          "How would you like to pay?"}
                      </span>
                    </h3>
                    {/* <div className="flex flex-nowrap space-x-4"> */}
                    <HorizontalScrollView>
                      {Object.keys(paymentMethods).map((method, index) =>
                        paymentMethods[method].status === 1 &&
                        !(paymentMethods[method].key === "COD") ? (
                          <div
                            key={index}
                            onClick={() =>
                              setSelectedPayMethod(paymentMethods[method])
                            }
                            className={`rounded-lg flex-shrink-0 w-[196px] h-[112px] p-4 ${
                              paymentMethods[method].title ===
                              selectedPayMethod?.title
                                ? "bg-amber-200 border border-primary"
                                : "bg-slate-100"
                            } relative text-slate-700 flex flex-col justify-between gap-2`}
                          >
                            <div className="flex justify-end">
                              <CustomRadio
                                isChecked={
                                  paymentMethods[method].title ===
                                  selectedPayMethod?.title
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
              )}

              {/* oder confirm button  */}
              <div className="form-control md:mt-11 responsive-action flex lg:block justify-between items-center">
                <div className="lg:hidden">
                  <p className="">{translations["total:"] || "Total:"}</p>
                  <h3 className="text-slate-900 font-bold">
                    {siteConfig.currency.sign} {grandTotal}
                  </h3>
                </div>
                <button
                  disabled={!cart?.length}
                  type="submit"
                  className="bg-primary text-white px-4 py-3 !rounded-md w-[232px] lg:w-full disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {translations["confirm-order"] || "Confirm Order"}
                </button>
              </div>
            </form>
          </div>
          <div className="md:col-span-3 p-3 lg:p-6 pl-8 mx-3 md:mx-0 border-l border-slate-200">
            <h3 className="text-lg/[26px] text-slate-700 font-semibold">
              {translations["your-order"] || "Your Order"}
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
                      <div className="w-full h-full rounded absolute left-0 top-0 flex-center backdrop-opacity-90 bg-white/90">
                        <button
                          className="text-btn mt-20 font-bold"
                          onClick={() => setOrderCollapsed(true)}
                        >
                          <FiPlus />
                          {translations["more"] || "More"} {cart.length - 2}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <CartCard key={item.barcodeId} item={item} />
                  )
                )}

                <div className="my-3 border-t border-b py-3 md:py-6 border-slate-200">
                  <CouponField />
                </div>
              </div>

              {/* Delivery Options  */}

              <div
                className={`p-4 mt-4 lg:mt-8 bg-slate-100 shadow border ${
                  deliveryArea ? "border-green-500" : "border-primary"
                }`}
              >
                <h4 className="text-slate-700">
                  {translations["select-delivery-area"] ||
                    "Select Delivery Area"}
                </h4>
                <div className="flex flex-col lg:flex-row gap-3 lg:gap-12 lg:items-center py-3">
                  {deliveryAreas.map((area) => (
                    <button
                      key={area.key}
                      className={`flex gap-2 items-center`}
                      onClick={() => handleDeliveryAreaChange(area)}
                    >
                      <CustomRadio
                        isChecked={deliveryArea?.key === area.key}
                        label={area.title}
                        // onClick={() => setDeliveryArea(area)}
                      />
                      <p
                        className={cn(
                          `font-semibold`,
                          !deliveryCharge && deliveryArea && "line-through"
                        )}
                      >
                        {siteConfig.currency.sign} {area.charges}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              {!deliveryArea && (
                <p id="deliveryAreaError" className="hidden errorMsg">
                  You must select delivery area
                </p>
              )}

              <div className="text-slate-700 p-4 rounded-lg shadow bg-white mt-2">
                <div className="flex-between my-2">
                  <p>{translations["total"] || "Total"}</p>
                  <p>
                    {siteConfig.currency.sign} {total}
                  </p>
                </div>
                <div className="flex-between my-2">
                  <p>{translations["coupon-discount"] || "Coupon Discount"}</p>
                  {discountCoupon ? (
                    <span className="text-primary">{discountCoupon.code}</span>
                  ) : (
                    <button
                      className=" text-black"
                      // onClick={() => setShowModal(true)}
                    >
                      {translations["coupon-code"] || "Coupon Code"}
                    </button>
                  )}
                </div>
                <div className="flex-between my-2">
                  <p>{translations["discount-amount"] || "Discount Amount"}</p>
                  <p className="text-red-500">
                    -{siteConfig.currency.sign} {discountedPrice}
                  </p>
                </div>

                <div className="border-b border-slate-300 my-2"></div>
                <div className="flex-between my-2">
                  <p>
                    {translations["total-with-discount"] ||
                      "Total With Discount"}
                  </p>
                  <p>
                    {siteConfig.currency.sign} {totalWithDiscount}
                  </p>
                </div>

                {deliveryArea && (
                  <div className="flex-between my-2">
                    <p>
                      {translations["delivery-charge"] || "Delivery Charge"}{" "}
                      {!deliveryCharge && (
                        <span className="bg-green-100 px-2 text-green-500">
                          Free
                        </span>
                      )}
                    </p>
                    <p>
                      {siteConfig.currency.shortForm}
                      {deliveryCharge}
                    </p>
                  </div>
                )}
                <div className="border-b border-slate-900 my-2"></div>
                <div className="flex-between my-2 font-bold">
                  <p>{translations["grand-total"] || "Grand Total"}</p>

                  <p>
                    {siteConfig.currency.sign} {grandTotal}
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
    </>
  );
};

export default RequireAuth(Checkout);
