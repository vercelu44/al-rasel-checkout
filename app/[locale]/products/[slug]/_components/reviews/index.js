"use client";
import { useState } from "react";
import RatingReviewCard from "./RatingReviewCard";
import { Rating } from "react-simple-star-rating";
import {
	useGetProductReviewsQuery,
	useGetReviewImagesQuery,
	useGetReviewSummaryQuery,
} from "@/store/api/productReviewAPI";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import AllReviewImages from "./AllReviewImages";
import Paginator from "@/components/elements/Paginator";
import ReviewSortSelect from "./ReviewSortSelect";
import ReviewFilterSelect from "./ReviewFilterSelect";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getFractionFixed } from "@/utils/format-number";

const RatingReviews = ({ product_id }) => {
	const { user } = useSelector((state) => state.auth);
	const [customSearchParams, setCustomSearchParams] = useState({
		per_page: 6,
		sort_type: "default",
		rating: "all-star",
		page: 1,
	});
	const { translations, settings } = useSelector((state) => state.common);
	const isMobile = useMediaQuery("(max-width: 768px)");

	// Review Summary
	const { data: summary = {}, isLoading: summaryLoading } =
		useGetReviewSummaryQuery(product_id);

	const starLabelToValue = {
		five: 5,
		four: 4,
		three: 3,
		two: 2,
		one: 1,
	};

	// Calculate percentage for each star rating
	const percentages = {
		five: (summary.five / summary.totalReview) * 100,
		four: (summary.four / summary.totalReview) * 100,
		three: (summary.three / summary.totalReview) * 100,
		two: (summary.two / summary.totalReview) * 100,
		one: (summary.one / summary.totalReview) * 100,
	};

	//ALL Review Images
	const { data: reviewImageData, isLoading: imagesLoading } =
		useGetReviewImagesQuery(product_id);

	const reviewImages = reviewImageData?.data || [];

	//ALL Reviews
	// const searchParams = useSearchParams();
	const queryParams = new URLSearchParams(customSearchParams);

	if (user) {
		queryParams.set("reference_id", user?.id);
	}

	const { data, isLoading } = useGetProductReviewsQuery(
		product_id + "&" + queryParams.toString()
	);
	const allReviews = data?.data || [];
	const meta = data?.meta || {};

	return (
		<section id="product-rating-reviews">
			<h2 className="text-2xl font-bold font-title text-slate-900">
				{translations["ratings-and-reviews"] || "রেটিং ও রিভিউ"}:
			</h2>
			{summaryLoading ? (
				<ItemsListLoader noImage={true} numItems={1} />
			) : (
				<div className="rating grid grid-cols-1 lg:grid-cols-7 mt-3 mb-5 pb-6 border-b border-slate-200">
					<div className="justify-self-center lg:justify-self-start lg:col-span-2 text-center flex flex-col justify-center items-center">
						<h3 className="text-2xl font-bold text-slate-950">
							{getFractionFixed(summary?.averageRating || 0)}
						</h3>
						<div className="my-3">
							<Rating
								initialValue={summary?.averageRating}
								allowFraction
								readonly
								size={24}
								transition
								fillColor="#F59E0B"
							/>
						</div>
						<p className="text-slate-700">
							{summary?.totalReview} {translations["ratings"] || "গুলো রেটিং"}
						</p>
					</div>
					<div className="rating-summery lg:col-span-5 grid grid-cols-12 items-center">
						<div className="h-[88px] w-[1px] bg-slate-200 mr-5 justify-self-start hidden lg:block"></div>
						<div className="col-span-11">
							{Object.keys(percentages).map((star) => (
								<div key={star} className="flex items-center gap-2 mt-3">
									<span className="text-sm font-semibold text-slate-700">
										{starLabelToValue[star]}
									</span>
									<div className="w-5/6 h-[6px] bg-gray-200 rounded">
										<div
											className="h-[6px] bg-amber-500 rounded"
											style={{ width: `${percentages[star] || 0}%` }}
										></div>
									</div>
									<span className="text-sm font-medium text-slate-300">
										{summary[star]}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* ALL Review Images and sorting and filter */}
			{imagesLoading && <ItemsListLoader noImage={true} numItems={1} />}
			{reviewImages.length > 0 && (
				<>
					<div id="customer-pictures">
						<h2 className="text-base/4 font-semibold font-title text-slate-700">
							{translations["imgs-from-cstmr"] || "কাস্টমারের দেয়া ছবি গুলো"}
						</h2>
						<div className="bg-slate-50 rounded-md mt-3 p-3 lg:p-4">
							<AllReviewImages images={reviewImages} max={isMobile ? 8 : 6} />
						</div>
					</div>
					<div
						id="customer-review-header"
						className="bg-slate-50 rounded-md mt-8 p-3 flex flex-col gap-3 lg:flex-row lg:items-center"
					>
						<h2 className="text-base/4 font-semibold font-title text-slate-700">
							{translations["customer-reviews"] || "কাস্টমারের রিভিউ গুলো"}
						</h2>
						<div className="lg:ml-auto flex gap-4 lg:items-center">
							<ReviewSortSelect
								onSelectChange={(item) =>
									setCustomSearchParams((prevParams) => ({
										...prevParams,
										sort_type: item.key,
									}))
								}
							/>
							<ReviewFilterSelect
								onSelectChange={(item) =>
									setCustomSearchParams((prevParams) => ({
										...prevParams,
										rating: item.key,
									}))
								}
							/>
						</div>
					</div>
				</>
			)}

			{/* Rating Review Cards */}
			{isLoading ? (
				<ItemsListLoader noImage={true} numItems={3} />
			) : (
				<div className="mt-2">
					{allReviews.map((review) => (
						<RatingReviewCard
							key={review.id}
							review={review}
							reviewImages={reviewImages}
							translations={translations}
							settings={settings}
						/>
					))}
				</div>
			)}
			{allReviews.length >= 6 && (
				<div className="flex lg:justify-end mt-4 lg:mt-9">
					<Paginator
						meta={meta}
						isOnPage={true}
						onPageChange={(page) =>
							setCustomSearchParams((prevParams) => ({
								...prevParams,
								page: page,
							}))
						}
					/>
				</div>
			)}
		</section>
	);
};

export default RatingReviews;
