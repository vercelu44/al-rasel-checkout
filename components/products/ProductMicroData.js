
import React from "react";

const ProductMicroData = ({ product }) => {
	// console.log(product);
	const origin = typeof window !== "undefined" ? window.location.origin : "";
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: product?.header_script
            ? product.header_script
            : JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                name: product?.product_name || "",
                image: [product?.image || ""],
                description: product?.meta_description || "",
                sku: product?.sku || "",
                brand: {
                  "@type": "Brand",
                  name: product?.brand?.brand_name || "",
                },
                offers: {
                  "@type": "Offer",
                  url: `${origin}/products/${product?.slug}` || "",
                  priceCurrency: "BDT",
                  price: product?.new_price || "",
                  priceValidUntil: "2025-12-31",
                  itemCondition: "https://schema.org/NewCondition",
                  availability:
                    product?.stock_qty > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  seller: {
                    "@type": "Organization",
                    name: origin,
                  },
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product?.average_rating || "4.8",
                  reviewCount: product?.total_rating || "1326",
                },
              }),
        }}
      />
    </>
  );
};

export default ProductMicroData;

