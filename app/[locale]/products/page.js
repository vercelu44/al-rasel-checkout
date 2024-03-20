import { Link } from "@/navigation";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
import { fetchData } from "@/lib/fetch-data";

const page = async ({ params, searchParams }) => {
	const [settingsRes, tranRes] = await Promise.allSettled([
		fetchData({ api: `info/basic` }),
		fetchData({ api: `translations` }),
	]);

	const settings =
		settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
	const translations =
		tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

	return (
		<>
			<div
				className="hidden lg:block bg-no-repeat bg-cover w-full h-[240px] breadcrumb py-20"
				style={{
					backgroundImage: `url(${settings?.all_product_banner})`,
				}}
			>
				<div className="container">
					<div className="text-center">
						<h3 className="text-2xl font-bold font-title text-white mb-4">
							{searchParams?.sort_type === "new"
								? translations["new-product"] || "নতুন প্রডাক্ট"
								: translations["all-products"] || "সকল প্রডাক্ট"}
						</h3>
						<div>
							<Link
								href={`/`}
								className="text-base text-white hover:text-primary"
							>
								{translations["home"] || "হোম"}
							</Link>
							{searchParams?.sort_type === "new" ? (
								<Link
									href={`/products?sort_type=new`}
									className="text-base text-white hover:text-primary"
								>
									{translations["new-product"] || "নতুন প্রডাক্ট"}
								</Link>
							) : (
								<Link
									href={`/products`}
									className="text-base text-white hover:text-primary"
								>
									{translations["all-products"] || "সকল প্রডাক্ট"}
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>

			<ProductsWithFilter
				customSearchParams={searchParams}
				translations={translations}
			/>
		</>
	);
};

export default page;
