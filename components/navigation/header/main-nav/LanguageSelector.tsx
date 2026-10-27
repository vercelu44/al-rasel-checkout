"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link, usePathname } from "@/navigation";
import { useParams } from "next/navigation";
import UnitedKingdomFlag from "@/components/elements/svg/UnitedKingdomFlag";
import BangladeshiFlag from "@/components/elements/svg/BangladeshiFlag";

const languages = [
	{
		code: "en",
		name: "EN",
		fullName: "English",
	},
	{
		code: "bn",
		name: "BN",
		fullName: "বাংলা",
	},
];

const LanguageSelector = ({ isFullName }: { isFullName?: boolean }) => {
	const { locale } = useParams<{ locale: string }>();
	// const [selectedLanguage, setSelectedLanguage] = useState(locale); // Default language
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility state
	const dropdownRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	const handleLanguageChange = (language: string) => {
		// setSelectedLanguage(language);
		setIsDropdownOpen(false); // Close the dropdown after selecting a language
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				className="inline-flex items-center justify-center gap-1 font-title rounded-md text-sm font-medium"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{locale === "en" ? (
					<span className="flex justify-center items-center">
						<UnitedKingdomFlag />{" "}
						<p className={`ml-2  !font-normal`}>
							{isFullName ? "English" : "EN"}
						</p>
					</span>
				) : (
					<span className="flex justify-center items-center">
						<BangladeshiFlag />{" "}
						<p className={`ml-2  !font-normal`}>
							{isFullName ? "বাংলা" : "BN"}
						</p>
					</span>
				)}

				<FiChevronDown />
			</button>
			{isDropdownOpen && (
				<div className="absolute w-full z-10 top-full bg-white rounded shadow-lg divide-y divide-gray-200 text-black">
					{languages.map((lang) => (
						<div key={lang.code} className="text-center">
							<Link
								href={pathname}
								onClick={() => handleLanguageChange(lang.code)}
								locale={lang.code}
								className="w-full p-1"
							>
								{isFullName ? lang.fullName : lang.name}
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default LanguageSelector;
