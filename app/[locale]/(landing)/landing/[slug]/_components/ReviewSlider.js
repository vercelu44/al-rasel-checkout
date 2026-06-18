"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ReviewSlider({ product }) {
  const images =
    product?.product_review_sses?.map((review) => review.image) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const sliderRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setPrevTranslate(currentTranslate);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX - startX;
    setCurrentTranslate(prevTranslate + currentPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const dragThreshold = 100; // Minimum drag distance to trigger a slide change

    if (currentTranslate - prevTranslate > dragThreshold) {
      handlePrev(); // Dragged to the right
    } else if (currentTranslate - prevTranslate < -dragThreshold) {
      handleNext(); // Dragged to the left
    }

    // Reset translate after slide change
    setCurrentTranslate(0);
    setPrevTranslate(0);
  };

  const getTranslateValue = () => {
    return `translateX(calc(-${currentIndex} * 100% + ${currentTranslate}px))`;
  };

  return (
    <div className=" flex items-center justify-center pt-5 pb-14">
      <div className="w-full max-w-5xl p-4 relative">
        <h1 className="text-[29px] font-bold text-center mb-6 font-hind">কাস্টমার রিভিউ: </h1>
        {/* Slider */}
        <div
          className="relative overflow-hidden w-full md:h-[35rem] bg-gray-200 rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Handle case when mouse leaves the slider
          ref={sliderRef}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: getTranslateValue(),
            }}
          >
            {images.map((src, index) => (
              <Image
              width={700}
              height={500}
                key={index}
                src={src}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#FFA000] text-white p-2 rounded-full px-3"
          >
            &#8592;
          </button>
          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#FFA000] text-white p-2 rounded-full px-3"
          >
            &#8594;
          </button>
        </div>
        {/* Dots */}
        <div className="flex justify-center mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index ? "bg-black" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
