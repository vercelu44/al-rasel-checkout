import { Link, locales } from "@/navigation";
import { fetchData } from "@/lib/fetch-data";
import ProductsWithFilter from "@/components/products/ProductsWithFilter";
import ResponsiveSlider from "./ResponsiveSlider";
import Image from "next/image";
import { notFound } from "next/navigation";

// export const generateMetadata = async ({ params, searchParams }, parent) => {
//   const parentMetaData = await parent;

//   // --- Hreflang alternates logic ---
//   const { slug, locale } = params;
//   const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
//   const locales = ["en", "bn", "ar"];
//   const primaryLocale = "en";
//   const path = `/categories/${slug}`;

//   // Generate hreflang alternates
//   const hreflangAlternates = {};
//   locales.forEach(l => {
//     hreflangAlternates[l] = l === primaryLocale ? `${base}${path}` : `${base}/${l}${path}`;
//   });
//   hreflangAlternates["x-default"] = `${base}${path}`;
//   // --- End hreflang alternates logic ---

//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.alrasel.net";

//   try {
//     const slugOnly = params.slug;
//     const currentLocale = params.locale || "en";

//     // Fetch category data
//     const categoryRes = await fetchData({ api: `category/${slugOnly}` });
//     const category = categoryRes?.data || {};

//     const basePath = `/categories/${params.slug}`;
//     const queryString = new URLSearchParams(searchParams).toString();
//     const fullUrl = queryString ? `${baseUrl}${basePath}?${queryString}` : `${baseUrl}${basePath}`;

//     const categoryName = category.category_name || "Category";
//     const appName = parentMetaData?.applicationName || "App";

//     // Ensure unique locales
//     const supportedLocales = [...new Set(locales)];

//     const configDefaultLocale = process.env.DEFAULT_LOCALE || "en";
//     const localePrefix = currentLocale !== configDefaultLocale ? `/${currentLocale}` : "";
//     const canonicalUrl = searchParams.page
//       ? `${baseUrl}${localePrefix}${basePath}?page=${searchParams.page}`
//       : `${baseUrl}${localePrefix}${basePath}`;

//     // Language alternates for SEO
//     const languageAlternates = {};
//     supportedLocales.forEach((loc) => {
//       const prefix = loc === configDefaultLocale ? "" : `/${loc}`;
//       languageAlternates[loc] = searchParams.page
//         ? `${baseUrl}${prefix}${basePath}?page=${searchParams.page}`
//         : `${baseUrl}${prefix}${basePath}`;
//     });
//     // x-default always points to the default locale version
//     languageAlternates["x-default"] = languageAlternates[configDefaultLocale];

//     return {
//       title: `${categoryName} | ${appName}`,
//       description: `${categoryName} - a category of ${appName}`,
//       metadataBase: new URL(baseUrl),
//       alternates: {
//         canonical: canonicalUrl,
//         languages: languageAlternates,
//       },
//       openGraph: {
//         title: `${categoryName} | ${appName}`,
//         description: `All ${categoryName} products of ${appName}`,
//         url: fullUrl,
//         images: [
//           {
//             url: category.image_url || "/default-og-image.jpg",
//             width: 1200,
//             height: 630,
//             alt: categoryName,
//           },
//         ],
//       },
//     };
//   } catch (error) {
//     if (process.env.NODE_ENV !== "production") {
//       console.error("Error in generateMetadata:", error);
//     }
//     return notFound();
//   }
// };


// export const generateMetadata = async ({ params, searchParams }, parent) => {
//   const parentMetaData = await parent;

//   const slugOnly = params.slug;
//   const currentLocale = params.locale || "en";

//   const locales = ["en", "bn", "ar"];
//   const defaultLocale = "en";
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.alrasel.net";
//   const basePath = `/categories/${slugOnly}`;
//   const queryString = new URLSearchParams(searchParams).toString();

//   const currentLocalePrefix = currentLocale === defaultLocale ? "" : `/${currentLocale}`;
//   const canonicalUrl = `${baseUrl}${currentLocalePrefix}${basePath}${queryString ? `?${queryString}` : ""}`;

//   try {
//     // Fetch category data
//     const categoryRes = await fetchData({ api: `category/${slugOnly}` });
//     const category = categoryRes?.data || {};
//     const categoryName = category.category_name || "Category";
//     const appName = parentMetaData?.applicationName || "App";

//     // hreflang generation
//     const languageAlternates = {};
//     locales.forEach((loc) => {
//       const prefix = loc === defaultLocale ? "" : `/${loc}`;
//       languageAlternates[loc] = `${baseUrl}${prefix}${basePath}${queryString ? `?${queryString}` : ""}`;
//     });
//     languageAlternates["x-default"] = languageAlternates[defaultLocale];

//     return {
//       title: `${categoryName} | ${appName}`,
//       description: `${categoryName} - a category of ${appName}`,
//       metadataBase: new URL(baseUrl),
//       alternates: {
//         canonical: canonicalUrl,
//         languages: languageAlternates,
//       },
//       openGraph: {
//         title: `${categoryName} | ${appName}`,
//         description: `All ${categoryName} products of ${appName}`,
//         url: canonicalUrl,
//         images: [
//           {
//             url: category.image_url || "/default-og-image.jpg",
//             width: 1200,
//             height: 630,
//             alt: categoryName,
//           },
//         ],
//       },
//     };
//   } catch (error) {
//     if (process.env.NODE_ENV !== "production") {
//       console.error("Error in generateMetadata:", error);
//     }
//     return notFound();
//   }
// };


// export async function generateMetadata({ params, searchParams }) {
//   const slug = params.slug;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "https://example.com";

//   const defaultLocale = "en";


//   const prefix = ""; // or `/locale` if you have locale param

//   // Build canonical URL, include searchParams if any (e.g., ?page=2)
//   const queryString = new URLSearchParams(searchParams).toString();
//   const canonicalUrl = `${baseUrl}${prefix}/categories/${slug}${queryString ? `?${queryString}` : ""}`;

//   return {
//     alternates: {
//       canonical: canonicalUrl,
//       languages: Object.fromEntries(
//         locales.map((locale) => {
//           const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
//           return [locale, `${baseUrl}${localePrefix}/categories/${slug}${queryString ? `?${queryString}` : ""}`];
//         })
//       ),
//     },
//   };
// }

// export async function generateMetadata({ params, searchParams }) {
//   const slug = params.slug;
//   const defaultLocale = "en";
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3001";

//   // Build query string (e.g., "?page=2")
//   const queryString = new URLSearchParams(searchParams).toString();
//   const queryPart = queryString ? `?${queryString}` : "";

//   // Canonical URL (default locale, no prefix)
//   const canonicalUrl = `${baseUrl}/categories/${slug}${queryPart}`;

//   // hreflang alternate URLs
//   const languageAlternates = {};
//   locales.forEach((locale) => {
//     const prefix = locale === defaultLocale ? "" : `/${locale}`;
//     languageAlternates[locale] = `${baseUrl}${prefix}/categories/${slug}${queryPart}`;
//   });
//   languageAlternates["x-default"] = languageAlternates[defaultLocale];

//   return {
//     alternates: {
//       canonical: canonicalUrl,
//       languages: languageAlternates,
//     },
//     title: `Category: ${slug} - Page ${searchParams.page || 1}`,
//     description: `Browse page ${searchParams.page || 1} of ${slug} category.`,
//   };
// }

export async function generateMetadata({ params, searchParams }) {
  const slug = params.slug;
  const defaultLocale = "en";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3001";

  // Get and normalize pagination
  let pageParam = searchParams.page;
  const isBasePage = !pageParam || pageParam === "1";

  // Canonical should always point to the base (no page param)
  const canonicalUrl = `${baseUrl}/categories/${slug}`;

  const metadata = {
    title: `Category: ${slug} - Page ${pageParam || 1}`,
    description: `Browse page ${pageParam || 1} of ${slug} category.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };

  // Only add hreflang for base page
  if (isBasePage) {
    const languageAlternates = {};
    locales.forEach((locale) => {
      const prefix = locale === defaultLocale ? "" : `/${locale}`;
      languageAlternates[locale] = `${baseUrl}${prefix}/categories/${slug}`;
    });
    languageAlternates["x-default"] = languageAlternates[defaultLocale];

    metadata.alternates.languages = languageAlternates;
  }

  return metadata;
}



const page = async ({ params, searchParams }) => {
  // Strip id from slug for fetching backend data
  const slugOnly = params.slug;

  const [categoryResponse, tranRes] = await Promise.allSettled([
    fetchData({ api: `category/${slugOnly}` }),
    fetchData({ api: `translations` }),
  ]);
console.log(`category/${slugOnly}`, "sajfgsljd=============")
  const category = categoryResponse.status === "fulfilled" ? categoryResponse.value?.data || {} : {};
  const translations = tranRes.status === "fulfilled" ? tranRes.value?.data || {} : {};

  const customSearchParams = {
    category_id: category?.id,
    ...searchParams,
  };

  return (
    <>
      <h1 className="sr-only">Category</h1>
      {category?.image ? (
        <>
          <div
            className="hidden lg:block bg-no-repeat bg-cover w-full h-[240px] breadcrumb py-20"
            style={{
              backgroundImage: `url(${category.image})`,
            }}
          >
            <div className="container">
              {/* You can add semantic breadcrumb markup here for SEO */}
            </div>
          </div>
          <Image
            src={category.image}
            alt={category.category_name}
            width={1000}
            height={240}
            className="w-full h-full object-cover block lg:hidden"
          />
        </>
      ) : (
        <div className="breadcrumb breadcrumb-2 py-5 border-b border-slate-200 hidden lg:block">
          <div className="container capitalize">
            <div className="flex">
              <Link href={`/`} className="text-base text-slate-600 hover:text-primary">
                {translations["home"] || "হোম"}
              </Link>
              <Link href={`/categories`} className="text-base text-slate-900 hover:text-primary">
                {translations["category"] || "ক্যাটাগরি"}
              </Link>
              <Link
                href={`/categories/${params.slug}`}
                aria-disabled="true"
                className="text-base text-slate-900 pointer-events-none"
              >
                {category.category_name}
              </Link>
            </div>
          </div>
        </div>
      )}

      {category?.child_categories?.length ? (
        <div className="border-b border-slate-200 pt-3 lg:py-8">
          <h6 className="container text-base font-semibold font-title text-slate-900 lg:mb-4">
            {translations["related-categories"] || "Related Categories"}
          </h6>
          <div className="lg:container">
            <ResponsiveSlider categories={category.child_categories} />
          </div>
        </div>
      ) : null}

      <ProductsWithFilter
        customSearchParams={customSearchParams}
        category={category}
        translations={translations}
      />
    </>
  );
};

export default page;
