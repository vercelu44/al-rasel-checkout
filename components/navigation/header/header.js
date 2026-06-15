"use client";
import { usePathname } from "@/navigation";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import TopBar from "./TopBar";
import MainNav from "./main-nav";

const HeaderWrapper = ({ settings, categories }) => {
  const pathArray = usePathname().split("/");
  if (pathArray.includes("landing")) return null;

  return (
    <>
      <header className="header fixed z-30 w-full">
        {settings?.offer_massage && <TopBar settings={settings} />}
        <MainNav settings={settings} categories={categories} />
        <CategoriesMegaMenu settings={settings} categories={categories} />
        {/* <CategoriesNav categories={categories} settings={settings} /> */}
        {/* <OfferSliderNav /> */}
      </header>
    </>
  );
};

export default HeaderWrapper;
