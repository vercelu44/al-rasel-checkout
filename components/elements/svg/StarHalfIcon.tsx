import type * as React from "react";
/** `empty` = colour of the empty half */
const StarHalfIcon = (props: React.SVGProps<SVGSVGElement> & { empty?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <mask
      id="a"
      width={18}
      height={16}
      x={1}
      y={2}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path
        // fill="#F59E0B"
        fillRule="evenodd"
        d="M8.99 2.675c.373-.897 1.647-.897 2.02 0l1.735 4.173 4.503.36c.97.078 1.364 1.288.625 1.921l-3.431 2.94 1.047 4.394c.226.946-.803 1.694-1.633 1.187L10 15.295 6.144 17.65c-.83.507-1.859-.242-1.633-1.187l1.047-4.395-3.43-2.939c-.74-.633-.346-1.843.624-1.92l4.503-.361L8.99 2.675Z"
        clipRule="evenodd"
      />
    </mask>
    <g mask="url(#a)">
      <path
        // fill="#F59E0B"
        fillRule="evenodd"
        d="M8.99 2.675c.373-.897 1.647-.897 2.02 0l1.735 4.173 4.503.36c.97.078 1.364 1.288.625 1.921l-3.431 2.94 1.047 4.394c.226.946-.803 1.694-1.633 1.187L10 15.295 6.144 17.65c-.83.507-1.859-.242-1.633-1.187l1.047-4.395-3.43-2.939c-.74-.633-.346-1.843.624-1.92l4.503-.361L8.99 2.675Z"
        clipRule="evenodd"
      />
      <path fill={props.empty || "#E2E8F0"} d="M10 1.25h8.75v17.5H10z" />
    </g>
  </svg>
);
export default StarHalfIcon;
