"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { HiMenuAlt1 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";

export default function ResponsiveMenu({ settings, categories }) {
	const { translations } = useSelector((state) => state.common);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { category_slug } = useParams();
  const megaMenuRef = useRef(null);
  const router = useRouter();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActiveOrNavigate = (cat) => {
    if (cat.child_categories.length) {
      setActiveCategory((prevActiveCategory) =>
        prevActiveCategory === cat.slug ? null : cat.slug
      );
    } else {
      setActiveCategory(null);
      router.push(`/categories/${cat.slug}?sort_type=new`);
      closeMenu();
    }
  };

  return (
    <div
      className="header-left flex items-center gap-x-2"
      style={{ color: settings?.colors?.primary_text }}
    >
      {!menuOpen ? (
        <button onClick={() => setMenuOpen(!menuOpen)} className=" md:hidden">
          <HiMenuAlt1 size={24} />
        </button>
      ) : (
        <span className=" md:hidden">
          <AiOutlineClose size={24} />
        </span>
      )}
      <Link href="/" className="logo">
        <Image
          src={settings?.logo}
          alt={settings?.name}
          width={150}
          height={56}
          className="h-full max-h-[60px] py-2 object-contain lg:w-auto"
        />
      </Link>
      <ul className="ml-3 nav-menu hidden lg:flex gap-3 items-center justify-start h-[60px] box-border">
        {categories?.slice(0, 4)?.map((category, index) => (
          <li
            key={category.id}
            className={`h-full inline-flex items-center whitespace-nowrap text-ellipsis border-b-2`}
            style={{
              borderBottom:
                category.slug == category_slug ||
                (category.child_categories || []).some(
                  (c) => c.slug === category_slug
                )
                  ? `2px solid ${settings?.colors?.primary_text}`
                  : "2px solid transparent",
            }}
          >
            <Link
              href={`/categories/${category.slug}?sort_type=new`}
              className="inline-block mt-[2px] font-title font-semibold uppercase"
              style={{ color: settings?.colors?.primary_text }}
            >
              {category.category_name}
            </Link>
          </li>
        ))}
        {categories?.length > 4 && (
          <li
            className={`h-full inline-flex items-center whitespace-nowrap text-ellipsis border-b-2 border-transparent`}
          >
            <Link
              href={`/categories`}
              className="inline-block mt-[2px] font-title font-bold uppercase"
              style={{ color: settings?.colors?.primary_text }}
            >
              {translations["all-categories"] || "All Categories"}
            </Link>
          </li>
        )}
      </ul>
      {menuOpen && (
        <div
          ref={megaMenuRef}
          className="absolute z-30 left-0 top-full shadow-lg w-full lg:hidden"
          style={{ backgroundColor: settings?.colors?.primary }}
        >
          <div className="">
            <ul className="nav-menu text-center py-2">
              {categories.map((category, index) => (
                <li key={category.id} className="my-2">
                  <button
                    onClick={() => handleActiveOrNavigate(category)}
                    className="inline-block h-full font-title font-bold uppercase"
                    style={{ color: settings?.colors?.primary_text }}
                  >
                    {category.category_name}
                    {category.slug === activeCategory ? "-" : "+"}
                  </button>
                  {category.slug === activeCategory ? (
                    <ul
                      className="text-center py-2"
                      style={{ backgroundColor: settings?.colors?.secondary }}
                    >
                      {category?.child_categories?.map((subCategory, index) => (
                        <li key={subCategory.id} className="my-2">
                          <Link
                            href={`/categories/${subCategory.slug}?sort_type=new`}
                            onClick={closeMenu}
                            className="inline-block h-full font-title font-bold uppercase"
                            style={{
                              color: settings?.colors?.secondary_text,
                            }}
                          >
                            {subCategory.category_name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
