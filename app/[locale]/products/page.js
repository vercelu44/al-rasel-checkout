import Link from "next/link";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
// import { fetchData } from "@/utils/fetchData";

const page = ({ params, searchParams }) => {
	// const [settingsRes] = await Promise.allSettled([
	//   fetchData({ api: `info/basic` }),
	// ]);

	// const settings =
	//   settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};

	return (
		<>
			<div className="breadcrumb breadcrumb-2 py-4 md:py-5">
				<div className="container">
					<div>
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
							<h1>All Products</h1>
						</Link>
					</div>
				</div>
			</div>

			<ProductsWithFilter customSearchParams={searchParams} />
		</>
	);
};

export default page;
