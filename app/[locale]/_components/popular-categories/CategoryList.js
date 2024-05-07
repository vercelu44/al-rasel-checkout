"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import noImage from "@/public/assets/images/no-image.png";

const CategoryList = ({ categories }) => {
	return (
		<div className="grid grid-cols-3 justify-center items-start gap-4">
			{categories?.slice(0, 6)?.map((category) => (
				<div key={category?.id} className="w-[96px] justify-self-center">
					<Link
						href={`/categories/${category.slug}`}
						className="category-img flex justify-center items-center h-[96px] bg-white rounded-full overflow-hidden"
					>
						<Image
							src={category?.icon || noImage}
							alt={category.category_name}
							width={58}
							height={58}
							className="w-[58px] h-[58px] object-contain hover:scale-110"
						/>
					</Link>
					<Link
						href={`/categories/${category.slug}`}
						className="block text-sm text-white text-center mt-4"
					>
						{category.category_name}
					</Link>
				</div>
			))}
		</div>
	);
};

export default CategoryList;
