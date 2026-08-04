"use client";

import Image from "next/image";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import * as cartActions from "@/store/slices/cartSlice";
import noImage from "@/public/assets/images/no-image.png";
import { Link } from "@/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { siteConfig } from "@/config/site";
import { getAppropriatePhoto } from "@/lib/cart";
import { BsChevronDown } from "react-icons/bs";
import { getDiscountPercent } from "@/utils/percent";
import { useState, useEffect } from "react";

const CartCard = ({ item }) => {
  const {
    slug,
    brand,
    product_name,
    quantity,
    barcodeId,
    selectedBarCode,
    availableSizes,
    buy_x_get_y,
    selectedFreeProducts, //persisted map { [freeProductId]: barcodeObj }
  } = item;

  const { settings } = useSelector((state) => state.common);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [eligibleFreeProducts, setEligibleFreeProducts] = useState([]);

  // Check if this product qualifies for free products
  useEffect(() => {
    if (buy_x_get_y && cart.length > 0) {
      const { buy_qty, get_products } = buy_x_get_y;
      const buyQty = parseFloat(buy_qty);

      if (quantity >= buyQty) {
        const eligibleSets = Math.floor(quantity / buyQty);

        const freeProducts = get_products.map((product) => {
          // usable variants: prefer in-stock ones, fallback to all
          const inStockVariants = product.barcodes?.filter((b) => b.stock_qty > 0) || [];
          const variants = inStockVariants.length ? inStockVariants : product.barcodes || [];

          return {
            ...product,
            freeQuantity: parseFloat(product.get_qty) * eligibleSets,
            variants,
          };
        });

        setEligibleFreeProducts(freeProducts);
      } else {
        setEligibleFreeProducts([]);
      }
    } else {
      setEligibleFreeProducts([]);
    }
  }, [quantity, buy_x_get_y, cart]);

  // auto-select a default variant for each eligible free product if not already selected
  useEffect(() => {
    eligibleFreeProducts.forEach((product) => {
      const alreadySelected = selectedFreeProducts?.[product.id];
      if (!alreadySelected && product.variants?.length) {
        dispatch(
          cartActions.setFreeProductBarcode({
            barcodeId,
            freeProductId: product.id,
            barcode: product.variants[0],
          })
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligibleFreeProducts]);

  const handleFreeVariantSelect = (freeProductId, barcode) => {
    dispatch(
      cartActions.setFreeProductBarcode({
        barcodeId,
        freeProductId,
        barcode,
      })
    );
  };

  return (
    <div className="relative cart-card p-4 bg-white border-slate-200">
      <button
        className="absolute right-4 top-4 bg-transparent text-primary"
        onClick={() => dispatch(cartActions.removeFromCart(barcodeId))}
      >
        <AiOutlineClose size={16} />
      </button>
      <div className="flex w-full gap-2">
        <div className="w-24">
          <Image
            src={getAppropriatePhoto(item, selectedBarCode?.color) || noImage}
            alt="product"
            height={80}
            width={80}
            className="h-20 w-20 rounded border border-gray-100"
          />
        </div>
        <div className="w-full">
          <h2>
            <Link
              href={`/products/${slug}`}
              className="product-title text-base font-semibold text-slate-900 font-body overflow-text"
            >
              {product_name}
            </Link>
          </h2>
          <div className="flex gap-3 products-center items-center">
            <>
              <h3 className="text-base ">
                {siteConfig.currency.shortForm}
                {item.finalPrice}
              </h3>
              {item.finalPrice < item.basePrice ? (
                <>
                  <del className="text-sm text-slate-300">
                    {siteConfig.currency.sign} {item.basePrice}
                  </del>
                  <div className="rounded-md px-1 text-xs text-white bg-red-500">
                    {getDiscountPercent(item.basePrice, item.finalPrice)}% OFF
                  </div>
                </>
              ) : null}
            </>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <div className="flex products-center gap-3">
              {selectedBarCode?.color && (
                <p className="px-2 py-[1px] text-xs h-5 border border-slate-300 rounded-md">
                  {selectedBarCode?.color}
                </p>
              )}

              {availableSizes?.length > 1 ? (
                selectedBarCode?.size && (
                  <button
                    className="px-2 py-[1px] flex items-center text-xs h-5 border border-slate-300 rounded-md cursor-pointer"
                    onClick={() => dispatch(cartActions.addToSizeChange(item))}
                  >
                    {selectedBarCode?.size}
                    <BsChevronDown className="ml-1 text-slate-900" />
                  </button>
                )
              ) : (
                selectedBarCode?.size && (
                  <p className="px-2 py-[1px] text-sm h-6 border border-slate-300 rounded-md">
                    {selectedBarCode?.size}
                  </p>
                )
              )}
            </div>
            <div className="flex border items-center products-center px-1 rounded-full gap-2 text-slate-900">
              <button
                disabled={quantity <= 1}
                className={`bg-transparent ${
                  quantity <= 1
                    ? "border-slate-300 cursor-not-allowed text-slate-300"
                    : "border-primary"
                } rounded w-7 h-7`}
                onClick={() => dispatch(cartActions.removeQuantity(barcodeId))}
              >
                <FiMinus size={14} />
              </button>
              <div className="mx-1 font-bold">{quantity || 1}</div>
              <button
                className="bg-transparent border-primary rounded w-7 h-7"
                onClick={() =>
                  dispatch(cartActions.addQuantity({ barcodeId, settings }))
                }
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* Buy X Get Y - Free Products Section */}
          {eligibleFreeProducts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
              <p className="text-xs text-green-600 font-semibold mb-2">
                🎁 Free Products (Buy {buy_x_get_y?.buy_qty} Get {buy_x_get_y?.get_products?.length} Free)
              </p>
              <div className="space-y-2">
                {eligibleFreeProducts.map((freeProduct) => {
                  const selectedVariant = selectedFreeProducts?.[freeProduct.id];
                  const hasMultipleVariants = freeProduct.variants?.length > 1;

                  return (
                    <div
                      key={freeProduct.id}
                      className="flex items-start gap-2 bg-green-50 p-2 rounded-md"
                    >
                      <Image
                        src={freeProduct.image || noImage}
                        alt={freeProduct.product_name}
                        height={40}
                        width={40}
                        className="h-10 w-10 rounded border border-gray-200 object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {freeProduct.product_name}
                        </p>
                        <p className="text-xs text-green-600">
                          Free × {freeProduct.freeQuantity}
                        </p>

                        {/* variant display / selector */}
                        {!hasMultipleVariants && selectedVariant ? (
                          <p className="text-[11px] text-slate-500 mt-1">
                            {selectedVariant.color && `${selectedVariant.color}`}
                            {selectedVariant.color && selectedVariant.size && " / "}
                            {selectedVariant.size && `${selectedVariant.size}`}
                          </p>
                        ) : hasMultipleVariants ? (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {freeProduct.variants.map((variant) => {
                              const isActive = selectedVariant?.id === variant.id;
                              const label =
                                [variant.color, variant.size]
                                  .filter(Boolean)
                                  .join(" / ") || variant.barcode;
                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={() =>
                                    handleFreeVariantSelect(freeProduct.id, variant)
                                  }
                                  className={`px-2 py-[2px] text-[11px] rounded-md border ${
                                    isActive
                                      ? "border-primary text-primary bg-white font-semibold"
                                      : "border-slate-300 text-slate-600 bg-white"
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartCard;