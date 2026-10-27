"use client";
import type * as React from "react";
// `ssr: false` is only allowed inside Client Components (Next.js 15+),
// so the client-only Popup is lazy-loaded from here.
import dynamic from "next/dynamic";

const Popup = dynamic(() => import("./Popup"), { ssr: false });

export default function PopupClient(props: React.ComponentProps<typeof Popup>) {
  return <Popup {...props} />;
}
