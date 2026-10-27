import Slider from "rc-slider";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { siteConfig } from "@/config/site";

interface PriceRange {
	min: number;
	max: number;
}

const PriceRangeSlider = ({ min_price, max_price }: { min_price: number; max_price: number }) => {
	const [priceRange, setPriceRange] = useState<PriceRange>({
		min: min_price,
		max: max_price,
	});

	const router = useRouter();
	let pathname = usePathname();
	const searchParams = useSearchParams();

	// Debounce the price change
	const debouncedPriceRange = useDebounce(priceRange, 300);

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createPriceQueryString = useCallback(
		(name1: string, value1: number, name2: string, value2: number) => {
			const params = new URLSearchParams(searchParams);
			params.set(name1, String(value1));
			params.set(name2, String(value2));
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

	useEffect(() => {
		if (debouncedPriceRange) {
			router.push(
				pathname +
					"?" +
					createPriceQueryString(
						"min_price",
						debouncedPriceRange.min,
						"max_price",
						debouncedPriceRange.max
					)
			);
		}
	}, [debouncedPriceRange, createPriceQueryString, pathname, router]);

	const handlePriceRangeChange = (value: number | number[]) => {
		if (!Array.isArray(value)) return; // range slider always sends [min, max]
		setPriceRange({ min: value[0], max: value[1] });
	};

	return (
		<div className="price-range border-b border-slate-200 pb-5">
			<h6 className="text-sm font-bold text-slate-900 mb-3">By Price</h6>
			<div className="flex justify-between my-2">
				<span className="text-sm font-medium border border-secondary rounded px-1">
					{siteConfig.currency.sign}
					{priceRange.min}
				</span>
				<span className="text-sm font-medium border border-secondary rounded px-1">
					{siteConfig.currency.sign}
					{priceRange.max}
				</span>
			</div>
			<Slider
				range
				allowCross={false}
				value={[priceRange.min, priceRange.max]} // Use default values based on min_price and max_price
				defaultValue={[min_price, max_price]} // Use default values based on min_price and max_price
				min={min_price}
				max={max_price}
				// dotStyle={"text-red-500"}
				onChange={(value) => handlePriceRangeChange(value)}
			/>
		</div>
	);
};

export default PriceRangeSlider;
