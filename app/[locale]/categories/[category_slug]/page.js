import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";

export async function generateMetadata({ params, searchParams }) {
	const slug = params.slug;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3001";
  
	// Get and normalize pagination
	let pageParam = searchParams.page;
  
	// Canonical should always point to the base (no page param)
	const canonicalUrl = `${baseUrl}/categories/${slug}`;
  
	const metadata = {
	  title: `Category: ${slug} - Page ${pageParam || 1}`,
	  description: `Browse page ${pageParam || 1} of ${slug} category.`,
	  alternates: {
		canonical: canonicalUrl,
	  },
	};

	return metadata;
  }
  

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
					<div className="flex">
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
