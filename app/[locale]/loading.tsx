import React from "react";
// import Image from "next/image";
// import loading from "@/public/assets/images/loading.gif";

export default function Loading({ ...props }) {
	return (
		<>
			{/* <div className="flex h-screen w-screen justify-center items-center -mt-16">
			<Image
				className={`h-[100px] md:h-[200px] w-[100px] md:w-[200px]`}
				src={"https://akaarserver.xyz/loading.gif" || loading}
				alt={"loader"}
				width={200}
				height={200}
			/>
		</div> */}
			<div className="flex h-[70vh] w-full justify-center items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={200}
					height={200}
					preserveAspectRatio="xMidYMid"
					style={{
						shapeRendering: "auto",
						display: "block",
						background: "#fff",
					}}
					viewBox="0 0 100 100"
					{...props}
				>
					<path fill="#847c7c" d="M21 50a29 29 0 0 0 58 0 29 30 0 0 1-58 0">
						<animateTransform
							attributeName="transform"
							dur="1s"
							keyTimes="0;1"
							repeatCount="indefinite"
							type="rotate"
							values="0 50 50.5;360 50 50.5"
						/>
					</path>
				</svg>
			</div>
		</>
	);
}
