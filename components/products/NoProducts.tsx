"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import noItemsImage from "@/public/assets/images/product-not-found.png";
import { useAppSelector } from "@/store/hooks";

export default function NoProducts() {
  const { settings, translations } = useAppSelector((state) => state.common);

  return (
    <div className="container">
      <div className="content flex flex-col items-center py-28 text-center">
        <div className="h-[216px] w-[216px]">
          <Image
            src={noItemsImage}
            alt="No-Items-Image"
            height={216}
            width={216}
            className="h-[216px]"
          />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold font-title text-primary">
          {translations["sorry-no-product-found"] || "Sorry, no product found"}
        </h2>
        <p className=" lg:text-lg text-slate-600 mt-4 mb-5">
          {translations["dont-find-any-match"] ||
            "We could not find any matches for your search"}
        </p>
        <Link
          href="/"
          className="inline-block  px-8 py-3"
          style={{
            backgroundColor: settings?.colors?.primary,
            color: settings?.colors?.primary_text,
          }}
        >
          {translations["go-back-home"] || "Back To Home"}
        </Link>
      </div>
    </div>
  );
}
