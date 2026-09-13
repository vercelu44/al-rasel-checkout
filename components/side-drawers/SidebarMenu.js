"use client";
import React from "react";
import CategoriesMenuList from "../navigation/header/main-nav/CategoriesMenuList";
import LanguageSelector from "../navigation/header/main-nav/LanguageSelector";
import DrawerLeft from "../elements/DrawerLeft";
import Link from "next/link";
import { MdLocalShipping } from "react-icons/md";
import TrackOrderButton from "../navigation/header/main-nav/TrackOrderButton";

const SidebarMenu = ({
  sidebarToggle = () => {},
  isSideBarOpen,
  categories,
  settings,
}) => {
  return (
    <DrawerLeft
      title={"Menu"}
      show={isSideBarOpen}
      className={"w-[70vw]"}
      setShow={sidebarToggle}
    >
      {isSideBarOpen && (
        <div className="py-3 text-black">
          <CategoriesMenuList
            setShow={sidebarToggle}
            categories={categories}
            settings={settings}
          />
					
          <div className="flex items-center justify-between px-3 !w-full py-2 shadow text-md">
            <TrackOrderButton className={'inline-flex lg:hidden'} />
          </div>
          <div className="py-5 px-4 font-bold flex justify-start">
            <LanguageSelector isFullName={true} />
          </div>
        </div>
      )}
    </DrawerLeft>
  );
};

export default SidebarMenu;