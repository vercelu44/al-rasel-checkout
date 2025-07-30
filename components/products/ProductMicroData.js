import React from "react";

const ProductMicroData = ({ product }) => {
	return (
		<>
			<meta
				property="product:brand"
				content={product?.brand?.brand_name || "no-brand"}
			/>
			{/* <meta
        property="product:category"
        content={product?.category?.category_name}
      /> */}
			<meta
				property="product:availability"
				content={product?.stock_qty > 0 ? "in stock" : "out of stock"}
			/>
			<meta property="product:condition" content="new" />
			<meta property="product:price:amount" content={product?.new_price} />
			<meta property="product:price:currency" content="BDT" />
			<meta property="product:retailer_item_id" content={product?.id} />
			{/* <meta property="product:item_group_id" content="fb_tshirts" /> */}

			<script type="application/ld+json">
				{product?.header_script}
			</script>
		</>
	);
};

export default ProductMicroData;
