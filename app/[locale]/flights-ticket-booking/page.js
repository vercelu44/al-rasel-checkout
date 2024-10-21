"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImagesUpload from "./ImagesUpload";
import CustomRadio from "@/components/elements/CustomRadio";
import HorizontalScrollView from "@/components/elements/HorizontalScrollView";
import Image from "next/image";
import { usePlaceTicketOrderMutation } from "@/store/api/airTicketAPI";
import { toast } from "react-toastify";
import Script from "next/script";
// import { useParams, useSearchParams } from "next/navigation";

const methods = [
  {
    id: 1,
    title: "Online Payment",
    icon: "https://cdn-icons-png.freepik.com/256/4108/4108042.png",
  },
  {
    id: 2,
    title: "RTGS/ BFTN/ NPSB",
    icon: "https://cdn-icons-png.flaticon.com/512/4140/4140767.png",
  },
];

const TicketBookingPage = ({ params }) => {
  // const searchParams = useSearchParams();
  // const status = searchParams.get("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Using watch to monitor price and total_ticket
  } = useForm();

  const [selectedMethod, setSelectedMethod] = useState(1);
  const [imageFiles, setImageFiles] = useState([]);
  const [placeTicketOrder, { isLoading }] = usePlaceTicketOrderMutation();

  // Watch the price and total_ticket fields
  const price = watch("price", 0); // Default value 0
  const totalTicket = watch("total_ticket", 1); // Default value 1

  const totalAmount = price * totalTicket;

  const onSubmit = async (data) => {
    console.log("Form Data: ", data);

    if (selectedMethod === 2) {
      // Handle form data submission
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("from_airport", data.from_airport);
      formData.append("to_airport", data.to_airport);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("total_ticket", data?.total_ticket);
      formData.append("flight_no", data.flight_no);
      formData.append("price", data.price);
      formData.append("total", data.total);
      if (imageFiles.length) {
        imageFiles.forEach((image) => {
          formData.append("attachments[]", image);
        });
      }
      try {
        await placeTicketOrder(formData).unwrap();
        toast.success("data submitted successfully ");
      } catch (error) {
        console.log(error);
        toast.error("Failed to save data");
      }
    } else {
      //Online payment
      const res = await fetch("/api/payments/southeastbank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // authorization: getToken(),
        },
        body: JSON.stringify({
          data,
        }),
      });
      const resData = await res.json();
      //   console.log(resData);

      const sessionId = resData?.data?.session?.id;

      if (sessionId) {
        toast.success("Online payment is processing please wait");
        Checkout.configure({
          session: {
            id: sessionId,
          },
        });
        Checkout.showPaymentPage();
      }
    
    }
  };

  //   const errorCallback = (error) => console.log(JSON.stringify(error));
  //   const cancelCallback = () => console.log("Payment cancelled");

  // useEffect(() => {
  //   if (status) {
  //     toast.success("Ticket purchased successfully ");
  //   }
  // }, [status]);

  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_SOUTHEAST_SCRIPT_URI}
        // data-error="errorCallback"
        // data-cancel="cancelCallback"
      />

      <div className="flex justify-center items-center py-8 bg-gray-100">
        <div className="bg-white shadow p-8 rounded-lg max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-center mb-6">
            Flights Ticket Booking
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* From (Airport) */}
              <div>
                <label className="block text-gray-700">From (Airport)</label>
                <input
                  type="text"
                  {...register("from_airport", {
                    required: "Departure From is required",
                  })}
                  placeholder="Enter destination"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.from_airport && (
                  <span className="text-red-500 text-sm">
                    {errors.from_airport.message}
                  </span>
                )}
              </div>

              {/* To (Destination) */}
              <div>
                <label className="block text-gray-700">To (Airport)</label>
                <input
                  type="text"
                  {...register("to_airport", {
                    required: "Destination is required",
                  })}
                  placeholder="Enter destination"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.to_airport && (
                  <span className="text-red-500 text-sm">
                    {errors.to_airport.message}
                  </span>
                )}
              </div>

              {/* Date From */}
              <div>
                <label className="block text-gray-700">Date From</label>
                <input
                  type="date"
                  {...register("start_date", {
                    required: "Date From is required",
                  })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.start_date && (
                  <span className="text-red-500 text-sm">
                    {errors.start_date.message}
                  </span>
                )}
              </div>

              {/* Date To */}
              <div>
                <label className="block text-gray-700">Date To</label>
                <input
                  type="date"
                  {...register("end_date", { required: "Date To is required" })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.end_date && (
                  <span className="text-red-500 text-sm">
                    {errors.end_date.message}
                  </span>
                )}
              </div>

              {/* User Name */}
              <div>
                <label className="block text-gray-700">Your Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Your name is required" })}
                  placeholder="Enter your name"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Flight No */}
              <div>
                <label className="block text-gray-700">Flight No</label>
                <input
                  type="text"
                  {...register("flight_no", {
                    required: "Flight No is required",
                  })}
                  placeholder="Enter flight no"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.flight_no && (
                  <span className="text-red-500 text-sm">
                    {errors.flight_no.message}
                  </span>
                )}
              </div>

              {/* Ticket Price */}
              <div>
                <label className="block text-gray-700">Ticket Price</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price should be at least 1" },
                  })}
                  placeholder="Enter price"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">
                    {errors.price.message}
                  </span>
                )}
              </div>

              {/* Total Ticket */}
              <div>
                <label className="block text-gray-700">Total Ticket</label>
                <input
                  type="number"
                  defaultValue={1}
                  {...register("total_ticket", {
                    required: "Total Ticket is required",
                    min: { value: 1, message: "Ticket should be at least 1" },
                  })}
                  placeholder="Enter total ticket"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {errors.total_ticket && (
                  <span className="text-red-500 text-sm">
                    {errors.total_ticket.message}
                  </span>
                )}
              </div>
            </div>

            {/* Display Total Amount */}
            <div className="text-xl font-bold mt-6">
              Total Amount: TK. {totalAmount}
            </div>

            <HorizontalScrollView>
              {methods.map((method, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`rounded-lg flex-shrink-0 w-[196px] h-[112px] p-4  ${
                    method.id === selectedMethod
                      ? "bg-amber-200 border border-primary"
                      : "bg-slate-100"
                  } relative text-slate-700 flex flex-col justify-between gap-2`}
                >
                  <div className="flex justify-end">
                    <CustomRadio isChecked={method.id === selectedMethod} />
                  </div>
                  <div className="w-2/3">
                    <Image
                      src={method.icon}
                      height={32}
                      width={150}
                      alt="icon"
                      className="h-8 w-auto object-left object-contain"
                    />
                  </div>
                  <h3>{method.title}</h3>
                </div>
              ))}
            </HorizontalScrollView>

            {/* Images Upload */}
            {selectedMethod === 2 && (
              <div className="mt-4">
                <ImagesUpload
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                />
              </div>
            )}

            {/* Pay/Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                {selectedMethod === 2 ? "Submit" : `Pay Now TK. ${totalAmount}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TicketBookingPage;
