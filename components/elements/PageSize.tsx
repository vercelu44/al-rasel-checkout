"use client";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";

const PageSize = () => {
	const { handleSelectChange } = useSelectURLQuery();
	return (
		<>
			<div className="flex items-center gap-x-4 gap-y-4 capitalize">
				<div className="sort-by">
					<span className="">showing:</span>
				</div>
				<div className="sort-by-dropdown-wrap">
					<select
						className="w-20 text-base text-slate-900 bg-white border border-slate-300 px-3 py-1 focus:outline-0"
						onChange={(e) => handleSelectChange("per_page", e.target.value)}
						defaultValue={"30"}
						// defaultValue={getCurrentValue("per_page") || 30}
					>
						<option value="20">20</option>
						<option value="30">30</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>
				</div>
				<p className="whitespace-nowrap">per page</p>
			</div>
		</>
	);
};

export default PageSize;
