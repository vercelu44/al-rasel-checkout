import Link from "next/link";
import Image from "next/image";
import { fetchData } from "@/lib/fetch-data";
import noImage from "@/public/assets/images/no-image.png";

const page = async () => {
	const data = await fetchData({ api: "categories?no_child=1" });
	const categories = data?.data || [];
    console.log("Categories Data:", categories);
	return (
		<>

			<div className="breadcrumb breadcrumb-2 pt-5">
				<div className="container border-b border-slate-200 pb-5">
					<div>
						<Link
							href={`/`}
							className="text-base text-slate-600 hover:text-secondary"
						>
							Home
						</Link>
						<Link
							href={`/categories`}
							className="text-base text-slate-900 hover:text-secondary"
						>
							<h1>All Categories</h1>
						</Link>
					</div>
				</div>
			</div>

			<div className="container mt-4 md:mt-8 mb-4 md:mb-24">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6  gap-3 md:gap-5 mb-12">
					{categories?.map((category, i) => (
						<div
							className="category flex flex-col justify-center items-center border p-3 lg:p-4"
							key={i}
						>
							<Link
								href={`/categories/${category.slug}?sort_type=new`}
								className="category-img w-full md:w-[200px] h-[150px] md:h-[200px] overflow-hidden"
							>
								<Image
									src={category?.icon || noImage}
									alt={category.category_name}
									width={180}
									height={200}
									// style={{ width: "auto", height: "auto" }}
									className="h-full w-full object-cover object-top hover:scale-105 ease-in-out duration-300"
								/>
							</Link>
							<Link
								href={`/categories/${category.slug}?sort_type=new`}
								className="block text-lg text-slate-700 text-center"
							>
								{category.category_name}
							</Link>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default page;
