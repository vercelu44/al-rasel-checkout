import Image from "next/image";
import { Link } from "@/navigation";
import { fetchData } from "@/lib/fetch-data";
import noImage from "@/public/assets/images/no-image.png";

const FeaturedBanner = async () => {
  const { data: featuredBanner = [] } = await fetchData({ api: "banners" });
  if (!featuredBanner?.length) return null;

  const [mainBanner, firstSubBanner, secondSubBanner, sideBanner] = featuredBanner;

  const renderBanner = (banner, width, height, className) => (
    <Link href={banner?.url || "/"} className="banner-img">
      <Image
        src={banner?.image || noImage}
        alt="Banner"
        width={width}
        height={height}
        sizes="100vw"
        className={`w-full ${className} rounded-2xl object-cover`}
      />
    </Link>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-x-0 md:gap-x-4 lg:gap-6">
      {mainBanner && renderBanner(mainBanner, 662, 416, "lg:w-[662px] lg:h-[416px]")}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-0 md:gap-x-4 lg:gap-6">
        <div className="col-span-2">
          <div className="mb-4">
            {firstSubBanner && renderBanner(firstSubBanner, 408, 198, "lg:w-[408px] lg:h-[198px]")}
          </div>
          <div>
            {secondSubBanner && renderBanner(secondSubBanner, 408, 198, "lg:w-[408px] lg:h-[198px]")}
          </div>
        </div>
        <div className="col-span-1">
          {sideBanner && renderBanner(sideBanner, 192, 414, "lg:w-[192px] lg:h-[414px]")}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
