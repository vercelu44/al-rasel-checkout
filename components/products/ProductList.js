import React from "react";
import ProductCard from "../cards/ProductCard";

export default function ProductList({ products, isFlashSale, translations }) {
	return (
		<div className="products-wpr grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-x-6 lg:gap-y-12 mb-3 lg:mb-12">
			{products?.map((product, i) => (
				<ProductCard
					key={i}
					product={product}
					isFlashSale={isFlashSale}
					translations={translations}
				/>
			))}
		</div>
	);
}
