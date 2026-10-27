import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";
import ViewHTML from "@/components/elements/ViewHTML";
import { notFound } from "next/navigation";
import type { ApiResponse, CmsPage, MetadataProps, PageProps } from "@/types";
import type { Metadata } from "next";


export async function generateMetadata({ params }: MetadataProps<{ blog_slug: string }>): Promise<Metadata> {
  const { blog_slug } = await params;

  const [blogRes] = await Promise.allSettled([
    fetchData<ApiResponse<CmsPage>>({ api: `pages/${blog_slug}?type=blog` }),
  ]);

  const blog: CmsPage = blogRes.status === "fulfilled" ? blogRes.value?.data || {} : {};
  if (!blog?.title) return {};

  return {
    title: blog.title,
    description: blog.meta_description || "",
    alternates: {
      canonical: `/blogs/${blog_slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.meta_description || blog.excerpt || "",
      type: 'article',
    },
  };
}

const DynamicPage = async ({ params }: PageProps<{ blog_slug: string }>) => {
  const { blog_slug } = await params;

  const [blogRes] = await Promise.allSettled([
    fetchData<ApiResponse<CmsPage>>({ api: `pages/${blog_slug}?type=blog`}),
  ]);

  const blog: CmsPage = blogRes.status === "fulfilled" ? blogRes.value?.data || {} : {};
  if (!blog.slug) return notFound();

  return (
    <>
    <h1 className="sr-only">Header for seo</h1>
      <div className="breadcrumb breadcrumb-2 py-5">
        <div className="container">
          <div>
            <Link
              href={`/`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              Home
            </Link>
            <Link
              href={`/blogs`}
              className="text-base text-slate-600 hover:text-secondary"
            >
              Blogs
            </Link>
            <Link
              href={`${blog.slug}`}
              className="text-base text-slate-900 hover:text-secondary"
            >
              {blog.title}
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="mb-4">
          {/* <Image
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            width={1200}
            height={400}
          /> */}
          <ViewHTML htmlText={blog.description} />
        </div>
      </div>
    </>
  );
};

export default DynamicPage;
