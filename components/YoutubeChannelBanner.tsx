import { fetchData } from "@/lib/fetch-data";
import Link from "next/link";

// ** Import Icons
import { HiPlay } from "react-icons/hi";
import { HiArrowLongRight } from "react-icons/hi2";
import type { ApiResponse, SiteSettings } from "@/types";

const YoutubeChannelBanner = async () => {
	const [settingsRes] = await Promise.allSettled([
		fetchData<ApiResponse<SiteSettings>>({ api: `info/basic` }),
	]);

	const settings: SiteSettings =
		settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};

	return (
		<>
			<div
				className="bg-no-repeat bg-cover bg-center lg:min-h-[400px] px-6 py-10 md:p-12 flex items-center justify-center"
				style={{
					backgroundImage: `url(${settings.home_review_banner})`,
				}}
			>
				<div className="content text-center">
					<h3 className="text-3xl lg:text-4xl/[48px] font-bold font-title text-white">
						Check out some review videos of our latest products
					</h3>
					<p className="max-w-sm text-lg font-normal text-white my-5 mx-auto">
						You can also find reviews of all products on our official YouTube
						channel
					</p>
					<Link
						href={settings?.youtube_link || "https://youtube.com"}
						target="_blank"
						className="inline-block text-lg/[26px] font-semibold text-white hover:text-secondary border-2 border-white hover:border-secondary p-3"
					>
						<HiPlay className="mr-1" />
						Watch Our Review Videos
					</Link>
				</div>
				{/* <div className="text-center">
          <Link
            href={settings.youtube_link}
            target="_blank"
            className="inline-block text-sm text-red-500 mt-14"
          >
            Visit our YouTube Channel{" "}
            <HiArrowLongRight className="text-lg ml-1" />
          </Link>
        </div> */}
			</div>
		</>
	);
};

export default YoutubeChannelBanner;
