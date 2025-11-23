"use client";

import { useState, useEffect } from "react";
import { Card, Input, Button, message } from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  instructions?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [serviceOption, setServiceOption] = useState("ingredients");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  useEffect(() => {
    const savedAddresses = localStorage.getItem("userAddresses");
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      if (parsed.length > 0) {
        const defaultAddr = parsed[0];
        setFullName(defaultAddr.fullName);
        setPhoneNumber(defaultAddr.phoneNumber);
        setDeliveryAddress(defaultAddr.address);
        setDeliveryInstructions(defaultAddr.instructions || "");
      }
    }
  }, []);

  const handlePlaceOrder = () => {
    message.success("Order placed successfully!");
    router.push("/dashboard/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-app_bg font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href={conts.paths.timetable}
            className="flex items-center gap-2 text-text2 hover:text-text1 transition-colors"
          >
            <ArrowLeftOutlined />
            <span>Back to Meal Plan</span>
          </Link>
          <h1 className="text-xl font-bold text-text1 absolute left-1/2 transform -translate-x-1/2">
            Checkout
          </h1>
          <div className="w-24"></div> 
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Option */}
            <Card className="shadow-sm border-none rounded-xl">
              <h2 className="text-lg font-bold text-text1 mb-6">
                Select Service Option
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setServiceOption("ingredients")}
                  className={`p-6 rounded-xl border cursor-pointer transition-all relative ${
                    serviceOption === "ingredients"
                      ? "border-green-500 bg-[#E8F5E9]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text1">Only Ingredients</h3>
                    {serviceOption === "ingredients" ? (
                      <CheckCircleFilled className="text-[#FF7043] text-xl" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <p className="text-sm text-text2">
                    Get all ingredients delivered to your doorstep
                  </p>
                </div>

                <div
                  onClick={() => setServiceOption("vendors")}
                  className={`p-6 rounded-xl border cursor-pointer transition-all relative ${
                    serviceOption === "vendors"
                      ? "border-green-500 bg-[#E8F5E9]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text1">Food Vendors</h3>
                    {serviceOption === "vendors" ? (
                      <CheckCircleFilled className="text-[#FF7043] text-xl" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <p className="text-sm text-text2">
                    Order prepared meals from our partner restaurants
                  </p>
                </div>

                <div
                  onClick={() => setServiceOption("chef_ingredients")}
                  className={`p-6 rounded-xl border cursor-pointer transition-all relative ${
                    serviceOption === "chef_ingredients"
                      ? "border-green-500 bg-[#E8F5E9]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text1">Ingredients + Chef</h3>
                    {serviceOption === "chef_ingredients" ? (
                      <CheckCircleFilled className="text-[#FF7043] text-xl" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <p className="text-sm text-text2">
                    Get ingredients and a chef to prepare your meals
                  </p>
                </div>

                <div
                  onClick={() => setServiceOption("chef_only")}
                  className={`p-6 rounded-xl border cursor-pointer transition-all relative ${
                    serviceOption === "chef_only"
                      ? "border-green-500 bg-[#E8F5E9]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text1">Chef Only</h3>
                    {serviceOption === "chef_only" ? (
                      <CheckCircleFilled className="text-[#FF7043] text-xl" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <p className="text-sm text-text2">
                    Hire a chef to prepare meals with your own ingredients
                  </p>
                </div>
              </div>
            </Card>

            {/* Delivery Information */}
            <Card className="shadow-sm border-none rounded-xl">
              <h2 className="text-lg font-bold text-text1 mb-6">
                Delivery Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Full Name
                  </label>
                  <Input
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Phone Number
                  </label>
                  <Input
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Delivery Address
                  </label>
                  <Input
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <Input.TextArea
                    className="rounded-lg border-gray-300"
                    rows={4}
                    placeholder="Any special delivery instructions"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-none rounded-xl sticky top-24">
              <h2 className="text-lg font-bold text-text1 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Weekly Meal Plan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Days</span>
                  <span className="font-medium text-text1">7 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Total Meals</span>
                  <span className="font-medium text-text1">21 meals</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Total Calories</span>
                  <span className="font-medium text-text1">14,700 kcal</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <p className="text-xs text-text2 mb-3">Includes meals like:</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs">
                      🥣
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text1">
                        Monday Breakfast
                      </p>
                      <p className="text-xs text-text2">
                        Oat and Tiger Nuts Pap
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs">
                      🥗
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text1">
                        Wednesday Lunch
                      </p>
                      <p className="text-xs text-text2">
                        Beans and Vegetable Salad
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs">
                      🍲
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text1">
                        Friday Dinner
                      </p>
                      <p className="text-xs text-text2">Amala and Ewedu Soup</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Meal Plan Cost</span>
                  <span className="font-medium text-text1">₦45,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Delivery Fee</span>
                  <span className="font-medium text-text1">₦1,500</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span className="text-text1">Total</span>
                  <span className="text-text1">₦47,000</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text1 mb-2">
                  Payment Method
                </label>
                <div
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-gray-200"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center gap-3">
                    <CreditCardOutlined className="text-xl text-text1" />
                    <span className="font-medium text-text1">Pay with Card</span>
                  </div>
                  {paymentMethod === "card" && (
                    <CheckCircleFilled className="text-[#FF7043]" />
                  )}
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handlePlaceOrder}
                className="bg-[#FF5722] hover:bg-[#F4511E] border-none h-12 text-lg font-bold rounded-lg"
              >
                Complete Order
              </Button>

              <p className="text-[10px] text-text2 text-center mt-4 px-4 leading-tight">
                By completing this order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
