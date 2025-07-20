"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { getCouponDiscount } from "@/lib/checkout";
import { getSlicedText } from "@/utils/format-text";
import ViewHTML from "@/components/elements/ViewHTML";
import ProductVariantSelect from "@/components/products/ProductVariantSelect";
import * as pixel from "/lib/fpixel";

// ** Import Icon
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { TbTag } from "react-icons/tb";
import { IoCopy } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import ProductViewSlider from "./ProductViewSlider";
import { siteConfig } from "@/config/site";
import { IoIosFlash } from "react-icons/io";
import { getDiscountPercent } from "@/utils/percent";
import useCart from "@/hooks/useCart";
import { useSelector } from "react-redux";
import VideoPlayer from "@/components/elements/VideoPlayer";
import { MdArrowForwardIos } from "react-icons/md";
import SizeChartModal from "@/components/modals/SizeChartModal";
import { getFirstVariantOfColor } from "@/lib/product-variant";
import SocialShare from "@/components/elements/SocialShare";
import { generateUniqueId } from "@/utils/get-unique";
import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
import { Cookies } from "@/utils/cookies";
import { sendGTMEvent } from "@next/third-parties/google";
const ProductDetails = ({ product, settings, translations }) => {
  const { handleAddToCart, handleAddAndCheckout } = useCart(); // custom hook for reusing
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const productViewSwiperRef = useRef(null);
  const pathname = usePathname();

  // Get first variant of selected color to display prices
  const firstVariantOfColor = getFirstVariantOfColor(
    selectedColor,
    product?.barcodes
  );

  const newPrice =
    selectedVariant?.discount_selling_price ||
    firstVariantOfColor?.discount_selling_price ||
    product?.new_price;
  const oldPrice =
    selectedVariant?.selling_price ||
    firstVariantOfColor?.selling_price ||
    product?.old_price;

  //META PIXEL TRACKING CODE
  const [AddToConversionAPI] = useAddToTrackingMutation();
  const { isFbPixelInitialized } = useSelector((state) => state.common);
  const flag = useRef(true);
  const flag2 = useRef(true);

  useEffect(() => {
    if (!product) return;
    const eventID = generateUniqueId();

    if (isFbPixelInitialized && flag.current) {
      pixel.event("ViewContent", pixel.getProductPixelData(product), {
        eventID: eventID,
      });
      flag.current = false;
    }
    //For conversion API
    if (settings?.fb_pixel_id && settings?.fb_access_token && flag2.current) {
      AddToConversionAPI({
        event_id: eventID,
        event_name: "ViewContent",
        product_ids: [product.id],
        url: process.env.NEXT_PUBLIC_BASE_URL + pathname,
        fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie,
        fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie
      });
      flag2.current = false;
    }
  }, [product, pathname, isFbPixelInitialized, settings, AddToConversionAPI]);
  // Google Tag Manager
  const gtmFlag = useRef(true);
  useEffect(() => {
    if (!product) return;
    const payload = {
      event: "view_item",
      ecommerce: {
        currency: "BDT", // Change to your store's currency
        value: product.new_price, // Total value of the added item(s)
        url: process.env.NEXT_PUBLIC_BASE_URL + pathname,
        fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie,
        fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie
        items: [
          {
            item_id: product.id,
            item_name: product.product_name,
            image: product.image,
            price: product.new_price,
            item_brand: product?.brand?.brand_name || "no-brand",
            item_category: product?.category?.category_name,
            item_category2: product?.sub_category?.category_name,
            item_category3: product?.child_category?.category_name,
            quantity: 1,
          },
        ],
      },
    };

    //Client side tracking
    if (gtmFlag.current && settings?.gtm_id) {
      sendGTMEvent(payload);
      // console.log("view_item occured"); // console success
      gtmFlag.current = false;
    }
  }, [product, pathname, settings]);
  return (
    <>
      <div className="relative product-details">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-10">
          <div className="lg:w-fit">
            <div className="sticky top-32">
              <ProductViewSlider
                product={product}
                ref={productViewSwiperRef}
                selectedColor={selectedColor}
                isSquareImage={siteConfig.isSquareImage}
              />
            </div>
          </div>
          <div className="lg:w-full">
            <div className="product-content-wrap">
              {product?.brand?.brand_name && (
                <p className="text-sm font-bold text-primary capitalize mb-1 lg:mb-2">
                  {product.brand.brand_name}
                </p>
              )}
              <h1 className="text-2xl font-title font-bold text-slate-900">
                {product?.product_name}
              </h1>
              {/* Product Dynamic Pricing Area  */}
              <div className="product-price flex items-center gap-4 lg:border-b border-slate-200 py-3 lg:py-5">
                <span className="text-2xl lg:text-3xl/[48px] font-bold font-title text-slate-900">
                  {siteConfig.currency.sign} {newPrice || "0.00"}{" "}
                </span>
                {oldPrice > newPrice ? (
                  <>
                    <del className="old-price text-base lg:text-lg/[24px] font-normal text-slate-400">
                      {siteConfig.currency.sign} {oldPrice ? oldPrice : "0.00"}
                    </del>
                    <span className="discount inline-block text-base/[22px] font-semibold font-title text-white bg-red-500 rounded-md py-1 px-2">
                      {getDiscountPercent(oldPrice, newPrice)}% OFF
                    </span>
                  </>
                ) : null}
              </div>
              {/* {product?.minimum_wholesale_quantity > 0 && (
								<div className="product-price flex items-center gap-4 pt-4">
									<span className="text-xl font-title text-slate-900">
										Wholesale Price {siteConfig.currency.shortForm}
										{product?.wholesale_price || "0.00"}{" "}
									</span>
									<span className="old-price text-lg/[24px] font-normal text-slate-400">
										(MOQ: {product?.minimum_wholesale_quantity})
									</span>
								</div>
							)} */}
              <div className="flex items-center gap-2 lg:py-3 font-title text-lg">
                <span className="text-slate-900">SKU:</span>
                <span className="text-secondary">{product?.sku}</span>
              </div>
              {/* short description  */}
              <ViewHTML
                htmlText={product?.product_short_description}
                className={"desc"}
              />
              <div className="px-3 lg:px-0">
                {!(
                  product.barcodes?.length === 1 &&
                  product.barcodes[0].size === "" &&
                  product.barcodes[0].color === ""
                ) ? (
                  <ProductVariantSelect
                    photos={product?.photos}
                    productBarCodes={product?.barcodes}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                    translations={translations}
                    ref={productViewSwiperRef}
                    setSelectedColor={setSelectedColor}
                    selectedColor={selectedColor}
                  />
                ) : null}
              </div>
              {product?.coupons?.length ? (
                <div className="mt-5 mb-8">
                  <p className="font-semibold font-title text-slate-900 mb-2">
                    {translations["best-offer"] || "সেরা অফার"}{" "}
                    <TbTag size={24} className="text-primary mb-1" />
                  </p>
                  <ul className="coupon-info">
                    <li className="relative text-slate-900 pl-4">
                      {translations["coupon-discount"] || "কুপন ডিসকাউন্ট"}:{" "}
                      <span className="font-semibold text-title text-secondary-700">
                        &#2547;
                        {getCouponDiscount(
                          product?.coupons[0],
                          product.new_price
                        )}{" "}
                        {translations["off!"] || "ছাড়!"}
                      </span>
                    </li>
                    <li className="relative text-slate-900 pl-4 my-2 before:!top-3">
                      {translations["coupon-code"] || "কুপন কোড"}:{" "}
                      <span className="inline-block text-primary border border-dashed border-primary rounded px-2 py-1 ml-1">
                        {product.coupons[0].code}{" "}
                        <CopyToClipboard
                          text={product.coupons[0].code}
                          onCopy={() => toast.success("copied")}
                        >
                          <IoCopy
                            size={20}
                            className="text-primary mb-1 active:scale-90"
                          />
                        </CopyToClipboard>
                      </span>
                    </li>
                    <li className="relative text-slate-900 pl-4 mb-3">
                      {translations["applicable"] || "প্রযোজ্য"}:{" "}
                      {siteConfig.currency.sign}
                      {product.coupons[0].max_discount}{" "}
                      {translations["amount-above-order"] ||
                        "উপরে অর্ডারে (শুধুমাত্র প্রথম কেনাকাটায়)"}
                    </li>
                  </ul>
                  <Link href="#" className="text-secondary-700 underline">
                    {translations["see-all-products-on-offer"] ||
                      "অফারের সকল প্রডাক্ট দেখুন"}
                  </Link>
                </div>
              ) : null}
            </div>

            {/* size chart section */}
            {product?.size_chart && (
              <button
                className="text-secondary-700 mt-4 flex items-center gap-x-1 text-sm lg:text-base"
                onClick={() => setShowSizeChart((show) => !show)}
              >
                <span>
                  {translations["see-size-chart"] || "See Size Chart"}
                </span>
                <MdArrowForwardIos />
              </button>
            )}
            {/* Add to cart section  */}
            <div className="py-2 pt-6 lg:pt-8 lg:pb-4">
              <div className="product-actions flex gap-4 justify-between items-center">
                <button
                  className="bg-primary py-3 w-full px-2 lg:px-6 text-white  text-center active:scale-95 rounded-lg"
                  onClick={() => handleAddToCart(product, selectedVariant)}
                  style={{
                    backgroundColor: settings?.colors?.primary,
                    color: settings?.colors?.primary_text,
                    border: `1px solid ${settings?.colors?.primary_text}`,
                  }}
                >
                  <HiOutlineShoppingCart size={24} />
                  <span className="ml-2">
                    {translations["add-to-cart"] || "Add to cart"}
                  </span>
                </button>
                <button
                  onClick={() => handleAddAndCheckout(product, selectedVariant)}
                  className="bg-primary py-3 w-full px-2 lg:px-6 text-white  text-center active:scale-95 rounded-lg"
                  style={{
                    backgroundColor: settings?.colors?.primary,
                    color: settings?.colors?.primary_text,
                    border: `1px solid ${settings?.colors?.primary_text}`,
                  }}
                >
                  <IoIosFlash size={24} />{" "}
                  <span className="mr-2">
                    {translations["buy-now"] || "Buy now"}
                  </span>
                </button>
              </div>
            </div>

            <SocialShare translations={translations} />

            {/* Product Descriptions */}
            <div className="pt-3 lg:pt-4 pb-2 lg:pb-4">
              {product?.details && (
                <div className="description">
                  <h4 className="text-2xl font-bold font-title text-slate-900">
                    {translations["product-description"] || "Description"}:
                  </h4>
                  <ViewHTML htmlText={product?.details} />
                </div>
              )}
              {product.includedProducts?.length ? (
                <div className="mt-4 lg:mt-5">
                  <h4 className="text-2xl font-bold font-title text-slate-900 mb-4 capitalize">
                    {translations["product-included"] || "Product Included"}:
                  </h4>
                  <Image
                    src={product.includedProducts[0]?.image}
                    alt="Insta 360"
                    width={628}
                    height={510}
                    className="w-full h-[300px] lg:h-[510px] rounded-lg"
                  />
                </div>
              ) : null}

              {product?.review_video && (
                <div className="mt-4 lg:mt-5">
                  <h4 className="text-2xl font-bold font-title text-slate-900">
                    {translations["review-video"] || "রিভিউ ভিডিও"}
                  </h4>
                  <div className="mt-3">
                    <VideoPlayer
                      url={product?.review_video}
                      loop={true}
                      muted={true}
                      // playing={true}
                      controls={true}
                      className={"h-[12rem] md:h-[21.875rem]"}
                    />
                  </div>
                </div>
              )}

              {/* product-specifications */}
              {product?.specification && (
                <div id="product-specifications" className="mt-4 lg:mt-5">
                  <h4 className="text-2xl font-bold font-title text-slate-900">
                    {translations["specifications"] || "Specifications"}:
                  </h4>
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 mt-3 overflow-x-auto">
                    <ViewHTML htmlText={product?.specification} />
                  </div>
                </div>
              )}

              <div className="contact mt-5 bg-amber-200  border p-4 mb-4 text-center">
                <h5 className="text-2xl font-bold font-title text-slate-900 mb-3">
                  {translations["contact-for-more-details"] ||
                    "Contact for more details"}
                </h5>
                <p className="flex justify-center items-center gap-4">
                  <span className="text-base text-slate-900">
                    {translations["call-now"] || "Call Now"}:
                  </span>{" "}
                  <Link
                    href={`tel:${settings?.phone[0]}`}
                    className="text-2xl font-bold font-title text-primary"
                  >
                    <BsFillTelephoneFill /> {settings?.phone[0]}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {product?.size_chart && showSizeChart && (
        <SizeChartModal
          showModal={showSizeChart}
          setShowModal={setShowSizeChart}
          sizeChart={product?.size_chart}
        />
      )}
    </>
  );
};

export default ProductDetails;
