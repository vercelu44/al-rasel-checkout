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

export default function ProductZoomYetAnother({
  images,
  index,
  open,
  setOpen,
  setIndex,
}) {
  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((item) => ({ src: item.image }))}
        index={index}
        on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
        plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
      />
    </>
  );
}
