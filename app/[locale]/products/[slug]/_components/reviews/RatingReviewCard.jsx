"use client";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";

import ReviewImages from "./ReviewImages";
import { getFormattedDate } from "@/utils/format-date";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import useAddReviewReaction from "@/hooks/useAddReviewReaction";

const RatingReviewCard = ({ review, translations, settings }) => {
	const { handleReviewReact } = useAddReviewReaction(); //custom hook for reusing
	return (
		<div className="grid lg:grid-cols-3 border-b border-slate-300 px-3 gap-1 lg:px-4 lg:py-3 mt-4">
			<div id="user-info" className="col-span-1 box-border">
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
					<div className="h-7 min-w-7 rounded-full shrink-0">
						{review.customer.image ? (
							<Image
								src={review.customer.image}
								alt={"male"}
								width={28}
								height={28}
								className="h-7 min-w-7 rounded-full"
							/>
						) : (
							<div className="!h-7 !w-7 min-w-7 rounded-full bg-slate-200 flex justify-center items-center font-semibold">
								{review.customer.name.slice(0, 1)}
							</div>
						)}
					</div>

					<span className="text-base/4 font-title text-slate-900 overflow-text line-clamp-2">
						{review.customer.name}
					</span>
				</div>

				<p className="text-slate-600 mt-3">
					{getFormattedDate(review?.created_at)}
				</p>
			</div>
			<div
				id="review"
				className="col-span-2 flex flex-col gap-3 justify-between"
			>
				<p className="text-base font-normal text-slate-700">{review.comment}</p>
				{review?.images?.length ? (
					<ReviewImages review={review} max={4} />
				) : null}

				<div
					className={`actions flex items-center justify-between  text-slate-600`}
				>
					{review.barcode.color && (
						<p>
							{translations["color"] || "কালার"}: {review.barcode?.color}
						</p>
					)}
					{review.barcode.size && (
						<p>
							{translations["size"] || "সাইজ"}: {review.barcode?.size}
						</p>
					)}

					<div className="justify-self-end like-dislike flex-center gap-4">
						{!settings?.guest_checkout ? (
							<>
								<button
									onClick={() => handleReviewReact("like", review?.id)}
									className={`icon-btn !py-0 hover:text-primary ${
										review.is_liked ? "text-primary" : "text-slate-700"
									}`}
								>
									<AiFillLike /> {review.likes_count}
								</button>
								<button
									onClick={() => handleReviewReact("dislike", review?.id)}
									className={`icon-btn !py-0 hover:text-primary ${
										review.is_disliked ? "text-primary" : "text-slate-700"
									}`}
								>
									<AiFillDislike /> {review.dislikes_count}
								</button>
							</>
						) : (
							<>
								<div className="text-slate-700 space-x-1">
									<AiFillLike /> {review.likes_count}
								</div>
								<div className="text-slate-700 space-x-1">
									<AiFillDislike /> {review.dislikes_count}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RatingReviewCard;
