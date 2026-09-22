const allowedQueryKeys = [
  "text",
  "reference_id",
  "brand_ids",
  "sort_type",
  "category_id",
  "per_page",
  "page",
  "colors",
  "sizes",
  "min_price",
  "max_price",
  "category_ids",
];

export const buildProductQueryParams = (customParams, per_page=30) => {
  const params = new URLSearchParams();  

  Object.entries(customParams).forEach(([key, value]) => {
    if (!allowedQueryKeys.includes(key)) return;

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else {
      params.set(key, String(value));
    }
  });

  if (!params.has("per_page")) {
    params.set("per_page", String(per_page));
  }

  if(!params.has("page")){
    params.set("page", String(1))
  }

  return params;
};
