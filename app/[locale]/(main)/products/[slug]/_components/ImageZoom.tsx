"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import "./ImageZoom.css";

import type { StaticImageData } from "next/image";

interface ImageZoomProps {
  image: string | StaticImageData;
  /** Large image shown in the zoom pane */
  zoomImage: string | StaticImageData;
  productTitle?: string;
  isSquareImage?: boolean;
}

const ZoomExample = ({ image, zoomImage, productTitle, isSquareImage }: ImageZoomProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCursorOverImage, setIsCursorOverImage] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const imageWidth = isSquareImage ? 700 : 550; // Example width
    const imageHeight = 700; // Example height

    const isXWithinBounds = mouseX > 0 && mouseX < imageWidth;
    const isYWithinBounds = mouseY > 0 && mouseY < imageHeight;

    if (isXWithinBounds && isYWithinBounds) {
      setCursorPosition({ x: mouseX, y: mouseY });
      setIsCursorOverImage(true);
    } else {
      setIsCursorOverImage(false);
    }
  };
  const imgRef = useRef<HTMLImageElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const inlineContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // drift-zoom touches `window`, so it is loaded only in the browser.
    // (ESM dynamic import instead of `require` so it works with Turbopack.)
    let cancelled = false;
    import("drift-zoom").then((mod) => {
      if (cancelled || !imgRef.current) return;
      // `|| mod` keeps the old fallback for builds where the module has no default export
      const Drift = mod.default || (mod as unknown as typeof mod.default);
      new Drift(imgRef.current, {
        paneContainer: paneRef.current,
        inlineContainer: inlineContainerRef.current,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div
      className=" !h-full hover:!h-auto active:!h-auto"
      onMouseMove={handleMouseMove}
    >
      <Image
        className="demo-trigger zoom-image__img !h-[100%] !w-[100%] !object-cover !object-top"
        ref={imgRef}
        data-zoom={zoomImage}
        src={image}
        alt={productTitle|| "Not Found"}
        width={700}
        height={700}
      />
      <div ref={inlineContainerRef} />
      <div ref={paneRef} />
      <div
        className={isCursorOverImage ? "zoom-square" : ""}
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      ></div>
    </div>
  );
};

export default ZoomExample;
