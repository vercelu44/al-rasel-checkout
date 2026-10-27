"use client";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { cn } from "@/utils";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
	url: string;
	className?: string;
	/** Any other react-player prop (controls, muted, loop, playing…) */
	[playerProp: string]: unknown;
}

const VideoPlayer = ({ url, className, ...props }: VideoPlayerProps) => {
	// Mount the player (YouTube/Facebook iframe, its scripts and the video
	// stream) only when the box is about to scroll into view. Until then the
	// box keeps its size, so the layout is unchanged.
	const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "300px" });

	return (
		<div ref={ref} className={cn("video-player", className)}>
			{inView && (
				<ReactPlayer
					url={url}
					className="overflow-hidden"
					// playing={true}
					{...props}
					width="100%"
					height="100%"
				/>
			)}
		</div>
	);
};

export default VideoPlayer;
