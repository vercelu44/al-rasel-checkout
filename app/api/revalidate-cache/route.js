import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

// Reference:
// https://nextjs.org/docs/app/api-reference/functions/revalidatePath
// https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation

export async function GET(request) {
  let message = "revalidated";
  try {
    // validating unauthorized access
    const headersList = headers();
    const apiKey = headersList.get("AmsPrivateKey");
    if (apiKey !== process.env.AMS_PRIVATE_KEY) {
      return NextResponse.json(
        { revalidated: false, message: "Unauthorized access", now: Date.now() },
        { status: 403 }
      );
    }

    const { searchParams, origin: baseUrl } = new URL(request.url);
    // const path2 = request.nextUrl.searchParams.get('path')

    // '/products' / '/blog/[slug]' / '/(main)/post/[slug]'
    const path = searchParams.get("path");

    // 'page' / 'layout' - This will cause pages beneath with the same layout to revalidate on the next visit
    const type = searchParams.get("type") || "page";

    // 'collection' / 'products' etc
    const tag = searchParams.get("tag");

    if (path && tag) {
      revalidatePath(path, type);
      revalidateTag(tag);
      message = `path: ${path} type: ${type} and tag: ${tag} revalidated`;
    } else if (path) {
      revalidatePath(path, type);
      message = `path: ${path} type: ${type} revalidated`;
    } else if (tag) {
      revalidateTag(tag);
      message = `tag: ${tag} revalidated`;
    } else {
      revalidatePath("/", "layout");
      message = `All pages revalidated`;
    }

    return NextResponse.json(
      { revalidated: true, message, now: Date.now() },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Failed to revalidate",
        now: Date.now(),
      },
      { status: 500 }
    );
  }
}
