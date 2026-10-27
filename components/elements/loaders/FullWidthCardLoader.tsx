import React from "react";
import ContentLoader from "react-content-loader";

const FullWidthCardLoader = (props: React.ComponentProps<typeof ContentLoader>) => (
  <ContentLoader
    viewBox="0 0 800 100" // Adjust the viewBox width to 800 (4 items in a row)
    width="100%" // Set the width to 100% to take full width
    height={100} // Double the height to 200
    title="Loading ..."
    {...props}
  >
    <rect x="0" y="9.93" rx="5" ry="5" width="180" height="86.59" />
    <rect x="220" y="9.67" rx="0" ry="0" width="578" height="12.12" />
    <rect x="220" y="25.67" rx="0" ry="0" width="420" height="9" />
  </ContentLoader>
);

export default FullWidthCardLoader;
