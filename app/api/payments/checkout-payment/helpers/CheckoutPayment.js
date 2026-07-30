import { generateUniqueId } from "@/utils/get-unique";

export const getCheckoutPaymentSession = async ({
  order,
  nextBaseUrl,
  isDeliveryChargePayment,
}) => {
  const { sale } = order;

  const amount = isDeliveryChargePayment
    ? sale.shipping.delivery_charge
    : sale.due_amount;

  const checkoutAmount = Math.round(Number(amount) * 100);

  const reference = `ORDER-${sale.id}`;
  const paymentSessionReference = generateUniqueId();

  const payload = {
    amount: checkoutAmount,
    currency: "BDT",

    payment_type: "Regular",

    reference,

    description: `Payment for Order #${sale.id}`,

    customer: {
      name: sale.customer.name || sale.shipping.name,
      email: sale.customer.email,
      phone: {
        country_code: "+880",
        number: sale.customer.mobile || sale.shipping.phone,
      },
    },

    billing: {
      address: {
        address_line1: sale.shipping.address,
        address_line2: sale.shipping.alt_address || "",
        city: "Dhaka",
        state: "Dhaka",
        zip: "1200",
        country: "BD",
      },
      phone: {
        country_code: "+880",
        number: sale.customer.mobile || sale.shipping.phone,
      },
    },

    shipping: {
      address: {
        address_line1: sale.shipping.address,
        address_line2: sale.shipping.alt_address || "",
        city: "Dhaka",
        state: "Dhaka",
        zip: "1200",
        country: "BD",
      },
      phone: {
        country_code: "+880",
        number: sale.shipping.phone,
      },
    },

    success_url: `${nextBaseUrl}/checkout/payment/success?order=${sale.id}`,

    failure_url: `${nextBaseUrl}/checkout/payment/fail?order=${sale.id}`,

    processing_channel_id: process.env.CHECKOUT_PROCESSING_CHANNEL_ID,

    items: sale.products.map((item) => ({
      name: item.product_name,
      quantity: item.quantity,
      unit_price: Math.round(Number(item.sale_price) * 100),
      total_amount: Math.round(Number(item.total_price) * 100),
      reference: item.product_id.toString(),
    })),

    metadata: {
      order_id: sale.id.toString(),
      payment_reference: paymentSessionReference,
      delivery_charge_payment: isDeliveryChargePayment.toString(),
    },

    capture: true,

    "3ds": {
      enabled: true,
    },

    enabled_payment_methods: [
      "card",
      "applepay",
      "googlepay",
    ],
  };


  const baseUrl = process.env.CHECKOUT_SANDBOX === "sandbox"
  ? `https://${process.env.CHECKOUT_API_PREFIX}.api.sandbox.checkout.com`
  : `https://${process.env.CHECKOUT_API_PREFIX}.api.checkout.com`;

  const response = await fetch(
    `${baseUrl}/payment-sessions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHECKOUT_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error(result);
    throw new Error("Unable to create Checkout payment session.");
  }

  return result;
};