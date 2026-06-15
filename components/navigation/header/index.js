// import CategoriesNav from "./CategoriesNav";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import TopBar from "./TopBar";
import HeaderWrapper from "./header";
import MainNav from "./main-nav";
import { fetchData } from "@/lib/fetch-data";
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
			<HeaderWrapper settings={settings} categories={categories} />
		</>
	);
};

export default Header;
