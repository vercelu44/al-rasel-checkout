"use client";
import React from "react";
import WishListCard from "./WishListCard";
import { useParams } from "next/navigation";
import { useGetWishListQuery } from "@/store/api/wishListAPI";
import NoItems from "../_components/NoItems";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { useSelector } from "react-redux";

const MyWishList = () => {
	const { locale } = useParams();
	const { data, isLoading } = useGetWishListQuery({ locale });
	const { settings, translations } = useSelector((state) => state.common);
	const wishedProducts = data?.data || [];
	return (
		<div className="p-6">
			<h2 className="text-slate-600 text-2xl text-center md:text-start">
				{translations["my-wish-list"] || "My Wish List"} (
				{wishedProducts.length}) {translations["item"] || "Item"}
			</h2>
			{isLoading ? (
				<div className="py-4">
					<ItemsListLoader itemHeight={90} viewBoxWidth={900} />
				</div>
			) : wishedProducts.length ? (
				<div className="mt-4">
					{wishedProducts.map((product) => (
						<WishListCard key={product.id} product={product} />
					))}
				</div>
			) : (
				<NoItems />
			)}
		</div>
	);
};

export default MyWishList;
