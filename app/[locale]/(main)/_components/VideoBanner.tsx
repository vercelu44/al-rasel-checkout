import { fetchData } from "@/lib/fetch-data";
import VideoPlayer from "@/components/elements/VideoPlayer";
import BackgroundVideo from "next-video/background-video";
import type { ApiResponse, SiteSettings } from "@/types";

const VideoBanner = async () => {
  const [settingsRes] = await Promise.allSettled([
    fetchData<ApiResponse<SiteSettings>>({ api: `info/basic` }),
  ]);

  const settings: SiteSettings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};

  if (!settings?.review_video_link && !settings?.review_video_file) return null;

  return (
    <div className="mt-10">
      {settings?.review_video_link ? (
        <VideoPlayer
          url={settings?.review_video_link}
          loop={true}
          muted={true}
          playing={true}
          controls={true}
          className={"h-[300px] md:h-[520px] lg:h-[113vh]"}
        />
      ) : (
        <BackgroundVideo
          className="w-full !object-cover object-center"
          // next-video types `height` as a number, but this has always passed "115vh";
          // the cast keeps the rendered output exactly the same.
          height={"115vh" as unknown as number}
          src={settings?.review_video_file}
        />
      )}
    </div>
  );
};

export default VideoBanner;
