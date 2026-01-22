// import CategoriesNav from "./CategoriesNav";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import MainNav from "./main-nav";
import { fetchData } from "@/lib/fetch-data";

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
				
				<MainNav settings={settings} categories={categories} />
				<CategoriesMegaMenu settings={settings} categories={categories} />
				{/* <CategoriesNav categories={categories} settings={settings} /> */}
				{/* <OfferSliderNav /> */}
			</header>
		</>
	);
};

export default Header;
