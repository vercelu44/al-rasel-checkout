import { fetchData } from "@/lib/fetch-data";
import ProductDetails from "./_components/ProductDetails";
import { Link } from "@/navigation";
import SectionTitle from "@/components/elements/SectionTitle";
import AllProducts from "@/components/products/AllProducts";
import { SeeAll } from "@/components/elements/buttons";
import LastVisitedProducts from "@/components/products/LastVisitedProducts";
import { getSlicedText } from "@/utils/format-text";
import ProductMicroData from "@/components/products/ProductMicroData";

const ProductDetailsView = async ({ params }) => {
	const { slug } = params;
	// if (slug === "null") return notFound();
	const [settingsRes, productRes, tranRes] = await Promise.allSettled([
		fetchData({ api: `info/basic` }),
		fetchData({ api: `products/${slug}` }),
		fetchData({ api: `translations` }),
	]);

	const settings =
		settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
	const product =
		productRes.status === "fulfilled" ? productRes.value?.data || [] : [];
	const translations =
		tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

	//Category Filter
	const customSearchParams = {
		category_id: product?.category?.id,
		per_page: 20,
	};

	return (
		<>
			<ProductMicroData product={product} />
			<div className="mb-32 lg:mb-0">
				<div className="container hidden lg:block">
					<div className="breadcrumb breadcrumb-2 py-5">
						<div>
							<Link
								href={`/`}
								className="text-base text-slate-600 hover:text-primary"
							>
								{translations["home"] || "হোম"}
							</Link>
							<Link
								href={`/products`}
								className="text-base text-slate-600 hover:text-primary"
							>
								{translations["products"] || "প্রডাক্টস"}
							</Link>
							<Link
								href={`/products/${slug}`}
								aria-disabled="true"
								className={`text-base text-slate-900 pointer-events-none`}
							>
								{getSlicedText(slug, 50)}
							</Link>
						</div>
					</div>
				</div>
				<div className="lg:container">
					<ProductDetails
						product={product}
						settings={settings}
						translations={translations}
					/>
				</div>
				<section>
					<div className="h-2 w-full bg-slate-200 lg:hidden"></div>
					<div className="container mt-4 lg:mt-12 mb-6 lg:mb-12">
						<SectionTitle
							className={"justify-start"}
							title={
								translations["same-category-products"] ||
								"একই ক্যাটাগরির আরও প্রোডাক্ট"
							}
							buttonText={translations["see-all"]}
						/>
						<div className="category-products mt-1 lg:mt-6">
							<AllProducts
								customSearchParams={customSearchParams}
								translations={translations}
							/>
							<SeeAll
								href={`/categories/${product?.category?.slug}`}
								buttonText={translations["see-all"]}
							/>
						</div>
					</div>
				</section>
				<LastVisitedProducts
					visitedProductId={product?.id}
					translations={translations}
				/>
			</div>
		</>
	);
};

export default ProductDetailsView;
