import Loader from "../elements/loaders/Loader";


const ProductLoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Loader key={index} />
      ))}
    </div>
  );
};

export default ProductLoadingSkeleton;