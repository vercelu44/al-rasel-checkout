import Link from "next/link";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";

const page = ({ searchParams }) => {

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
