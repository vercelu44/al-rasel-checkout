/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  getAutoSelectedPaymentOption,
  getCartTotal,
  getCouponDiscount,
  getDefaultFormValues,
  getOrderFormattedCartItems,
} from "@/lib/checkout";

//components
import CartCard from "@/components/cards/CartCard";
import CustomRadio from "@/components/elements/CustomRadio";
import CouponModal from "@/components/modals/CouponModal";
import RequireAuth from "@/components/hoks/RequireAuth";
import * as pixel from "/lib/fpixel";

//Icons
import { FiPlus } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { FaTruckFast } from "react-icons/fa6";

import { useGetPaymentMethodsQuery } from "@/store/api/paymentMethodsAPI";
import { siteConfig } from "@/config/site";
import useOrderPlace from "@/hooks/useOrderPlace";
import ShippingForm from "./ShippingForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "react-toastify";
import { cn } from "@/utils";
import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
import { generateUniqueId } from "@/utils/get-unique";
import { Cookies } from "@/utils/cookies";
import DeliveryIcon from "@/public/assets/icons/customIcon/DeliveryIcon";
import { getGTMFormattedCartItems } from "@/lib/gtm-data-formatter";
import { sendGTMEvent } from "@next/third-parties/google";
import { usePlaceIncompleteOrderMutation } from "@/store/api/orderAPI";

const Checkout = () => {
  const { settings, translations, isFbPixelInitialized } = useSelector(
    (state) => state.common,
  );

  const deliveryAreas = [
    {
      key: `inside dhaka`,
      title: `Inside ${settings?.delivery_region || "Dhaka"}`,
      charges: settings?.inside_dhaka_delivery_charges,
      icon: <FaTruckFast className="w-5 h-5" />,
    },
    {
      key: "outside dhaka",
      title: `Outside ${settings?.delivery_region || "Dhaka"}`,
      charges: settings?.outside_dhaka_delivery_charges,
      icon: <FaTruckFast className="w-5 h-5" />,
    },
  ];

  const [deliveryArea, setDeliveryArea] = useState(deliveryAreas[1]);
  const [isDeliveryChargeRequired, setIsDeliveryChargeRequired] = useState(false);
  const [activePaymentMethods, setActivePaymentMethods] = useState(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [orderCollapsed, setOrderCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isTermChecked, setIsTermChecked] = useState(false);
  const { cart, discountCoupon } = useSelector((state) => state.cart);
  const { user, isLoading } = useSelector((state) => state.auth);
  const { handleOrderPlace } = useOrderPlace();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: paymentMethodsData } = useGetPaymentMethodsQuery();
  const [placeIncompleteOrder] = usePlaceIncompleteOrderMutation();

  const paymentMethods = useMemo(
    () => paymentMethodsData?.data || {},
    [paymentMethodsData],
  );

  const cartItems = orderCollapsed ? cart : cart.slice(0, 3);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: getDefaultFormValues(),
  });

  const phoneValue = watch("phone");
  const nameValue = watch("name");
  const addressValue = watch("address");
  const cityValue = watch("city");

  useEffect(() => { reset(); }, [user, reset]);

  const total = getCartTotal(cart);
  const discountedPrice = getCouponDiscount(discountCoupon, total);
  const totalWithDiscount = total - discountedPrice;

  const deliveryCharge =
    settings?.free_delivery_charges_limit > totalWithDiscount ||
    settings?.free_delivery_charges_limit <= 0
      ? deliveryArea?.charges || 0
      : 0;

  const grandTotal = totalWithDiscount + deliveryCharge;

  const updateDeliveryChargeRequirement = (areaKey) => {
    switch (areaKey) {
      case "inside dhaka":
        setIsDeliveryChargeRequired(!!settings?.is_delivery_charge_required_for_inside);
        break;
      case "sub dhaka":
        setIsDeliveryChargeRequired(!!settings?.is_delivery_charge_required_for_sub_region);
        break;
      case "outside dhaka":
        setIsDeliveryChargeRequired(!!settings?.is_delivery_charge_required_for_outside);
        break;
      default:
        setIsDeliveryChargeRequired(false);
    }
  };

  useEffect(() => {
    updateDeliveryChargeRequirement(deliveryArea?.key);
  }, [deliveryArea?.key, settings]);

  const handleDeliveryAreaChange = (area) => {
    setDeliveryArea(area);
    updateDeliveryChargeRequirement(area?.key);
    const autoSelectedPaymentOption = getAutoSelectedPaymentOption(activePaymentMethods);
    if (autoSelectedPaymentOption) setSelectedPaymentOption(autoSelectedPaymentOption);
  };

  useEffect(() => {
    if (Object.keys(paymentMethods).length > 0) {
      let activePayments = Object.values(paymentMethods).filter(
        (payMethod) => payMethod?.status === 1,
      );
      if (activePayments?.length > 1 && activePayments[0].key === "COD") {
        setSelectedPayMethod(activePayments[1]);
      } else {
        setSelectedPayMethod(activePayments[0]);
      }
      setActivePaymentMethods(activePayments);
    }
  }, [paymentMethods]);

  const isCodPayEnabled =
    activePaymentMethods?.length > 0 &&
    activePaymentMethods?.find((payMethod) => payMethod?.key === "COD")?.status === 1;

  const paymentOptions = [
    isCodPayEnabled && (!isDeliveryChargeRequired || activePaymentMethods?.length == 1)
      ? { key: "no_payment", title: `Cash on delivery`, value: grandTotal }
      : null,
    activePaymentMethods?.length > 1 && isDeliveryChargeRequired && isCodPayEnabled
      ? { key: "delivery_charge_payment", title: `Pay delivery charge only`, value: deliveryArea.charges }
      : null,
    (activePaymentMethods?.length === 1 && activePaymentMethods[0].key === "COD") ||
    activePaymentMethods?.length === 0
      ? null
      : { key: "total_payment", title: `Pay total amount`, value: grandTotal },
  ].filter((option) => option !== null);

  useEffect(() => {
    const autoSelectedPaymentOption = getAutoSelectedPaymentOption(activePaymentMethods);
    if (autoSelectedPaymentOption) setSelectedPaymentOption(autoSelectedPaymentOption);
  }, [activePaymentMethods]);

  useEffect(() => {
    let incompleteId = localStorage.getItem("incomplete_unique_id");
    if (!incompleteId) {
      const newId = generateUniqueId();
      localStorage.setItem("incomplete_unique_id", newId);
    }
  }, []);

  const isDisabled = !!(!cart?.length || settings?.agreement_links?.length ? !isTermChecked : false);

  const handleCheckoutSubmit = async (data) => {
    const incompleteId = localStorage.getItem("incomplete_unique_id");
    if (!deliveryArea) {
      document.getElementById("deliveryAreaError").classList.remove("hidden");
      toast.error("Please select delivery area");
      return;
    }
    if (activePaymentMethods?.length === 0) {
      toast.error("Checkout is not available now, please contact us for more info");
      return;
    }
    if (!selectedPaymentOption) {
      document.getElementById("paymentOptionError").classList.remove("hidden");
      toast.error("Please select payment option");
      return;
    }

    let phone = data?.phone;
    let alt_phone = data?.phone;
    let fullAddress = data.address + ", " + data.city;

    if (!settings?.guest_checkout) {
      alt_phone = siteConfig.phone.countryCode + user?.phone || user?.alt_phone_no;
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
      note: data?.note || "",
      fbp: Cookies.get("_fbp"),
      fbc: Cookies.get("_fbc"),
      incomplete_unique_id: incompleteId,
    };
    handleOrderPlace(newOrder);
    localStorage.removeItem("incomplete_unique_id");
  };

  const [AddToConversionAPI] = useAddToTrackingMutation();
  const flag = useRef(true);
  const flag2 = useRef(true);

  useEffect(() => {
    if (cart.length === 0) return;
    const eventID = generateUniqueId();
    if (isFbPixelInitialized && flag.current) {
      pixel.event("InitiateCheckout", pixel.getInitiateCheckoutPixelData(cart, total), { eventID });
      flag.current = false;
    }
    if (settings?.fb_pixel_id && settings?.fb_access_token && flag2.current) {
      AddToConversionAPI({
        event_id: eventID,
        event_name: "InitiateCheckout",
        products: pixel.contentItems(cart),
        fbp: Cookies.get("_fbp"),
        fbc: Cookies.get("_fbc"),
      });
      flag2.current = false;
    }
  }, [cart, total, isFbPixelInitialized, settings, AddToConversionAPI]);

  const gtmFlag = useRef(true);
  useEffect(() => {
    if (cart.length === 0) return;
    const formattedItems = getGTMFormattedCartItems(cart);
    const payload = {
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: total,
        fbp: Cookies.get("_fbp"),
        fbc: Cookies.get("_fbc"),
        items: formattedItems,
      },
    };
    if (settings?.gtm_id && gtmFlag.current) {
      sendGTMEvent(payload);
      gtmFlag.current = false;
    }
  }, [cart, total, settings]);

  const handleIncompleteOrder = async (data) => {
    const incompleteId = localStorage.getItem("incomplete_unique_id");
    let phone = data?.phone;
    let alt_phone = data?.phone;
    let fullAddress = data?.address + ", " + data?.city;
    const newOrder = {
      name: data?.name,
      alt_name: data?.name,
      phone,
      alt_phone,
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
      incomplete_unique_id: incompleteId,
    };
    try {
      await placeIncompleteOrder(newOrder).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("name", nameValue);
    localStorage.setItem("address", addressValue);
    localStorage.setItem("phone", phoneValue);
    localStorage.setItem("city", cityValue);
    const phonePattern = siteConfig.phone.pattern;
    if (phoneValue && phonePattern.test(phoneValue)) {
      const formValues = watch();
      handleIncompleteOrder(formValues);
    }
  }, [phoneValue, nameValue, addressValue, cityValue, watch]);

  return (
    <section className="bg-slate-50 min-h-screen">
      <div className="container py-8 max-w-7xl mx-auto px-4">

        {/* Page Header */}
        <div className="mb-6">
         
          <h1 className="text-2xl text-center font-bold text-slate-900">Checkout</h1>
        </div>

        {/* Mobile Shipping Form */}
        {isMobile && (
          <ShippingForm
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
            isLoading={isLoading}
            handleCheckoutSubmit={handleCheckoutSubmit}
            user={user}
            translations={translations}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ───────── LEFT COLUMN ───────── */}
          <div className="space-y-5">

            {/* Desktop Shipping Form */}
            {!isMobile && (
              <ShippingForm
                handleSubmit={handleSubmit}
                errors={errors}
                register={register}
                isLoading={isLoading}
                handleCheckoutSubmit={handleCheckoutSubmit}
                user={user}
                translations={translations}
              />
            )}

            {/* Delivery Area */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {translations["select-delivery-area"] || "Delivery Area"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Choose your delivery zone</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliveryAreas.map((area) => (
                  <button
                    key={area.key}
                    onClick={() => handleDeliveryAreaChange(area)}
                    className={cn(
                      "relative flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200",
                      deliveryArea?.key === area.key
                        ? "border-slate-900 "
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      deliveryArea?.key === area.key ? "bg-slate-100" : "bg-white/10"
                    )}>
                      <span className={" text-slate-600" }>
                        {area.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{area.title}</p>
                      <p className={cn(
                        "text-xs mt-0.5 font-medium",
                        !deliveryCharge && deliveryArea?.key === area.key
                          ? "line-through opacity-60"
                          : deliveryArea?.key === area.key ? "opacity-80" : "text-slate-400"
                      )}>
                        {siteConfig.currency.sign}{area.charges}
                      </p>
                    </div>
                    {deliveryArea?.key === area.key && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {!deliveryArea && (
                <p id="deliveryAreaError" className=" mt-3 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  You must select a delivery area
                </p>
              )}
            </div>

            {/* Payment Options */}
            {deliveryArea && (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">
                      {translations["payment-options"] || "Payment Options"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">How would you like to pay?</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {paymentOptions.map((payOption) => (
                    <button
                      key={payOption.key}
                      type="button"
                      onClick={() => setSelectedPaymentOption(payOption.key)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left",
                        payOption.key === selectedPaymentOption
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          payOption.key === selectedPaymentOption
                            ? "border-slate-900"
                            : "border-slate-300"
                        )}>
                          {payOption.key === selectedPaymentOption && (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          payOption.key === selectedPaymentOption ? "text-slate-900" : "text-slate-600"
                        )}>
                          {payOption.title}
                        </span>
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        payOption.key === selectedPaymentOption ? "text-slate-900" : "text-slate-500"
                      )}>
                        {siteConfig.currency.sign}{payOption.value}
                      </span>
                    </button>
                  ))}
                </div>

                {!selectedPaymentOption && (
                  <p id="paymentOptionError" className="hidden mt-3 text-xs text-red-500">
                    You must select a payment option
                  </p>
                )}

                {/* Payment Methods */}
                {(selectedPaymentOption === "delivery_charge_payment" ||
                  selectedPaymentOption === "total_payment") && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      {translations["payment-method"] || "Select Payment Method"}
                    </h5>
                    <div className="space-y-2">
                      {Object.keys(paymentMethods).map((method, index) =>
                        paymentMethods[method].status === 1 &&
                        !(paymentMethods[method].key === "COD") ? (
                          <div
                            key={index}
                            onClick={() => setSelectedPayMethod(paymentMethods[method])}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200",
                              paymentMethods[method].title === selectedPayMethod?.title
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                paymentMethods[method].title === selectedPayMethod?.title
                                  ? "border-slate-900"
                                  : "border-slate-300"
                              )}>
                                {paymentMethods[method].title === selectedPayMethod?.title && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {paymentMethods[method].title}
                              </span>
                            </div>
                            <Image
                              src={paymentMethods[method].icon}
                              height={28}
                              width={120}
                              alt="icon"
                              className="h-7 w-fit max-w-[120px] object-contain"
                            />
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ───────── RIGHT COLUMN — Order Summary ───────── */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Cart Items Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 8H4l1-8z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {cart.length} {translations["item-in-your-bag"] || "item in your bag"}
                  </h3>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="  divide-y divide-slate-100">
                {cartItems.map((item, index) =>
                  index == 2 && !orderCollapsed ? (
                    <div key={index} className="relative">
                      <CartCard item={item} />
                      <div className="w-full h-full rounded absolute left-0 top-0 flex items-center justify-center backdrop-blur-sm bg-white/40">
                        <button
                          className="flex items-center gap-1 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
                          onClick={() => setOrderCollapsed(true)}
                        >
                          <FiPlus size={14} />
                          {cart.length - 2} more items
                        </button>
                      </div>
                    </div>
                  ) : (
                    <CartCard key={index} item={item} />
                  ),
                )}
              </div>

              {/* Order Summary */}
              <div className="px-6 py-5  border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                  Order Summary
                </h4>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{translations["total"] || "Subtotal"}</span>
                    <span className="font-medium text-slate-800">{siteConfig.currency.shortForm}{total}</span>
                  </div>

                  {discountedPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{translations["discount-amount"] || "Discount"}</span>
                      <span className="font-medium text-green-600">−{siteConfig.currency.shortForm}{discountedPrice}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">{translations["coupon-discount"] || "Coupon"}</span>
                    {discountCoupon ? (
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                        {discountCoupon.code}
                      </span>
                    ) : (
                      <button
                        className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors flex items-center gap-1"
                        onClick={() => setShowModal(true)}
                      >
                        <AiOutlinePlus size={12} />
                        Add coupon
                      </button>
                    )}
                  </div>

                  {deliveryArea && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{translations["delivery-charge"] || "Delivery"}</span>
                      <span className={cn("font-medium", !deliveryCharge ? "text-green-600" : "text-slate-800")}>
                        {!deliveryCharge
                          ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Free</span>
                          : `${siteConfig.currency.shortForm}${deliveryCharge}`
                        }
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-4 border-t border-dashed border-slate-300" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">{translations["grand-total"] || "Grand Total"}</span>
                  <span className="text-xl font-bold text-slate-900">{siteConfig.currency.shortForm}{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Delivery Note */}
            {process.env.NEXT_PUBLIC_FOR_MOTO_STUC === "YES" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-amber-800">
                  {`৩ - ৭ কর্মদিবসের মধ্যে ডেলিভার করা হবে ইন'শা-আল্লাহ, এর মধ্যে কল দেওয়া হবে না।`}
                </p>
              </div>
            )}

            {/* Terms & Order Button */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              {settings?.agreement_links?.length ? (
                <div className="flex gap-3 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <input
                    id="shipping-2"
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 flex-shrink-0"
                    checked={isTermChecked}
                    onChange={(e) => setIsTermChecked(e.target.checked)}
                  />
                  <label htmlFor="shipping-2" className="text-xs text-slate-600 leading-relaxed">
                    I have read and agree to the website
                    {settings.agreement_links.map((item, index) => (
                      <span key={index}>
                        <Link href={item?.link} target="_blank" className="ml-1 text-slate-900 font-semibold hover:underline">
                          {item?.link_type}
                        </Link>
                        {index < settings.agreement_links.length - 1 && ","}
                      </span>
                    ))}
                    <span className="block mt-1 text-slate-400">
                      {settings?.agreement_text ?? "Your personal data will be used to process your order."}
                    </span>
                  </label>
                </div>
              ) : null}

              <button
                disabled={isDisabled}
                onClick={() => handleSubmit(handleCheckoutSubmit)()}
                className="w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                style={{
                  backgroundColor: isDisabled ? "#cccccc" : settings?.colors?.primary,
                  color: settings?.colors?.primary_text,
                }}
              >
                {translations["order-now"] || "Confirm Order"} — {siteConfig.currency.shortForm}{grandTotal}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CouponModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
};

export default RequireAuth(Checkout);