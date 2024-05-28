"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState, useMemo } from "react";
import * as pixel from "/lib/fpixel";
import { useDispatch, useSelector } from "react-redux";
import { setFbPixelInitialized } from "@/store/slices/commonSlice";

const FacebookPixel = ({ fbPixelId }) => {
	const { isFbPixelInitialized } = useSelector((state) => state.common);
	// console.log(isFbPixelInitialized);
	// const [loaded, setLoaded] = useState(false);
	const pathname = usePathname();
	const dispatch = useDispatch();

	const memoizedPixelId = useMemo(() => fbPixelId, [fbPixelId]);
	// console.log(memoizedPixelId);

	useEffect(() => {
		if (!isFbPixelInitialized || !memoizedPixelId) return;
		// console.log("first");
		pixel.pageview();
	}, [pathname, isFbPixelInitialized, memoizedPixelId]);

	return (
		<div>
			{memoizedPixelId && (
				<Script
					id="fb-pixel"
					src="/scripts/pixel.js"
					strategy="afterInteractive"
					onLoad={() => dispatch(setFbPixelInitialized(true))}
					data-pixel-id={memoizedPixelId}
					// data-pixel-id={pixel.FB_PIXEL_ID}
				/>
			)}
		</div>
	);
};

export default FacebookPixel;
