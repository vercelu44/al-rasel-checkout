"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { forwardRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Pagination, Mousewheel, Navigation } from "swiper/modules";
import useWishList from "@/hooks/useWishList";
import noImage from "@/public/assets/images/no-image.png";
import ImageZoom from "./ImageZoom";
import dynamic from "next/dynamic";
const ProductZoomYetAnother = dynamic(() => import("./ProductZoomYetAnother"));

// ** Import Icon
import { HiOutlineHeart, HiPlayCircle } from "react-icons/hi2";
import HeartRedIcon from "@/components/elements/svg/HeartRedIcon";
import { startVideoPlayer } from "@/store/slices/commonSlice";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { cn } from "@/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ProductViewSlider = forwardRef(
  ({ product, selectedColor, isSquareImage }, ref) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
    // const isLg = useMediaQuery("(max-width: 992px)"); // checking for mobile
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
        (slide) => slide.color_name === selectedColor,
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
        {open && (
          <ProductZoomYetAnother
            open={open}
            setIndex={setIndex}
            index={index}
            setOpen={setOpen}
            images={slides}
          />
        )}
        <div className="lg:grid grid-cols-[66px_1fr] lg:gap-4 items-start">
          <div className="thumb-slider hidden lg:block">
            <Swiper
              onSwiper={setThumbsSwiper}
              direction="vertical"
              slidesPerView={isSquareImage ? 7 : 9}
              mousewheel={true}
              modules={[Thumbs, Mousewheel]}
              className={cn(
                isSquareImage ? "!h-[33rem] 2xl:!h-[42rem]" : "!h-[42rem]",
              )}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="slider-image cursor-pointer border border-slate-100 rounded-lg">
                    <Image
                      src={slide?.image}
                      alt="image"
                      width={64}
                      height={64}
                      className="border border-transparent h-16 w-16 cursor-pointer rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div
            className={cn(
              "preview-slider grid relative",
              isSquareImage
                ? "lg:w-[32.75rem] 2xl:w-[41.1875rem]"
                : "lg:w-[32.75rem] ",
            )}
          >
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
              navigation={{
                prevEl: `.custom_prev_product-preview`,
                nextEl: `.custom_next_product-preview`,
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
              modules={[Thumbs, Pagination, Navigation]}
            >
              {slides.map((slide, index) => (
                <SwiperSlide
                  key={index}
                  className={cn(
                    isSquareImage
                      ? "!h-[98vw] lg:!h-[32.75rem] 2xl:!h-[41.1875rem]"
                      : "!h-[115vw] md:!h-[41.1875rem] md:!w-[32.75rem]",
                  )}
                >
                  <div className="slider-imag h-full w-full">
                    {(isFirstItem(slide?.color_name) || index === 0) &&
                    slide?.video_link ? (
                      <>
                        <Image
                          src={slide?.image}
                          alt="image"
                          width={524}
                          height={659}
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
                              }),
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
                    ) : isMobile ? (
                      <Image
                        onClick={() => handleOpenZoom(index)}
                        src={slide?.image}
                        alt="image"
                        width={524}
                        height={524}
                        className="object-cover h-full w-full cursor-zoom-in"
                      />
                    ) : (
                      <ImageZoom
                        image={slide?.image}
                        zoomImage={slide?.image}
                        isSquareImage={isSquareImage}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="slider-arrow md:hidden">
              <span
                className={`slider-btn slider-prev slick-arrow custom_prev_product-preview !left-1`}
              >
                <TfiAngleLeft />
              </span>
              <span
                className={`slider-btn slider-next slick-arrow custom_next_product-preview !right-1`}
              >
                <TfiAngleRight />
              </span>
            </div>
            {/* Wishlist  */}
            <div className="product-action top-2 md:top-4 right-2 lg:right-4 absolute z-10 ">
              <button
                aria-label="Add To Wishlist"
                className="inline-flex justify-center items-center bg-white w-8 h-8 rounded-lg"
                onClick={(e) =>
                  isInWishList
                    ? handleRemoveFromWishlist(product.id)
                    : handleAddToWishlist(product)
                }
              >
                {isInWishList ? (
                  <HeartRedIcon />
                ) : (
                  <>
                    <span className="text-slate-400">
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
  },
);

ProductViewSlider.displayName = "ProductViewSlider";

export default ProductViewSlider;
