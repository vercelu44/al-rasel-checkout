"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { forwardRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Pagination, Mousewheel } from "swiper/modules";
import useWishList from "@/hooks/useWishList";
import noImage from "@/public/assets/images/no-image.png";
import ImageZoom from "./ImageZoom";
import dynamic from "next/dynamic";
const ProductZoomYetAnother = dynamic(() => import("./ProductZoomYetAnother"));

// ** Import Icon
import { HiOutlineHeart, HiPlayCircle } from "react-icons/hi2";
import { startVideoPlayer } from "@/store/slices/commonSlice";
import HeartRedIcon from "@/components/elements/svg/HeartRedIcon";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ProductViewSlider = forwardRef(({ product, selectedColor }, ref) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [open, setOpen] = useState(false);
  const [indexx, setIndex] = useState(0);
  const {
    handleAddToWishlist,
    handleWishListProductStatus,
    handleRemoveFromWishlist,
  } = useWishList(); //custom hook for reusing

  //setting default image if no image is provided
  let slides = product?.photos?.length
    ? product?.photos
    : [
        {
          image: noImage,
        },
      ];

  //filtering slides based on selected color
  if (selectedColor) {
    const filteredSlides = slides.filter(
      (slide) => slide.color_name === selectedColor
    );
    filteredSlides.length && (slides = filteredSlides);
  }

  let colorFlag = "";
  const isFirstItem = (colorName) => {
    if (colorFlag !== colorName) {
      colorFlag = colorName;
      return true;
    }
    return false;
  };

  const isInWishList = handleWishListProductStatus(product.id);

  const handleOpenZoom = (index) => {
    setOpen(true);
    setIndex(index);
  };

  return (
    <>
      <ProductZoomYetAnother
        open={open}
        setIndex={setIndex}
        index={indexx}
        setOpen={setOpen}
        images={slides}
      />
      <div className="lg:grid grid-cols-[66px_1fr] lg:gap-4 items-start">
        <div className="thumb-slider hidden lg:block">
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="vertical"
            slidesPerView={7}
            mousewheel={true}
            modules={[Thumbs, Mousewheel]}
            className="!h-[33rem]"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="slider-image cursor-pointer border border-slate-100 rounded-lg">
                  <Image
                    src={slide?.image}
                    alt=""
                    width={64}
                    height={64}
                    className="border border-transparent h-16 w-16 cursor-pointer rounded-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="lg:w-[32.75rem] preview-slider grid relative">
          <Swiper
            ref={ref}
            className="product-preview-slider [&_.swiper-wrapper]:pb-3 lg:[&_.swiper-wrapper]:pb-0 lg:rounded-xl lg:border border-slate-300"
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            direction="horizontal"
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicMainBullets: 3,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                direction: "horizontal",
                pagination: { clickable: true },
              },
              768: {
                direction: "horizontal",
                pagination: false,
              },
            }}
            modules={[Thumbs, Pagination]}
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={index}
                className="!h-[100vw] md:!h-[32.75rem] md:!w-[32.75rem]"
              >
                <div className="slider-imag h-full w-full">
                  {/* start from here */}
                  {(isFirstItem(slide?.color_name) || index === 0) &&
                  slide?.video_link ? (
                    <>
                      <Image
                        src={slide?.image}
                        alt=""
                        width={524}
                        height={524}
                        className="object-contain h-full w-full"
                      />
                      <button
                        onClick={() =>
                          dispatch(
                            startVideoPlayer({
                              url: slide?.video_link,
                              playing: true,
                              title: product.product_name,
                              controls: true,
                            })
                          )
                        }
                        className="z-20 vid-icon absolute inline-flex justify-center items-center top-1/2 left-1/2 w-[72px] h-[72px] rounded-full drop-shadow-[0_0px_60px_rgba(0,0,0,0.16)] translate-x-[-50%] translate-y-[-50%]"
                      >
                        <HiPlayCircle
                          size={60}
                          className="text-white hover:text-primary"
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      {isMobile ? (
                        <Image
                          src={slide?.image}
                          alt=""
                          width={524}
                          height={524}
                          className="object-contain h-full w-full"
                          onClick={() => handleOpenZoom(index)}
                        />
                      ) : (
                        <ImageZoom
                          image={slide?.image}
                          zoomImage={slide?.image}
                        />
                      )}
                    </>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="product-action top-2 md:top-4 right-2 lg:right-4 absolute z-10 ">
            <button
              aria-label="Add To Wishlist"
              className="wishlist-action-btn-product-details inline-flex justify-center items-center"
              onClick={(e) =>
                isInWishList
                  ? handleRemoveFromWishlist(product.id)
                  : handleAddToWishlist(product.id)
              }
            >
              {isInWishList ? (
                <HeartRedIcon />
              ) : (
                <>
                  <span className="">
                    <HiOutlineHeart />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

ProductViewSlider.displayName = "ProductViewSlider";

export default ProductViewSlider;
