"use client";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "@/components/elements/Modal";
import {
	EmailShareButton,
	FacebookShareButton,
	LinkedinShareButton,
	PinterestShareButton,
	TwitterShareButton,
	// WhatsappShareButton,
} from "react-share";
import { HiShare } from "react-icons/hi2";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "react-toastify";

export default function SocialShare({ translations = {} }) {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [currentUrl, setCurrentUrl] = useState("");
	const [isActive, setIsActive] = useState(false);
	const socialShareRef = useRef(null);

	useEffect(() => {
		// Get the current page URL and update the state
		setCurrentUrl(window.location.href);

		// Add event listener to handle outside click
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			// Remove the event listener when the component unmounts
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (
			socialShareRef.current &&
			!socialShareRef.current.contains(event.target)
		) {
			// Click is outside the popover, so close it
			setIsActive(false);
		}
	};

	const pageContent = (
		<>
			<h3 className="md:hidden text-center mb-5 mt-2 font-bold text-[18px]">
				{translations["share"] || "Share"}
			</h3>
			<div
				className={`content-area ${
					isMobile && "grid grid-cols-4"
				} justify-start w-full md:w-[196px] px-3 lg:px-4 text-slate-500`}
			>
				<FacebookShareButton
					url={currentUrl}
					className="flex items-center flex-col md:flex-row gap-3 my-3 hover:bg-amber-50"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.2137 13.3282L17.8356 9.23302H13.9452V6.5767C13.9452 5.45607 14.4877 4.36311 16.2301 4.36311H18V0.876705C18 0.876705 16.3945 0.600006 14.8603 0.600006C11.6548 0.600006 9.56164 2.5618 9.56164 6.11185V9.23302H6V13.3282H9.56164V23.2285C10.2767 23.3419 11.0082 23.4 11.7534 23.4C12.4986 23.4 13.2301 23.3419 13.9452 23.2285V13.3282H17.2137Z"
							fill="#1877F2"
						/>
					</svg>
					<span>{translations["facebook"] || "Facebook"}</span>
				</FacebookShareButton>
				<TwitterShareButton
					url={currentUrl}
					className="flex flex-col md:flex-row items-center gap-3 my-3 hover:bg-amber-50"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M21.0571 7.18075C21.0664 7.39195 21.0664 7.59355 21.0664 7.80475C21.0756 14.208 16.3712 21.6 7.76793 21.6C5.23048 21.6 2.73933 20.8416 0.600098 19.4208C0.970528 19.4688 1.34096 19.488 1.71139 19.488C3.81358 19.488 5.86021 18.7584 7.51789 17.4048C5.51756 17.3664 3.75802 16.0128 3.14681 14.0352C3.85063 14.1792 4.57296 14.1504 5.25826 13.9488C3.08198 13.5072 1.51691 11.52 1.50765 9.20635C1.50765 9.18715 1.50765 9.16795 1.50765 9.14875C2.15591 9.52316 2.88751 9.73436 3.62837 9.75356C1.58174 8.33275 0.942746 5.50074 2.18369 3.28314C4.5637 6.31675 8.06427 8.15035 11.8241 8.35195C11.4445 6.67195 11.9631 4.90554 13.1762 3.71514C15.0561 1.88153 18.0196 1.97753 19.7977 3.92634C20.8441 3.71514 21.8535 3.31194 22.7704 2.74553C22.4185 3.86874 21.6869 4.81914 20.7145 5.42394C21.6406 5.30874 22.5481 5.04954 23.4001 4.66554C22.7704 5.64474 21.9739 6.48955 21.0571 7.18075Z"
							fill="#1D9BF0"
						/>
					</svg>

					<span>{translations["twitter"] || "টুইটার"}</span>
				</TwitterShareButton>
				<EmailShareButton
					url={currentUrl}
					className="flex items-center flex-col md:flex-row gap-3 my-3 hover:bg-amber-50"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_3550_38775)">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M23.52 12.2727C23.52 11.4218 23.4436 10.6036 23.3018 9.81819H12V14.46H18.4582C18.18 15.96 17.3345 17.2309 16.0636 18.0818V21.0927H19.9418C22.2109 19.0036 23.52 15.9273 23.52 12.2727Z"
								fill="#4285F4"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 24C15.24 24 17.9564 22.9254 19.9418 21.0927L16.0636 18.0818C14.9891 18.8018 13.6145 19.2273 12 19.2273C8.87455 19.2273 6.22909 17.1163 5.28546 14.28H1.27637V17.3891C3.25091 21.3109 7.30909 24 12 24Z"
								fill="#34A853"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M5.28545 14.28C5.04545 13.56 4.90909 12.7909 4.90909 12C4.90909 11.2091 5.04545 10.44 5.28545 9.72001V6.61092H1.27636C0.463636 8.23092 0 10.0636 0 12C0 13.9364 0.463636 15.7691 1.27636 17.3891L5.28545 14.28Z"
								fill="#FBBC05"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 4.77273C13.7618 4.77273 15.3436 5.37818 16.5873 6.56727L20.0291 3.12545C17.9509 1.18909 15.2345 0 12 0C7.30909 0 3.25091 2.68909 1.27637 6.61091L5.28546 9.72C6.22909 6.88364 8.87455 4.77273 12 4.77273Z"
								fill="#EA4335"
							/>
						</g>
						<defs>
							<clipPath id="clip0_3550_38775">
								<rect width="24" height="24" fill="white" />
							</clipPath>
						</defs>
					</svg>

					<span>{translations["google"] || "Google"}</span>
				</EmailShareButton>
				<LinkedinShareButton
					url={currentUrl}
					className="flex flex-col md:flex-row items-center gap-3 my-3 hover:bg-amber-50"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_3550_28402)">
							<path
								d="M22.2283 0H1.77167C1.30179 0 0.851161 0.186657 0.518909 0.518909C0.186657 0.851161 0 1.30179 0 1.77167V22.2283C0 22.6982 0.186657 23.1488 0.518909 23.4811C0.851161 23.8133 1.30179 24 1.77167 24H22.2283C22.6982 24 23.1488 23.8133 23.4811 23.4811C23.8133 23.1488 24 22.6982 24 22.2283V1.77167C24 1.30179 23.8133 0.851161 23.4811 0.518909C23.1488 0.186657 22.6982 0 22.2283 0ZM7.15333 20.445H3.545V8.98333H7.15333V20.445ZM5.34667 7.395C4.93736 7.3927 4.53792 7.2692 4.19873 7.04009C3.85955 6.81098 3.59584 6.48653 3.44088 6.10769C3.28591 5.72885 3.24665 5.31259 3.32803 4.91145C3.40941 4.51032 3.6078 4.14228 3.89816 3.85378C4.18851 3.56529 4.55782 3.36927 4.95947 3.29046C5.36112 3.21165 5.77711 3.25359 6.15495 3.41099C6.53279 3.56838 6.85554 3.83417 7.08247 4.17481C7.30939 4.51546 7.43032 4.91569 7.43 5.325C7.43386 5.59903 7.38251 5.87104 7.27901 6.1248C7.17551 6.37857 7.02198 6.6089 6.82757 6.80207C6.63316 6.99523 6.40185 7.14728 6.14742 7.24915C5.893 7.35102 5.62067 7.40062 5.34667 7.395ZM20.4533 20.455H16.8467V14.1933C16.8467 12.3467 16.0617 11.7767 15.0483 11.7767C13.9783 11.7767 12.9283 12.5833 12.9283 14.24V20.455H9.32V8.99167H12.79V10.58H12.8367C13.185 9.875 14.405 8.67 16.2667 8.67C18.28 8.67 20.455 9.865 20.455 13.365L20.4533 20.455Z"
								fill="#0A66C2"
							/>
						</g>
						<defs>
							<clipPath id="clip0_3550_28402">
								<rect width="24" height="24" fill="white" />
							</clipPath>
						</defs>
					</svg>

					<span>LinkedIn</span>
				</LinkedinShareButton>
				<PinterestShareButton
					url={currentUrl}
					className="flex flex-col md:flex-row items-center gap-3 my-3 hover:bg-amber-50"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_3550_17351)">
							<path
								d="M11.9951 0C5.36076 0 0 5.37062 0 11.9951C0 17.0794 3.15919 21.4233 7.62156 23.1707C7.51296 22.2229 7.42411 20.7618 7.66104 19.7252C7.87824 18.7873 9.06293 13.7622 9.06293 13.7622C9.06293 13.7622 8.70754 13.0416 8.70754 11.9852C8.70754 10.3167 9.67502 9.07281 10.8795 9.07281C11.9062 9.07281 12.3998 9.84286 12.3998 10.761C12.3998 11.7877 11.7482 13.3278 11.4027 14.7594C11.1164 15.9539 12.0049 16.9313 13.1798 16.9313C15.3122 16.9313 16.9511 14.6804 16.9511 11.4422C16.9511 8.56932 14.8877 6.5652 11.9358 6.5652C8.51995 6.5652 6.51583 9.12216 6.51583 11.768C6.51583 12.7947 6.91073 13.9004 7.40436 14.5027C7.5031 14.6211 7.51296 14.7297 7.48334 14.8482C7.3945 15.2234 7.18716 16.0428 7.14768 16.2106C7.09831 16.4278 6.96996 16.4772 6.7429 16.3686C5.26202 15.6577 4.33402 13.4661 4.33402 11.7088C4.33402 7.92761 7.07856 4.45248 12.2616 4.45248C16.4179 4.45248 19.6561 7.41422 19.6561 11.383C19.6561 15.5195 17.0498 18.8466 13.4364 18.8466C12.2221 18.8466 11.0769 18.2147 10.6919 17.4644C10.6919 17.4644 10.0897 19.7548 9.94159 20.3176C9.67502 21.3641 8.94446 22.6672 8.45083 23.4669C9.57631 23.8124 10.761 24 12.0049 24C18.6294 24 24 18.6294 24 12.0049C23.9901 5.37062 18.6195 0 11.9951 0Z"
								fill="#BD081C"
							/>
						</g>
						<defs>
							<clipPath id="clip0_3550_17351">
								<rect width="24" height="24" fill="white" />
							</clipPath>
						</defs>
					</svg>
					<span>{translations["pinterest"] || "Pinterest"}</span>
				</PinterestShareButton>
			</div>
			<div className="text-center text-secondary-800  border-t border-slate-200 pt-4">
				<CopyToClipboard
					text={currentUrl}
					onCopy={() => toast.success("copied")}
				>
					<button className="active:scale-90">
						<svg
							width="21"
							height="20"
							viewBox="0 0 21 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M15.8125 10.6158L9.40169 17.0267C8.69842 17.7299 7.74459 18.125 6.75002 18.125C5.75546 18.125 4.80162 17.7299 4.09836 17.0267C3.39509 16.3234 3 15.3696 3 14.375C3 13.3804 3.39509 12.4266 4.09836 11.7233L13.215 2.60666C13.4472 2.37455 13.7229 2.19045 14.0263 2.06488C14.3296 1.9393 14.6548 1.87471 14.9831 1.87479C15.3114 1.87486 15.6365 1.93961 15.9399 2.06533C16.2432 2.19105 16.5187 2.37528 16.7509 2.6075C16.983 2.83972 17.1671 3.11538 17.2926 3.41875C17.4182 3.72212 17.4828 4.04725 17.4827 4.37559C17.4827 4.70392 17.4179 5.02902 17.2922 5.33233C17.1665 5.63564 16.9822 5.91122 16.75 6.14333L7.62669 15.2667C7.39001 15.4936 7.07366 15.6176 6.74581 15.6134C6.41797 15.6092 6.10488 15.4764 5.87402 15.2436C5.64317 15.0108 5.51303 14.6966 5.51166 14.3687C5.51029 14.0409 5.63779 13.7256 5.86669 13.4908L12.375 6.9825M7.63419 15.2583L7.62586 15.2667"
								stroke="#00B7C9"
								stroke-width="1.5"
								stroke-linecap="round"
								strokeLinejoin="round"
							/>
						</svg>{" "}
						{translations["copy-link"] || "Copy Link"}
					</button>
				</CopyToClipboard>
			</div>
		</>
	);

	return (
		<div className="relative ltr:border-l rtl:border-r ltr:pl-3 rtl:pr-3 border-slate-300 leading-4">
			{!isActive ? (
				<button type="button" onClick={() => setIsActive(true)}>
					<HiShare size={20} />{" "}
					<span className="hover:text-primary">
						{translations["share"] || "Share"}
					</span>
				</button>
			) : (
				<p>
					<HiShare size={20} />{" "}
					<span className="text-primary">
						{translations["share"] || "Share"}
					</span>
				</p>
			)}

			{isActive && isMobile && (
				<Modal showModal={isActive} bodyOnly={true} setShowModal={setIsActive}>
					{pageContent}
				</Modal>
			)}
			{isActive && !isMobile && (
				<div className="absolute left-0 top-[40px] z-10" ref={socialShareRef}>
					<div className="relative bg-white py-3 lg:py-6 border border-slate-200 rounded-xl">
						<div className="absolute top-0 left-8 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-5 h-5 bg-white border-l border-t border-slate-200"></div>
						{pageContent}
					</div>
				</div>
			)}
		</div>
	);
}
