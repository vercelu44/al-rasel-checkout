
import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }, parent) => {
  // const parentMetaData = await parent;
  let page = {};
  try {
    const pageRes = await fetchData({ api: `pages/${params.page_slug}` });
    page = pageRes?.data;
    // console.log(`/pages/${page?.slug}`);
    return {
      title: `${page?.title}`,
      // description: `${page?.title} a category of ${parentMetaData.applicationName}`,
      openGraph: {
        title: `${page?.title}`,
        url: `/pages/${page?.slug}`,
      },
      alternates: {
        canonical: `/${page?.slug}`,
      },
    };
  } catch (error) {
    return notFound();
  }
};
export default function DynamicPageLayout({ children }) {
  return <div>{children}</div>;
}
