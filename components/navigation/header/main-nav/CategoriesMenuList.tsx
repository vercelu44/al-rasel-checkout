"use client";
import { Link } from "@/navigation";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { LuMinus } from "react-icons/lu";
import type { Category, SiteSettings } from "@/types";

interface CategoriesMenuListProps {
	/** Closes the side menu after a link is clicked */
	setShow: (show: boolean) => void;
	categories: Category[];
	settings: SiteSettings;
}

const CategoriesMenuList = ({ setShow, categories,settings }: CategoriesMenuListProps) => {
	const [selectedCategory, setSelectedCategory] = React.useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);

	return (
		<div className={`!h-full relative`}>
			{categories.map((category) => (
				<div className={`!w-full sub-menu`} key={category.id}>
					<div className="flex items-center justify-between px-3 !w-full py-2 shadow text-md">
						<Link
							key={category.id}
							onClick={() => setShow(false)}
							href={`/categories/${category.slug}?sort_type=${process.env.NEXT_PUBLIC_SORT_TYPE || 'new'}`}
							className="hover:transform hover:translate-x-2 transition ease-in-out duration-300"
						>
							{category.category_name}
						</Link>
						{category.child_categories?.length ? (
							<span className="cursor-pointer">
								{category.id === selectedCategory ? (
									<LuMinus onClick={() => setSelectedCategory(null)} />
								) : (
									<FiPlus onClick={() => setSelectedCategory(category?.id)} />
								)}
							</span>
						) : null}
					</div>

					{category.id === selectedCategory ? (
						<div
							className={`shadow bg-white !w-full !h-full overflow-y-auto overflow-x-hidden`}
						>
							{category.child_categories?.map((subCategory) => (
								<div className="second-sub-menu" key={subCategory.id}>
									<div
										className={`pl-6 hover:text-primary py-2  flex items-center justify-between px-3 text-md shadow mb-2 w-full ${
											subCategory.id === selectedSubCategory ? "" : ""
										}`}
									>
										<Link
											onClick={() => setShow(false)}
											href={`/categories/${subCategory.slug}?sort_type=${process.env.NEXT_PUBLIC_SORT_TYPE || 'new'}`}
										>
											{subCategory.category_name}
										</Link>
										{subCategory?.child_categories?.length ? (
											<span className="cursor-pointer">
												{subCategory.id === selectedSubCategory ? (
													<LuMinus
														onClick={() => setSelectedSubCategory(null)}
													/>
												) : (
													<FiPlus
														onClick={() =>
															setSelectedSubCategory(subCategory?.id)
														}
													/>
												)}
											</span>
										) : null}
									</div>
									{subCategory.id === selectedSubCategory ? (
										<div
											className={`shadow bg-white !w-full !h-full overflow-y-auto overflow-x-hidden`}
										>
											{subCategory.child_categories?.map((childCategory) => (
												<div className="second-sub-menu" key={childCategory.id}>
													<Link
														onClick={() => setShow(false)}
														className="pl-12 hover:text-primary py-2 flex items-center justify-between px-3 text-md"
														href={`/categories/${childCategory.slug}?sort_type=${process.env.NEXT_PUBLIC_SORT_TYPE || 'new'}`}
													>
														{childCategory.category_name}
													</Link>
												</div>
											))}
										</div>
									) : null}
								</div>
							))}
						</div>
					) : null}
				</div>
			))}

			{/* Extra pages */}
				{settings?.header_page?.map((extraPage, idx) => (
					<div key={idx} className="flex items-center justify-between px-3 !w-full py-2 shadow text-md">
						<Link
							onClick={() => setShow(false)}
							href={extraPage.path}
							key={idx}
							title={extraPage.name}
							className={`uppercase`}
							style={{ flexShrink: 0 }}
							>
							{extraPage.name}
						</Link>
					</div>
				))}
		</div>
	);
};

export default CategoriesMenuList;
