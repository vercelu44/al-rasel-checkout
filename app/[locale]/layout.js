
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "rc-slider/assets/index.css";

//** Swiper Slider
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import ReduxProvider from "@/store/ReduxProvider";
import ServerDataProvider from "@/components/utility/ServerDataProvider";

export default async function RootLayout({ children, params }) {
  return (
    <html lang={params.locale}>
      <body>
        <ReduxProvider>
          {children}
          <ServerDataProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
