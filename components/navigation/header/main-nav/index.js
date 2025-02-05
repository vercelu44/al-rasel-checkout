"use client";
import { Link } from "@/navigation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import LoginModal from "../../../modals/login/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "@/store/slices/cartSlice";
import AuthUserMenus from "./AuthUserMenus";
import LanguageSelector from "./LanguageSelector";
import {
  setLoginModalOpen,
  setLogoutModalOpen,
} from "@/store/slices/authSlice";

// ** Import Icons
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi2";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useParams } from "next/navigation";
import ResponsiveSearch from "./ResponsiveSearch";
import MenuItems from "./MenuItems";
import LogoutModal from "@/components/modals/logoutModal";
import useWishList from "@/hooks/useWishList";
// import logo from "@/public/assets/logo-2.jpeg";
import MegaMenu from "../mega-menu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { setDeliveryAddressModalOpen } from "@/store/slices/commonSlice";
import { IoIosArrowDown } from "react-icons/io";

export default function MainNav({ settings }) {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || prevScrollPos < 100;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const { locale } = useParams();
  const [scroll, setScroll] = useState(0);
  const { cart } = useSelector((state) => state.cart);
  const { user, isLoginModalOpen, isLogoutModalOpen } = useSelector(
    (state) => state.auth
  );
  const { translations } = useSelector((state) => state.common);
  const { getWishlistCount } = useWishList();
  const isTablet = useMediaQuery("(max-width: 992px)");

  const dispatch = useDispatch();

  //start of popover
  const [userOpen, setUserOpen] = useState(false);
  const popoverRef = useRef(null);

  const togglePopover = () => {
    setUserOpen((prevState) => !prevState);
  };

  const handleModalOpen = () => {
    setUserOpen(false);
    // setShowModal(true);
    dispatch(setLoginModalOpen(true));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //end of popover

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY >= 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  }, [scroll]);

  const wishlistCount = getWishlistCount();

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
    <div className={"!mt-[73px] md:!mt-24 lg:!mt-32"}>
      <div
        style={{
          transition: "top 0.3s ease",
          ...(!visible && { top: isTablet ? "-60px" : "-80px" }),
        }}
        className={`fixed left-0 top-0 w-full z-30 `}
      >
        <div className="py-3 md:py-1 xl:py-4 bg-white md:bg-header border-b border-slate-300">
          <div className="container">
            <div className="header-wrap flex justify-between items-center">
              {/* Nav Items  */}
              <div className="header-left flex items-center">
                <Link href="/" className="logo">
                  <Image
                    src={settings?.logo}
                    alt={settings?.name}
                    width={200}
                    height={48}
                    className="h-[40px] md:min-h-[48px] object-contain w-auto max-w-[120px] xl:max-w-[200px]"
                  />
                </Link>
                <MenuItems settings={settings} />
              </div>
              <div className="header-right flex justify-between items-center ml-4 gap-2 lg:gap-6">
                <ResponsiveSearch />
                {defaultAddress && (
                  <div
                    onClick={() => dispatch(setDeliveryAddressModalOpen(true))}
                    className="relative hidden lg:flex items-center space-x-2 p-1 bg-gray-100 rounded-md cursor-pointer group"
                  >
                    <div className="text-blue-500">
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
                      <h4 className="text-sm font-medium text-gray-700">
                        Delivery to
                      </h4>
                      <p className="text-sm text-gray-500">
                        {defaultAddress.slice(0, 20)}...
                      </p>
                    </div>
                    <IoIosArrowDown className="h-5 w-5 text-blue-500" />
                    {/* <div className="absolute top-full left-0 w-48 p-2 bg-white shadow-md rounded-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p
                        className="text-sm text-blue-500 hover:underline cursor-pointer"
                        onClick={() =>
                          dispatch(setDeliveryAddressModalOpen(true))
                        }
                      >
                        Update delivery location
                      </p>
                    </div> */}
                  </div>
                )}

                <div className="header-actions flex items-center gap-3 lg:gap-4">
                  {!settings?.guest_checkout ? (
                    <Link
                      href="/dashboard/my-wishlist"
                      className="single-action !hidden md:!flex relative"
                    >
                      <HiOutlineHeart size={24} />
                      {wishlistCount ? (
                        <span className="absolute -right-2 -top-2 bg-red-500 text-white px-2 text-center rounded-full">
                          {wishlistCount > 9 ? "9+" : wishlistCount}
                        </span>
                      ) : null}
                    </Link>
                  ) : null}

                  <button
                    onClick={() => dispatch(toggleCart())}
                    className="single-action relative"
                  >
                    <HiOutlineShoppingCart size={24} />
                    {cart?.length ? (
                      <span className="absolute -right-2 -top-2 bg-red-500 text-white px-2 text-center rounded-full">
                        {cart?.length > 9 ? "9+" : cart?.length}
                      </span>
                    ) : null}
                  </button>
                  {!settings?.guest_checkout ? (
                    <div
                      ref={popoverRef}
                      className="relative hidden md:flex items-center"
                    >
                      <button className="single-action" onClick={togglePopover}>
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
                      {userOpen && !user ? (
                        <div className="absolute right-0 top-0 z-10 mt-14">
                          <div className="relative bg-white px-6 py-8 w-52 border border-slate-300 md:border-white rounded-lg">
                            <div className="absolute top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-slate-300"></div>
                            <p className="text-slate-500 text-base font-bold text-center">
                              {translations["login-status"]}
                            </p>
                            <div className="flex justify-center mt-4">
                              <button
                                className="primary-btn px-6"
                                onClick={handleModalOpen}
                              >
                                {translations["log-in"] || "Log In"}
                                <HiArrowNarrowRight />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {/* for authenticated user */}
                      {userOpen && user ? (
                        <AuthUserMenus togglePopover={togglePopover} />
                      ) : null}
                    </div>
                  ) : null}
                  {/* <div className="hidden md:block"> */}
                  {process.env.NEXT_PUBLIC_LOCALIZATION !== "NO" && (
                    <LanguageSelector locale={locale} />
                  )}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-full border-b border-slate-300 hidden md:block">
          <MegaMenu settings={settings} />
        </div>

        {isLoginModalOpen && (
          <LoginModal
            showModal={isLoginModalOpen}
            setShowModal={(show) => dispatch(setLoginModalOpen(show))}
            title={translations["welcome"]}
          />
        )}
        {isLogoutModalOpen && (
          <LogoutModal
            showModal={isLogoutModalOpen}
            setShowModal={(show) => dispatch(setLogoutModalOpen(show))}
            title={translations["log-out"]}
          />
        )}
      </div>
    </div>
  );
}
