import React from "react";
import ContentLoader from "react-content-loader";

interface ItemsListLoaderProps extends React.ComponentProps<typeof ContentLoader> {
  viewBoxWidth?: number;
  imageWidth?: number;
  itemHeight?: number;
  numItems?: number;
  /** Hide the image placeholder on the left */
  noImage?: boolean;
}

const ItemsListLoader = ({
  viewBoxWidth: propViewBoxWidth,
  imageWidth: propImageWidth,
  itemHeight: propItemHeight,
  numItems: propNumItems,
  noImage: propNoImage,
  ...props
}: ItemsListLoaderProps) => {
  const defaultViewBoxWidth = 800;
  const defaultFirstRectWidth = 180;
  const defaultItemHeight = 80;
  const defaultNumItems = 4;
  const lineHeight = (propItemHeight || defaultItemHeight) / 8;
  const gap = lineHeight * 3;

  const viewBoxWidth = propViewBoxWidth || defaultViewBoxWidth;
  const firstRectWidth = propImageWidth || defaultFirstRectWidth;
  const firstRectHeight = propItemHeight || defaultItemHeight;
  const numItems = propNumItems || defaultNumItems;

  const viewBoxHeight = numItems * (firstRectHeight + gap) - gap;

  return (
    <ContentLoader
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height={viewBoxHeight}
      title="Loading ..."
      {...props}
    >
      {[...Array(numItems)].map((_, index) => {
        const yPos = index * (firstRectHeight + gap);
        const smallRectHeight = (firstRectHeight - gap) / 3;
        return (
          <React.Fragment key={index}>
            <rect
              x="0"
              y={yPos}
              rx="5"
              ry="5"
              width={propNoImage ? 0 : firstRectWidth}
              height={firstRectHeight}
            />
            {[...Array(3)].map((_, subIndex) => (
              <rect
                key={subIndex}
                x={propNoImage ? 0 : firstRectWidth + 20}
                y={yPos + subIndex * smallRectHeight + subIndex * lineHeight}
                rx="0"
                ry="0"
                width={
                  propNoImage
                    ? viewBoxWidth
                    : viewBoxWidth - firstRectWidth - 20
                }
                height={smallRectHeight}
              />
            ))}
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
};

ItemsListLoader.metadata = {
  name: "Muhammad Touhiduzzaman",
  github: "touhidzaman",
  description: "A reusable loading skeleton for your vertical cart list items",
  filename: "ItemsListLoader",
};

export default ItemsListLoader;
