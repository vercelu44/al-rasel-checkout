// import Image from "next/image";
import React from "react";

export default function loading({ ...props }) {
	return (
		<div className="flex h-[70vh] w-screen justify-center items-center">
			{/* 			<Image
				className={`h-[200px] lg:h-[300px] w-[200px] lg:w-[300px]`}
				src={"/assets/images/logo.svg"}
				alt={"loader"}
				width={226}
				height={226}
			/> */}
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
	);
}