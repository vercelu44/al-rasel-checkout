"use client";
import React, { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RoundedSearch({ placeholder }: { placeholder?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  let pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    router.push(pathname + "?" + createQueryString("text", searchTerm));
  };

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleInput}
      placeholder={placeholder}
      className="h-[3rem] w-full border-2 border-[#E2E8F0] focus:border-primary focus:outline-none rounded-full py-3 px-4"
    />
  );
}
