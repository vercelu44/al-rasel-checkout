import { useEffect } from "react";
import * as pixel from "/lib/fpixel";
import { sendGTMEvent } from "@next/third-parties/google";
import { getGTMFormattedSaleProducts } from "@/lib/gtm-data-formatter";
import SHA256 from "crypto-js/sha256";

const FB_PREFIX = "fb_purchase_";
const GTM_PREFIX = "gtm_purchase_";
const MAX_KEYS = 20;

/* ---------------- helpers ---------------- */

function cleanup(prefix) {
  const keys = Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .sort();

  if (keys.length <= MAX_KEYS) return;

  const removeCount = keys.length - MAX_KEYS;
  for (let i = 0; i < removeCount; i++) {
    localStorage.removeItem(keys[i]);
  }
}

function hasFired(prefix, orderId) {
  return localStorage.getItem(`${prefix}${orderId}`) === "1";
}

function markFired(prefix, orderId) {
  localStorage.setItem(`${prefix}${orderId}`, "1");
  cleanup(prefix);
}

/* ---------------- hook ---------------- */

export default function usePurchaseTracking({
  order,
  settings,
  isFbPixelInitialized,
}) {
  /* -------- Facebook Pixel -------- */
  useEffect(() => {
    if (!isFbPixelInitialized || !order?.id) return;

    if (hasFired(FB_PREFIX, order.id)) return;

    pixel.event(
      "Purchase",
      // pixel.getPurchasedItemsPixelData(order.ordered_items, order.sub_total), 
      {
        // This code give by Roni Vi
        ...pixel.getPurchasedItemsPixelData(order.ordered_items, order.sub_total),
        // Server-এর order_id-এর সাথে একই মান (invoice_no, না থাকলে id)
        order_id: order.invoice_no ?? String(order.id),
      },
      {
        eventID: order.id,
        fn: order?.customer?.name
          ? SHA256(order.customer.name).toString()
          : undefined,
        ph: order?.customer?.mobile
          ? SHA256(order.customer.mobile).toString()
          : undefined,
        em: order?.customer?.email
          ? SHA256(order.customer.email.trim().toLowerCase()).toString()
          : undefined,
      },
    );

    markFired(FB_PREFIX, order.id);
    console.log("FB Purchase fired:", order.id);
  }, [order, isFbPixelInitialized]);

  /* -------- Google Tag Manager -------- */
  useEffect(() => {
    if (!settings?.gtm_id || !order?.id) return;

    if (hasFired(GTM_PREFIX, order.id)) return;

    const items = getGTMFormattedSaleProducts(order.ordered_items);
    console.log("GTM ORDER",order);
    

    sendGTMEvent({
      event: "purchase",
      event_id: order.id, // GA4 dedup
      ecommerce: {
        transaction_id: order.invoice_no,
        currency: "BDT",
        value: order.total_amount,
        tax: 0,
        shipping: order?.shipping?.delivery_charge || 0,
        items,
      },
      user_data: {
        email: order?.customer?.email || "",
        phone_number: order?.customer?.mobile || "",
        address: {
          first_name: order?.customer?.name || "",
          last_name: "",
          street: order?.customer?.address || "",
          city: "",
          region: "",
          postal_code: "",
          country: order?.customer?.country || "Bangladesh"
        }
      }
    });

    markFired(GTM_PREFIX, order.id);
    console.log("GTM Purchase fired:", order.id);
  }, [order, settings]);
}
