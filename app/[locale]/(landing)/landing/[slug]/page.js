import { fetchData } from "@/lib/fetch-data";

import Image from "next/image";
import VideoPlayer from "@/components/elements/VideoPlayer";
import ViewHTML from "@/components/elements/ViewHTML";

import TemplateCheckout from "./_components/TemplateCheckout";

import TemplateFooter from "./_components/TemplateFooter";
import ReviewSlider from "./_components/ReviewSlider";
import Link from "next/link";
import ProductSlider from "./_components/ProductSlider";
import QNAItems from "@/components/QNAItems";

const ProductTemplatePage = async ({ params }) => {
  const { slug } = params;
  const [settingsRes, productRes] = await Promise.allSettled([
    fetchData({ api: `info/basic` }),
    fetchData({ api: `products/landing-page-show/${slug}` }),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
  const product =
    productRes.status === "fulfilled" ? productRes.value?.data || [] : [];

  return (
    <section>
      {/* <ProductMicroData product={product} /> */}

      <div className="">
        {/* logo section    */}
        <div className="flex flex-col items-center">
          <Link href={"/"}>
            <Image
              src={settings?.logo}
              alt={settings?.name}
              width={200}
              height={200}
            />
          </Link>
        </div>

        {/* product title section */}
        <div className="text-center mt-7 py-8 font-bold md:text-3xl text-2xl bg-[#FFA000] rounded-2xl md:w-9/12 w-11/12 mx-auto">
          <h2 className="text-[#fff] md:px-3 px-2 font-hind">
            {product?.product_name}
          </h2>
        </div>

        {/* product video section  */}
        {product?.review_video && (
          <div className="md:w-8/12 w-11/12 aspect-video md:px-10 px-4 pt-10 mx-auto">
            <VideoPlayer
              url={product?.review_video}
              loop={true}
              muted={true}
              // playing={true}
              controls={true}
              className={"w-full h-full object-cover"}
            />
          </div>
        )}

        {/* product order section */}

        <section>
          <div className="h-2 w-full bg-slate-200 lg:hidden"></div>
          <div className="container mt-4 lg:mt-12 mb-6 lg:mb-12">
            <div className="  flex items-center justify-center">
              <div className=" flex justify-center">
                {/* <a href="#order-now">My first section</a> */}

                <a
                  href="#order-now"
                  className="shake-button flex items-center gap-3 rounded-lg bg-[#FFA000] text-gray-900 font-semibold px-10 py-4 "
                >
                  <svg
                    aria-hidden="true"
                    className="e-font-icon-svg e-fas-gifts w-8 h-8"
                    viewBox="0 0 640 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M240.6 194.1c1.9-30.8 17.3-61.2 44-79.8C279.4 103.5 268.7 96 256 96h-29.4l30.7-22c7.2-5.1 8.9-15.1 3.7-22.3l-9.3-13c-5.1-7.2-15.1-8.9-22.3-3.7l-32 22.9 11.5-30.6c3.1-8.3-1.1-17.5-9.4-20.6l-15-5.6c-8.3-3.1-17.5 1.1-20.6 9.4l-19.9 53-19.9-53.1C121 2.1 111.8-2.1 103.5 1l-15 5.6C80.2 9.7 76 19 79.2 27.2l11.5 30.6L58.6 35c-7.2-5.1-17.2-3.5-22.3 3.7l-9.3 13c-5.1 7.2-3.5 17.2 3.7 22.3l30.7 22H32c-17.7 0-32 14.3-32 32v352c0 17.7 14.3 32 32 32h168.9c-5.5-9.5-8.9-20.3-8.9-32V256c0-29.9 20.8-55 48.6-61.9zM224 480c0 17.7 14.3 32 32 32h160V384H224v96zm224 32h160c17.7 0 32-14.3 32-32v-96H448v128zm160-288h-20.4c2.6-7.6 4.4-15.5 4.4-23.8 0-35.5-27-72.2-72.1-72.2-48.1 0-75.9 47.7-87.9 75.3-12.1-27.6-39.9-75.3-87.9-75.3-45.1 0-72.1 36.7-72.1 72.2 0 8.3 1.7 16.2 4.4 23.8H256c-17.7 0-32 14.3-32 32v96h192V224h15.3l.7-.2.7.2H448v128h192v-96c0-17.7-14.3-32-32-32zm-272 0c-2.7-1.4-5.1-3-7.2-4.8-7.3-6.4-8.8-13.8-8.8-19 0-9.7 6.4-24.2 24.1-24.2 18.7 0 35.6 27.4 44.5 48H336zm199.2-4.8c-2.1 1.8-4.5 3.4-7.2 4.8h-52.6c8.8-20.3 25.8-48 44.5-48 17.7 0 24.1 14.5 24.1 24.2 0 5.2-1.5 12.6-8.8 19z"></path>
                  </svg>
                  <h3 className="text-[22px] text-[#fff] font-hind">
                    এখানে অর্ডার করুন
                  </h3>
                </a>
              </div>
            </div>
            <div className="container mx-auto py-10">
              <ProductSlider photos={product?.photos} />
            </div>

            <div className="flex items-center justify-center">
              <div className="flex justify-center">
                <a
                  href="#order-now"
                  className="shake-button flex rounded-lg items-center gap-3 bg-[#FFA000] text-gray-900 font-semibold px-10 py-4"
                >
                  <svg
                    aria-hidden="true"
                    className="e-font-icon-svg e-fas-gifts w-8 h-8"
                    viewBox="0 0 640 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M240.6 194.1c1.9-30.8 17.3-61.2 44-79.8C279.4 103.5 268.7 96 256 96h-29.4l30.7-22c7.2-5.1 8.9-15.1 3.7-22.3l-9.3-13c-5.1-7.2-15.1-8.9-22.3-3.7l-32 22.9 11.5-30.6c3.1-8.3-1.1-17.5-9.4-20.6l-15-5.6c-8.3-3.1-17.5 1.1-20.6 9.4l-19.9 53-19.9-53.1C121 2.1 111.8-2.1 103.5 1l-15 5.6C80.2 9.7 76 19 79.2 27.2l11.5 30.6L58.6 35c-7.2-5.1-17.2-3.5-22.3 3.7l-9.3 13c-5.1 7.2-3.5 17.2 3.7 22.3l30.7 22H32c-17.7 0-32 14.3-32 32v352c0 17.7 14.3 32 32 32h168.9c-5.5-9.5-8.9-20.3-8.9-32V256c0-29.9 20.8-55 48.6-61.9zM224 480c0 17.7 14.3 32 32 32h160V384H224v96zm224 32h160c17.7 0 32-14.3 32-32v-96H448v128zm160-288h-20.4c2.6-7.6 4.4-15.5 4.4-23.8 0-35.5-27-72.2-72.1-72.2-48.1 0-75.9 47.7-87.9 75.3-12.1-27.6-39.9-75.3-87.9-75.3-45.1 0-72.1 36.7-72.1 72.2 0 8.3 1.7 16.2 4.4 23.8H256c-17.7 0-32 14.3-32 32v96h192V224h15.3l.7-.2.7.2H448v128h192v-96c0-17.7-14.3-32-32-32zm-272 0c-2.7-1.4-5.1-3-7.2-4.8-7.3-6.4-8.8-13.8-8.8-19 0-9.7 6.4-24.2 24.1-24.2 18.7 0 35.6 27.4 44.5 48H336zm199.2-4.8c-2.1 1.8-4.5 3.4-7.2 4.8h-52.6c8.8-20.3 25.8-48 44.5-48 17.7 0 24.1 14.5 24.1 24.2 0 5.2-1.5 12.6-8.8 19z"></path>
                  </svg>
                  <h3 className="text-[22px] text-[#fff] font-hind">
                    এখানে অর্ডার করুন
                  </h3>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* product short description */}
        <div className=" mt-7  font-bold text-2xl bg-[#FFA000] md:w-9/12 w-11/12 mx-auto text-[#fff]">
          <ViewHTML
            htmlText={product?.product_short_description}
            className="px-5 text-[#fff] font-bold text-2xl text-center font-hind"
          />
        </div>

        {/* product details section */}
        <div className="mt-6">
          <div className=" flex items-center justify-center p-4 ">
            <div className="max-w-6xl w-full bg-white rounded-3xl overflow-hidden border-4 border-[#FFA000]">
              <div className="bg-[#29B6F6] text-white p-8 text-xl md:text-2xl font-semibold text-center rounded-t-3xl relative">
                <div className="absolute inset-0 bg-[#FFA000]">
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#FFA000] rounded-b-[100%] translate-y-1/2"></div>
                </div>
                <span className="relative z-10 text-3xl font-hind font-[800]">
                  আমাদের কাছে প্যাক টি আপনি কেনো নিবেন ?
                </span>
              </div>

              <div className="p-8 pt-10">
                <ViewHTML
                  htmlText={product?.details}
                  className="desc text-sm lg:text-base text-slate-600 mt-3 font-hind"
                />

                <div className="  flex items-center justify-center">
                  <div className="mt-8 flex justify-center">
                    <a
                      href="#order-now"
                      className="shake-button flex items-center gap-3 rounded-lg bg-[#FFA000] text-gray-900 font-semibold px-10 py-4 "
                    >
                      <svg
                        aria-hidden="true"
                        className="e-font-icon-svg e-fas-gifts w-7 h-7"
                        viewBox="0 0 640 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M240.6 194.1c1.9-30.8 17.3-61.2 44-79.8C279.4 103.5 268.7 96 256 96h-29.4l30.7-22c7.2-5.1 8.9-15.1 3.7-22.3l-9.3-13c-5.1-7.2-15.1-8.9-22.3-3.7l-32 22.9 11.5-30.6c3.1-8.3-1.1-17.5-9.4-20.6l-15-5.6c-8.3-3.1-17.5 1.1-20.6 9.4l-19.9 53-19.9-53.1C121 2.1 111.8-2.1 103.5 1l-15 5.6C80.2 9.7 76 19 79.2 27.2l11.5 30.6L58.6 35c-7.2-5.1-17.2-3.5-22.3 3.7l-9.3 13c-5.1 7.2-3.5 17.2 3.7 22.3l30.7 22H32c-17.7 0-32 14.3-32 32v352c0 17.7 14.3 32 32 32h168.9c-5.5-9.5-8.9-20.3-8.9-32V256c0-29.9 20.8-55 48.6-61.9zM224 480c0 17.7 14.3 32 32 32h160V384H224v96zm224 32h160c17.7 0 32-14.3 32-32v-96H448v128zm160-288h-20.4c2.6-7.6 4.4-15.5 4.4-23.8 0-35.5-27-72.2-72.1-72.2-48.1 0-75.9 47.7-87.9 75.3-12.1-27.6-39.9-75.3-87.9-75.3-45.1 0-72.1 36.7-72.1 72.2 0 8.3 1.7 16.2 4.4 23.8H256c-17.7 0-32 14.3-32 32v96h192V224h15.3l.7-.2.7.2H448v128h192v-96c0-17.7-14.3-32-32-32zm-272 0c-2.7-1.4-5.1-3-7.2-4.8-7.3-6.4-8.8-13.8-8.8-19 0-9.7 6.4-24.2 24.1-24.2 18.7 0 35.6 27.4 44.5 48H336zm199.2-4.8c-2.1 1.8-4.5 3.4-7.2 4.8h-52.6c8.8-20.3 25.8-48 44.5-48 17.7 0 24.1 14.5 24.1 24.2 0 5.2-1.5 12.6-8.8 19z"></path>
                      </svg>
                      <h3 className="text-[20px] font-hind text-[#fff]">
                        এখনই অর্ডার করুন
                      </h3>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specification */}
        <div className="flex items-center justify-center p-4 ">
          <div className="max-w-6xl w-full bg-white rounded-3xl overflow-hidden border-4 border-[#FFA000]">
            <div className="bg-[#29B6F6] text-white p-8 text-xl md:text-2xl font-semibold text-center rounded-t-3xl relative">
              <div className="absolute inset-0 bg-[#FFA000]">
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#FFA000] rounded-b-[100%] translate-y-1/2"></div>
              </div>
              <span className="relative z-10 text-3xl font-hind font-[800]">
                আমাদের কম্বো প্যাকেজ গুলোর বৈশিষ্ট
              </span>
            </div>

            <div className="p-8 pt-10">
              <div className="grid md:grid-cols-2 gap-8">
                <ViewHTML
                  htmlText={product?.specification}
                  className="desc text-sm lg:text-base text-slate-600 mt-3 font-hind"
                />
                <div className=" mx-auto">
                  <Image
                    src={product?.image}
                    alt="product Image"
                    width={400}
                    height={200}
                  />
                </div>
              </div>

              <div className="  flex items-center justify-center">
                <div className="mt-8 flex justify-center">
                  <a
                    href="#order-now"
                    className="shake-button flex items-center gap-3 rounded-lg bg-[#FFA000] text-gray-900 font-semibold px-10 py-4 "
                  >
                    <svg
                      aria-hidden="true"
                      className="e-font-icon-svg e-fas-gifts w-7 h-7"
                      viewBox="0 0 640 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M240.6 194.1c1.9-30.8 17.3-61.2 44-79.8C279.4 103.5 268.7 96 256 96h-29.4l30.7-22c7.2-5.1 8.9-15.1 3.7-22.3l-9.3-13c-5.1-7.2-15.1-8.9-22.3-3.7l-32 22.9 11.5-30.6c3.1-8.3-1.1-17.5-9.4-20.6l-15-5.6c-8.3-3.1-17.5 1.1-20.6 9.4l-19.9 53-19.9-53.1C121 2.1 111.8-2.1 103.5 1l-15 5.6C80.2 9.7 76 19 79.2 27.2l11.5 30.6L58.6 35c-7.2-5.1-17.2-3.5-22.3 3.7l-9.3 13c-5.1 7.2-3.5 17.2 3.7 22.3l30.7 22H32c-17.7 0-32 14.3-32 32v352c0 17.7 14.3 32 32 32h168.9c-5.5-9.5-8.9-20.3-8.9-32V256c0-29.9 20.8-55 48.6-61.9zM224 480c0 17.7 14.3 32 32 32h160V384H224v96zm224 32h160c17.7 0 32-14.3 32-32v-96H448v128zm160-288h-20.4c2.6-7.6 4.4-15.5 4.4-23.8 0-35.5-27-72.2-72.1-72.2-48.1 0-75.9 47.7-87.9 75.3-12.1-27.6-39.9-75.3-87.9-75.3-45.1 0-72.1 36.7-72.1 72.2 0 8.3 1.7 16.2 4.4 23.8H256c-17.7 0-32 14.3-32 32v96h192V224h15.3l.7-.2.7.2H448v128h192v-96c0-17.7-14.3-32-32-32zm-272 0c-2.7-1.4-5.1-3-7.2-4.8-7.3-6.4-8.8-13.8-8.8-19 0-9.7 6.4-24.2 24.1-24.2 18.7 0 35.6 27.4 44.5 48H336zm199.2-4.8c-2.1 1.8-4.5 3.4-7.2 4.8h-52.6c8.8-20.3 25.8-48 44.5-48 17.7 0 24.1 14.5 24.1 24.2 0 5.2-1.5 12.6-8.8 19z"></path>
                    </svg>
                    <h3 className="text-[20px] font-hind text-[#fff]">
                      এখনই অর্ডার করুন
                    </h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-10 bg-[#FFA000]  rounded-sm">
          <div className="text-center">
            {/* Regular Price */}
            <div className="text-black font-bold text-lg md:text-2xl">
              <span className="font-hind text-[29px] text-[#fff]">
                রেগুলার প্রাইস
              </span>
              <span className="line-through text-red-600 ml-2 font-hind text-[29px]">
                {product?.old_price} টাকা
              </span>
              {/* <span className="text-black ml-2">(১.৫ - ৪ বছর)</span> */}
            </div>
            {/* Offer Price */}
            <div className="text-black font-bold text-lg md:text-2xl mt-2">
              <span className="font-hind text-[29px] text-[#fff]">
                অফার প্রাইস
              </span>
              <span className="text-blue-600 underline ml-2 font-hind text-[29px]">
                {product?.new_price} টাকা
              </span>
              {/* <span className="text-black ml-2">(১.৫ - ৪ বছর)</span> */}
            </div>
          </div>
        </div>

        {product?.product_review_sses?.length > 0 ? (
          <div className="container max-w-7xl">
            <div className="heading border-b border-slate-200 py-4 mb-6">
              <h3 className="text-3xl text-center font-title text-slate-900">
                Customer Reviews
              </h3>
            </div>
            <ReviewSlider product={product} />
          </div>
        ) : null}

        <div className="qna container max-w-7xl mb-20">
          <div className="heading border-b border-slate-200 py-4 mb-6">
            <h3 className="text-3xl text-center font-title text-slate-900">
              Questions and Answers
            </h3>
          </div>
          <QNAItems />
        </div>

        {/* place order */}
        <div id="order-now">
          <TemplateCheckout product={product} settings={settings} />
        </div>
        <div className="  flex items-center mb-5 justify-center">
          <div className=" flex justify-center">
            <a
              href="/"
              className="shake-button flex items-center gap-3 rounded-lg bg-[#FFA000] text-gray-900 font-semibold px-10 py-4 "
            >
              <svg
                aria-hidden="true"
                className="e-font-icon-svg e-fas-gifts w-8 h-8"
                viewBox="0 0 640 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M240.6 194.1c1.9-30.8 17.3-61.2 44-79.8C279.4 103.5 268.7 96 256 96h-29.4l30.7-22c7.2-5.1 8.9-15.1 3.7-22.3l-9.3-13c-5.1-7.2-15.1-8.9-22.3-3.7l-32 22.9 11.5-30.6c3.1-8.3-1.1-17.5-9.4-20.6l-15-5.6c-8.3-3.1-17.5 1.1-20.6 9.4l-19.9 53-19.9-53.1C121 2.1 111.8-2.1 103.5 1l-15 5.6C80.2 9.7 76 19 79.2 27.2l11.5 30.6L58.6 35c-7.2-5.1-17.2-3.5-22.3 3.7l-9.3 13c-5.1 7.2-3.5 17.2 3.7 22.3l30.7 22H32c-17.7 0-32 14.3-32 32v352c0 17.7 14.3 32 32 32h168.9c-5.5-9.5-8.9-20.3-8.9-32V256c0-29.9 20.8-55 48.6-61.9zM224 480c0 17.7 14.3 32 32 32h160V384H224v96zm224 32h160c17.7 0 32-14.3 32-32v-96H448v128zm160-288h-20.4c2.6-7.6 4.4-15.5 4.4-23.8 0-35.5-27-72.2-72.1-72.2-48.1 0-75.9 47.7-87.9 75.3-12.1-27.6-39.9-75.3-87.9-75.3-45.1 0-72.1 36.7-72.1 72.2 0 8.3 1.7 16.2 4.4 23.8H256c-17.7 0-32 14.3-32 32v96h192V224h15.3l.7-.2.7.2H448v128h192v-96c0-17.7-14.3-32-32-32zm-272 0c-2.7-1.4-5.1-3-7.2-4.8-7.3-6.4-8.8-13.8-8.8-19 0-9.7 6.4-24.2 24.1-24.2 18.7 0 35.6 27.4 44.5 48H336zm199.2-4.8c-2.1 1.8-4.5 3.4-7.2 4.8h-52.6c8.8-20.3 25.8-48 44.5-48 17.7 0 24.1 14.5 24.1 24.2 0 5.2-1.5 12.6-8.8 19z"></path>
              </svg>
              <h3 className="text-[22px] text-[#fff] font-hind">
                আরও নতুন ও আকর্ষণীয় পণ্য দেখতে আমাদের মূল ওয়েবসাইট ভিজিট করুন।
              </h3>
            </a>
          </div>
        </div>
        <div>
          <TemplateFooter />
        </div>
      </div>
    </section>
  );
};

export default ProductTemplatePage;
