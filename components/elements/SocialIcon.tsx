import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

import type { StaticImageData } from "next/image";

interface SocialIconProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string;
  icon: string | StaticImageData;
  name?: string;
  linkClass?: string;
  iconClass?: string;
}

export default function SocialIcon({
  href,
  icon,
  name,
  linkClass,
  iconClass,
  ...props
}: SocialIconProps) {
  return (
    <Link
      target="_blank"
      href={href || "/"}
      className={twMerge("inline", linkClass)}
      {...props}
    >
      <Image
        src={icon}
        alt={name || "social-icon"}
        width="24"
        height="24"
        className={twMerge("w-6 h-6", iconClass)}
      />
    </Link>
  );
}
