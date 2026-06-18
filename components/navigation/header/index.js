// import CategoriesNav from "./CategoriesNav";

import { fetchData } from "@/lib/fetch-data";
import MainNav from "./main-nav";
import TopBar from "./TopBar";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
// import OfferSliderNav from "./offer-slider-nav";

const Header = async () => {
	const [settingsRes, categoriesRes] = await Promise.allSettled([
		fetchData({ api: `info/basic` }),
		fetchData({ api: "categories" }),
	]);

	const settings =
		settingsRes.status === "fulfilled" ? settingsRes.value?.data || {} : {};
	const categories =
		categoriesRes.status === "fulfilled" ? categoriesRes.value?.data || [] : [];
	return (
		<>
			 <header className="header fixed z-30 w-full">
        {settings?.offer_massage && <TopBar settings={settings} />}
        <MainNav settings={settings} categories={categories} />
        <CategoriesMegaMenu settings={settings} categories={categories} />
        {/* <CategoriesNav categories={categories} settings={settings} /> */}
        {/* <OfferSliderNav /> */}
      </header>
		</>
	);
};

export default Header;
