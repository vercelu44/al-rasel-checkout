import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link } from "@/navigation";
// import dynamic from "next/dynamic";
// const MegaMenu = dynamic(() => import("./MegaMenu"), {
//   ssr: false,
// });

const MenuItems = ({ settings }) => {
  const matches = useMediaQuery("(max-width: 768px)");
  const headerPage = settings?.header_page || [];
  const className = "px-2 py-3 rounded-sm flex items-center gap-1";

  return (
    <>
      {!matches && (
        <div className="nav-menu container flex items-center gap-2">
          {headerPage.map((page, index) => (
            <Link key={index} href={page?.path} className={`${className}`}>
              {page?.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

{/* {!matches && <MegaMenu settings={settings} />} */}
export default MenuItems;
