"use client";
import React, { useState } from "react";
import { Link } from "@/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";
const LogoutModal = dynamic(() => import("@/components/modals/logoutModal"));
import dynamic from "next/dynamic";

//icons
import { FaClipboardList, FaUser } from "react-icons/fa";
import { HiHeart, HiReceiptPercent, HiTicket } from "react-icons/hi2";
import { IoLogOut } from "react-icons/io5";
import { MdRateReview } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { setLogoutModalOpen } from "@/store/slices/authSlice";

export default function AuthUserMenus({ togglePopover }) {
  const { translations } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const handleModalOpen = () => {
    dispatch(setLogoutModalOpen(true));
    togglePopover();
  };
  const navItems = [
    {
      text: translations["my-profile"] || "My Profile",
      icon: <FaUser />,
      path: "/dashboard/profile",
    },
    {
      text: translations["my-order"] || "My Orders",
      icon: <FaClipboardList />,
      path: "/dashboard/my-orders",
    },
    {
      text: translations["my-wish-list"] || "My Wish List",
      icon: <HiHeart />,
      path: "/dashboard/my-wishlist",
    },
    {
      text: translations["my-review"] || "My Reviews",
      icon: <MdRateReview />,
      path: "/dashboard/my-reviews",
    },
    {
      text: translations["voucher"] || "Voucher",
      icon: <HiReceiptPercent />,
      path: "/dashboard/my-voucher",
    },
    {
      text: translations["questions-and-answers"] || "Q&A",
      icon: <RiQuestionAnswerFill />,
      path: "/dashboard/qna",
    },
    {
      text: translations["support-ticket"] || "Support Ticket",
      icon: <HiTicket />,
      path: "/dashboard/support-ticket",
    },
    // Add more items as needed
  ];

  return (
    <div className="absolute right-0 top-0 z-10 mt-14">
      <div className="relative bg-white pl-2 py-6 w-52 border border-slate-300 rounded-lg">
        <div className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-slate-300"></div>
        <div className="content-area">
          <ul className="w-[15.25rem] text-slate-500">
            {navItems.map((item) => (
              <li
                key={item.path}
                className={`flex items-center py-3 px-4 rounded-lg w-full`}
              >
                <Link
                  href={item.path}
                  onClick={() => togglePopover()}
                  className="flex items-center gap-x-3 group capitalize"
                >
                  <span
                    className={`group-hover:font-bold text-xl text-amber-400 group-hover:text-primary`}
                  >
                    {item.icon}
                  </span>
                  <span className="group-hover:text-primary">{item.text}</span>
                </Link>
              </li>
            ))}
            <li className={`flex items-center py-3 px-4 rounded-lg w-full`}>
              <button
                className="flex items-center gap-x-3 group"
                onClick={handleModalOpen}
              >
                <span
                  className={`hover:font-bold text-xl text-amber-400 group-hover:text-primary`}
                >
                  <IoLogOut />
                </span>
                <span className="group-hover:text-primary hover:font-bold">
                  {translations["log-out"] || "Log Out"}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
