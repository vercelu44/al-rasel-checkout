"use client";
import Image from "next/image";
import { Link } from "@/navigation";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import noImage from "@/public/assets/images/no-image.png";
import useCart from "@/hooks/useCart";
import useWishList from "@/hooks/useWishList";
import { siteConfig } from "@/config/site";
import { getDiscountPercent } from "@/utils/percent";
import { useSelector } from "react-redux";

const WishListCard = ({ product }) => {
	const { translations } = useSelector((state) => state.common);
	const { handleAddToCart } = useCart(); //custom hook for reusing
	const { handleRemoveFromWishlist } = useWishList(); //custom hook for reusing
	const { id, slug, brand, product_name, new_price, old_price, stock_qty } =
		product;

	const stockOut = stock_qty <= 0 ? true : false;

	return (
		<div className="relative px-3 py-4 bg-white border border-slate-200 rounded-xl mb-3">
			<button
				className="absolute z-10 right-3 top-3 bg-transparent text-red-500"
				onClick={() => handleRemoveFromWishlist(id)}
			>
				<FiTrash2 size={20} />
			</button>
			<div className={`flex gap-2 lg:gap-4`}>
				<div className="relative !w-[95px]">
					<Image
						src={product.image || noImage}
						alt="product"
						height={84}
						width={84}
						className={`${
							stockOut ? "opacity-50" : ""
						} h-[72px] w-[72px] lg:w-[84px] lg:h-[84px] rounded-lg`}
					/>
					{stockOut ? (
						<div className="w-full h-full rounded absolute left-0 top-0 flex items-center justify-center">
							<span className="text-red-500 !text-4 rounded-lg whitespace-nowrap capitalize border-solid border bg-white border-red-200 px-1 py-[2px]">
								{translations["out-of-stock"] || "স্টক শেষ"}
							</span>
						</div>
					) : null}
				</div>
				<div className="flex flex-col justify-between w-full">
					<span
						// href={`/brands/${brand?.id}`}
						className={`text-primary font-bold text-base ${
							stockOut ? "opacity-50" : ""
						}`}
					>
						{brand?.brand_name || "No Brand"}
					</span>
					<Link
						href={`/products/${slug}`}
						className={`${
							stockOut ? "opacity-50 font-normal text-[14px]" : ""
						} product-title overflow-text font-semibold max-w-fit`}
					>
						{product_name}
					</Link>
					<div className="flex justify-between items-center">
						<div
							className={`flex gap-3 products-center items-center ${
								stockOut ? "opacity-50" : ""
							}`}
						>
							<h3 className="text-base font-semibold text-red-500 whitespace-nowrap">
								{siteConfig.currency.sign} {new_price}
							</h3>
							{old_price > new_price ? (
								<>
									<del className="text-base whitespace-nowrap text-slate-300">
										{siteConfig.currency.sign} {old_price}
									</del>
									<div className="rounded-md px-1 flex justify-center items-center !text-[12px] whitespace-nowrap text-sm text-white bg-red-500">
										{getDiscountPercent(old_price, new_price)}% OFF
									</div>
								</>
							) : null}
						</div>
						{!stockOut ? (
							<button
								className="bg-secondary-700 py-2 px-3 ml-3 text-white rounded-lg text-center active:scale-95"
								onClick={() => handleAddToCart(product)}
							>
								<HiOutlineShoppingCart size={20} />
								<span className="ml-2 hidden md:inline">
									{translations["add-to-cart"] || "কার্টে রাখুন"}
								</span>
							</button>
						) : (
							<Link
								href={`/categories/${product.category?.slug}`}
								className="text-secondary-700 font-bold border whitespace-nowrap border-secondary-700 py-2 px-3 rounded-lg active:scale-95 cursor-pointer"
							>
								<span className="hidden md:inline">
									{translations["find-similar"] || "সিমিলার খুঁজুন"}
								</span>
								<span className="inline md:hidden">
									{translations["find"] || "খুঁজুন"}
								</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WishListCard;
