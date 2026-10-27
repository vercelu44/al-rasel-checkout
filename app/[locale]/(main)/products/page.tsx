import Link from "next/link";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
import type { PageProps } from "@/types";
// import { fetchData } from "@/utils/fetchData";

const page = async ({ searchParams }: PageProps) => {
	const resolvedSearchParams = await searchParams;
	// const [settingsRes] = await Promise.allSettled([
	//   fetchData({ api: `info/basic` }),
	// ]);

	// const settings =
	//   settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};

	return (
		<>
			<div className="breadcrumb breadcrumb-2 border-b mt-2.5 py-4 md:py-5 md:pb-3">
				<div className="container">
					<div className="flex">
						<Link
							href={`/`}
							className="text-base text-slate-600 hover:text-secondary"
						>
							Home
						</Link>
						<Link
							href={`/products`}
							className="text-base text-slate-600 hover:text-secondary"
						>
							<p>All Products</p>
						</Link>
					</div>
				</div>
			</div>
 			<h1 className="sr-only">All Products</h1>
			<ProductsWithFilter customSearchParams={resolvedSearchParams} />
		</>
	);
};

export default page;
