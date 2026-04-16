import Script from "next/script";

const ExternalScript = ({ src, id }) => {
  if (!src) return null;

  return <Script id={id} src={src} strategy="afterInteractive" />;
};

export default ExternalScript;
