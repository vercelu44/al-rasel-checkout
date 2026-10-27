import Link from "next/link";
import Image from "next/image";
import noImage from "@/public/assets/images/no-image.png";
import { fetchData } from "@/lib/fetch-data";
import type { ApiResponse, Brand } from "@/types";

const Brands = async () => {
	// const { locale } = useParams<{ locale: string }>();
	// const { data: brandsData } = useGetBrandsQuery({ locale });
	// console.log("brandsData-------", brandsData);
	const data = await fetchData<ApiResponse<Brand[]>>({ api: "brands" });
	const brands = data?.data || [];

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
				{brands?.map((brand, i) => (
					<div key={i} className="h-[150px] w-[150px] overflow-hidden">
						<Link href={`/brands/${brand.id}`} className="">
							<Image
								src={brand.brand_image || noImage}
								alt={brand.title || "Not Found"}
								width={150}
								height={150}
								className="w-full h-full object-contain hover:scale-125 transition-all duration-300 ease-in-out"
							/>
						</Link>
					</div>
				))}
			</div>
		</>
	);
};

export default Brands;
