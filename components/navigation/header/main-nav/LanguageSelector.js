"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link, usePathname } from "@/navigation";

const languages = [
	{
		code: "en",
		name: "English",
	},
	{
		code: "bn",
		name: "Bengali",
	},
	{
		code: "ar",
		name: "Arabic",
	},
];

const LanguageSelector = ({ locale }) => {
	// const [selectedLanguage, setSelectedLanguage] = useState(locale); // Default language
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility state
	const dropdownRef = useRef(null);
	const pathname = usePathname();

	const handleLanguageChange = (language) => {
		// setSelectedLanguage(language);
		setIsDropdownOpen(false); // Close the dropdown after selecting a language
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative inline-flex" ref={dropdownRef}>
			<button
				type="button"
				className="flex h-12 flex-col lg:flex-row items-center justify-center gap-1 font-title bg-transparent box-border px-3.5 lg:px-3 lg:py-2 border border-gray-300 rounded-full lg:rounded-md shadow-sm text-sm font-medium text-slate-700 bg-slate-100 lg:bg-white hover:bg-gray-50"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					className="hidden lg:block"
				>
					<path
						d="M16 3V4.14148H14.3899V13H13.2092C12.9127 12.3676 12.5447 11.8156 12.1051 11.3441C11.6656 10.8617 11.1953 10.4491 10.6944 10.1061L11.0778 9.04502C11.4662 9.28081 11.87 9.60236 12.2892 10.0096C12.7083 10.4169 13.0303 10.8296 13.2552 11.2476C13.245 11.0868 13.2348 10.9368 13.2245 10.7974C13.2245 10.6581 13.2194 10.5134 13.2092 10.3633C13.2092 10.2133 13.2092 10.0525 13.2092 9.88103V4.14148H2V3H16ZM7.91895 11.537C7.2238 11.537 6.55933 11.3655 5.92552 11.0225C5.29171 10.6795 4.69368 10.1007 4.13143 9.28617C3.57941 8.46088 3.06827 7.33012 2.59803 5.89389L3.71742 5.50804C4.08543 6.62272 4.46878 7.53912 4.86747 8.25724C5.27638 8.96463 5.73129 9.48446 6.2322 9.81672C6.73311 10.149 7.30559 10.3151 7.94962 10.3151C8.51187 10.3151 8.96166 10.224 9.29901 10.0418C9.64659 9.84887 9.89704 9.59164 10.0504 9.2701C10.2037 8.93784 10.2804 8.57342 10.2804 8.17685C10.2804 7.5552 10.1168 7.05145 9.7897 6.66559C9.4728 6.27974 9.07411 6.08682 8.59365 6.08682C8.2563 6.08682 8.00073 6.1672 7.82694 6.32797C7.65316 6.47803 7.56626 6.70847 7.56626 7.01929C7.56626 7.09432 7.57649 7.19614 7.59693 7.32476C7.61738 7.45338 7.64805 7.57127 7.68894 7.67846L6.52355 7.91961C6.45199 7.69453 6.39576 7.49089 6.35487 7.30868C6.32421 7.11576 6.30887 6.93355 6.30887 6.76206C6.30887 6.36549 6.4111 6.03323 6.61555 5.76527C6.83023 5.49732 7.10113 5.29904 7.42826 5.17042C7.76561 5.03108 8.11829 4.96142 8.48631 4.96142C9.08945 4.96142 9.61081 5.10611 10.0504 5.3955C10.49 5.67417 10.8324 6.06002 11.0778 6.55305C11.3231 7.04609 11.4458 7.61951 11.4458 8.27331C11.4458 8.85209 11.318 9.39335 11.0624 9.89711C10.8069 10.3901 10.4184 10.7867 9.89704 11.0868C9.37568 11.3869 8.71632 11.537 7.91895 11.537ZM7.42826 5.52412C7.37714 5.18114 7.2238 4.88103 6.96824 4.62379C6.72289 4.35584 6.35998 4.16827 5.87952 4.06109L6.24753 3.33762L6.93757 3.53055C7.52026 3.76635 7.93939 4.0343 8.19496 4.3344C8.45053 4.63451 8.59876 5.01501 8.63965 5.47588L7.42826 5.52412Z"
						fill="#94A3B8"
					/>
					<path
						d="M20.5423 22L19.1944 18.9177H14.7586L13.4263 22H12L16.373 12H17.6426L22 22H20.5423ZM17.5172 14.7894C17.4859 14.715 17.4336 14.5802 17.3605 14.3849C17.2874 14.1897 17.2142 13.9898 17.1411 13.7852C17.0784 13.5714 17.0261 13.4086 16.9843 13.2971C16.9321 13.483 16.8746 13.6736 16.8119 13.8689C16.7597 14.0549 16.7022 14.2269 16.6395 14.3849C16.5873 14.543 16.5402 14.6778 16.4984 14.7894L15.2288 17.802H18.7712L17.5172 14.7894Z"
						fill="#94A3B8"
					/>
				</svg>
				<span className="uppercase leading-6">{locale}</span>
				<FiChevronDown className="hidden lg:block" />
			</button>
			{isDropdownOpen && (
				<ul className="absolute w-fit lg:w-full z-10 right-0 mt-1 lg:left-0 top-full bg-white border border-gray-300 rounded-md shadow-lg divide-y divide-gray-200">
					{languages.map((lang) => (
						<li key={lang.code}>
							<Link
								href={pathname}
								className="icon-btn px-4"
								onClick={() => handleLanguageChange(lang.code)}
								locale={lang.code}
							>
								<span className="">{lang.name}</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default LanguageSelector;
