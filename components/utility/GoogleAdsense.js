import Script from "next/script";

const GoogleAdsense = ({ verificationId }) => {
//   if (process.env.NODE_ENV !== "production") {
//     return null;
//   }
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${verificationId}`} // example: ca-pub-123456789
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default GoogleAdsense;
