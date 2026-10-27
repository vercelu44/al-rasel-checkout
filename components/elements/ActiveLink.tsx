"use client";
import type * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
}

const ActiveLink = ({ href, children }: ActiveLinkProps) => {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const isActive = pathname === href || pathname.split(locale)[1] === href;

  return (
    <Link href={href} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
};

export default ActiveLink;
