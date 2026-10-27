"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ** Import Image
import NoInternetImg from "@/public/assets/images/no-internet-2.jpg";

// ** Imoprt icons

export const metadata = {
  title: "No Internet Connection",
};

export default function NoInterNet({ image }: { image?: string }) {
  const router = useRouter();

  return (
    <>
      <div className="container">
        <div className="content flex flex-col items-center min-h-[80vh] pt-6 text-center">
          <Image
            src={NoInternetImg}
            width={340}
            height={311}
            alt="Not Internet"
            className="h-[311px] w-[340px]"
          />
          <h2 className="text-3xl font-bold font-title text-slate-900">
            Your device does not have an internet connection
          </h2>
          <p className="text-lg text-slate-600 mt-6 mb-8">
            Please check your internet connection and try again
          </p>
          <Link
            href="javascript:void(0)"
            onClick={() => router.refresh()}
            className="inline-block font-semibold text-white bg-primary rounded-lg px-8 py-3"
          >
            Reload Page
          </Link>
        </div>
      </div>
    </>
  );
}
