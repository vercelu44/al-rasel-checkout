'use server'

import { getLocale } from "next-intl/server";

export async function fetchProducts(page, config) {
try {
  const response = await fetch(`${process.env.server}/${config?.api}`,{
		next: { revalidate: 59 },
		headers: {
			AmsPublickey: process.env.AMS_PUBLIC_KEY,
			// AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
			lang: config?.locale || (await getLocale()),
		},
	});
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error fetching products:', error);
  return null;
}
}