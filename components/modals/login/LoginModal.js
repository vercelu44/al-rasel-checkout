"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";
import OtpForm from "./OtpForm";
import Modal from "@/components/elements/Modal";

//Hooks
import { useOtpLoginMutation } from "@/store/api/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoader } from "@/store/slices/commonSlice";
import { siteConfig } from "@/config/site";

const LoginModal = ({ showModal, setShowModal, title }) => {
  const { settings, translations } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [sendOTP, { isSuccess, isLoading, data: otpResponse, isError }] =
    useOtpLoginMutation();

  // Handling global loader
  useEffect(() => {
    dispatch(setGlobalLoader(isLoading));
    return () => dispatch(setGlobalLoader(false)); // Cleanup on unmount
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (isSuccess && otpResponse) {
      toast.success("OTP has been sent to your mobile");
      setOtpSent(true);
    } else if (isError) {
      toast.error("Failed to send OTP");
    }
  }, [isSuccess, isError, otpResponse]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const loginData = {
      phone_no: data.phone,
      country: siteConfig.phone.country,
    };
    setPhone(data.phone);
    sendOTP(loginData);
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal} title={title}>
      {process.env.NEXT_PUBLIC_OTP_LOGIN === "NO" ? (
        <div className="md:w-[27rem] text-slate-500 pb-4">
          <div className="">
            <Image
              src={settings?.footer_logo}
              alt={"Logo"}
              width={200}
              height={48}
              className="max-h-12 object-contain object-left"
            />
          </div>
          <SocialLogin setShowModal={setShowModal} />

        </div>
      ) : (
        <div className="md:w-[27rem] text-slate-500">
          <div>
            <Image
              src={settings?.footer_logo}
              alt={"Logo"}
              width={200}
              height={48}
              className="max-h-12 object-contain object-left"
            />
          </div>
          <p className="py-4 md:py-6 ">
            {otpSent
              ? `${
                  translations["otp-sent-message"] ||
                  "Just enter the OTP sent to your mobile"
                } (${siteConfig.phone.countryCode + phone})`
              : translations["verify-mobile-message"] ||
                "Verify your mobile number"}
          </p>
          {!otpSent ? (
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 md:mb-8">
                <label className="block text-base mb-2">
                  {translations["mobile"] || "Mobile"}
                </label>
                <div className="flex items-center group">
                  <div className="h-12 py-3 min-w-fit text-base font-title font-normal px-2 rounded-s-lg border bg-slate-100 border-gray-300 group-focus-within:border-primary group-focus-within:border-r-gray-300">
                    <p>{siteConfig.phone.prefix}</p>
                  </div>
                  <input
                    type="number"
                    className="w-full !pl-2 rounded-s-none rounded-e-lg border border-l-0 border-gray-300 focus:outline-none group-focus:border-primary"
                    name="phone"
                    placeholder={
                      translations["your-mobile-number"] || "Your mobile number"
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

              <div className="form-control">
                <button type="submit" className="primary-btn w-full">
                  {translations["send-code"] || "Send code"}
                </button>
              </div>
            </form>
          ) : (
            <OtpForm
              phone={phone}
              setShowModal={setShowModal}
              setOtpSent={setOtpSent}
              translations={translations}
            />
          )}
          <SocialLogin setShowModal={setShowModal} />
        </div>
      )}
    </Modal>
  );
};

export default LoginModal;
