import React from "react";
import OfferSlider from "./OfferSlider";
const offers = [
	{
		title: "15% Discount On Winter Clear Out",
		text: "* Only Selected Products",
	},
	{
		title: "Boshonto Items Are Comming Soon",
		text: "Get Ready",
	},
	{
		title: "10% Extra Discout For Teens",
		text: "* For First Order",
	},
];
export default function OfferSliderNav() {
	return (
		<div className="offer bg-[#f5e7cc] py-3">
			<div className="container">
				<OfferSlider sliders={offers} />
			</div>
		</div>
	);
}
