import { fetchData } from "@/lib/fetch-data";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

const Page = async () => {
  const [blogRes] = await Promise.allSettled([
    fetchData({ api: `pages?type=blog` }),
  ]);

  const blogs = blogRes.status === "fulfilled" ? blogRes.value?.data || [] : [];
  return (
    <div className="container">
    <div className="p-6 w-full flex flex-col md:flex-row gap-4 items-center justify-around h-[500px]">
        {blogs.map((blog) => (
          <Link
            href={`/blogs/${blog.slug}`}
            className={`group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300 `}
          >
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
