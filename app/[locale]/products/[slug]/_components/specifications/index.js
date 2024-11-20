import ViewHTML from "@/components/elements/ViewHTML";

const Specifications = ({ product, translations }) => {
	return (
		<section id="product-specifications">
			<h4 className="text-2xl font-bold font-title text-slate-900">
				{translations["specifications"] || "Specifications"}:
			</h4>
			<div class="-mx-4 sm:-mx-8 px-4 sm:px-8 mt-3 overflow-x-auto">
				<ViewHTML htmlText={product?.specification} />
			</div>
		</section>
	);
};

export default Specifications;
