"use client";
import React, { useEffect, useRef, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { cn } from "@/utils";
// import useLockedBody from "@/hooks/useLockedBody";

export default function DropdownSelect({
	title,
	options = [],
	children,
	className,
	onSelectChange = () => {},
}) {
	const dropdownRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(options[0]);
	// useLockedBody(isOpen, "root"); // Activate to lock body scroll

	const handle = () => {
		setIsOpen(!isOpen);
	};

	const handleSelectChange = (option) => {
		setSelectedOption(option);
		onSelectChange(option);
		setIsOpen(!isOpen);
	};

	//useRef issue need to fix
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef} className={cn(`w-full relative`)}>
			<div
				onClick={() => handle()}
				className={cn(
					`w-full flex gap-2 items-center cursor-pointer text-base text-slate-900 bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-0`,
					isOpen ? "border-primary rounded-b-none border-b-0" : "",
					className
				)}
			>
				{children}
				<h2 className={`text-base font-normal line-clamp-1`}>
					{selectedOption ? selectedOption.value : title}
				</h2>
				<div className="ml-auto">
					{isOpen ? <BsChevronUp /> : <BsChevronDown />}
				</div>
			</div>
			{isOpen && (
				<ul className="w-full absolute top-full left-0 bg-white border border-primary border-t-0 rounded-b-lg py-2 focus:outline-0 z-30">
					{options.map((option, index) => (
						<li
							key={index}
							className={`px-4 py-3 text-base hover:bg-amber-200 ${
								selectedOption?.key === option.key
									? "text-slate-900"
									: "text-slate-500"
							}`}
							onClick={() => handleSelectChange(option)}
						>
							{option.value}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
