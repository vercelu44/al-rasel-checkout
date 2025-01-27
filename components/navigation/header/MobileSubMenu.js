"use client";
import React, { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useParams, usePathname } from "next/navigation";

export default function MobileSubMenu({ settings }) {
  const { locale } = useParams();
  const pathname = usePathname();
  const { translations } = useSelector((state) => state.common);
  const { user } = useSelector((state) => state.auth);
  // const pathArray = usePathname().split("/");
  const isActiveForMobile = [
    `/${locale}`,
    "/",
    `/${locale}/categories`,
    "/categories",
  ].includes(pathname);

  const isMobile = useMediaQuery("(max-width: 767px)");

  const headerPage = settings?.header_page || [];
  const className = "px-2 py-2 bg-white rounded-lg flex items-center";

  const [defaultAddress, setDefaultAddress] = useState("");
  // const defaultAddress = settings?.guest_checkout
  //   ? localStorage?.getItem("userLocation")
  //   : user?.address || localStorage?.getItem("userLocation");
  useEffect(() => {
    // Ensure `localStorage` is accessed on the client only
    const address = settings?.guest_checkout
      ? localStorage?.getItem("userLocation")
      : user?.address || localStorage?.getItem("userLocation");
    setDefaultAddress(address || "");
  }, [settings?.guest_checkout, user?.address]);

  return (
    isMobile &&
    isActiveForMobile && (
      <>
        {defaultAddress && (
          <div className="flex items-center space-x-2 p-1 bg-white rounded-md py-2">
            <div className="text-blue-500">
              {/* Replace with your location icon component */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zM12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Delivery to</h4>
              <p className="text-sm text-gray-500">
                {defaultAddress.slice(0, 40)}...
              </p>
            </div>
          </div>
        )}
        <div className="mobile-menu bg-slate-100 container py-3 flex items-center gap-2">
          <Link href={"/categories"} className={`${className}`}>
            {translations["category"]}
          </Link>
          {headerPage.map((page, index) => (
            <Link key={index} href={page?.path} className={`${className}`}>
              {page?.name}
            </Link>
          ))}
        </div>
      </>
    )
  );
}
