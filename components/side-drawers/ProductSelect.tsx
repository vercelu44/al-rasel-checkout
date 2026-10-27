"use client";
import { Link } from "@/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { removeFromSelected, toggleCart } from "@/store/slices/cartSlice";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { HiArrowLongRight } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ProductVariantSelect from "../products/ProductVariantSelect";
import noImage from "@/public/assets/images/no-image.png";
import { siteConfig } from "@/config/site";
import useCart from "@/hooks/useCart";
import { getDiscountPercent } from "@/utils/percent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Modal from "../elements/Modal";
import DrawerRight from "../elements/DrawerRight";
import type { ProductVariant } from "@/types";

const ProductSelect = () => {
	const { handleAddToCart, handleAddAndCheckout } = useCart(); //custom hook for reusing
	const { selectedProduct } = useAppSelector((state) => state.cart);
	const { settings, translations } = useAppSelector((state) => state.common);
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
	const [selectedColor, setSelectedColor] = useState("");
	const isMobile = useMediaQuery("(max-width: 768px)");
	const dispatch = useAppDispatch();

	const closeDrawer = () => {
		setSelectedVariant(null); // clearing selected variants on close
		dispatch(removeFromSelected());
	};

	const handleAddAndClose = () => {
		const isSuccess = handleAddToCart(selectedProduct, selectedVariant);
		if (isSuccess) {
			closeDrawer();
			dispatch(toggleCart()); //opening cart
		}
	};

	const newPrice =
		selectedVariant?.discount_selling_price || selectedProduct?.new_price;
	const oldPrice = selectedVariant?.selling_price || selectedProduct?.old_price;

	const pageContent = (
		<div className="lg:p-6">
			<div className="product-info grid grid-cols-[72px_auto] lg:grid-cols-[84px_auto] gap-3 lg:gap-4 items-center">
				<Image
					src={selectedProduct?.image || noImage}
					alt="product"
					height={84}
					width={84}
					className="h-[72px] w-[72px] lg:w-[84px] lg:h-[84px] rounded-lg"
				/>
				<div className="">
					<h5 className="text-primary text-xs font-semibold">
						{selectedProduct?.brand?.brand_name || "No Brand"}
					</h5>
					<h2 className="mt-2">
						<Link
							href={`/products/${selectedProduct?.slug}`}
							className="product-title"
						>
							{selectedProduct?.product_name}
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
			<ProductVariantSelect
				photos={selectedProduct?.photos}
				productBarCodes={selectedProduct?.barcodes}
				selectedVariant={selectedVariant}
				setSelectedVariant={setSelectedVariant}
				translations={translations}
				selectedColor={selectedColor}
				setSelectedColor={setSelectedColor}
			/>
			<div className="product-actions mt-8 lg:mt-10 mb-3 lg:my-6 flex gap-3 text-sm md:text-base lg:gap-4 justify-between items-center">
				<button
					className="py-2 md:py-3 w-full px-1 md:px-3 text-center active:scale-95 rounded-lg"
					style={{
						backgroundColor: settings?.colors?.primary,
						color: settings?.colors?.primary_text,
						border: `1px solid ${settings?.colors?.primary_text}`,
					}}
					onClick={() => handleAddAndClose()}
				>
					<HiOutlineShoppingCart size={20} />
					<span className="ml-2">
						{translations["add-to-cart"] || "Add to Cart"}
					</span>
				</button>
				<button
					onClick={() =>
						handleAddAndCheckout(selectedProduct, selectedVariant, true)
					}
					className="py-2 md:py-3 w-full px-1 md:px-3 text-center active:scale-95 rounded-lg"
					style={{
						backgroundColor: settings?.colors?.primary,
						color: settings?.colors?.primary_text,
						border: `1px solid ${settings?.colors?.primary_text}`,
					}}
				>
					<span className="mr-2">{translations["buy-now"] || "Buy Now"}</span>
					<HiArrowLongRight size={20} className="hidden lg:inline" />
				</button>
			</div>
			<Link
				href={`/products/${selectedProduct?.slug}`}
				className="text-secondary-700 text-sm"
			>
				<p className="text-center">
					{translations["click-product-details"] ||
						"Click to view product details"}
				</p>
			</Link>
		</div>
	);

	return (
		<>
			{isMobile ? (
				<Modal
					showModal={!!selectedProduct}
					setShowModal={closeDrawer}
					title={translations["select-variant"] || "Select Variant"}
				>
					{pageContent}
				</Modal>
			) : (
				<DrawerRight
					title={translations["select-variant"] || "Select Variant"}
					show={!!selectedProduct}
					setShow={closeDrawer}
				>
					{pageContent}
				</DrawerRight>
			)}
		</>
	);
};

export default ProductSelect;
