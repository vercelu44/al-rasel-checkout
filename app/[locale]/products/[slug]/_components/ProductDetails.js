"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { getCouponDiscount } from "@/lib/checkout";
import ViewHTML from "@/components/elements/ViewHTML";
import ProductVariantSelect from "@/components/products/ProductVariantSelect";
import * as pixel from "/lib/fpixel";

// ** Import Icon
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { TbTag } from "react-icons/tb";
import { IoCallOutline, IoCopy } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import ProductViewSlider from "./ProductViewSlider";
import { siteConfig } from "@/config/site";
import { IoIosFlash } from "react-icons/io";
import { getDiscountPercent } from "@/utils/percent";
import useCart from "@/hooks/useCart";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "@/components/elements/VideoPlayer";
import { MdArrowForwardIos } from "react-icons/md";
import SizeChartModal from "@/components/modals/SizeChartModal";
import { getFirstVariantOfColor } from "@/lib/product-variant";
import SocialShare from "@/components/elements/SocialShare";
import { generateUniqueId } from "@/utils/get-unique";
import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
import { Cookies } from "@/utils/cookies";
import { sendGTMEvent } from "@next/third-parties/google";
import { RxCopy } from "react-icons/rx";
import { setLoginModalOpen } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { AiFillGift } from "react-icons/ai";
import { BsArrowDown } from "react-icons/bs";

const ProductDetails = ({ product, settings, translations }) => {
  const { handleAddToCart, handleAddAndCheckout } = useCart();
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const productViewSwiperRef = useRef(null);
  const pathname = usePathname();

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const firstVariantOfColor = getFirstVariantOfColor(
    selectedColor,
    product?.barcodes,
  );

  const newPrice =
    selectedVariant?.discount_selling_price ||
    firstVariantOfColor?.discount_selling_price ||
    product?.new_price;
  const oldPrice =
    selectedVariant?.selling_price ||
    firstVariantOfColor?.selling_price ||
    product?.old_price;

  // Get current variant's price break discounts
  const getCurrentVariantPriceBreaks = () => {
    const currentBarcode = selectedVariant || product?.barcodes?.[0];
    if (!currentBarcode) return [];
    
    // Check if price_break_discounts exists in the product or barcode
    if (product?.price_break_discounts && product.price_break_discounts.length > 0) {
      return product.price_break_discounts;
    }
    
    // If price_break_discounts is in barcode level
    if (currentBarcode?.price_break_discounts) {
      return currentBarcode.price_break_discounts;
    }
    
    return [];
  };

  const priceBreaks = getCurrentVariantPriceBreaks();
  
  // Calculate savings for each price break
  const calculateSavings = (discount) => {
    const basePrice = parseFloat(selectedVariant?.selling_price || product?.old_price || 0);
    let discountedPrice = basePrice;
    
    if (discount.discount_type === 'fixed') {
      discountedPrice = basePrice - parseFloat(discount.discount_value);
    } else if (discount.discount_type === 'percentage') {
      discountedPrice = basePrice * (1 - parseFloat(discount.discount_value) / 100);
    }
    
    return {
      originalTotal: basePrice * parseFloat(discount.min_qty),
      discountedTotal: discountedPrice * parseFloat(discount.min_qty),
      savings: (basePrice - discountedPrice) * parseFloat(discount.min_qty),
      perPieceSavings: basePrice - discountedPrice,
      discountedPrice: discountedPrice
    };
  };

  // Format quantity range
  const formatQuantityRange = (discount) => {
    const minQty = parseFloat(discount.min_qty);
    const maxQty = discount.max_qty ? parseFloat(discount.max_qty) : null;
    
    if (maxQty) {
      return `${minQty} - ${maxQty}`;
    }
    return `${minQty}+`;
  };

  // Get the best deal (max quantity)
  const getBestDeal = () => {
    if (!priceBreaks || priceBreaks.length === 0) return null;
    
    // Sort by min_qty descending to get the highest quantity deal
    const sorted = [...priceBreaks].sort((a, b) => 
      parseFloat(b.min_qty) - parseFloat(a.min_qty)
    );
    
    // The last one (highest quantity) with max_qty: null is the best deal
    const bestDeal = sorted.find(d => d.max_qty === null) || sorted[0];
    return bestDeal;
  };

  const bestDeal = getBestDeal();

  // META PIXEL TRACKING CODE
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
    if (settings?.fb_pixel_id && settings?.fb_access_token && flag2.current) {
      AddToConversionAPI({
        event_id: eventID,
        event_name: "ViewContent",
        product_ids: [product.id],
        url: process.env.NEXT_PUBLIC_BASE_URL + pathname,
        fbp: Cookies.get("_fbp"),
        fbc: Cookies.get("_fbc"),
      });
      flag2.current = false;
    }
  }, [product, pathname, isFbPixelInitialized, settings, AddToConversionAPI]);

  const gtmFlag = useRef(true);
  useEffect(() => {
    if (!product) return;
    const payload = {
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: product.new_price,
        url: process.env.NEXT_PUBLIC_BASE_URL + pathname,
        fbp: Cookies.get("_fbp"),
        fbc: Cookies.get("_fbc"),
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

    if (gtmFlag.current && settings?.gtm_id) {
      sendGTMEvent(payload);
      gtmFlag.current = false;
    }
  }, [product, pathname, settings]);

  const [copied, setCopied] = useState(false);

  const barcode =
    product.barcodes?.length === 1
      ? product.barcodes[0].barcode
      : selectedVariant?.barcode;
  
  const getShowStockStatus = settings?.show_stock_status_on_ecommerce || false;
  const findSingleProduct = product?.barcodes?.length === 1 ? true : false;
  const isShowStockStatus = (getShowStockStatus && findSingleProduct) && product?.stock_qty <= 0 ? true : false;

  const handleCopy = () => {
    if (barcode) {
      navigator.clipboard.writeText(barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappNumber = settings?.phone[0];
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product?.slug}`;
  const message = `Hello! ${settings?.name}, I'm interested in:
      Product: ${product?.product_name}
      Price: ${newPrice}
      Barcode: ${barcode}
      Product URL: ${productUrl}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;

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

              <div className="flex items-center gap-2 lg:py-3 font-title text-lg">
                <span className="text-slate-900">SKU:</span>
                <span className="">{product?.sku}</span>
              </div>
              {barcode ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-slate-700 font-semibold text-lg">
                    Barcode:
                  </h2>
                  <h2
                    title="Select a variant to see barcode"
                    className="text-secondary text-lg font-mono break-all"
                  >
                    {barcode || "N/A"}
                  </h2>
                  <button
                    title="Copy Barcode"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    {copied ? (
                      "Copied!"
                    ) : (
                      <>
                        <RxCopy className="text-base" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ) : null}

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

              {/* ============= NEW: PRICE BREAK DISCOUNT SECTION ============= */}
              {priceBreaks && priceBreaks.length > 1 && (
                <div className="mt-5 mb-2 border-2 border-green-400 rounded-xl p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-3">
                    <AiFillGift className="text-green-600 text-2xl" />
                    <h4 className="text-base lg:text-lg font-bold font-title text-green-800">
                      {translations["bulk-discount-offer"] || "🎯 Bulk Purchase Offer"}
                    </h4>
                    <span className="ml-auto text-xs bg-green-600 text-white px-2 py-1 rounded-full animate-pulse">
                      {translations["save-more"] || "Save More!"}
                    </span>
                  </div>
                  
                  <p className="text-sm text-green-700 mb-3">
                    {translations["buy-more-save-more"] || "Buy more, save more! Check out our quantity-based discounts below:"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {priceBreaks.map((discount, index) => {
                      const savings = calculateSavings(discount);
                      const range = formatQuantityRange(discount);
                      const isBestDeal = discount === bestDeal;
                      
                      return (
                        <div 
                          key={index}
                          className={`relative bg-white rounded-lg p-3 border-2 transition-all hover:shadow-md ${
                            isBestDeal 
                              ? 'border-green-500 shadow-lg shadow-green-100' 
                              : 'border-green-200'
                          }`}
                        >
                          {isBestDeal && (
                            <div className="absolute -top-2 -right-2">
                              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {translations["best-deal"] || "BEST DEAL"}
                              </span>
                            </div>
                          )}
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-slate-500 font-medium">
                                {translations["quantity"] || "Qty"}
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {range}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500 font-medium">
                                {translations["per-piece"] || "Per Piece"}
                              </p>
                              <p className="text-base font-bold text-green-600">
                                {siteConfig.currency.sign} {savings.discountedPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {translations["you-save"] || "You Save"}
                              </span>
                              <span className="text-sm font-bold text-red-600">
                                {siteConfig.currency.sign} {savings.perPieceSavings.toFixed(2)} 
                                <span className="text-[10px] font-normal text-slate-500"> /pc</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-slate-500">
                                {translations["total-savings"] || "Total Savings"}
                              </span>
                              <span className="text-sm font-bold text-red-600">
                                {siteConfig.currency.sign} {savings.savings.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Show total savings if buying max quantity */}
                  {bestDeal && (
                    <div className="mt-3 p-3 bg-green-200 rounded-lg border border-green-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BsArrowDown className="text-green-700 animate-bounce" />
                          <span className="text-sm font-semibold text-green-800">
                            {translations["best-value"] || "🌟 Best Value"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-green-700">
                            {translations["save-up-to"] || "Save up to"}
                          </span>
                          <span className="ml-2 font-bold text-green-800">
                            {siteConfig.currency.sign} {calculateSavings(bestDeal).savings.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Combo Product Section */}
              {product?.combo_products?.length ? (
                <div className="mt-5 mb-2 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-base lg:text-lg font-bold font-title text-slate-900 mb-3">
                    {translations["combo-includes"] || "This Combo Includes"}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      ({product.combo_products.length}{" "}
                      {translations["items"] || "items"})
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.combo_products.map((comboItem) => (
                      <Link
                        key={comboItem.id}
                        href={`/products/${comboItem?.product?.slug}`}
                        className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition rounded-lg p-2"
                      >
                        <Image
                          src={
                            comboItem?.product?.image ||
                            "/assets/images/no-image.png"
                          }
                          alt={comboItem?.product?.product_name || "product"}
                          height={56}
                          width={56}
                          className="h-14 w-14 rounded-md object-cover shrink-0 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {comboItem?.product?.product_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {translations["qty"] || "Qty"}:{" "}
                            {comboItem?.combo_qty}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

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
                          product.new_price,
                        )}{" "}
                        {translations["off!"] || "ছাড়!"}
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
                        "উপরে অর্ডারে (শুধুমাত্র প্রথম কেনাকাটায়)"}
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
            <div className="py-2 pt-6 lg:pt-8 space-y-3 lg:pb-4">
              {
                isShowStockStatus && <p className="py-1 px-3 bg-red-500 text-white rounded inline-flex"> Stock Out  </p>
              }
              
              <div className="flex gap-2 lg:gap-3 justify-between items-center">
                <button
                  className="bg-primary text-xs md:text-base uppercase lg:font-medium py-3 gap-2 w-full px-2 lg:px-6 text-white text-center active:scale-95 rounded-lg"
                  onClick={() => handleAddToCart(product, selectedVariant)}
                  style={{
                    backgroundColor: settings?.colors?.primary,
                    color: settings?.colors?.primary_text,
                    border: `1px solid ${settings?.colors?.primary_text}`,
                  }}
                >
                  <HiOutlineShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="ml-2">
                    {translations["add-to-cart"] || "Add to cart"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      if (!settings?.guest_checkout) {
                        toast.error("Please login first before checkout");
                        dispatch(setLoginModalOpen(true));
                        localStorage.setItem("redirect", "/checkout");
                        return;
                      }
                    }
                    handleAddAndCheckout(product, selectedVariant);
                  }}
                  className="bg-primary text-xs md:text-base uppercase lg:font-medium py-3 gap-2 w-full px-2 lg:px-6 text-white text-center active:scale-95 rounded-lg"
                  style={{
                    backgroundColor: settings?.colors?.primary,
                    color: settings?.colors?.primary_text,
                    border: `1px solid ${settings?.colors?.primary_text}`,
                  }}
                >
                  <IoIosFlash className="w-4 h-4 lg:w-5 lg:h-5" />{" "}
                  <span className="">
                    {translations["buy-now"] || "Buy now"}
                  </span>
                </button>
              </div>
              <div className="flex gap-2 lg:gap-3 justify-between items-center">
                <Link href={whatsappUrl} target="_blank" className="w-full">
                  <button
                    className="bg-primary text-xs md:text-base lg:font-medium py-3 gap-2 w-full px-1 md:px-2 lg:px-6 text-white text-center active:scale-95 rounded-lg"
                    style={{
                      backgroundColor: "#1daa61",
                    }}
                  >
                    <FaWhatsapp className="w-4 h-4 lg:w-5 lg:h-5"/>
                    <span className="md:ml-2">Order On WhatsApp</span>
                  </button>
                </Link>
                <Link href={`tel:${settings?.phone[0]}`} className="w-full">
                  <button
                    className="bg-primary text-xs md:text-base lg:font-medium py-3 gap-2 w-full px-1 md:px-2 lg:px-6 text-white text-center active:scale-95 rounded-lg"
                    style={{
                      backgroundColor: "#193276",
                    }}
                  >
                    <IoCallOutline className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="md:ml-2">Call for order</span>
                  </button>
                </Link>
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

              <div className="contact mt-5 bg-amber-200 border p-4 mb-4 text-center">
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