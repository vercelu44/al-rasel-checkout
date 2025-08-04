"use client";
import { Link } from "@/navigation";
import Image from "next/image";

import { useSelector } from "react-redux";
import CallInquiry from "@/components/elements/CallInquiry";
// import { redirect } from "next/navigation";

export default function NotFound() {
  // redirect("/");
  const { translations } = useSelector((state) => state.common);
  return (
    <div className="container">
      <div className="content flex flex-col items-center py-12 lg:py-28">
        <Image
          src={`/assets/images/banner/404.png`}
          width={340}
          height={340}
          alt="Not Found"
          className="mb-12 h-[200px] w-[200px] lg:h-[340px] lg:w-[340px]"
        />
        <h2 className="text-2xl lg:text-3xl font-bold font-title text-slate-900">
          {translations["page-not-found!"] || "Page not found!"}
        </h2>
        <p className="text-base text-center lg:text-lg text-slate-600 mt-6 mb-8">
          {translations["page-not-found"] ||
            "We're sorry, but the page you requested could not be found"}
        </p>
        <Link
          href="/"
          className="inline-block font-semibold text-white bg-primary rounded-lg px-8 py-3"
        >
          {translations["back-to-home"] || "Back to Home"}
        </Link>
      </div>
      <CallInquiry />
    </div>
  );
}
