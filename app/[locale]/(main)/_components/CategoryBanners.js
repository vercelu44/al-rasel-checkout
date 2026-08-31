
import Image from "next/image";
import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
import noImage from "@/public/assets/images/no-image.png";
import { cn } from "@/utils";

const CategoryBanners = async ({ settings }) => {
  const [transRes] = await Promise.allSettled([
    fetchData({ api: "translations" }),
  ]);
  const translations =
    transRes.status === "fulfilled" ? transRes.value?.data || {} : {};
  
  const { data: cBanners = [] } = await fetchData({ api: "banners" });
  
  if (!cBanners?.length) return null;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-4 gap-4 2xl:gap-8",
      process.env.NEXT_PUBLIC_CAT_GRID_BANNER === "YES" ? "grid-cols-2":"grid-cols-1"

    )}>
      {cBanners.map((banner, index) => (
        <div key={banner.id} className="group">
          <Link 
            href={banner.url || "#"} 
            className="banner-img block relative overflow-hidden rounded"
            aria-label={banner.title || `View ${banner.title || 'category'}`}
          >
            <Image
              src={banner.image || noImage}
              alt={banner.title || "Category banner"}
              width={400}
              height={700}
              loading="lazy"
              quality={80}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full aspect-[4/5]  object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjcwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjcwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
            />
          </Link>
          <div className="content w-full text-center p-5">
            <Link href={banner.url || "#"}>
              <h2 className="mb-4 text-sm font-thin font-serif hover:opacity-70 transition-opacity">
                {banner.title}
              </h2>
            </Link>
            <Link
              href={banner.url || "#"}
              className="inline-block border rounded px-4 py-2 font-semibold font-title transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: settings?.colors?.default_text,
                color: settings?.colors?.default_text,
              }}
              aria-label={`Shop ${banner.title || 'category'}`}
            >
              {translations["shop-now"] || "Shop Now"}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBanners;