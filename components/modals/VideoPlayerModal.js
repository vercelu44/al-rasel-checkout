"use client";

import Modal from "../elements/Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeVideoPlayer } from "@/store/slices/commonSlice";
import VideoPlayer from "../elements/VideoPlayer";
import { cn } from "@/utils";

const VideoPlayerModal = () => {
	const dispatch = useDispatch();
	const { videoPlayerConfig } = useSelector((state) => state.common);

	return (
		videoPlayerConfig?.url && (
			<Modal
				showModal={videoPlayerConfig}
				setShowModal={() => dispatch(closeVideoPlayer())}
				title={videoPlayerConfig.title}
				bottomSheet={false}
				// bodyOnly={true}
			>
				<div className={`w-full`}>
					<VideoPlayer
						url={videoPlayerConfig.url}
						className={cn(
							"h-[12rem] w-full md:h-[480px] md:w-[854px]",
							videoPlayerConfig?.className ? videoPlayerConfig?.className : ``
						)}
						{...videoPlayerConfig}
					/>
				</div>
			</Modal>
		)
	);
};

export default VideoPlayerModal;
