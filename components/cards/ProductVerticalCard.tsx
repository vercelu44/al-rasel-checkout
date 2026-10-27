"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loader from "../elements/loaders/Loader";
import { formatLongNumber, getFractionFixed } from "@/utils/format-number";

// ** Import Icon
import { FaStar } from "react-icons/fa";

import type { Product } from "@/types";

interface ProductVerticalCardProps {
	product: Product;
	/** Smaller card used in the visit history */
	isHistory?: boolean;
}

const ProductVerticalCard = ({ product, isHistory }: ProductVerticalCardProps) => {
	const [loading, setLoading] = useState(true);

	const {
		slug,
		image,
		product_name,
		brand,
		averate_rating,
		total_rating,
		new_price,
		old_price,
		discount_percentage,
	} = product;

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="product-card-wrap flex items-center gap-x-2 bg-white border border-slate-200 rounded-xl p-2">
			<div
				className="product-img"
				style={{
					height: isHistory ? "76px" : "116px",
					width: isHistory ? "76px" : "116px",
				}}
			>
				<Link href="/products/[slug]" as={`/products/${slug}`}>
					<Image
						src={image || "/assets/images/no-image.png"}
						alt={`product`}
						width={isHistory ? 76 : 116}
						height={isHistory ? 76 : 116}
						// priority={true}
						className="h-full w-full object-cover"
					/>
				</Link>
			</div>
			<div className="product-content-wrap">
				{!isHistory && (
					<div className="product-category">
						<Link
							href={`/brands/${brand?.id ? brand?.id : ""}`}
							className="text-xs text-primary capitalize"
						>
							{brand?.brand_name || "No Brand"}
						</Link>
					</div>
				)}
				<h2>
					<Link
						href={`/products/${slug}`}
						className="product-title text-base font-semibold text-slate-900 font-body overflow-text"
					>
						{product_name}
					</Link>
				</h2>
				<div className="rating-result flex items-center gap-2 mb-2">
					<span className="font-semibold text-slate-900">
						{getFractionFixed(averate_rating) || 0}{" "}
						<FaStar className="text-primary pb-1" />
					</span>
					<span className="block border-l border-l-slate-200 pl-2 font-semibold text-slate-900">
						{total_rating === 0 ? "No Rating" : formatLongNumber(total_rating)}
					</span>
				</div>
				<div className="product-price mb-3 text-sm flex gap-2">
					<span className="text-lg/[24px] font-semibold text-red-500">
						৳{new_price}
					</span>
					{typeof discount_percentage === "number" &&
					discount_percentage > 0 ? (
						<>
							<del className="old-price text-lg/[24px] font-normal text-slate-400">
								৳{old_price}
							</del>
							<span className="discount inline-block text-xs text-white bg-red-500 rounded-md py-1 px-1 ml-2">
								-{getFractionFixed(discount_percentage)}%
							</span>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ProductVerticalCard;
