import Link from "next/link";
import { fetchData } from "@/lib/fetch-data";

// ** Imoprt icons
import ViewHTML from "@/components/elements/ViewHTML";
import { notFound } from "next/navigation";
import type { ApiResponse, CmsPage, PageProps } from "@/types";

const DynamicPage = async ({ params }: PageProps<{ page_slug: string }>) => {
  const { page_slug } = await params;

  const [pageRes] = await Promise.allSettled([
    fetchData<ApiResponse<CmsPage>>({ api: `pages/${page_slug}` }),
  ]);

  const page: CmsPage = pageRes.status === "fulfilled" ? pageRes.value?.data || {} : {};
  if (!page.slug) return notFound();

  return (
    <>
    <h1 className="sr-only">Pages</h1>
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
              href={`pages/${page.slug}`}
              className="text-base text-slate-900 hover:text-secondary"
            >
             <h1>{page.title}</h1> 
             
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="mb-4">
          <ViewHTML htmlText={page.description} />
        </div>
      </div>
    </>
  );
};

export default DynamicPage;
