"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const RoundedSearch = ({ placeholder, isSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();
	let pathname = usePathname();
	const searchParams = useSearchParams();

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const handleSearch = () => {
		router.push(pathname + "?" + createQueryString("text", searchTerm));
	};

	const handleInput = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSearch();
		}
	};

	// Handling focus
	const searchRef = useRef(null);
	useEffect(() => {
		isSearch && searchRef.current.focus();
	}, [isSearch]);

	return (
		<div className="relative w-full">
			<FiSearch
				size={24}
				className="absolute top-1/2 ltr:left-4 rtl:right-4 -translate-y-1/2 text-slate-900"
			/>

			<input
				ref={searchRef}
				type="text"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={handleInput}
				placeholder={placeholder}
				className="h-[3rem] ltr:!pl-11 rtl:!pr-11 w-full border border-[#E2E8F0] bg-slate-100 lg:bg-white focus:bg-white focus:border-primary focus:outline-none rounded-full"
			/>
		</div>
	);
};

RoundedSearch.displayName = "RoundedSearch";

export default RoundedSearch;
