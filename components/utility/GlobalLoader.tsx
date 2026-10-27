"use client";

import { useAppSelector } from "@/store/hooks";
import LoaderOverlay from "@/components/elements/loaders/LoaderOverlay";

// this will apply overlay loader for full screen
const GlobalLoader = () => {
  const { isGlobalLoading } = useAppSelector((state) => state.common);
  // console.log(isGlobalLoading);
  if (isGlobalLoading) return <LoaderOverlay />;
  return null;
};

export default GlobalLoader;
