"use client";
import { Link } from "@/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useCart from "@/hooks/useCart";
import { toast } from "react-toastify";
import { siteConfig } from "@/config/site";
import { useDispatch, useSelector } from "react-redux";
import { removeFromSizeChange } from "@/store/slices/cartSlice";
import noImage from "@/public/assets/images/no-image.png";
import { getDiscountPercent } from "@/utils/percent";
import Modal from "../elements/Modal";
import { getAppropriatePhoto } from "@/lib/cart";

const SizeChangeModal = () => {
	const { handleSizeChange } = useCart(); //custom hook for reusing
	const { sizeChangeProduct: product } = useSelector((state) => state.cart);
	const { settings, translations } = useSelector((state) => state.common);
	const [selectedVariant, setSelectedVariant] = useState();
	const dispatch = useDispatch();

	const closeSizeChange = (param) => {
		setSelectedVariant(null); // clearing selected variants on close
		dispatch(removeFromSizeChange());
	};

	const handleSizeChangeAndClose = () => {
		if (!selectedVariant) {
			toast.error("You must select a size first");
			return;
		}
		if (product.selectedBarCode.size === selectedVariant.size) {
			toast.error("you didn't change the size");
			return;
		}
		handleSizeChange(product, selectedVariant);
		closeSizeChange();
	};

	const handleVariantSelect = (variantProp) => {
		if (variantProp.stock_qty <= 0 && settings.allow_stock_out_product_add_to_cart === 0) {
			setSelectedVariant(null); // clear selected variant when out of stock
			toast.error("Oops! this variant isn't available");
			return;
		}
		setSelectedVariant(variantProp);
	};

	useEffect(() => {
		if (product) {
			setSelectedVariant(product.selectedBarCode);
		}
	}, [product]);

	const newPrice =
		selectedVariant?.discount_selling_price || product?.new_price;
	const oldPrice = selectedVariant?.selling_price || product?.old_price;

	return (
		product && (
			<Modal
				showModal={product}
				setShowModal={closeSizeChange}
				title={translations["select-variant"] || "Select Variant"}
			>
				<div className="lg:w-[430px]">
					{/* Product details section */}
					<div className="product-info grid grid-cols-[72px_auto] lg:grid-cols-[84px_auto] gap-3 lg:gap-4 items-center">
						<Image
							src={
								getAppropriatePhoto(product, product?.selectedBarCode?.color) ||
								noImage
							}
							alt="product"
							height={84}
							width={84}
							className="h-[72px] w-[72px] lg:w-[84px] lg:h-[84px] rounded-lg"
						/>
						<div className="">
							<h5 className="text-primary text-xs font-semibold">
								{product?.brand?.brand_name || "No Brand"}
							</h5>
							<h2 className="mt-2">
								<Link
									href={`/products/${product?.slug}`}
									className="product-title"
								>
									{product?.product_name}
								</Link>
							</h2>
							<div className="flex gap-2 lg:gap-3 products-center items-center">
								<h3 className="text-base/[16px] lg:text-xl text-red-500">
									{siteConfig.currency.sign} {newPrice}
								</h3>
								{oldPrice > newPrice ? (
									<>
										<del className="text-sm text-slate-300">
											{siteConfig.currency.sign} {oldPrice}
										</del>
										<div className="rounded-md px-1 text-xs py-0.5 text-white bg-red-500">
											{getDiscountPercent(oldPrice, newPrice)}% OFF
										</div>
									</>
								) : null}
							</div>
						</div>
					</div>
					{/* Size change Section  */}
					<div className="product-size mt-4">
						<div className="flex justify-between font-normal items-center">
							<h4 className="text-slate-900 text-sm lg:text-base">
								{translations["select-size"] || "Select Variant"}:
							</h4>
						</div>
						<div className="flex gap-2 lg:gap-3 flex-wrap mt-2 lg:mt-3">
							{product.availableSizes?.map((variant) => (
								<div
									key={variant.id}
									className={`py-2 lg:py-3 px-4 rounded-lg border text-sm lg:text-base ${
										selectedVariant?.id === variant.id
											? "border-primary"
											: "border-slate-300"
									} cursor-pointer  ${
										variant.stock_qty <= 0 && settings.allow_stock_out_product_add_to_cart === 0
											? "bg-slate-300 text-slate-400 cursor-not-allowed"
											: "text-slate-700"
									}`}
									onClick={() => handleVariantSelect(variant)}
								>
									{variant.size}
								</div>
							))}
						</div>
					</div>
					{/* Actions Section */}
					<div className="product-actions mt-8 flex gap-3 lg:gap-4 justify-between items-center">
						<button
							onClick={handleSizeChangeAndClose}
							className="bg-primary py-3 w-full px-2 text-white text-center active:scale-95"
							style={{
								background: settings?.colors?.primary,
								border: `1px solid ${settings?.colors?.primary_text}`,
								color: settings?.colors?.primary_text,
							}}
						>
							{translations["update-variant"] || "Update Variant"}
						</button>
					</div>
				</div>
			</Modal>
		)
	);
};

export default SizeChangeModal;
