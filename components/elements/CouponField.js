"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Modal from "../elements/Modal";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios-instance";
import { addDiscountInfo } from "@/store/slices/cartSlice";
import { setGlobalLoader } from "@/store/slices/commonSlice";

const CouponField = ({ showModal, setShowModal, total }) => {
  const { translations } = useSelector((state) => state.common);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // console.log(total, "total");
  const onSubmit = async (data, event) => {
    event.preventDefault();
    setError("");
    dispatch(setGlobalLoader(true));
    try {
      const coupon = data.coupon_code;
      const response = await axiosInstance.get(`coupons/${coupon}`);
      dispatch(setGlobalLoader(false));
      if (response.status === 200) {
        dispatch(addDiscountInfo(response.data.data));
        toast.success(
          `Coupon added, Applicable for minimum order amount ${response.data.data.minimum_order_amount}`
        );
        setShowModal(false); //closing coupon modal
      } else {
        setError("Invalid coupon code");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Invalid coupon code");
      dispatch(setGlobalLoader(false));
    }
  };
  return (
    <div className=" text-slate-500 ">
      <form
        className=" flex justify-start items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className=" form-control">
          <input
            type="text"
            className="flex items-center justify-center !max-w-[200px]"
            name="coupon_code"
            placeholder={translations["type-coupon"] || "Type coupon code"}
            {...register("coupon_code", {
              required: "Coupon code is required.",
            })}
          />
          {errors.coupon_code && (
            <p className="errorMsg">{errors.coupon_code.message}</p>
          )}
          {error && (
            <p className="errorMsg max-w-[200px]">
              {translations["invalid-coupon-msg"] ||
                "Invalid coupon code"}
            </p>
          )}
        </div>
        <div className="form-control mb-2 md:mb-0 ml-5">
          <button
            type="submit"
            className="px-4 py-3 w-full bg-primary text-white rounded-md"
          >
            {translations["verify-coupon"] || "Verify coupon"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponField;