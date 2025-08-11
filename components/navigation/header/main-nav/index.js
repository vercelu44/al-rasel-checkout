"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "@/store/slices/cartSlice";
import { setLoginModalOpen } from "@/store/slices/authSlice";
import ResponsiveSearch from "./ResponsiveSearch";
import useWishList from "@/hooks/useWishList";
import LanguageSelector from "./LanguageSelector";
import SidebarMenu from "@/components/side-drawers/SidebarMenu";
import { useRouter } from "@/navigation";
const LoginModal = dynamic(() => import("../../../modals/login/LoginModal"), {
  ssr: false,
});

// ** Import Icons
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi2";
import { cn } from "@/utils";
import { HiMenuAlt1 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import Search from "@/components/elements/Search";
import { IoCall } from "react-icons/io5";
import useHover from "@/hooks/useHover";

export default function MainNav({ settings, categories }) {
  const { cart } = useSelector((state) => state.cart);
  const { user, isLoginModalOpen } = useSelector((state) => state.auth);
  const { isHovered: isHoveredElement1, bind: bindElement1 } = useHover();

  const { getWishlistCount } = useWishList();
  const router = useRouter();
  const dispatch = useDispatch();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const handleModalOpen = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      dispatch(setLoginModalOpen(true));
    }
  };
  const wishlistCount = getWishlistCount();

  return (
    <div
      className={cn(`relative py-1.5 shadow-sm md:shadow-none`)}
      style={{
        backgroundColor: settings?.colors?.primary,
        color: settings?.colors?.primary_text,
      }}
    >
      <div className="main-nav container">
        <div className="flex items-center justify-between gap-x-2">
          <Link
            href="/"
            className="logo h-[45px] lg:h-[68px] max-w-[150px] lg:max-w-[250px] -mr-10 sm:-mr-12 md:mr-0"
          >
            {settings?.logo ? (
              <Image
                src={settings?.logo}
                alt={settings?.name || "Not Found"}
                width={200}
                height={68}
                className="h-full w-auto object-contain"
              />
            ) : (
              <span className="text-3xl font-bold inline-block pt-4">{settings?.name}</span>
            )}
          </Link>
          <div className="hidden lg:flex items-center gap-10">
            <Search />
            {settings?.phone[0] && (
              <a
                href={`tel:${settings.phone[0]}`}
                className="flex items-center gap-2"
                {...bindElement1}
                style={
                  isHoveredElement1
                    ? { color: settings?.colors?.secondary }
                    : { color: settings?.colors?.primary_text }
                }
              >
                <IoCall size={24} />
                <div className="text-xs capitalize">
                  <p>Call us now</p>
                  <p>{settings.phone[0]}</p>
                </div>
              </a>
            )}
          </div>

          <div className="header-actions items-center flex gap-2 lg:gap-4">
            <ResponsiveSearch settings={settings} />
            <button
              onClick={() => dispatch(toggleCart())}
              className="group relative single-action hidden lg:block"
            >
              <HiOutlineShoppingCart size={24} />
              {cart?.length ? (
                <span
                  className="absolute -right-1 -top-1 border text-[10px] px-1 text-center rounded-full"
                  style={{
                    border: `1px solid ${settings?.colors?.primary_text}`,
                  }}
                >
                  {cart?.length}
                </span>
              ) : null}
            </button>
            {!settings?.guest_checkout ? (
              <>
                <button
                  onClick={() => router.push("/dashboard/my-wishlist")}
                  className="inline-block relative"
                >
                  <HiOutlineHeart size={24} />
                  {wishlistCount ? (
                    <span
                      className="absolute -right-1.5 -top-1.5 border text-[10px] px-1 text-center rounded-full "
                      style={{
                        border: `1px solid ${settings?.colors?.primary_text}`,
                        backgroundColor: settings?.colors?.primary,
                      }}
                    >
                      {wishlistCount}
                    </span>
                  ) : null}
                </button>
                <button onClick={handleModalOpen} className="single-action">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      height={32}
                      width={32}
                      className="h-full w-full rounded-full"
                    />
                  ) : (
                    <HiOutlineUser size={24} />
                  )}
                </button>
              </>
            ) : null}

            <span className="hidden md:block">
              <LanguageSelector />
            </span>
            <button
              onClick={() => setSideMenuOpen(!sideMenuOpen)}
              className=" md:hidden"
            >
              {!sideMenuOpen ? (
                <HiMenuAlt1 size={24} />
              ) : (
                <AiOutlineClose size={24} />
              )}
            </button>
          </div>
        </div>
      </div>
      {isLoginModalOpen && (
        <LoginModal
          showModal={isLoginModalOpen}
          setShowModal={(show) => dispatch(setLoginModalOpen(show))}
          title={"welcome"}
        />
      )}
      {sideMenuOpen && (
        <SidebarMenu
          categories={categories}
          sidebarToggle={() => setSideMenuOpen(!sideMenuOpen)}
          isSideBarOpen={sideMenuOpen}
          settings={settings}
        />
      )}
    </div>
  );
}
