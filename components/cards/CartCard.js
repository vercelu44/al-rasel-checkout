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

const CartCard = ({ item }) => {
  const {
    slug,
    brand,
    product_name,
    quantity,
    // barcodes,
    barcodeId,
    selectedBarCode,
    availableSizes,
    // wholesale_price,
    // minimum_wholesale_quantity,
  } = item;

  const { settings } = useSelector((state) => state.common);
  const dispatch = useDispatch();

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
            src={getAppropriatePhoto(item, selectedBarCode.color) || noImage}
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
            {/* {minimum_wholesale_quantity &&
						quantity >= minimum_wholesale_quantity ? (
							<h3 className="">
								{siteConfig.currency.shortForm}
								{wholesale_price} -{" "}
								<span className="text-green-600">(wholesale)</span>
							</h3>
						) : ( */}
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
                  <div className="rounded-md px-1 text-xs  text-white bg-red-500">
                    {getDiscountPercent(item.basePrice, item.finalPrice)}% OFF
                  </div>
                </>
              ) : null}
            </>
            {/* )} */}
          </div>
          <div className="flex  justify-between text-sm mt-1">
            <div className="flex products-center gap-3">
              {selectedBarCode.color && (
                <p className="px-2 py-[1px] text-xs h-5  border border-slate-300 rounded-md">
                  {selectedBarCode?.color}
                </p>
              )}

              {availableSizes?.length > 1
                ? selectedBarCode.size && (
                    <button
                      className="px-2 py-[1px] flex items-center text-xs h-5 border border-slate-300 rounded-md cursor-pointer"
                      onClick={() =>
                        dispatch(cartActions.addToSizeChange(item))
                      }
                    >
                      {selectedBarCode?.size}
                      <BsChevronDown className="ml-1 text-slate-900" />
                    </button>
                  )
                : selectedBarCode.size && (
                    <p className="px-2 py-[1px] text-sm h-6 border border-slate-300 rounded-md">
                      {selectedBarCode?.size}
                    </p>
                  )}
            </div>
            <div className="flex border items-center products-center px-1  rounded-full gap-2 text-slate-900">
              <button
                disabled={quantity <= 1}
                className={`bg-transparent  ${
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
                className="bg-transparent  border-primary rounded w-7 h-7"
                onClick={() =>
                  dispatch(cartActions.addQuantity({ barcodeId, settings }))
                }
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
