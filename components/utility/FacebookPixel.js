"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import * as pixel from "/lib/fpixel";
import { useDispatch, useSelector } from "react-redux";
import { setFbPixelInitialized } from "@/store/slices/commonSlice";
import { generateUniqueId } from "@/utils/get-unique";
import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
import { Cookies } from "./cookies";

const FacebookPixel = ({ fbPixelId }) => {
  const { isFbPixelInitialized, settings } = useSelector(
    (state) => state.common
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const memoizedPixelId = useMemo(() => fbPixelId, [fbPixelId]);

  const [AddToConversionAPI] = useAddToTrackingMutation();

  // Wait for page load before starting pixel tracking
  useEffect(() => {
    const handlePageLoad = () => {
      setIsPageLoaded(true);
    };

    // Check if the page is already loaded or attach the load event
    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  const flag = useRef(true);
  const flag2 = useRef(true);

  // Meta Pixel events
  useEffect(() => {
    if (!isPageLoaded || !memoizedPixelId) return;

    const eventID = generateUniqueId();

    if (isFbPixelInitialized && flag.current) {
      pixel.pageView({ eventID });
      flag.current = false;
    }

    if (settings?.fb_pixel_id && settings?.fb_access_token) {
      AddToConversionAPI({
        event_id: eventID,
        event_name: "PageView",
        url: process.env.NEXT_PUBLIC_BASE_URL + pathname,
        fbp: Cookies.get("_fbp"), // Get Facebook Pixel cookie,
        fbc: Cookies.get("_fbc"), // Get Facebook Click ID cookie
      });
      flag2.current = false;
    }
  }, [
    isPageLoaded,
    pathname,
    isFbPixelInitialized,
    memoizedPixelId,
    settings,
    AddToConversionAPI,
  ]);

  return (
    <div>
      {memoizedPixelId && (
        <Script
          id="fb-pixel"
          src="/scripts/pixel.js"
          strategy="afterInteractive"
          onLoad={() => dispatch(setFbPixelInitialized(true))}
          data-pixel-id={memoizedPixelId}
        />
      )}
    </div>
  );
};

export default FacebookPixel;
