export const STATUS_ORDER = [
  "Pending",
  "Confirm",
  "Packing",
  "Delivery",
  "Delivered",
];

export const getOrderTrackingData = (orderData, translations = {}) => {
  const { saleStatus = {}, sale = {} } = orderData || {};

  const currentStatus =
    [...STATUS_ORDER]
      .reverse()
      .find((status) => saleStatus?.[status] !== null) || "Pending";

  const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

  const steps = [
    {
      key: "Pending",
      date: saleStatus?.Pending?.created_at,
      title: translations["order-placed"] || "Order Placed",
      description: "Order placed",
      message: `${
        translations["order-successfully-placed"] ||
        "Order successfully placed"
      } #${sale?.invoice_no || ""}`,
    },
    {
      key: "Confirm",
      date: saleStatus?.Confirm?.created_at,
      title: translations["confirmed"] || "Confirmed",
      description: translations["order-confirmed"] || "Order confirmed",
      message: translations["order-confirmed"] || "Order confirmed",
    },
    {
      key: "Packing",
      date: saleStatus?.Packing?.created_at,
      title: translations["packing"] || "Packing",
      description: translations["product-packing"] || "Product packing",
      message: translations["product-packing"] || "Product packing",
    },
    {
      key: "Delivery",
      date: saleStatus?.Delivery?.created_at,
      title: translations["on-delivery"] || "On Delivery",
      description:
        translations["product-for-delivery"] || "Product for delivery",
      message:
        translations["product-for-delivery"] || "Product for delivery",
    },
    {
      key: "Delivered",
      date: saleStatus?.Delivered?.created_at,
      title: translations["done"] || "Delivered",
      description:
        translations["received-product"] ||
        "You have received your product",
      message:
        translations["received-product"] ||
        "You have received your product",
    },
  ].map((step, index) => ({
    ...step,
    completed: index <= currentStatusIndex,
    isComplete: index <= currentStatusIndex,
  }));

  const totalSteps = steps.length;
  const completedSteps = currentStatusIndex + 1;

  const progress =
    totalSteps <= 1
      ? 0
      : (currentStatusIndex / (totalSteps - 1)) * 100;

  return {
    currentStatus,
    currentStatusIndex,
    steps,
    totalSteps,
    completedSteps,
    progress,
    activeStepData: steps[currentStatusIndex],
  };
};