import { fetchData } from "@/lib/fetch-data";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

const Page = async () => {
  const [blogRes] = await Promise.allSettled([
    fetchData({ api: `pages?type=blog` }),
  ]);
  const blogs = blogRes.status === "fulfilled" ? blogRes.value?.data || [] : [];
  return (
    <div className="container">
      <div className="breadcrumb breadcrumb-2 py-6">
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
          </div>
        </div>
      </div>
      <div className="px-6 pt-6 pb-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-around ">
        {blogs.map((blog) => (
          <Link
            key={blog.slug}
            href={`/blogs/${blog.slug}`}
            className={`group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300 `}
          >
            <div className="w-full h-[200px] overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
                width={1200}
                height={400}
              />
            </div>
            <div className="px-6 py-10">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                {blog.title}
              </h2>

              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-auto">Read more</span>
                <BsArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 group-hover:text-rose-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
