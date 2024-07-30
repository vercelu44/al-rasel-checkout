"use client";
import Link from "next/link";
import { startVideoPlayer } from "@/store/slices/commonSlice";

// ** Import Icons
import { HiPlay } from "react-icons/hi";
import { HiArrowLongRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

const VideoBanner = ({ translations }) => {
	const dispatch = useDispatch();
	const { settings } = useSelector((state) => state.common);

	return (
		<>
			<div
				className="bg-no-repeat bg-cover bg-center py-8 lg:py-12"
				style={{
					backgroundImage: `url(${settings.home_review_banner})`,
				}}
			>
				<div className="content text-center container">
					<h3 className="text-2xl lg:text-4xl/[48px] font-bold font-title text-white">
						{translations["review_banner_title"]}
					</h3>
					<p className="max-w-sm text-sm lg:text-lg font-normal text-white mt-3 lg:mt-5 mx-auto">
						{translations["review_banner_subtitle"]}
					</p>
					<button
						onClick={() =>
							dispatch(
								startVideoPlayer({
									url: settings?.review_video_link || "https://youtube.com",
									playing: true,
									title: translations["review-video"] || "রিভিউ ভিডিও",
									controls: true,
									// className: "md:h-[480px] md:w-[854px]",
								})
							)
						}
						className="inline-block text-lg/[26px] font-semibold text-white bg-primary p-3 rounded-lg mt-4 lg:mt-8"
					>
						<HiPlay className="mr-1" />
						{translations["watch-video"]}
					</button>
				</div>
				<div className="text-center">
					<Link
						href={settings?.youtube_link || "https://youtube.com"}
						target="_blank"
						className="inline-block text-sm text-red-500 mt-9 lg:mt-14"
					>
						{translations["visit-youtube-channel"]}{" "}
						<HiArrowLongRight className="text-lg ml-1 rtl:rotate-180" />
					</Link>
				</div>
			</div>
		</>
	);
};

export default VideoBanner;
