import Slider from "rc-slider";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

const PriceRangeSlider = ({ min_price, max_price }) => {
	const { translations } = useSelector((state) => state.common);
	const [priceRange, setPriceRange] = useState({
		min: min_price,
		max: max_price,
	});

	const router = useRouter();
	let pathname = usePathname();
	const searchParams = useSearchParams();

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createPriceQueryString = useCallback(
		(name1, value1, name2, value2) => {
			const params = new URLSearchParams(searchParams);
			params.set(name1, value1);
			params.set(name2, value2);
			return params.toString();
		},
		[searchParams]
	);

	// Reset the price state and slider default value when min_price or max_price change
	useEffect(() => {
		setPriceRange({
			min: min_price,
			max: max_price,
		});
	}, [min_price, max_price]);

	const handlePriceRangeChange = (value) => {
		setPriceRange({ min: value[0], max: value[1] });
		router.push(
			pathname +
				"?" +
				createPriceQueryString("min_price", value[0], "max_price", value[1])
		);
	};

	return (
		<div className="price-range pr-5">
			<h6 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 mb-3">
				{translations["price"] || "Price"}
			</h6>
			<div className="px-2 py-1">
				<Slider
					range
					allowCross={false}
					value={[priceRange.min, priceRange.max]} // Use default values based on min_price and max_price
					defaultValue={[min_price, max_price]} // Use default values based on min_price and max_price
					min={min_price}
					max={max_price}
					onChange={(value) => handlePriceRangeChange(value)}
				/>
			</div>

			<div className="flex justify-between mt-2">
				<span className="text-sm font-medium text-slate-900">
					{siteConfig.currency.sign}
					{priceRange.min}
				</span>
				<span className="text-sm font-medium text-slate-900">
					{siteConfig.currency.sign}
					{priceRange.max}
				</span>
			</div>
		</div>
	);
};

export default PriceRangeSlider;
