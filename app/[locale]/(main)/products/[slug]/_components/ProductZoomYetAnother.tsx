"use client";
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import type { StaticImageData } from "next/image";

interface ProductZoomProps {
  images: Array<{ image?: string | StaticImageData }>;
  /** Index of the slide to show */
  index: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  setIndex: (index: number) => void;
}

export default function ProductZoomYetAnother({
  images,
  index,
  open,
  setOpen,
  setIndex,
}: ProductZoomProps) {
  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((item) => ({ src: item.image as string }))}
        index={index}
        on={{ view: ({ index: currentIndex }: { index: number }) => setIndex(currentIndex) }}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
      />
    </>
  );
}
