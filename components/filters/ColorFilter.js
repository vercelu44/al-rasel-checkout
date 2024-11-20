"use client";
import { useSelector } from "react-redux";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";

const ColorFilter = ({ colors, selectedColors }) => {
	const { translations } = useSelector((state) => state.common);
	const { handleSelectChange } = useSelectURLQuery();

	const handleChange = (e) => {
		if (e.target.checked) {
			handleSelectChange(
				"colors",
				[...selectedColors, e.target.name].join(",")
			);
		} else {
			handleSelectChange(
				"colors",
				selectedColors.filter((color) => color !== `${e.target.name}`).join(",")
			);
		}
	};

	return (
		<>
			<div className="pr-5">
				<h6 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
					{translations["color"] || "Color"}
				</h6>
				<div className="category-filter">
					{/* bg-blue-500 */}
					{colors?.map((color, i) => (
						<div className="input-grp mt-3" key={i}>
							<label
								className="flex items-center gap-2 text-base text-slate-700 cursor-pointer"
								htmlFor={`clr-${i}`}
							>
								<input
									type="checkbox"
									id={`clr-${i}`}
									checked={selectedColors.includes(`${color.name}`)}
									name={color.name}
									value={color.code}
									onChange={handleChange}
								/>
								<span
									className={`inline-block w-3 h-3 rounded-full`}
									style={{ background: color.code }}
								></span>
								<span className="pt-1 capitalize">{color.name}</span>
							</label>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default ColorFilter;
