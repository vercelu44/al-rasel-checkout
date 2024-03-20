"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import React from "react";

const DynamicBackgroundComponent = ({
  imageUrl,
  children,
  heading,
  height,
  mobileHeight,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerStyle = {
    background: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    // Add any other styles you want for the container
    width: "100%",
    height: isMobile ? mobileHeight : height, // Adjust the height as needed
  };

  return (
    <div className="" style={containerStyle}>
      {children}
    </div>
  );
};

export default DynamicBackgroundComponent;
