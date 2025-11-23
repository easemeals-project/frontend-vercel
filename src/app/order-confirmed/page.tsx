"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button } from "antd";
import { CheckCircleOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import conts from "@/lib/conts";

export default function OrderConfirmedPage() {
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedService, setSelectedService] = useState("ingredients");

  useEffect(() => {
    // Load order details from session/localStorage
    const savedAddresses = localStorage.getItem("userAddresses");
    if (savedAddresses) {
      const addresses = JSON.parse(savedAddresses);
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    }
    const service = sessionStorage.getItem("selectedService") || "ingredients";
    setSelectedService(service);
  }, []);

  return (
    <div className="min-h-screen bg-app_bg p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={conts.paths.timetable}
            className="text-app_primary hover:underline mb-4 inline-block"
          >
            ← Back to Meal Plan
          </Link>
          <h1 className="text-3xl font-bold text-text1 text-center">Order Confirmed</h1>
        </div>

        {/* Confirmation Message */}
        <Card className="text-center mb-6 shadow-md">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircleOutlined className="text-5xl text-app_primary" />
            </div>
            <h2 className="text-2xl font-bold text-text1 mb-2">
              Your order has been confirmed!
            </h2>
            <p className="text-text2 mb-4">
              Order #38492 was placed successfully. You'll receive an email
              confirmation shortly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-text2">
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>Delivery starts: Monday, June 24</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockCircleOutlined />
                <span>Estimated time: 9:00 AM - 11:00 AM</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            {selectedAddress && (
              <Card className="shadow-md">
                <h2 className="text-xl font-bold text-text1 mb-4">
                  Delivery Information
                </h2>
                <div className="space-y-2 text-text2">
                  <div>
                    <span className="font-semibold">Full Name:</span>{" "}
                    {selectedAddress.fullName}
                  </div>
                  <div>
                    <span className="font-semibold">Phone Number:</span>{" "}
                    {selectedAddress.phoneNumber}
                  </div>
                  <div>
                    <span className="font-semibold">Delivery Address:</span>{" "}
                    {selectedAddress.address}
                  </div>
                  {selectedAddress.instructions && (
                    <div>
                      <span className="font-semibold">
                        Delivery Instructions:
                      </span>{" "}
                      {selectedAddress.instructions}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Service Option */}
            <Card className="shadow-md bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleOutlined className="text-app_primary text-xl" />
                <h2 className="text-xl font-bold text-text1">Service Option</h2>
              </div>
              <div className="font-semibold text-text1 mb-1">Only Ingredients</div>
              <div className="text-sm text-text2">
                Get all ingredients delivered to your doorstep
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            <Card className="shadow-md">
              <h2 className="text-xl font-bold text-text1 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text1 mb-2">
                    Weekly Meal Plan
                  </h3>
                  <div className="text-sm text-text2 space-y-1">
                    <div>Days: 7 days</div>
                    <div>Total Meals: 21 meals</div>
                    <div>Total Calories: 14,700 kcal</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-text1 mb-2">
                    Includes meals like:
                  </h4>
                  <div className="text-sm text-text2 space-y-1">
                    <div>Monday Breakfast: Oat and Tiger Nuts Pap</div>
                    <div>Wednesday Lunch: Beans and Vegetable Salad</div>
                    <div>Friday Dinner: Amala and Ewedu Soup</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-text2">
                    <span>Meal Plan Cost</span>
                    <span>₦45,500</span>
                  </div>
                  <div className="flex justify-between text-text2">
                    <span>Delivery Fee</span>
                    <span>₦1,500</span>
                  </div>
                  <div className="flex justify-between font-bold text-text1 text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₦47,000</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-text2">
                    <CheckCircleOutlined className="text-app_primary" />
                    <span>Payment Method: Wallet</span>
                  </div>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  className="bg-app_primary border-app_primary mt-4"
                  onClick={() => window.location.href = conts.paths.timetable}
                >
                  View My Meal Plan
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

