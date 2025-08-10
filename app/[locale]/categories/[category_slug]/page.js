import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";

const page = async ({ params, searchParams }) => {
	const { category_slug } = params;
	const [categoryResponse] = await Promise.allSettled([
		fetchData({ api: `category/${category_slug}` }),
	]);

	const category =
		categoryResponse.status === "fulfilled"
			? categoryResponse.value?.data || {}
			: {};
	// const popularCategories =
	//   dataResponse.status === "fulfilled" ? dataResponse.value?.data || [] : [];

	//forming search params
	const customSearchParams = {
		category_id: category?.id,
		...searchParams,
	};

	// console.log(category);

	return (
		<>
		<h1 className="sr-only">Detail category</h1>
			<div className="breadcrumb breadcrumb-2 py-5">
				<div className="container">
					<div>
						<Link
							href={`/`}
							className="text-base text-slate-600 hover:text-secondary"
						>
							Home
						</Link>
						<Link
							href={`/categories`}
							className="text-base text-slate-600 hover:text-secondary"
						>
							All Categories
						</Link>
						<Link
							href={`/categories/${category.slug}?sort_type=new`}
							className={`text-base text-slate-900 hover:text-secondary`}
						>
							{category.category_name}
						</Link>
					</div>
				</div>
			</div>

			<ProductsWithFilter
				customSearchParams={customSearchParams}
				category={category}
			/>
		</>
	);
};

export default page;
