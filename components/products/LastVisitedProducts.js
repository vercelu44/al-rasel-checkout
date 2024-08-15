"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
	useAddToVisitedMutation,
	useGetVisitedProductsQuery,
} from "@/store/api/visitedProductsAPI";
import ProductHistoryCard from "../cards/ProductHistoryCard";
import SectionTitle from "../elements/SectionTitle";

const LastVisitedProducts = ({ visitedProductId, translations }) => {
	const { locale } = useParams();
	const { user } = useSelector((state) => state.auth);
	const [addToVisited] = useAddToVisitedMutation();
	const { data, isLoading } = useGetVisitedProductsQuery({ locale });
	const visitedProducts = data?.data || [];
	// console.log(data);

	// Adding product to visited list
	useEffect(() => {
		if (visitedProductId && user) {
			addToVisited({ product_id: visitedProductId, date: new Date() });
		}
	}, [visitedProductId, user, addToVisited]);

	if (!user) return null;

	return (
		<div className="container mb-11 lg:mb-14">
			<div className="bg-slate-50 border border-slate-100 rounded-xl p-3 lg:p-6">
				<div className="latest-viewed-products">
					<SectionTitle
						className={"border-slate-100 justify-start"}
						title={
							translations["recently-viewed"] ||
							"Recently Viewed Products"
						}
						buttonText={translations["see-all"]}
					/>
					<div className="mt-1 lg:mt-6">
						<div className="products-wpr grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-x-5 lg:gap-y-6">
							{visitedProducts?.map((product, i) => (
								<div key={i}>
									<ProductHistoryCard
										product={product}
										status={translations["new"]}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LastVisitedProducts;
