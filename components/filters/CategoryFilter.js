"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/store/api/categoriesAPI";
import { IoChevronBackOutline } from "react-icons/io5";

const CategoryFilter = ({ selectedCategory }) => {
	const { locale } = useParams();
	const router = useRouter();
	const { translations } = useSelector((state) => state.common);
	const { data: categoriesData } = useGetCategoriesQuery({ locale }); // we can use server fetched data instead
	const categories = categoriesData?.data || [];

	const handleCategoryChange = (category) => {
		router.push(`/categories/${category.slug}`);
	};

	const categoryWithChildren = (categoryParam) => (
		<ul className="space-y-2">
			<li>
				<button
					className={`cursor-pointer pl-4 text-primary`}
					// onClick={() => handleCategoryChange(mainCategory)}
				>
					{categoryParam.child_categories?.length > 0 ? (
						<>
							<IoChevronBackOutline /> {categoryParam.category_name}
						</>
					) : (
						<div className="ml-4">{categoryParam.category_name}</div>
					)}
				</button>

				{/* sub categories  */}
				<ul className="pl-8 space-y-2">
					{categoryParam.child_categories.map((child) => (
						<li key={child.id} className="pl-4">
							<button
								className={`cursor-pointer`}
								onClick={() => handleCategoryChange(child)}
							>
								{child.category_name}
							</button>
						</li>
					))}
				</ul>
			</li>
		</ul>
	);

	return (
		<div className="pr-5">
			<h6 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
				{translations["shop-by-category"] || "Shop by category"}
			</h6>
			<div className="category-filter pt-2">
				{selectedCategory?.id &&
				(selectedCategory?.parent_id ||
					selectedCategory?.child_categories?.length > 0) ? (
					<>
						<button
							className={`cursor-pointer hover:font-bold`}
							onClick={() => router.push("/products")}
						>
							<IoChevronBackOutline />
							{translations["all-categories"] || "All categories"}
						</button>
						{!selectedCategory.parent_id ? (
							categoryWithChildren(selectedCategory)
						) : (
							<ul className="space-y-2">
								<li>
									<button
										className={`cursor-pointer pl-4`}
										onClick={() =>
											handleCategoryChange({
												slug: selectedCategory.parent_slug,
											})
										}
									>
										<IoChevronBackOutline />
										{selectedCategory.parent_name}
									</button>
									<div className="pl-4">
										{categoryWithChildren(selectedCategory)}
									</div>
								</li>
							</ul>
						)}
					</>
				) : (
					<ul className="space-y-2">
						{categories.map((category) => (
							<li key={category.id}>
								<button
									className={`cursor-pointer ${
										selectedCategory?.id === category.id ? "text-primary" : ""
									}`}
									onClick={() => handleCategoryChange(category)}
								>
									{category.category_name}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default CategoryFilter;
