import { createNavigation } from "next-intl/navigation";
import { routing, locales, localePrefix } from "./routing";

export { locales, localePrefix };

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);
