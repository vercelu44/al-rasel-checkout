"use client";
import Image from "next/image";
import { Link } from "@/navigation";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Loader from "../elements/loaders/Loader";
import { getDaysSinceCreation } from "@/utils/format-date";
import { getDiscountPercent, getSalePercent } from "@/utils/percent";
import noImage from "@/public/assets/images/no-image.png";

import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiArrowLongRight,
  HiHeart,
} from "react-icons/hi2";
import { siteConfig } from "@/config/site";
import useWishList from "@/hooks/useWishList";
import useHover from "@/hooks/useHover";
import useCart from "@/hooks/useCart";
import { cn } from "@/utils";

const ProductCard = ({ product, isFlashSale, isSquareImage, }) => {
  const { settings, translations } = useSelector((state) => state.common);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  
  const { isHovered: isHoveredElement1, bind: bindElement1 } = useHover();
  const { isHovered: isHoveredElement2, bind: bindElement2 } = useHover();
  //custom hook for reusing
  const { handleAddToCart, handleAddAndCheckout } = useCart(); 
  const {
    handleAddToWishlist,
    handleWishListProductStatus,
    handleRemoveFromWishlist,
  } = useWishList();

  const {
    id,
    slug,
    image,
    product_name,
    new_price,
    old_price,
    stock_qty,
    total_sale_qty,
    created_at,
    hover_image,
  } = product;

  useEffect(() => {
    if (Object.keys(product).length !== 0) {
      setLoading(false);
    }
  }, [product]);

  const isInWishlist = handleWishListProductStatus(id);

  return (
    <>
    <h1 className="sr-only">Detail category</h1>
      {!loading ? (
        <>
          <div
            className="relative product-card-wrap bg-white rounded shadow p-3 "
          >
            <div className="product-img-action-wrap relative @container">
              {getDaysSinceCreation(created_at) < 8 && (
                <div className="absolute top-2 left-2 z-20">
                  <span
                    className="text-sm px-1  active:scale-90 rounded"
                    style={{
                      backgroundColor: settings?.colors?.secondary,
                      color: settings?.colors?.secondary_text,
                    }}
                  >
                    New
                  </span>
                </div>
              )}
              {!settings?.guest_checkout ? (
                <div className="absolute top-2 right-2 z-20">
                  <button
                    aria-label="Add To Wishlist"
                    className={`bg-white px-1 active:scale-90 rounded ${
                      isInWishlist ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={(e) =>
                      !isInWishlist
                        ? handleAddToWishlist(product)
                        : handleRemoveFromWishlist(id)
                    }
                  >
                    {isInWishlist ? <HiHeart /> : <HiOutlineHeart />}
                  </button>
                </div>
              ) : null}
              <div
                className={cn(
                  `product-img overflow-hidden `,
                  isSquareImage ? 'aspect-[4/4]' : 'aspect-[4/5]'
                )}
              >
                <Link href="/products/[slug]" as={`/products/${slug}`}>
                  <Image
                    className="default-img h-full w-full object-cover object-top hover:scale-125 transition-transform duration-300 ease-in-out rounded-t"
                    src={
                      hovered
                        ? hover_image || image || noImage
                        : image || noImage
                    }
                    alt={product_name || "Not Found"}
                    width={226}
                    height={400}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  />
                </Link>
              </div>
            </div>
            <div className="product-content-wrap @container">
              <h2>
                <Link
                  href={`/products/${slug}`}
                  className="product-title text-base text-slate-900 font-body overflow-text"
                >
                  {product_name}
                </Link>
              </h2>
              <div className="product-price mb-3 flex flex-row font-title items-center gap-2">
                <span className="font-semibold ">
                  {siteConfig.currency.shortForm}
                  {new_price}
                </span>
                {old_price > new_price ? (
                  <div className="flex items-center gap-2">
                    <del className="old-price text-sm font-normal text-slate-400">
                      {siteConfig.currency.shortForm}
                      {old_price}
                    </del>
                    <span className="absolute @[200px]:absolute @[201px]:static bottom-28 lg:bottom-[120px] left-2 z-20 discount-badge rounded text-white bg-red-500 px-1 ml-1 !text-[12px]">
                      {getDiscountPercent(old_price, new_price)}% OFF
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="product-actions flex justify-between items-center gap-1 sm:gap-2">
                <button
                  aria-label="Add To Cart"
                  className="action-btn p-1 lg:px-2 text-sm lg:text-lg rounded "
                  onClick={(e) => handleAddToCart(product)}
                  {...bindElement1}
                  style={{
                    border: `1px solid ${
                      isHoveredElement1
                        ? settings?.colors?.primary_text
                        : settings?.colors?.default_text
                    }`,
                    backgroundColor: isHoveredElement1
                      ? settings?.colors?.primary
                      : "transparent",
                    color: isHoveredElement1
                      ? settings?.colors?.primary_text
                      : settings?.colors?.default_text,
                  }}
                >
                  <HiOutlineShoppingCart
                    size={20}
                    className="active:scale-90"
                  />
                </button>
                <button
                  onClick={() => handleAddAndCheckout(product)}
                  {...bindElement2}
                  className="action-btn p-1 text-sm lg:text-lg lg:px-4 py-1 w-full rounded"
                  style={{
                    border: `1px solid ${
                      isHoveredElement2
                        ? settings?.colors?.primary_text
                        : settings?.colors?.default_text
                    }`,
                    backgroundColor: isHoveredElement2
                      ? settings?.colors?.primary
                      : "transparent",
                    color: isHoveredElement2
                      ? settings?.colors?.primary_text
                      : settings?.colors?.default_text,
                  }}
                >
                  {translations["buy-now"] || "Buy Now"}{" "}
                  <HiArrowLongRight className="hidden @[200px]:inline-block" size={20} />
                </button>
              </div>
              {isFlashSale && (
                <div className="product-flash-counter mt-4">
                  <div className=" flex items-center gap-3">
                    <div className="w-full h-[8px] bg-gray-200 rounded">
                      <div
                        className="h-[8px] bg-primary rounded"
                        style={{
                          width: `${getSalePercent(
                            total_sale_qty,
                            stock_qty
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <h3>{getSalePercent(total_sale_qty, stock_qty)}%</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ProductCard;
