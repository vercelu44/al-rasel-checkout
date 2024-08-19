import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link } from "@/navigation";
// import dynamic from "next/dynamic";
// const MegaMenu = dynamic(() => import("./MegaMenu"), {
//   ssr: false,
// });

const MenuItems = ({ settings }) => {
  const headerPage = settings?.header_page || [];
  const className = "text-sm lg:text-base flex items-center gap-2";

  return (
    <>
      <div className="hidden md:flex nav-menu container items-center gap-2 md:ml-2 xl:md-4">
        {headerPage.map((page, index) => (
          <Link key={index} href={page?.path} className={`${className}`}>
            {page?.name}
          </Link>
        ))}
      </div>
    </>
  );
};

{
  /* {!matches && <MegaMenu settings={settings} />} */
}
export default MenuItems;
