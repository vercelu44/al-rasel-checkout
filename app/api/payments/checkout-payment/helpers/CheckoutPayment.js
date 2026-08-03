

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

  // const reference = `ORDER-${sale.id}`;
  // const paymentSessionReference = generateUniqueId();

  const payload = {
    amount: checkoutAmount,
    currency: "AED",

    reference: `ORDER-${sale.id}`,
    description: `Order #${sale.id}`,

    payment_type: "Regular",

    processing_channel_id: process.env.CHECKOUT_PROCESSING_CHANNEL_ID,

    customer: {
      name: sale.customer.name || sale.shipping.name,
      email: sale.customer.email,
    },

    customer: {
      name: sale.customer.name || sale.shipping.name,
      email: sale.customer.email || "customer@example.com",
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
        country: "AE",
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
        country: "AE",
      },
      phone: {
        country_code: "+880",
        number: sale.shipping.phone,
      },
    },

    metadata: {
      order_id: sale.id.toString(),
    },

    success_url: `${nextBaseUrl}/checkout/payment/success?order=${sale.id}`,
    failure_url: `${nextBaseUrl}/checkout/payment/fail?order=${sale.id}`,
  };

  const baseUrl =
    process.env.CHECKOUT_SANDBOX === "sandbox"
      ? `https://${process.env.CHECKOUT_API_PREFIX}.api.sandbox.checkout.com`
      : `https://${process.env.CHECKOUT_API_PREFIX}.api.checkout.com`;

  const response = await fetch(`${baseUrl}/payment-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHECKOUT_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  return body;
};
