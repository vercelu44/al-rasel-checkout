"use client";
import { Cookies } from "@/utils/cookies";
import { GoogleTagManager, sendGTMEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { generateUniqueId } from "./get-unique";
export function GTM({ gtmId }) {
  const eventID = generateUniqueId();
  const pathname = usePathname();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // -------------------  PAGE LOAD -------------------
  useEffect(() => {
    const handlePageLoad = () => setIsPageLoaded(true);

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, []);

  const getPayload = () => ({
    event: "page_view",
    event_id: eventID,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    fbp: Cookies.get("_fbp"),
    fbc: Cookies.get("_fbc"),
  });

  // -------------------  GTM -------------------
  useEffect(() => {
    if (!isPageLoaded) return;

    const payload = getPayload();

    sendGTMEvent(payload); // send to GTM client side
  }, [pathname, isPageLoaded]);

  return <GoogleTagManager gtmId={gtmId} />;
}
