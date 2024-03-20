"use client";
import { useState } from "react";
import Image from "next/image";
import ReviewGalleryModal from "@/components/modals/ReviewGalleryModal";
import ReviewViewModal from "@/components/modals/ReviewViewModal";

const AllReviewImages = ({ images, max }) => {
  const [reviewId, setReviewId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleReviewView = (reviewId) => {
    setReviewId(reviewId);
    setShowModal(true);
  };

  // console.log(images);

  return (
    <>
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4">
        {images.slice(0, max).map((image, index) => (
          <span
            key={index}
            className="relative cursor-pointer h-[74px] lg:h-[86px] w-[74px] lg:w-[86px] border border-slate-200 rounded-lg box-content"
          >

              <Image
                src={image.image}
                alt={`review-image-${index}`}
                width={86}
                height={86}
                className={`h-full w-full object-contain rounded-lg`}
                onClick={() => handleReviewView(image.product_review_id)}
              />


            {index === max - 1 ? (
              <div
                onClick={() => setGalleryOpen(true)}
                className=" rounded-lg bg-[#00000077] absolute top-0 w-full h-full left-0 flex flex-col justify-center"
              >
                <h3 className="text-white text-2xl text-center">
                  +{images.length - max + 1}
                </h3>
              </div>
            ) : null}
          </span>
        ))}
      </div>
      {showModal && (
        <ReviewViewModal
          showModal={showModal}
          setShowModal={setShowModal}
          reviewId={reviewId} // passing product review Id
        />
      )}
      {galleryOpen && (
        <ReviewGalleryModal
          showModal={galleryOpen}
          setShowModal={setGalleryOpen}
          images={images}
        />
      )}
    </>
  );
};

export default AllReviewImages;
