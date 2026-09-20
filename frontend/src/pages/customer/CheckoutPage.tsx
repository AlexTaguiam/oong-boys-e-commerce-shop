/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  Store,
  Banknote,
  Smartphone,
  // CreditCard,
  ShoppingBag,
  Loader2,
  ArrowLeft,
  UserCog,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { createOrder } from "@/services/order.service";
import { createIntentForCart } from "@/services/payment.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OrderSuccessScreen from "@/components/checkout/OrderSuccessScreen";
import { type CartItem } from "@/types/cart";
import { type CreateOrderPayload } from "@/services/order.service";

interface FormValidationErrors {
  contactPhone?: string;
  deliveryAddress?: string;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { dbProfile } = useAuth();
  const navigate = useNavigate();
  console.log("cartItems: ", cartItems);

  // Checkout Matrix States
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "gcash" | "card">(
    "cod",
  );

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Pre-fill contact phone and delivery address from the saved profile.
  // The customer can still edit either for this specific order.
  useEffect(() => {
    if (!dbProfile) return;
    setContactPhone((prev) => prev || dbProfile.phone || "");
    setDeliveryAddress((prev) => prev || dbProfile.address || "");
  }, [dbProfile]);

  // A profile is "complete enough" to check out when a real name is set.
  // Our OAuth fallback stores the email local-part as the name, which we
  // treat as "not set" so those users are nudged to complete their profile.
  const emailLocalPart = dbProfile?.email
    ? dbProfile.email.split("@")[0]
    : "";
  const hasRealName =
    !!dbProfile?.name?.trim() &&
    dbProfile.name.trim().toLowerCase() !== emailLocalPart.toLowerCase();
  const profileIncomplete = !hasRealName;

  // Client Validation Engine
  const validateForm = (): boolean => {
    const trackingErrors: FormValidationErrors = {};
    const phoneRegex = /^[0-9+\-\s]{10,15}$/;

    if (!contactPhone.trim()) {
      trackingErrors.contactPhone = "A contact phone number is required.";
    } else if (!phoneRegex.test(contactPhone)) {
      trackingErrors.contactPhone =
        "Please provide a valid numeric telephone record string.";
    }

    if (fulfillmentType === "delivery" && !deliveryAddress.trim()) {
      trackingErrors.deliveryAddress =
        "A specific shipping delivery destination is required.";
    }

    setErrors(trackingErrors);
    return Object.keys(trackingErrors).length === 0;
  };

  const handleCheckoutSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hard requirement: a real name must be on file before ordering so the
    // admin/order records identify the customer properly.
    if (profileIncomplete) {
      toast.error("Please complete your profile (name) before checking out.");
      navigate("/profile");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    // COD keeps the existing order-first checkout path.
    const payload: CreateOrderPayload = {
      fulfillmentType,
      contactPhone: contactPhone.trim(),
      // Map non-COD payment methods to 'paymongo' if your backend order schema requires it,
      // or pass paymentMethod directly if backend accepts 'gcash' and 'card'
      paymentMethod,
      ...(fulfillmentType === "delivery" && {
        deliveryAddress: deliveryAddress.trim(),
      }),
      items: cartItems.map((item: CartItem) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    };

    console.log("payload: ", payload);

    if (paymentMethod === "cod") {
      try {
        const orderResponse = await createOrder(payload);
        console.log("OrderResponse:", orderResponse);
        if (!orderResponse.success || !orderResponse.data) {
          throw new Error(
            orderResponse.message ||
              "Failed to initialize order instance allocations.",
          );
        }
        clearCart();
        setPlacedOrder(orderResponse.data);
        toast.success("Your balance structure configuration cleared.");
      } catch (error: any) {
        console.error("Order pipeline submission collision tracking:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "System fault runtime processing error.",
        );
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const intentResponse = await createIntentForCart({
        fulfillmentType,
        deliveryAddress:
          fulfillmentType === "delivery" ? deliveryAddress : undefined,
        contactPhone,
        paymentMethod,
        items: cartItems.map((item: CartItem) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      });
      if (intentResponse.data?.checkout_url) {
        clearCart();
        window.location.href = intentResponse.data.checkout_url;
      } else {
        throw new Error("Missing payment redirection routing links context.");
      }
    } catch (intentError: any) {
      console.error("Intent generation failure state details:", intentError);
      toast.error(
        intentError.response?.data?.message ||
          "Could not start payment. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  // Condition 1: Inline COD Confirmation Screen Trigger Block
  if (placedOrder) {
    return (
      <div className="w-full min-h-screen bg-[#faf8f4]">
        <OrderSuccessScreen
          orderId={placedOrder.orderId}
          totalAmount={parseFloat(placedOrder.totalAmount) || cartTotal}
          fulfillmentType={placedOrder.fulfillmentType}
        />
      </div>
    );
  }

  // Condition 2: Empty Cart Component State Handler UI Elements
  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[70vh] bg-[#faf8f4] flex flex-col items-center justify-center px-4 font-sans text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#2d4029] mb-1.5">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-gray-400 font-medium max-w-xs mb-6 leading-relaxed">
          You must select allocations before entering the payment pipeline
          stages.
        </p>
        <Button
          nativeButton={false}
          render={<Link to="/catalog"></Link>}
          className="bg-[#4c6a46] hover:bg-[#3d5538] text-white rounded-xl shadow-md font-semibold text-xs px-6 h-10"
        >
          Browse Our Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#faf8f4] font-sans antialiased py-8 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center">
          <Button
            nativeButton={false}
            render={
              <Link to="/cart">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shopping Cart</span>
              </Link>
            }
            variant="ghost"
            className="text-[#4c6a46] hover:text-[#3d5538] hover:bg-[#4c6a46]/5 rounded-xl font-semibold text-xs gap-2 -ml-2"
          ></Button>
        </div>

        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2d4029]">
          Checkout Allocation
        </h1>

        {/* Profile completion gate — customers must set a real name first */}
        {profileIncomplete && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Complete your profile before checking out. We need your full
                name so we can process and identify your order.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => navigate("/profile")}
              className="bg-[#4c6a46] hover:bg-[#3d5538] text-white rounded-xl shadow-sm font-semibold text-xs h-9 px-4 gap-2 shrink-0"
            >
              <UserCog className="w-3.5 h-3.5" />
              Complete Profile
            </Button>
          </div>
        )}

        <form
          onSubmit={handleCheckoutSubmission}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Form Parameters Formulations */}
          <div className="lg:col-span-7 bg-white border border-gray-200/60 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
            {/* Component Item 1: Fulfillment Selection Configuration Context */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#2d4029]">
                Fulfillment Framework Method
              </Label>
              <RadioGroup
                value={fulfillmentType}
                onValueChange={(val: "delivery" | "pickup") => {
                  setFulfillmentType(val);
                  // Clean dependent state warnings triggers if moving off delivery pathways
                  if (val === "pickup")
                    setErrors((prev) => ({
                      ...prev,
                      deliveryAddress: undefined,
                    }));
                }}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem
                    value="delivery"
                    id="type-delivery"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="type-delivery"
                    className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                      fulfillmentType === "delivery"
                        ? "border-[#4c6a46] bg-[#4c6a46]/5 text-[#2d4029] ring-1 ring-[#4c6a46]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <Truck
                      className={`w-4 h-4 ${fulfillmentType === "delivery" ? "text-[#4c6a46]" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">
                        Standard Delivery
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        To shipping address
                      </span>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="pickup"
                    id="type-pickup"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="type-pickup"
                    className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                      fulfillmentType === "pickup"
                        ? "border-[#4c6a46] bg-[#4c6a46]/5 text-[#2d4029] ring-1 ring-[#4c6a46]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <Store
                      className={`w-4 h-4 ${fulfillmentType === "pickup" ? "text-[#4c6a46]" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Store Pickup</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Collect directly at hub
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Component Item 2: Conditional Address Inputs Segmentations */}
            {fulfillmentType === "delivery" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <Label
                  htmlFor="address-input"
                  className="text-xs font-bold uppercase tracking-wider text-[#4c6a46]"
                >
                  Shipping Destination Address
                </Label>
                <Input
                  id="address-input"
                  type="text"
                  placeholder="Street Name, Barangay, City, Province"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={`rounded-xl text-xs h-10 text-[#4c6a46] border-gray-200 focus-visible:ring-[#4c6a46] ${
                    errors.deliveryAddress
                      ? "border-red-300 focus-visible:ring-red-400"
                      : ""
                  }`}
                />
                {errors.deliveryAddress && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>
            )}

            {/* Component Item 3: Contact Details Allocations Matrices */}
            <div className="space-y-2">
              <Label
                htmlFor="phone-input"
                className="text-xs font-bold uppercase tracking-wider text-[#2d4029]"
              >
                Contact Telephone String
              </Label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="0917XXXXXXX or +63XXXXXXXXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={`rounded-xl text-xs h-10 border-gray-200 text-[#4c6a46] focus-visible:ring-[#4c6a46] ${
                  errors.contactPhone
                    ? "border-red-300 focus-visible:ring-red-400"
                    : ""
                }`}
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-[11px] font-semibold mt-1">
                  {errors.contactPhone}
                </p>
              )}
            </div>

            {/* Component Item 4: Payment Network Route Providers Options */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#2d4029]">
                Payment Gateway Matrix
              </Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val: "cod" | "gcash" | "card") =>
                  setPaymentMethod(val)
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {/* Option A: Cash On Delivery */}
                <div>
                  <RadioGroupItem
                    value="cod"
                    id="pay-cod"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="pay-cod"
                    className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#4c6a46] bg-[#4c6a46]/5 text-[#2d4029] ring-1 ring-[#4c6a46]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <Banknote
                      className={`w-4 h-4 shrink-0 ${paymentMethod === "cod" ? "text-[#4c6a46]" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">
                        Cash On Delivery
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Settle at receipt
                      </span>
                    </div>
                  </Label>
                </div>

                {/* Option B: GCash */}
                <div>
                  <RadioGroupItem
                    value="gcash"
                    id="pay-gcash"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="pay-gcash"
                    className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                      paymentMethod === "gcash"
                        ? "border-[#4c6a46] bg-[#4c6a46]/5 text-[#2d4029] ring-1 ring-[#4c6a46]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <Smartphone
                      className={`w-4 h-4 shrink-0 ${paymentMethod === "gcash" ? "text-[#4c6a46]" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">GCash</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Via PayMongo
                      </span>
                    </div>
                  </Label>
                </div>

                {/* Option C: Credit / Debit Card */}
                {/* <div>
                  <RadioGroupItem
                    value="card"
                    id="pay-card"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="pay-card"
                    className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                      paymentMethod === "card"
                        ? "border-[#4c6a46] bg-[#4c6a46]/5 text-[#2d4029] ring-1 ring-[#4c6a46]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <CreditCard
                      className={`w-4 h-4 shrink-0 ${paymentMethod === "card" ? "text-[#4c6a46]" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">
                        Credit / Debit Card
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Via PayMongo
                      </span>
                    </div>
                  </Label>
                </div> */}
              </RadioGroup>
            </div>
          </div>

          {/* Right Column: Dynamic Invoice Ledger Aggregation Summaries */}
          <div className="lg:col-span-5 bg-white border border-gray-200/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d4029] border-b border-gray-100 pb-2.5">
              Order Allotment Summary
            </h3>

            {/* Read-only Allocation Items Loop Pipeline */}
            <div className="divide-y divide-gray-100 max-h-[30vh] overflow-y-auto pr-1">
              {cartItems.map((item: CartItem, i: number) => {
                const price = parseFloat(item?.price) || 0;
                const lineTotal = price * item.quantity;
                return (
                  <div
                    key={i}
                    className="flex justify-between items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="overflow-hidden space-y-0.5">
                      <span className="text-xs font-bold text-[#2d4029] block truncate">
                        {item?.name || "Inventory Allocation"}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium block">
                        ₱{price.toLocaleString()} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#2d4029] shrink-0 font-serif">
                      ₱
                      {lineTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Fee Calculations Structuring Block */}
            <div className="border-t border-gray-200/60 pt-4 space-y-2.5 text-xs font-medium text-gray-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-[#2d4029] font-semibold">
                  ₱
                  {cartTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span>Logistics Fulfillment</span>
                <span className="text-[#2d4029] font-semibold">
                  {fulfillmentType === "delivery" ? "₱0.00" : "FREE"}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-[#2d4029]">
                  Total Execution Balance
                </span>
                <span className="font-serif font-bold text-xl text-[#2d4029]">
                  ₱
                  {cartTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Action Directing Dispatch Buttons Layouts */}
            <Button
              type="submit"
              disabled={
                isSubmitting || cartItems.length === 0 || profileIncomplete
              }
              className="w-full rounded-xl text-xs font-bold uppercase tracking-wider h-11 shadow-md bg-[#4c6a46] hover:bg-[#3d5538] text-white transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Checkout Pipelines...</span>
                </span>
              ) : (
                <span>Place Order Allocation</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
