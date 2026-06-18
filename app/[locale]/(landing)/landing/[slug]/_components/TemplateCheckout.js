"use client";

import { usePlaceAnOrderMutation } from "@/store/api/orderAPI";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setGlobalLoader } from "@/store/slices/commonSlice";

export default function TemplateCheckout({ product, settings }) {
  const [placeAnOrder] = usePlaceAnOrderMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [shippingOption, setShippingOption] = useState("inside");
  const [selectedPrice, setSelectedPrice] = useState(
    product?.barcodes?.[0]?.discount_selling_price || 0
  );
  const [selectedBarcodeId, setSelectedBarcodeId] = useState(
    product?.barcodes?.[0]?.id || null
  );
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const calculateShippingCost = () =>
    shippingOption === "inside"
      ? settings?.inside_dhaka_delivery_charges
      : shippingOption === "outside"
      ? settings?.outside_dhaka_delivery_charges
      : 0;

  const calculateSubtotal = () => selectedPrice;

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCost = calculateShippingCost();
    // console.log("Subtotal:", subtotal);
    // console.log("Shipping cost:", shippingCost);
    const grandTotal = subtotal + shippingCost;
    // console.log("Grand total:", grandTotal);
    return grandTotal;
  };

  const calculateTotal = () => calculateGrandTotal(); // Use calculateGrandTotal for total

  useEffect(() => {
    const validBarcodes = product?.barcodes?.filter(
      (item) => item.size && item.color
    );
    if (validBarcodes?.length > 0) {
      setSelectedPrice(validBarcodes[0].discount_selling_price);
      setSelectedBarcodeId(validBarcodes[0].id);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderPlace = async () => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const delivery_type =
      shippingOption === "inside"
        ? "inside dhaka"
        : shippingOption === "outside"
        ? "outside dhaka"
        : "sub dhaka";

    const order_items =
      product?.barcodes
        ?.filter((item) => item.id === selectedBarcodeId)
        .map((item) => ({
          barcode_id: item.id,
          price: item.discount_selling_price,
          quantity: 1, // Default quantity set to 1
        })) || [];

    if (
      !name ||
      !phone ||
      !address ||
      !delivery_type ||
      order_items.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const subtotal = calculateSubtotal();
    const grand_total = calculateGrandTotal();

    // Check if both subtotal and grand_total are valid numbers
    if (
      isNaN(subtotal) ||
      isNaN(grand_total) ||
      subtotal <= 0 ||
      grand_total <= 0
    ) {
      toast.error("Invalid price calculation. Please try again.");
      return;
    }

    const newOrder = {
      name,
      phone,
      address,
      order_items,
      payment_type: "COD",
      delivery_type,
      delivery_charge: calculateShippingCost(),
      // subtotal: parseFloat(subtotal.toFixed(2)),
      subtotal: subtotal,
      // grand_total: parseFloat(grand_total.toFixed(2)), // Ensure consistent formatting
      grand_total: grand_total,
      // use_wholesale_forcely: true, // You can modify this field as needed
    };

    //  console.log("newOrder", newOrder);

    try {
      dispatch(setGlobalLoader(true));
      const response = await placeAnOrder({
        newOrder,
        isGuestCheckout: true,
      }).unwrap();
      toast.success("Order placed successfully!");
      router.push(`/checkout/success/${response.sale?.id}?template=true`);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to place an order.");
    } finally {
      dispatch(setGlobalLoader(false));
    }
  };

  return (
    <div>
      <div className="bg-[#FFA000] md:max-w-7xl w-5xl mx-auto py-4 px-10 rounded-lg">
        <h2 className="text-center text-[26px] text-white font-bold font-hind mx-10">
          তাই আর দেরি না করে আজই অর্ডার করুন
        </h2>
      </div>

      <div className="py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto border-2 border-[#FFA000] rounded-xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex w-full relative">
              {/* Billing Details Section */}

              <div className="md:w-full p-8">
                <h2 className="text-2xl font-semibold mb-6 font-hind">
                  Billing details
                </h2>

                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleOrderPlace();
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-hind">
                      নাম লিখুন <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-hind"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-hind">
                      ঠিকানা লিখুন <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-hind"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-hind">
                      নম্বর লিখুন <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="আপনার মোবাইল নম্বর লিখুন"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-hind"
                    />
                  </div>

                  <div className="max-w-2xl  rounded-lg">
                    {product?.barcodes?.some(
                      (item) => item.size || item.color
                    ) ? (
                      <>
                        <h1 className="text-2xl font-bold mb-4">
                          পণ্য সিলেক্ট করুন
                        </h1>
                        <div className="space-y-4">
                          {product?.barcodes
                            ?.filter((item) => item.size || item.color)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="border rounded-lg p-4 shadow-sm border-[#FFA000]"
                              >
                                <label className="flex items-center justify-between cursor-pointer">
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      name="product"
                                      className="mr-2"
                                      value={item.id}
                                      checked={selectedBarcodeId === item.id}
                                      onChange={() => {
                                        setSelectedPrice(
                                          item.discount_selling_price
                                        );
                                        setSelectedBarcodeId(item.id);
                                      }}
                                    />
                                    <div className="flex gap-2">
                                      <p className="text-sm font-semibold">{`Size: ${
                                        item.size || "N/A"
                                      }`}</p>
                                      <p className="text-sm font-semibold">{`Color: ${
                                        item.color || "N/A"
                                      }`}</p>
                                    </div>
                                  </div>
                                  <p className="text-lg font-bold text-gray-800">
                                    ৳
                                    {item.discount_selling_price.toLocaleString()}
                                  </p>
                                </label>
                                <p className="text-sm text-gray-500">
                                  (ঢাকার ভেতর{" "}
                                  {settings?.inside_dhaka_delivery_charges} টাকা
                                  ঢাকার বাইরে{" "}
                                  {settings?.outside_dhaka_delivery_charges}{" "}
                                  টাকা ডেলিভারি চার্জ যোগ হবে)
                                </p>
                              </div>
                            ))}
                        </div>
                      </>
                    ) : (
                      <span className=""></span>
                    )}
                  </div>

                  <div className="absolute md:right-5 right-[-26px] bottom-[-12px] w-[430px]">
                    <button
                      type="submit"
                      className="md:w-full w-9/12 mx-auto bg-[#FFA000] text-black py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2 transition duration-200"
                    >
                      <span className="font-hind text-[#fff]">অর্ডার দিন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary Section */}
              <div className="md:w-7/12 bg-gray-50 p-8 border-l">
                <h2 className="text-2xl font-semibold mb-6 font-hind">
                  আপনার অর্ডার
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <p className="font-hind">সাবটোটাল </p>
                    <p className="font-medium font-hind">
                      ৳{selectedPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="py-4">
                    <p className="font-medium mb-2 font-hind">শিপিং</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="shipping"
                          value="inside"
                          checked={shippingOption === "inside"}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="text-yellow-500 focus:ring-yellow-500"
                        />
                        <span className="font-hind">
                          ঢাকার মধ্যে :{" "}
                          {settings?.inside_dhaka_delivery_charges}
                        </span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="shipping"
                          value="outside"
                          checked={shippingOption === "outside"}
                          onChange={(e) => setShippingOption(e.target.value)}
                          className="text-yellow-500 focus:ring-yellow-500"
                        />
                        <span className="font-hind">
                          ঢাকার বাইরে :{" "}
                          {settings?.outside_dhaka_delivery_charges}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between py-4 border-t border-b">
                    <p className="font-semibold font-hind">সর্বমোট</p>
                    <p className="font-semibold font-hind">
                      ৳{calculateTotal().toLocaleString()}
                    </p>
                  </div>
                  <div className="py-4">
                    <p className="font-medium mb-2 font-hind">
                      ক্যাশ অন ডেলিভারি
                    </p>
                    <p className="text-sm text-gray-600 font-hind">
                      ডেলিভারির সময় নগদ অর্থ প্রদান করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-[16px] font-semibold font-hind text-center py-4 pt-10">
              সরাসরি অর্ডার করতে অথবা ফ্রি কনসাল্টেশন পেতে কল করুনঃ
              +8801628080802
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
