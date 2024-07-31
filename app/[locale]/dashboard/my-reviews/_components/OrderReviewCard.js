"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { BsArrowRight } from "react-icons/bs";
import ReviewSummaryPopover from "./ReviewSummaryPopover";
import { getFormattedDate } from "@/utils/format-date";
import noImage from "@/public/assets/images/no-image.png";
import { Rating } from "react-simple-star-rating";

const OrderReviewCard = ({ sellReview, translations = {} }) => {
	const [reviewOpen, setReviewOpen] = useState(null);
	const { id, total_review, delivered_at, saleProducts } = sellReview;

	//Popover
	const popoverRef = useRef(null);

	// Function to toggle popover for a specific index
	const togglePopover = (index) => {
		if (reviewOpen !== null) {
			setReviewOpen(null);
		} else {
			setReviewOpen(index);
		}
	};

	//useRef issue need to fix
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popoverRef.current && !popoverRef.current.contains(event.target)) {
				setReviewOpen(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	//end of popover
	return (
		<div className="relative mb-6 lg:mb-8">
			<div className="sec-heading absolute top-[-10px] left-0 rtl:right-0 w-full px-3 lg:px-8">
				<span className="bg-white text-secondary-700 px-2">
					{translations["delivery-completed"] || "Delivery Completed"} :{" "}
					{getFormattedDate(delivered_at)}
				</span>
			</div>
			<div className="bg-white rounded-2xl border-2 border-slate-200 mb-3 p-3 pt-[20px] lg:p-5 lg:pt-[30px]">
				{saleProducts.map(({ reviews, barcode, product }, index) => (
					<div
						key={index + Date.now()}
						className={`flex gap-3 lg:gap-4 ${
							saleProducts?.length > 1 && index !== saleProducts?.length - 1
								? "mb-3 border-b pb-3 border-slate-100"
								: ""
						}`}
					>
						<div className="">
							<Image
								src={product?.image || noImage}
								alt="product"
								height={80}
								width={80}
								className="h-[72px] lg:h-20 w-[72px] lg:w-20 rounded-lg"
							/>
						</div>
						<div className="flex flex-col w-full">
							<h2>
								<Link
									href={`/products/${product?.slug}`}
									className="product-title !mt-0"
								>
									{product?.product_name}
								</Link>
							</h2>
							<div className="flex products-center justify-between text-sm lg:mt-2">
								<div className="flex items-center gap-3">
									{barcode?.color && (
										<div className="px-2 border border-slate-300 rounded-md">
											{barcode?.color}
										</div>
									)}
									{barcode?.size && (
										<div className="px-2 border border-slate-300 rounded-md">
											{barcode.size}
										</div>
									)}
								</div>

								{total_review ? (
									<div className="ml-auto relative" ref={popoverRef}>
										<span
											className="flex items-center gap-1 text-primary cursor-pointer"
											onClick={() => togglePopover(index)}
										>
											<Rating
												initialValue={reviews?.rating || 5}
												allowFraction
												readonly
												size={24}
												transition
												fillColor="#F59E0B"
											/>
										</span>
										{reviewOpen === index && (
											<ReviewSummaryPopover
												review={reviews}
												translations={translations}
											/>
										)}
									</div>
								) : null}
							</div>
							{!total_review && index === saleProducts?.length - 1 ? (
								<div className="flex justify-end">
									<Link
										href={`/dashboard/my-reviews/new/${id}`}
										className="text-btn !p-0 text-xs/[100%] lg:!text-sm"
									>
										{translations["write-a-review"]} <BsArrowRight className="rtl:rotate-180"/>
									</Link>
								</div>
							) : null}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderReviewCard;
