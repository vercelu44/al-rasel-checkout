
"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import * as pixel from "/lib/fpixel";
import { useDispatch, useSelector } from "react-redux";
import { setFbPixelInitialized } from "@/store/slices/commonSlice";
import { generateUniqueId } from "@/utils/get-unique";
import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
import { Cookies } from "@/utils/cookies";

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
      pixel.pageview({ eventID });
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




// "use client";
// import { usePathname } from "next/navigation";
// import Script from "next/script";
// import { useEffect, useMemo, useRef, useState } from "react";
// import * as pixel from "/lib/fpixel";
// import { useDispatch, useSelector } from "react-redux";
// import { setFbPixelInitialized } from "@/store/slices/commonSlice";
// import { generateUniqueId } from "@/utils/get-unique";
// import { useAddToTrackingMutation } from "@/store/api/serverSideTrackingAPI";
// import { Cookies } from "@/utils/cookies";

// // _fbc cookie না থাকলে (প্রথম landing বা pixel block) URL-এর fbclid থেকে fbc বানাও
// const getFbc = () => {
//   const fbc = Cookies.get("_fbc");
//   if (fbc) return fbc;
//   const fbclid = new URLSearchParams(window.location.search).get("fbclid");
//   return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
// };

// // Visitor-এর আসল IP (IPv6 থাকলে IPv6), ২ সেকেন্ড timeout সহ
// const getClientIp = async () => {
//   try {
//     const cached = sessionStorage.getItem("client_ip");
//     if (cached) return cached;
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), 2000);
//     const res = await fetch("https://api64.ipify.org?format=json", {
//       signal: controller.signal,
//     });
//     clearTimeout(timer);
//     const { ip } = await res.json();
//     if (ip) sessionStorage.setItem("client_ip", ip);
//     return ip;
//   } catch {
//     return undefined;
//   }
// };

// const FacebookPixel = ({ fbPixelId }) => {
//   const { isFbPixelInitialized, settings } = useSelector(
//     (state) => state.common
//   );
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const [isPageLoaded, setIsPageLoaded] = useState(false);
//   const [pixelTimedOut, setPixelTimedOut] = useState(false);

//   const memoizedPixelId = useMemo(() => fbPixelId, [fbPixelId]);

//   const [AddToConversionAPI] = useAddToTrackingMutation();

//   useEffect(() => {
//     const handlePageLoad = () => setIsPageLoaded(true);
//     if (document.readyState === "complete") {
//       handlePageLoad();
//     } else {
//       window.addEventListener("load", handlePageLoad);
//     }
//     return () => window.removeEventListener("load", handlePageLoad);
//   }, []);

//   // Pixel block বা আটকে গেলে ৩ সেকেন্ড পর server event তবুও যাবে
//   useEffect(() => {
//     if (!isPageLoaded || isFbPixelInitialized) return;
//     const timer = setTimeout(() => setPixelTimedOut(true), 3000);
//     return () => clearTimeout(timer);
//   }, [isPageLoaded, isFbPixelInitialized]);

//   const flag = useRef(true);
//   const lastTrackedPath = useRef(null);

//   useEffect(() => {
//     if (!isPageLoaded || !memoizedPixelId) return;
//     // Pixel load হওয়া পর্যন্ত (বা block/timeout পর্যন্ত) অপেক্ষা — খালি fbc/fbp এড়াতে
//     if (!isFbPixelInitialized && !pixelTimedOut) return;
//     // একই path-এ server event দুইবার যাবে না
//     if (lastTrackedPath.current === pathname) return;
//     lastTrackedPath.current = pathname;

//     const eventID = generateUniqueId();

//     if (isFbPixelInitialized && flag.current) {
//       pixel.pageview({ eventID });
//       flag.current = false;
//     }

//     if (settings?.fb_pixel_id && settings?.fb_access_token) {
//       getClientIp().then((clientIp) => {
//         AddToConversionAPI({
//           event_id: eventID,
//           event_name: "PageView",
//           url: window.location.href, // fbclid সহ পুরো URL
//           fbp: Cookies.get("_fbp"),
//           fbc: getFbc(),
//           client_ip_address: clientIp,
//         });
//       });
//     }
//   }, [
//     isPageLoaded,
//     pathname,
//     isFbPixelInitialized,
//     pixelTimedOut,
//     memoizedPixelId,
//     settings,
//     AddToConversionAPI,
//   ]);

//   return (
//     <div>
//       {memoizedPixelId && (
//         <Script
//           id="fb-pixel"
//           src="/scripts/pixel.js"
//           strategy="afterInteractive"
//           onLoad={() => dispatch(setFbPixelInitialized(true))}
//           onError={() => setPixelTimedOut(true)} // block হলে সাথে সাথে server event
//           data-pixel-id={memoizedPixelId}
//         />
//       )}
//     </div>
//   );
// };

// export default FacebookPixel;





