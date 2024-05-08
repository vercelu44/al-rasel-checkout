"use client";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import Modal from "../elements/Modal";
import { Rating } from "react-simple-star-rating";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { getFormattedDate } from "@/utils/format-date";
import { useGetReviewDetailsQuery } from "@/store/api/productReviewAPI";
import ItemsListLoader from "../elements/loaders/ItemsListLoader";
import useAddReviewReaction from "@/hooks/useAddReviewReaction";
import ReviewImageSlider from "@/app/[locale]/products/[slug]/_components/reviews/ReviewImageSlider";

export default function ReviewViewModal({
	showModal,
	setShowModal,
	review: reviewFromProp,
	reviewId: reviewIdProp,
}) {
	const { user } = useSelector((state) => state.auth);
	const { translations, settings } = useSelector((state) => state.common);

	let review = {};
	let api = user ? reviewIdProp + `?reference_id=${user.id}` : reviewIdProp;
	const { data, isLoading } = useGetReviewDetailsQuery(api, {
		skip: !reviewIdProp,
	});
	const reviewFromId = data?.data || {};

	if (reviewFromProp) {
		review = { ...reviewFromProp };
	} else {
		review = { ...reviewFromId };
	}

	const { handleReviewReact } = useAddReviewReaction(); //custom hook for reusing

	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			title={
				translations["customer-review-images"] ||
				"কাস্টমারের দেয়া রিভিউ ছবি গুলো"
			}
		>
			{isLoading && reviewIdProp ? (
				<ItemsListLoader noImage={true} numItems={4} />
			) : (
				<div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
					<ReviewImageSlider images={review.images} />
					<div className="w-full lg:w-[245px]">
						<div id="user-info">
							<div className="flex items-center mb-4">
								<Rating
									initialValue={review.rating}
									allowFraction
									readonly
									size={24}
									transition
									fillColor="#F59E0B"
								/>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-7 min-w-7 rounded-full">
									{review.customer?.image ? (
										<Image
											src={review.customer.image}
											alt={"male"}
											width={28}
											height={28}
											className="h-7 min-w-7 rounded-full"
										/>
									) : (
										<div className="!h-7 !w-7 min-w-7 rounded-full bg-slate-200 flex justify-center items-center font-semibold">
											{review.customer?.name.slice(0, 1)}
										</div>
									)}
								</div>

								<span className="font-bold overflow-text line-clamp-2">
									{review.customer?.name}
								</span>
							</div>

							<p className="text-slate-600 mt-3">
								{getFormattedDate(review.created_at)}
							</p>
						</div>
						<p className="text-slate-700 lg:hidden py-3">{review.comment}</p>
						<div className="border-t lg:border-none flex lg:block">
							<div
								id="review"
								className="lg:border-b border-slate-200 py-4 flex flex-col gap-8 w-full"
							>
								<p className="text-slate-700 hidden lg:block">
									{review.comment}
								</p>

								<div className="actions flex items-center justify-between text-slate-600">
									{review.barcode.color && (
										<p>
											{translations["color"] || "কালার"}:{" "}
											{review.barcode?.color}
										</p>
									)}
									{review.barcode.size && (
										<p>
											{translations["size"] || "সাইজ"}: {review.barcode?.size}
										</p>
									)}
									<p className="lg:hidden"></p>
								</div>
							</div>
							<div className="ml-auto flex items-center gap-4">
								{!settings?.guest_checkout ? (
									<>
										<button
											onClick={() => handleReviewReact("like", review?.id)}
											className={`icon-btn hover:text-primary ${
												review.is_liked ? "text-primary" : "text-slate-700"
											}`}
										>
											<AiFillLike /> {review.likes_count}
										</button>
										<button
											onClick={() => handleReviewReact("dislike", review?.id)}
											className={`icon-btn hover:text-primary ${
												review.is_disliked ? "text-primary" : "text-slate-700"
											}`}
										>
											<AiFillDislike /> {review.dislikes_count}
										</button>
									</>
								) : (
									<>
										<div className="text-slate-700 space-x-1 pt-3">
											<AiFillLike /> {review.likes_count}
										</div>
										<div className="text-slate-700 space-x-1 pt-3">
											<AiFillDislike /> {review.dislikes_count}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}
