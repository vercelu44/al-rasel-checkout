"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/store/api/categoriesAPI";
import { IoChevronBackOutline } from "react-icons/io5";
// import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useState } from "react";
import { useSelector } from "react-redux";

const CategoryFilter = ({ selectedCategory }) => {
	const { translations } = useSelector((state) => state.common);
	const { locale } = useParams();
	const router = useRouter();
	const { data: categoriesData } = useGetCategoriesQuery({ locale }); // we can use server fetched data instead
	const categories = categoriesData?.data || [];
	const [isOpen, setIsOpen] = useState(true);

	const handleCategoryChange = (category) => {
		router.push(`/categories/${category.slug}?sort_type=new`);
	};

	const categoryWithChildren = (categoryParam) => (
		<ul className="space-y-2">
			<li>
				<button
					className={`cursor-pointer pl-4 font-bold`}
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
		<div id="category-filter" className="border-b border-slate-200 pb-3">
			<h4
				// onClick={() => setIsOpen((prevOpen) => !prevOpen)}
				className="text-sm font-bold text-slate-900"
			>
				{/* {isOpen ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}  */}
				{translations["by-category"] || "By Category"}
			</h4>
			{isOpen && (
				<div className="category-filter pt-3 text-slate-600">
					{selectedCategory?.id &&
					(selectedCategory?.parent_id ||
						selectedCategory?.child_categories?.length > 0) ? (
						<>
							<button
								className={`cursor-pointer hover:font-bold`}
								onClick={() => router.push("/products?sort_type=new")}
							>
								<IoChevronBackOutline />
								Categories
							</button>
							{!selectedCategory.parent_id ? (
								categoryWithChildren(selectedCategory)
							) : (
								<ul className="space-y-2">
									<li>
										<button
											className={`cursor-pointer hover:font-bold pl-4`}
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
										className={`cursor-pointer hover:font-bold ${
											selectedCategory?.id === category.id
												? "font-bold"
												: "text-slate-600"
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
			)}
		</div>
	);
};

export default CategoryFilter;
