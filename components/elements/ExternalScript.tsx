import Script from "next/script";

interface ExternalScriptProps {
  src?: string | null;
  id: string;
}

const ExternalScript = ({ src, id }: ExternalScriptProps) => {
  if (!src) return null;

  return <Script id={id} src={src} strategy="afterInteractive" />;
};

export default ExternalScript;
