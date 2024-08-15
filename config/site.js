import { TbCurrencyDirham, TbCurrencyTaka } from "react-icons/tb";

export const siteConfig = {
  currency: {
    locale: "Arabic",
    sign: "AED",
    code: "AED",
    shortForm: "AED",
    icon: <TbCurrencyDirham size={16} />, // Optional, replace with an appropriate icon if needed
  },
  phone: {
    country: "Bangladesh",
    prefix: "(BD) +88",
    countryCode: "+88", // We will store phon number including first 0
    pattern: /^(013|015|016|017|018|019)\d{8}$/,
  },
  email: {
    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
  },
};
