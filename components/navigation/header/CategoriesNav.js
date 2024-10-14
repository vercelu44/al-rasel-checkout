"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategoriesNav({ categories = [], settings = {} }) {
	const { category_slug } = useParams();
	let subMenuCategories = [];

	if (category_slug) {
		const temp = categories.find(
			(c) =>
				c.slug == category_slug ||
				(c.child_categories || []).some((c) => c.slug === category_slug)
		);

		subMenuCategories = temp?.child_categories;
	}

	if (!subMenuCategories || !subMenuCategories.length) return null;

	return (
		<div
			className="categories-nav hidden lg:block"
			style={{ backgroundColor: settings?.colors?.secondary }}
		>
			<div className="container">
				<ul className="nav-menu relative flex items-center gap-4 py-2 flex-wrap px-10">
					{subMenuCategories.map((category) => (
						<li key={category.id} className="nav-item">
							<Link
								href={`/categories/${category.slug}?sort_type=new`}
								className="uppercase font-title !text-sm/5"
								style={{ color: settings?.colors?.secondary_text }}
							>
								{category.category_name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
