"use client";
import Image from "next/image";


export default function NotFound() {
  return (
    <>
      <div className="container">
        <div className="content flex flex-col items-center py-28">
          <Image
            src={`/assets/images/banner/notFound.jpg`}
            width={600}
            height={500}
            alt="Not Found"
            className="mb-12"
          />
          <h2 className="text-3xl font-bold font-title text-slate-900">
            Page not found!
          </h2>
          <p className="text-lg text-slate-600 mt-6 mb-8">
            We are sorry, but the page you requested could not be found.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </>
  );
}