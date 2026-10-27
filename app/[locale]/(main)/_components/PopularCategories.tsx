import { fetchData } from "@/lib/fetch-data";
import Link from "next/link";
import Image from "next/image";
import noImage from "@/public/assets/images/no-image.png";
import type { ApiResponse, Category } from "@/types";

const PopularCategories = async () => {
	const data = await fetchData<ApiResponse<Category[]>>({ api: "popular-categories?no_child=1" });
	const popularCategories = data?.data || [];
	return (
		<>
			{popularCategories?.map((category) => (
				<div key={category.id} className="bg-white py-6 px-4">
					<Link
						href={`/categories/${category.slug}?sort_type=new`}
						className="flex items-center gap-4 hover:scale-105 hover:text-secondary"
					>
						<Image
							src={category?.icon || noImage}
							alt={category.category_name}
							width={50}
							height={50}
							className="w-[50px] h-[auto] object-contain"
						/>
						<h5>{category.category_name}</h5>
					</Link>
				</div>
			))}
		</>
	);
};

export default PopularCategories;
