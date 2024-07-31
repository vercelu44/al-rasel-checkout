"use client";

import { Link } from "@/navigation";
import { Rating } from "react-simple-star-rating";
import { useGetReviewSummaryQuery } from "@/store/api/productReviewAPI";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { handleTabItemToView } from "./ProductTabsView";
import { getFractionFixed } from "@/utils/format-number";

const RatingReviewPopover = ({ product_id }) => {
	const { translations } = useSelector((state) => state.common);
	const isMobile = useMediaQuery("(max-width: 768px)");

	// Review Summary
	const { data: summary = {}, isLoading: summaryLoading } =
		useGetReviewSummaryQuery(product_id, { skip: isMobile });

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

	return (
		<>
			{isMobile ? null : (
				<div className="right-22 top-7 mt-2 hidden group-hover:block group-hover:absolute relative">
					<div className="h-5 w-[400px] left-0 top-[-15px] absolute opacity-0"></div>
					<div className="product-rating-reviews w-[400px] rounded-xl bg-white shadow-top p-4">
						<div className="absolute top-1 left-10 -z-10 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-6 h-6 bg-white shadow-inner"></div>
						{summaryLoading ? (
							<ItemsListLoader noImage={true} numItems={1} />
						) : (
							<div className="rating grid grid-cols-1 lg:grid-cols-7 mt-3 pb-6 border-b border-slate-200">
								<div className="justify-self-center lg:justify-self-start lg:col-span-3 text-center flex flex-col justify-center items-center">
									<h3 className="text-2xl font-bold text-slate-950">
										{getFractionFixed(summary?.averageRating || 0)}
									</h3>
									<div className="my-3">
										<Rating
											initialValue={summary?.averageRating || 0}
											allowFraction
											readonly
											size={24}
											transition
											fillColor="#F59E0B"
										/>
									</div>
									<p className="text-slate-700">
										{summary?.totalReview}{" "}
										{translations["ratings"] || "Ratings"}
									</p>
								</div>
								<div className="rating-summery lg:col-span-4 grid grid-cols-1 items-center">
									<div className="">
										{Object.keys(percentages).map((star) => (
											<div key={star} className="flex items-center gap-2 mt-2">
												<span className="text-sm font-medium text-slate-700">
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

						<div className="pt-4">
							<Link
								href={"#p-rating-reviews"}
								onClick={(e) => handleTabItemToView(e, "p-rating-reviews")}
								className="w-full text-secondary-700 text-center inline-flex items-center gap-2 text-sm justify-center"
							>
								{translations["see-all-customer-reviews"] ||
									"See all customer reviews"}

								<HiOutlineArrowNarrowRight size={20} className="rtl:rotate-180"/>
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default RatingReviewPopover;
