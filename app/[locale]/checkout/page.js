/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  getCartTotal,
  getCouponDiscount,
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
import useProfileUpdate from "@/hooks/useProfileUpdate";
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
  //--------------------get default form values----------------
  const getDefaultFormValues = () => ({
    name: localStorage.getItem("name") || "",
    address: localStorage.getItem("address") || "",
    phone: localStorage.getItem("phone") || "",
    city: localStorage.getItem("city") || "",
  });
  // Dynamic delivery charges
  const { settings, translations, isFbPixelInitialized } = useSelector(
    (state) => state.common
  );
  // console.log(settings);
  const deliveryAreas = [
    {
      key: `inside dhaka`,
      title: `Inside ${settings?.delivery_region || "Dhaka"}`,
      charges: settings?.inside_dhaka_delivery_charges,
      icon: <FaTruckFast className="w-6 h-6" />,
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
      icon: <DeliveryIcon className="w-6 h-6" />,
    },
  ];

  const [deliveryArea, setDeliveryArea] = useState(deliveryAreas[1]); // default delivery area removed
  const [isDeliveryChargeRequired, setIsDeliveryChargeRequired] =
    useState(false);
  const [activePaymentMethods, setActivePaymentMethods] = useState(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [orderCollapsed, setOrderCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isTermChecked, setIsTermChecked] = useState(false);
  const { cart, discountCoupon } = useSelector((state) => state.cart);
  const { user, isLoading } = useSelector((state) => state.auth);
  const { handleOrderPlace } = useOrderPlace(); //custom hook for separating order place business logics
  const { handleUserUpdate } = useProfileUpdate(); //custom hook for separating profile update business logics
  const isMobile = useMediaQuery("(max-width: 768px)"); // checking for mobile

  const { data: paymentMethodsData } = useGetPaymentMethodsQuery();
  const [placeIncompleteOrder] = usePlaceIncompleteOrderMutation();

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
    watch,
  } = useForm({
    defaultValues: getDefaultFormValues(),
  });
  //----watch values----
  const phoneValue = watch("phone");
  const nameValue = watch("name");
  const addressValue = watch("address");
  const cityValue = watch("city");

  useEffect(() => {
    reset();
  }, [user, reset]);
  //Summary calculation
  // const total = getMultipliedColumnTotal(cart, "quantity", "new_price");
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
  setSelectedPaymentOption(null);
  updateDeliveryChargeRequirement(area?.key);
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
      title: `Cash on delivery`,
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

useEffect(() => {
  let incompleteId = localStorage.getItem("incomplete_unique_id");
  if (!incompleteId) {
    const newId = generateUniqueId();
    localStorage.setItem("incomplete_unique_id", newId);
  }
}, []);
  const handleCheckoutSubmit = async (data) => {
   const incompleteId = localStorage.getItem("incomplete_unique_id");


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
    let fullAddress = data.address + ", " + data.city;

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
      fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie,
      fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie
      incomplete_unique_id: incompleteId
    };
    // console.log(newOrder);
    handleOrderPlace(newOrder);
    //--------------------remove local storage items after checkout----------------
    localStorage.removeItem("name");
    localStorage.removeItem("address");
    localStorage.removeItem("phone");
    localStorage.removeItem("city");
    localStorage.removeItem("incomplete_unique_id");
    // updating user for the first time only not applicable for guest checkout
    if (
      ((!user?.phone && !user?.alt_phone_no) || !user?.address) &&
      !settings?.guest_checkout
    ) {
      handleUserUpdate({
        ...user,
        alt_phone_no: user?.alt_phone_no || data?.phone,
        address: user.address || data?.address,
        city: data?.city,
      });
    }
    // else alert("user not updated");
  };

  const [AddToConversionAPI] = useAddToTrackingMutation();
  const flag = useRef(true);
  const flag2 = useRef(true);

  // Facebook Pixel Initiate Checkout Event
  useEffect(() => {
    if (cart.length === 0) return;

    const eventID = generateUniqueId();
    // Check if product ID exists to avoid errors
    if (isFbPixelInitialized && flag.current) {
      pixel.event(
        "InitiateCheckout",
        pixel.getInitiateCheckoutPixelData(cart, total),
        {
          eventID: eventID,
        }
      );
      flag.current = false;
    }

    //For conversion API
    if (settings?.fb_pixel_id && settings?.fb_access_token && flag2.current) {
      AddToConversionAPI({
        event_id: eventID,
        event_name: "InitiateCheckout",
        products: pixel.contentItems(cart),
        fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie,
        fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie
      });
      flag2.current = false;
    }
  }, [cart, total, isFbPixelInitialized, settings, AddToConversionAPI]);

  const isDisabled = !!(!cart?.length || settings?.agreement_links?.length
    ? !isTermChecked
    : false);

  useEffect(() => {
    if (paymentOptions.length === 1) {
      setSelectedPaymentOption(paymentOptions[0].key);
    }
  }, [paymentOptions]);

  // Google Tag Manager
  const gtmFlag = useRef(true);
  useEffect(() => {
    if (cart.length === 0) return;
    const formattedItems = getGTMFormattedCartItems(cart);
    const payload = {
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT", // Change to your store's currency
        value: total, // Total value of the added item(s)
        fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie,
        fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie
        items: formattedItems,
      },
    };

    if (settings?.gtm_id && gtmFlag.current) {
      sendGTMEvent(payload);
      gtmFlag.current = false;
      console.log("gtm begin_checkout occurred");
    }
  }, [cart, total, settings]);

  //------------------ checkout on valid phone handler----------------
  const handleIncompleteOrder = async (data) => {
    const incompleteId = localStorage.getItem("incomplete_unique_id");
    let phone = data?.phone;
    let alt_phone = data?.phone;
    let fullAddress = data?.address + ", " + data?.city;
    const newOrder = {
      name: data?.name,
      alt_name: data?.name,
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
      incomplete_unique_id: incompleteId
      // note: "",
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
    <section className="container pb-8">
      <div className="breadcrumb breadcrumb-2 py-5">
        <div className="">
          <div>
            <Link
              href={`/`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              {translations["home"] || "Home"}
            </Link>
            <Link
              href={`/checkout`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              {translations["checkout"] || "Checkout"}
            </Link>
          </div>
        </div>
      </div>
      {/* Shipping Address are for mobile  */}
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
      <div className="grid lg:grid-cols-2 mb-8 gap-14">
        <div
          id="checkout-left"
          className="border border-slate-200 grid grid-cols-1"
        >
          {/* Delivery Options  */}
          <div className="lg:order-2 px-3 lg:px-9 py-4">
            <h4 className="text-slate-700 font-bold">
              {translations["select-delivery-area"] || "Select Delivery Area"}
            </h4>
            <div className="flex flex-col gap-3 pt-3">
              {deliveryAreas.map((area) => (
                <button
                  key={area.key}
                  className="flex gap-2 items-center border border-slate-200 p-3"
                  onClick={() => handleDeliveryAreaChange(area)}
                >
                  <CustomRadio
                    isChecked={deliveryArea?.key === area.key}
                    icon={area.icon}
                    label={area.title}
                  // onClick={() => setDeliveryArea(area)}
                  />

                  <p
                    className={cn(
                      `font-semibold`,
                      !deliveryCharge && deliveryArea && "line-through"
                    )}
                  >
                    {siteConfig.currency.sign}
                    {area.charges}
                  </p>
                </button>
              ))}
            </div>
            {!deliveryArea && (
              <p id="deliveryAreaError" className="hidden errorMsg">
                You must select delivery area
              </p>
            )}
          </div>

          {/* Cart Items  */}
          <div className="lg:order-1">
            <div className="border-b border-slate-200 text-left p-3 lg:p-5">
              <h3 className="text-xl">
                {cart.length}{" "}
                {translations["item-in-your-bag"] || "item in your bag"}
              </h3>
            </div>
            <div className="border-b border-slate-200 p-3 lg:p-5">
              <div className="">
                {cartItems.map((item, index) =>
                  index == 2 && !orderCollapsed ? (
                    <div key={index} className="relative">
                      <CartCard item={item} />
                      <div className="w-full h-full rounded absolute left-0 top-0 flex-center backdrop-blur-sm">
                        <button
                          className="text-btn mt-20 font-bold"
                          onClick={() => setOrderCollapsed(true)}
                        >
                          <FiPlus />
                          {cart.length - 2}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <CartCard key={index} item={item} />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Order Summery  */}
          <div className="lg:order-3 text-slate-700 px-3 lg:px-9 py-4 bg-white my-3">
            <div className="flex-between my-2">
              <p>{translations["total"] || "Total"}</p>
              <p>
                {siteConfig.currency.shortForm}
                {total}
              </p>
            </div>
            <div className="flex-between my-2">
              <p>{translations["discount-amount"] || "Discount Amount"}</p>
              <p className="">
                -{siteConfig.currency.shortForm}
                {discountedPrice}
              </p>
            </div>
            <div className="flex-between my-2">
              <p>{translations["coupon-discount"] || "Coupon Discount"}</p>
              {discountCoupon ? (
                <span className="text-primary">{discountCoupon.code}</span>
              ) : (
                <button
                  className="text-btn underline"
                  onClick={() => setShowModal(true)}
                >
                  <AiOutlinePlus size={24} />
                </button>
              )}
            </div>
            <div className="border-b border-slate-300 my-2"></div>
            <div className="flex-between my-2">
              <p>
                {translations["total-with-discount"] || "Total with discount"}
              </p>
              <p>
                {siteConfig.currency.shortForm}
                {totalWithDiscount}
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
                {siteConfig.currency.shortForm}
                {grandTotal}
              </p>
            </div>
          </div>
        </div>
        <div id="checkout-right">
          {/* Shipping Address Area for web*/}
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
          {/* Payment Area  */}
          <div>
            {/* Payment Options Area */}
            {deliveryArea ? (
              <div className="form-control">
                <h4 className="text-slate-700 font-bold">
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
                        className="flex gap-2 items-center border border-slate-200 p-3"
                        onClick={() => setSelectedPaymentOption(payOption.key)}
                      >
                        <CustomRadio
                          isChecked={payOption.key === selectedPaymentOption}
                          label={payOption.title}
                        // onClick={() => setDeliveryArea(pt)}
                        />
                        <p>
                          {siteConfig.currency.sign}
                          {payOption.value}
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
                <div className="form-control mt-4">
                  <h4 className="text-slate-700 font-bold">
                    {translations["payment-method"] || "Payment Method"}
                  </h4>
                  <div className="flex flex-col gap-3 mt-3">
                    {Object.keys(paymentMethods).map((method, index) =>
                      paymentMethods[method].status === 1 &&
                        !(paymentMethods[method].key === "COD") ? (
                        <div
                          key={index}
                          type="button"
                          onClick={() =>
                            setSelectedPayMethod(paymentMethods[method])
                          }
                          className="flex items-center justify-between border border-slate-200 p-3 cursor-pointer"
                        >
                          <CustomRadio
                            isChecked={
                              paymentMethods[method].title ===
                              selectedPayMethod?.title
                            }
                            label={paymentMethods[method].title}
                          />
                          <div className="">
                            <Image
                              src={paymentMethods[method].icon}
                              height={32}
                              width={150}
                              alt="icon"
                              className="h-8 w-fit max-w-[150px]"
                            />
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
          </div>
          {/* Order Now Button  */}
          <div className="form-control mt-7">
            {settings?.agreement_links?.length ? (
              <div className="grid grid-cols-[20px_1fr] items-start  mb-4">
                <div className="flex items-center h-5 w-5">
                  <input
                    id="shipping-2"
                    aria-describedby="shipping-2"
                    type="checkbox"
                    className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded"
                    checked={isTermChecked}
                    onChange={(e) => setIsTermChecked(e.target.checked)}
                  />
                </div>
                <div className="text-sm ml-3">
                  <label
                    htmlFor="shipping-2"
                    className="font-medium text-gray-900"
                  >
                    I have read and agree to the website
                    {settings.agreement_links.map((item, index) => (
                      <span key={index}>
                        <Link
                          href={item?.link}
                          target="_blank"
                          className="ml-1 text-blue-500 hover:underline"
                        >
                          {item?.link_type}
                        </Link>
                        {index < settings.agreement_links.length - 1 && ","}
                      </span>
                    ))}
                  </label>
                  <div className="text-gray-500">
                    <span className="font-normal text-xs">
                      {settings?.agreement_text ??
                        "Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy."}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <button
              disabled={isDisabled}
              // type="submit"
              onClick={() => handleSubmit(handleCheckoutSubmit)()}
              className="primary-btn w-full disabled:bg-slate-300 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isDisabled
                  ? "#cccccc"
                  : settings?.colors?.primary,
                color: settings?.colors?.primary_text,
                border: `1px solid ${settings?.colors?.primary_text}`,
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              {translations["order-now"] || "Order Now"}
            </button>
          </div>
        </div>
      </div>
      <CouponModal
        showModal={showModal}
        setShowModal={setShowModal}
      // total={total} //cart items total
      />
    </section>
  );
};

export default RequireAuth(Checkout);
