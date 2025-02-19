import Image from "next/image";
import ViewHTML from "@/components/elements/ViewHTML";
import VideoPlayer from "@/components/elements/VideoPlayer";

const Descriptions = ({ settings, product, translations }) => {
	return (
		<section id="product-descriptions">
			<div className="description">
				{/* <h4 className="text-2xl font-bold font-title text-slate-900 mb-3">
					{translations["product-description"] || "প্রডাক্টের বিবরণ"}:
				</h4> */}
				<ViewHTML htmlText={product?.details} />
			</div>
			{product?.includedProducts?.length ? (
				<div className="mt-6 lg:mt-8">
					<h4 className="text-2xl font-bold font-title text-slate-900">
						{translations["product-includes"] || "Product Includes"}
					</h4>
					<Image
						src={product.includedProducts[0]?.image}
						alt="Product Includes"
						width={628}
						height={510}
						className="w-full h-[17.5rem] lg:h-[31.875rem] rounded-xl mt-3"
					/>
				</div>
			) : null}
			{product?.review_video && (
				<div className="mt-6 lg:mt-8">
					<h4 className="text-2xl font-bold font-title text-slate-900">
						{translations["review-video"] || "Review Video"}
					</h4>
					<div className="mt-3">
						<VideoPlayer
							url={product?.review_video}
							loop={true}
							muted={true}
							// playing={true}
							controls={true}
							className={"h-[12rem] md:h-[21.875rem]"}
						/>
					</div>
				</div>
			)}
		</section>
	);
};

export default Descriptions;
