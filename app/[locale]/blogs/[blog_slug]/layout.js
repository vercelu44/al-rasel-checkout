import { fetchData } from "@/lib/fetch-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }, parent) => {
  try {
    const res = await fetchData({ api: `pages?type=blog&slug=${params.blog_slug}` });
    const blog = res?.data?.[0]; // assuming API returns an array
    if (!blog) return notFound();

    return {
      title: `${blog.title || blog.name}`,
      openGraph: {
        title: `${blog.title || blog.name}`,
        url: `/blogs/${blog.slug}`,
        
      },
      alternates: {
        canonical: `/blogs/${blog.slug}`,
      },
    };
  } catch (error) {
    return notFound();
  }
};

export default function BlogLayout({ children }) {
  return <div className="p-6">{children}</div>;
}
