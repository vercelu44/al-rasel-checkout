"use client";

import Modal from "../elements/Modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import VideoPlayer from "../elements/VideoPlayer";
import { closeVideoPlayer } from "@/store/slices/commonSlice";
import { cn } from "@/utils";

const VideoPlayerModal = () => {
	const dispatch = useAppDispatch();
	const { videoPlayerConfig } = useAppSelector((state) => state.common);

	if (!videoPlayerConfig?.url) return null;
	const isFacebook = videoPlayerConfig?.url?.split(".").includes("facebook");

	return (
		<Modal
			showModal={!!videoPlayerConfig}
			setShowModal={() => dispatch(closeVideoPlayer())}
			title={videoPlayerConfig.title}
			// bodyOnly={true}
		>
			<div
				className={cn(
					`w-full`,
					isFacebook
						? `md:h-auto md:min-w-[380px]`
						: `h-[12rem] md:h-[480px] md:w-[854px]`,
					videoPlayerConfig?.className
				)}
			>
				<VideoPlayer
					url={videoPlayerConfig.url}
					className={cn(
						"h-full w-[80vw]",
						isFacebook ? `md:w-auto` : `md:w-full`,
						videoPlayerConfig?.className
					)}
					{...videoPlayerConfig}
				/>
			</div>
		</Modal>
	);
};

export default VideoPlayerModal;
