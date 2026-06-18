import React from "react";
import Image from "next/image";
import noItemsImage from "@/public/assets/images/no-item-found-vector.webp";

function NoItems({ title }) {
  return (
    <div className="flex-center mt-20">
      <div className="flex-center flex-col h-[10rem] w-[15rem] md:h-[20rem] md:w-[25rem] mb-10 md:mb-5">
        <div className="h-[216px] w-[216px]">
          <Image
            src={noItemsImage}
            alt="No-Items-Image"
            height={216}
            width={216}
            className="h-[216px]"
          />
        </div>
      </div>
    </div>
  );
}

export default NoItems;
