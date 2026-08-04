// Calculating coupon discount
/**
 * The getCouponDiscount function calculates the discount amount based on the discount coupon type and
 * total price.
 * @param discountCoupon - An object representing the discount coupon. It should have the following
 * properties:
 * @param totalPrice - The total price of the items in the cart.
 * @returns The function `getCouponDiscount` returns the discount amount based on the discount coupon
 * and total price.
 */
export const getCouponDiscount = (discountCoupon, totalPrice) => {
  if (
    !discountCoupon ||
    discountCoupon?.coupon_type !== "cart" ||
    discountCoupon?.minimum_order > totalPrice // minimum_order_amount
  ) {
    return 0;
  }
  let discountAmount = 0;
  if (discountCoupon?.discount_type === "percentage") {
    discountAmount = totalPrice * (discountCoupon?.discount_amount / 100);
    if (discountAmount > discountCoupon?.max_discount) {
      return discountCoupon?.max_discount || 0;
    }
    return discountAmount;
  } else if (discountCoupon?.discount_type === "flat") {
    return discountCoupon?.discount_amount;
  }
  return discountAmount;
};


export const getOrderValueDiscount = (orderValueDiscounts, subTotal) => {
  if (!Array.isArray(orderValueDiscounts) || orderValueDiscounts.length === 0) {
    return 0;
  }

  const sortedDiscounts = [...orderValueDiscounts].sort(
    (a, b) => parseFloat(b.min_order_value) - parseFloat(a.min_order_value),
  );

  const matchedDiscount = sortedDiscounts.find(
    (discount) => subTotal >= parseFloat(discount.min_order_value),
  );

  if (!matchedDiscount) {
    return 0;
  }

  const discountValue = parseFloat(matchedDiscount.discount_value) || 0;

  if (matchedDiscount.discount_type === "percentage") {
    return (subTotal * discountValue) / 100;
  }

  // flat / fixed amount discount
  return discountValue;
};

//Formatting cart items for order
/**
 * Formats cart items into order_items payload. For items that have an active
 * buy_x_get_y promotion and the customer's quantity meets the buy_qty threshold,
 * appends the selected free product barcodes as separate zero-price line items.
 */
export const getOrderFormattedCartItems = (allCartItems) => {
  const order_items = [];

  allCartItems.forEach((item) => {
    // Regular paid line item
    order_items.push({
      barcode_id: item.barcodeId,
      quantity: item.quantity,
      price: item.finalPrice || 0,
    });

    // Buy X Get Y free items (if eligible)
    const { buy_x_get_y, selectedFreeProducts, quantity } = item;
    if (buy_x_get_y && selectedFreeProducts) {
      const buyQty = parseFloat(buy_x_get_y.buy_qty);
      if (buyQty > 0 && quantity >= buyQty) {
        const eligibleSets = Math.floor(quantity / buyQty);

        buy_x_get_y.get_products?.forEach((freeProduct) => {
          const selectedVariant = selectedFreeProducts[freeProduct.id];
          if (!selectedVariant) return; // no variant selected yet, skip

          const freeQty = parseFloat(freeProduct.get_qty) * eligibleSets;
          if (freeQty <= 0) return;

          order_items.push({
            barcode_id: selectedVariant.id,
            quantity: freeQty,
            price: 0,
            promotion_type: "buy_x_get_y",
            promotion_id: buy_x_get_y.id,
          });
        });
      }
    }
  });

  return order_items;
};

// (item.minimum_wholesale_quantity > 0 &&
// item.quantity >= item.minimum_wholesale_quantity

/**
 * The function calculates the total price of items in a shopping cart based on their quantity and
 * discount selling price.
 * @param allCartItems - An array of objects representing the items in the cart. Each object should
 * have the following properties:
 * @returns the total value of the cart items.
 */
export const getCartTotal = (allCartItems) => {
  let total = 0;
  if (Array.isArray(allCartItems)) {
    allCartItems.forEach((item) => {
      total +=
        (item?.quantity || 1) * item.finalPrice; // Use finalPrice instead of new_price
    });
  }
  return total;
};

/**
 * The function `getDefaultFormValues` returns an object with default values for the form of
 * shipping information. The default values are retrieved from the local storage. If the values
 * are not found in the local storage, the fields are set as empty strings.
 * @returns An object with the following properties:
 * name: The default name of the user.
 * address: The default address of the user.
 * phone: The default phone number of the user.
 * city: The default city of the user.
 */
export const getDefaultFormValues = () => ({
  name: localStorage.getItem("name") || "",
  address: localStorage.getItem("address") || "",
  phone: localStorage.getItem("phone") || "",
  city: localStorage.getItem("city") || "",
});

/**
 * This function takes an array of active payment methods and returns the auto selected payment option
 *
 * If there are no active payment methods, it returns null.
 *
 * If there is only one active payment method, it returns the key of the payment method.
 *
 * If the key of the only active payment method is 'COD', it returns 'no_payment', otherwise it
 * returns 'total_payment'.
 */
export const getAutoSelectedPaymentOption = (activePaymentMethods) => {
  if (!activePaymentMethods || activePaymentMethods.length === 0) return null;
  const isCodExists = activePaymentMethods?.find(
    (payMethod) => payMethod?.key === "COD",
  );

  if (activePaymentMethods.length === 1) {
    if (activePaymentMethods[0].key === "COD") return "no_payment";
    else return "total_payment";
  } else if (activePaymentMethods.length > 1 && !isCodExists) {
    return "total_payment";
  }
};

// When is_free_delivery is active for single product
export const getFreeDelivery = (allCartItems = []) => {
  if (allCartItems.length === 0) return false;
  return allCartItems.every((item) => item?.is_free_delivery === 1);
};
