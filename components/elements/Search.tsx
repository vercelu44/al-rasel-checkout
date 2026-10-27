import {
	useGetPopularSearchQuery,
	useGetSearchHistoriesQuery,
	useLazyGetSearchSuggestionsQuery,
	useRemoveSearchHistoryMutation,
} from "@/store/api/searchAPI";
import { getSlicedText } from "@/utils/format-text";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";

const Search = () => {
	const [showSuggestionResults, setShowSuggestionResults] = useState(false);
	const { user } = useAppSelector((state) => state.auth);
	const [searchTerm, setSearchTerm] = useState("");

	const { data: popularSearch } = useGetPopularSearchQuery(null, {
		skip: !showSuggestionResults,
	});
	let popular = popularSearch?.data || [];

	const { data: userSearch } = useGetSearchHistoriesQuery(user?.id, {
		skip: !user || !showSuggestionResults,
	});
	let searchHistory = userSearch?.data || [];

	if (searchHistory?.length && searchTerm) {
		searchHistory = searchHistory.filter((keyword) =>
			keyword.search_name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	if (popular?.length && searchTerm) {
		popular = popular.filter((keyword) =>
			keyword.search_name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	const [removeHistory] = useRemoveSearchHistoryMutation();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const pathArray = pathname.split("/");
		if (pathArray[pathArray.length - 1] !== "products") {
			setSearchTerm("");
		}
	}, [pathname]);

	const handleSearch = (text: string) => {
		// if (user) {
		// 	router.push(`/products?text=${text}&reference_id=${user.id}`);
		// 	return;
		// }
		router.push(`/products?text=${text}`);
	};

	const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSearch(searchTerm);
		}
	};

	let blurTimeout: ReturnType<typeof setTimeout>;

	const handleSuggestionsSelect = (suggestion: string) => {
		setSearchTerm(suggestion);
		handleSearch(suggestion);
	};

	const handleBlur = () => {
		blurTimeout = setTimeout(() => {
			setShowSuggestionResults(false);
		}, 200);
	};

	const handleFocus = () => {
		clearTimeout(blurTimeout);
		setShowSuggestionResults(true);
	};

	const handleDeleteHistoryItem = async (itemId: number) => {
		try {
			await removeHistory({ historyId: itemId, userId: user.id });
			toast.success("Search history removed!");
		} catch (error) {
			toast.error("Failed to remove search history");
			console.log(error);
		}
	};

	const debouncedSearchText = useDebounce(searchTerm, 300);
	const [trigger, { data }] = useLazyGetSearchSuggestionsQuery();
	const searchSuggestions = data?.data || [];

	useEffect(() => {
		if (debouncedSearchText) {
			trigger(debouncedSearchText);
		}
	}, [debouncedSearchText, trigger]);

	return (
		<div className="nav-search relative">
			<div className="rounded-full group">
				<input
					value={searchTerm}
					onKeyDown={handleInput}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					type="text"
					placeholder={"Search"}
					className="search-input"
				/>

				<button
					type="submit"
					aria-label="Search"
					onClick={() => handleSearch(searchTerm)}
					className="search-btn"
				>
					<HiMagnifyingGlass size={20} />
				</button>
			</div>
			{showSuggestionResults &&
			(searchHistory?.length ||
				popular?.length ||
				searchSuggestions?.length) ? (
				<div className="z-20 absolute font-title text-slate-600 mt-2 py-2 w-full overflow-hidden rounded-md bg-white">
					{searchHistory?.length &&
					(!searchSuggestions?.length || !searchTerm) ? (
						<div className="mx-2 mb-4">
							<h3 className="mb-2 mx-2">Recently Searched</h3>
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
							<h3 className="mb-2 mx-2">Popular Keywords</h3>
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
											alt={suggestion.text || "Not Found"}
											width={20}
											height={20}
											className="h-5 w-5 rounded-sm object-cover"
										/>
									) : (
										<FiSearch />
									)}
									<p className="text-sm font-medium">
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
