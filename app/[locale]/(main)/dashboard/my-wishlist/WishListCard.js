"use client";
import Image from "next/image";
import { Link } from "@/navigation";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import noImage from "@/public/assets/images/no-image.png";
import { AiOutlineClose } from "react-icons/ai";
import { siteConfig } from "@/config/site";
import useWishList from "@/hooks/useWishList";
import { useSelector } from "react-redux";
import useCart from "@/hooks/useCart";
import { getDiscountPercent } from "@/utils/percent";

const WishListCard = ({ product }) => {
	const { id, slug, brand, product_name, new_price, old_price, stock_qty } =
		product;

	const { handleAddToCart } = useCart(); //custom hook for reusing
	const { handleRemoveFromWishlist } = useWishList();
	const { settings, translations } = useSelector((state) => state.common);

	const stockOut = stock_qty <= 0 ? true : false;

	// console.log(product);
	return (
		<div className="relative px-3 py-4 bg-white border-t border-slate-200 mb-3 shadow rounded">
			<button
				className="absolute right-3 z-20 top-1 bg-transparent w-fit h-fit p-1"
				onClick={() => handleRemoveFromWishlist(id)}
			>
				<AiOutlineClose size={20} />
			</button>
			<div className={`flex gap-4`}>
				<div className="relative">
					<Image
						src={product.image || noImage}
						alt="product"
						height={80}
						width={96}
						className={`${stockOut ? "opacity-50" : ""} w-24 h-20`}
					/>
					{stockOut ? (
						<div className="w-full h-full rounded absolute left-0 top-0 flex items-center justify-center">
							<span className="text-center text-red-400 border bg-[#acacac71] border-red-100 p-[2px] rounded font-bold">
								{translations["stock-out"] || "Stock Out"}
							</span>
						</div>
					) : null}
				</div>
				<div className="flex flex-col justify-between w-full">
					<span
						// href={`/brands/${brand?.id}`}
						className={`text-sm text-orange-200 ${
							stockOut ? "opacity-50" : ""
						}`}
					>
						{brand?.brand_name || "No Brand"}
					</span>
					<Link
						href={`/products/${slug}`}
						className={`${
							stockOut ? "opacity-50" : ""
						} product-title overflow-text`}
					>
						{product_name}
					</Link>
					<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
						<div
							className={`flex gap-3 products-center items-center ${
								stockOut ? "opacity-50" : ""
							}`}
						>
							<h3 className="text-xl">
								{siteConfig.currency.shortForm}
								{new_price}
							</h3>
							{old_price > new_price ? (
								<>
									<del className="text-base whitespace-nowrap text-slate-300">
										{siteConfig.currency.shortForm} {old_price}
									</del>
									<div className="rounded-md px-1 flex justify-center items-center !text-[12px] whitespace-nowrap text-sm text-white bg-red-500">
										{getDiscountPercent(old_price, new_price)}% OFF
									</div>
								</>
							) : null}
						</div>
						{!stockOut ? (
							<button
								className="py-2 px-3 text-center active:scale-95 rounded shadow-around"
								onClick={() => handleAddToCart(product)}
								style={{
									backgroundColor: settings?.colors?.primary,
									color: settings?.colors?.primary_text,
								}}
							>
								<HiOutlineShoppingCart size={16} />
								<span className="ml-2">
									{translations["add-to-cart"] || "Add To Cart"}
								</span>
							</button>
						) : (
							<Link
								href={`/categories/${product.category?.slug}?sort_type=new`}
								className="text-center font-bold py-2 px-3 active:scale-95 cursor-pointer rounded"
								style={{
									border: `1px solid ${settings?.colors?.primary}`,
									color: settings?.colors?.primary,
								}}
							>
								{translations["similar-products"] || "Similar Products"}
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WishListCard;
