import ContentLoader from "react-content-loader";

const Loader = () => {
  return (
    <ContentLoader
      viewBox="0 0 360 420"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" rx="4" ry="4" width="100%" height="200" />
      <circle cx="20" cy="240" r="18" />
      <rect x="50" y="225" rx="2" ry="2" width="75%" height="14" />
      <rect x="50" y="250" rx="2" ry="2" width="40%" height="14" />
    </ContentLoader>
  );
};

export default Loader;
