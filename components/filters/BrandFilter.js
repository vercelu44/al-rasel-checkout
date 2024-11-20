"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSelectURLQuery from "@/hooks/useSelectURLQuery";
import { FiSearch } from "react-icons/fi";
import SearchCloseIcon from "../elements/svg/SearchCloseIcon";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

const BrandFilter = ({ filteredBrands, selectedBrandIds }) => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { translations } = useSelector((state) => state.common);
  const { handleSelectChange } = useSelectURLQuery();
  const searchRef = useRef(null);

  let searchFilteredBrands = filteredBrands || [];

  // console.log(searchFilteredBrands)

  if (searchTerm) {
    searchFilteredBrands = filteredBrands.filter((brand) =>
      brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  let brands = searchFilteredBrands || [];

  if (!showAll && brands?.length > 6) {
    brands = brands?.slice(0, 6);
  }

  //Handling Brand select
  const handleChange = (e) => {
    if (e.target.checked) {
      const ids = [...selectedBrandIds, e.target.value];
      handleSelectChange("brand_ids", ids.join(","));
    } else {
      handleSelectChange(
        "brand_ids",
        selectedBrandIds.filter((id) => id !== `${e.target.value}`).join(",")
      );
    }
  };

  const handleSearchClose = () => {
    setIsSearch(false);
    setSearchTerm("");
  };

  useEffect(() => {
    if (isSearch) {
      searchRef.current.focus();
    }
  }, [isSearch]);

  return (
    <>
      <div className="pr-5">
        <div className={`w-full qna-search pt border-b border-slate-200 pb-2 `}>
          {!isSearch ? (
            <div className="flex justify-between items-center pt-1 pr-2">
              <h6 className="text-[16px] font-bold text-slate-900">
                {translations["brands"] || "All Brands"}
              </h6>
              <button
                className="p-2 bg-white rounded-full border-2 border-[#E2E8F0] flex justify-center items-center  mt-[-4px]"
                onClick={() => setIsSearch(true)}
              >
                <FiSearch size={20} />
              </button>
            </div>
          ) : (
            <div
              className={`w-full  question-search flex items-center relative mt-3 lg:mt-0`}
            >
              <div className="relative w-full">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    translations["search-for-brands"] || "Search for brands"
                  }
                  className="h-[40px] w-full border border-[#E2E8F0] bg-slate-100  focus:bg-white focus:border-primary focus:outline-none rounded-full"
                />
              </div>
              <button
                onClick={handleSearchClose}
                className=" ml-6  absolute  right-[15px] top-[7px]"
              >
                <RxCross1 />
              </button>
            </div>
          )}
        </div>

        <div className={`category-filter mt-3`}>
          <div
            className={` ${
              showAll ? "h-[300px] overflow-auto scrollbar-hide" : ""
            }   `}
          >
            {brands?.map((brand) => (
              <div className={`input-grp mb-3`} key={brand.id}>
                <label
                  className="flex items-center gap-2 text-base text-slate-700 cursor-pointer"
                  htmlFor={`brd-${brand.id}`}
                >
                  <input
                    type="checkbox"
                    id={`brd-${brand.id}`}
                    checked={selectedBrandIds.includes(`${brand.id}`)}
                    name={brand.brand_name}
                    value={brand.id}
                    onChange={handleChange}
                  />
                  {brand.brand_name}
                </label>
              </div>
            ))}
          </div>

          {!showAll && searchFilteredBrands?.length > 6 ? (
            <div className="text-center mt-3">
              <span
                onClick={() => setShowAll(true)}
                className="inline-flex items-center text-primary cursor-pointer"
              >
                <span className="mr-1">
                  <GoPlus />
                </span>
                {translations["see-all"] || "See All"}
              </span>
            </div>
          ) : null}
          {showAll ? (
            <div className="text-center mt-3">
              <span
                onClick={() => setShowAll(false)}
                className="inline-flex items-center text-primary cursor-pointer"
              >
                <span className="mr-1">
                  <FiMinus size={20} />
                </span>
                {translations["see-less"] || "See Less"}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default BrandFilter;
