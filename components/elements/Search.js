import {
	useGetPopularSearchQuery,
	useGetSearchHistoriesQuery,
	useLazyGetSearchSuggestionsQuery,
	useRemoveSearchHistoryMutation,
} from "@/store/api/searchAPI";
import { toast } from "react-toastify";
import { getSlicedText } from "@/utils/format-text";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

// ** Import Icons
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "@/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";

const Search = () => {
	const [showSuggestionResults, setShowSuggestionResults] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const { user } = useSelector((state) => state.auth);
	const { translations } = useSelector((state) => state.common);

	const { data: popularSearch } = useGetPopularSearchQuery(null, {
		skip: !showSuggestionResults,
	});
	let popular = popularSearch?.data || [];

	const { data: userSearch } = useGetSearchHistoriesQuery(user?.id, {
		skip: !user || !showSuggestionResults,
	});
	let searchHistory = userSearch?.data || [];

	//filtering suggestion based on search
	if (searchHistory?.length && searchTerm) {
		searchHistory = searchHistory.filter((keyword) =>
			keyword.search_name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}
	//filtering suggestion based on search
	if (popular?.length && searchTerm) {
		popular = popular.filter((keyword) =>
			keyword.search_name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	const [removeHistory] = useRemoveSearchHistoryMutation();

	const router = useRouter();
	const pathname = usePathname();

	// Clear search term when route changes
	// useEffect(() => {
	// 	const pathArray = pathname.split("/");
	// 	if (pathArray[pathArray.length - 1] !== "products") {
	// 		setSearchTerm("");
	// 	}
	// }, [pathname]);

	const handleSearch = (text) => {
		setSearchTerm(""); // Clear the search term
		setShowSuggestionResults(false);
		if (user) {
			router.push(`/products?text=${text}&reference_id=${user.id}`);
			return;
		}
		router.push(`/products?text=${text}`);
	};

	const handleInput = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSearch(searchTerm);
		}
	};

	let blurTimeout; // Variable to store the timeout

	const handleSuggestionsSelect = (suggestion) => {
		// console.log(suggestion);
		setSearchTerm(suggestion); // Set the selected suggestion as the search term
		handleSearch(suggestion); // Perform the search
	};

	const handleBlur = () => {
		// Use a timeout to delay hiding the results
		blurTimeout = setTimeout(() => {
			setShowSuggestionResults(false);
		}, 200); // Adjust the delay time as needed
	};

	const handleFocus = () => {
		clearTimeout(blurTimeout); // Clear the timeout if the input is focused again
		setShowSuggestionResults(true);
	};

	const handleDeleteHistoryItem = async (itemId) => {
		try {
			await removeHistory({ historyId: itemId, userId: user.id });
			toast.success("Search history removed!");
		} catch (error) {
			toast.error("Failed to remove search history");
			console.log(error);
		}
	};

	// dynamic search suggestions
	const debouncedSearchText = useDebounce(searchTerm, 300);
	const [trigger, { data }] = useLazyGetSearchSuggestionsQuery();
	const searchSuggestions = data?.data || [];

	useEffect(() => {
		if (debouncedSearchText) {
			trigger(debouncedSearchText);
		}
	}, [debouncedSearchText, trigger]);


	return (
		<div className="nav-search md:relative">
			<div>
				<div className="group">
					<input
						value={searchTerm}
						onKeyDown={handleInput}
						onChange={(e) => setSearchTerm(e.target.value)}
						onFocus={handleFocus}
						onBlur={handleBlur}
						type="text"
						placeholder={translations["search-for-your-desired-product"]}
						className="group-focus-within:border-primary"
					/>

					<button
						onClick={() => handleSearch(searchTerm)}
						className="search-btn group-focus-within:border-primary"
					>
						<HiMagnifyingGlass
							size={24}
							className="text-[#475569] md:text-slate-900 group-focus-within:text-primary"
						/>
					</button>
				</div>
			</div>
			{showSuggestionResults && (searchHistory?.length || popular?.length || searchSuggestions ?.length) ? (
				<div className="z-20 absolute font-title text-slate-600 mt-5 left-0 md:mt-2 py-2 w-full h-screen md:h-auto overflow-hidden rounded-md bg-white">
					{searchHistory?.length && (!searchSuggestions?.length || !searchTerm) ? (
						<div className="mx-2 mb-4">
							<h3 className="mb-2 mx-2">{translations["recently-searched"]}</h3>
							{searchHistory?.slice(0, 5)?.map((keyword) => (
								<div
									key={keyword.id}
									className="cursor-pointer group px-2 py-2 flex gap-4 hover:bg-slate-100 rounded-lg"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M18.3334 10C18.3334 14.6 14.6001 18.3334 10.0001 18.3334C5.40008 18.3334 2.59175 13.7 2.59175 13.7M2.59175 13.7H6.35842M2.59175 13.7V17.8667M1.66675 10C1.66675 5.40002 5.36675 1.66669 10.0001 1.66669C15.5584 1.66669 18.3334 6.30002 18.3334 6.30002M18.3334 6.30002V2.13335M18.3334 6.30002H14.6334"
											stroke="#94A3B8"
											stroke-width="1.5"
											stroke-linecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M10 6V10.5L14 12"
											stroke="#94A3B8"
											stroke-width="1.5"
											stroke-linecap="round"
										/>
									</svg>

									<p
										className="text-sm font-medium"
										onClick={() => handleSuggestionsSelect(keyword.search_name)}
									>
										{getSlicedText(keyword.search_name, 30)}
									</p>
									<div className="flex-1 text-right hidden group-hover:block">
										<span
											onClick={() => handleDeleteHistoryItem(keyword.id)}
											className="text-slate-600 hover:text-primary"
										>
											X
										</span>
									</div>
								</div>
							))}
						</div>
					) : null}
					{popular?.length && (!searchSuggestions?.length || !searchTerm) ? (
						<div className="mx-2">
							<h3 className="mb-2 mx-2">{translations["popular-keywords"]}</h3>
							{popular?.slice(0, 5)?.map((keyword) => (
								<div
									key={keyword.id}
									className="cursor-pointer px-2 py-2 flex gap-4 hover:bg-slate-100 rounded-lg"
									onClick={() => handleSuggestionsSelect(keyword.search_name)}
								>
									<FiSearch />
									<p className="text-sm font-medium">
										{getSlicedText(keyword.search_name, 40)}
									</p>
								</div>
							))}
						</div>
					) : null}
					{searchSuggestions?.length && searchTerm ? (
						<div className="mx-2">
							{searchSuggestions?.map((suggestion, index) => (
								<div
									key={index}
									className="cursor-pointer px-2 py-2 flex gap-4 hover:bg-slate-100 rounded-lg"
									onClick={() => handleSuggestionsSelect(suggestion.text)}
								>
									{suggestion.image ? (
										<Image
											src={suggestion.image}
											alt={suggestion.text}
											width={20}
											height={20}
											className="h-5 w-5 rounded-sm object-cover"
										/>
									) : (
										<FiSearch />
									)}
									<p className="text-sm font-medium">
										{/* <span className="text-slate-400">
											{suggestion.sku}-
										</span> */}
										 {getSlicedText(suggestion.text, 40)}
									</p>
								</div>
							))}
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};

export default Search;
