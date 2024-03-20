"use client";
import { useState } from "react";
import Image from "next/image";
import ReviewViewModal from "@/components/modals/ReviewViewModal";
import ReviewGalleryModal from "@/components/modals/ReviewGalleryModal";

const ReviewImages = ({ review, max }) => {
	const [showModal, setShowModal] = useState(false);
	const [galleryOpen, setGalleryOpen] = useState(false);

	return (
		<div className="grid grid-cols-4 gap-2 lg:gap-4">
			{review.images.slice(0, max).map((item, index) => (
				<div
					key={item.image}
					className="relative cursor-pointer h-[74px] lg:h-[90px] w-[74px] lg:w-[90px] rounded-lg border border-slate-200 box-content"
				>
					<Image
						key={item.image}
						src={item.image}
						alt={`review-image-` + index}
						width={90}
						height={90}
						className="h-full w-full rounded-lg object-contain"
						onClick={() => setShowModal(true)}
					/>
					{index === max - 1 ? (
						<div
							onClick={() => setGalleryOpen(true)}
							className=" bg-[#00000077] rounded-lg absolute top-0 w-full h-full left-0 flex flex-col justify-center"
						>
							<h3 className="text-white text-2xl text-center">
								+{review.images.length - max + 1}
							</h3>
						</div>
					) : null}
				</div>
			))}
			{galleryOpen && (
				<ReviewGalleryModal
					showModal={galleryOpen}
					setShowModal={setGalleryOpen}
					images={review.images}
				/>
			)}
			{showModal && (
				<ReviewViewModal
					showModal={showModal}
					setShowModal={setShowModal}
					review={review}
				/>
			)}
		</div>
	);
};

export default ReviewImages;
