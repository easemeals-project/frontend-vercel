"use client";

import { Card, Button } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";

export default function OrderConfirmationPage() {
  const router = useRouter();

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
            Order Confirmed
          </h1>
          <div className="w-32"></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Success Banner */}
        <Card className="shadow-sm border-none rounded-xl mb-8 text-center py-12">
          <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckOutlined className="text-4xl text-[#4CAF50]" />
          </div>
          <h2 className="text-2xl font-bold text-text1 mb-2">
            Your order has been confirmed!
          </h2>
          <p className="text-text2 mb-8">
            Order #38492 was placed successfully. You'll receive an email
            confirmation shortly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-[#F5F5F5] px-6 py-4 rounded-lg flex items-center gap-3 min-w-[280px] justify-center">
              <CalendarOutlined className="text-text2 text-lg" />
              <span className="text-text1 font-medium">Delivery starts: Monday, June 24</span>
            </div>
            <div className="bg-[#F5F5F5] px-6 py-4 rounded-lg flex items-center gap-3 min-w-[280px] justify-center">
              <ClockCircleOutlined className="text-text2 text-lg" />
              <span className="text-text1 font-medium">Estimated time: 9:00 AM - 11:00 AM</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information */}
            <Card className="shadow-sm border-none rounded-xl">
              <h3 className="text-lg font-bold text-text1 mb-6">
                Delivery Information
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-text2 mb-1">Full Name</p>
                  <p className="font-medium text-text1 text-base">Sarah Johnson</p>
                </div>
                <div>
                  <p className="text-xs text-text2 mb-1">Phone Number</p>
                  <p className="font-medium text-text1 text-base">+234 812 345 6789</p>
                </div>
                <div>
                  <p className="text-xs text-text2 mb-1">Delivery Address</p>
                  <p className="font-medium text-text1 text-base">
                    42 Lagos Avenue, Lekki Phase 1, Lagos, Nigeria
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text2 mb-1">Delivery Instructions</p>
                  <p className="font-medium text-text1 text-base">
                    Please call when you arrive at the gate
                  </p>
                </div>
              </div>
            </Card>

            {/* Service Option */}
            <Card className="shadow-sm border-none rounded-xl">
              <h3 className="text-lg font-bold text-text1 mb-6">
                Service Option
              </h3>
              <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl p-6 flex items-start gap-4">
                <CheckCircleFilled className="text-[#4CAF50] text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-text1 mb-1">Only Ingredients</h4>
                  <p className="text-sm text-text2">
                    Get all ingredients delivered to your doorstep
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-none rounded-xl">
              <h3 className="text-lg font-bold text-text1 mb-6">
                Order Summary
              </h3>

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
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs font-bold">
                      B
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
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs font-bold">
                      L
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
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs font-bold">
                      D
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

              <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-text2">Payment Method</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text1">Wallet</span>
                  <CheckCircleFilled className="text-[#4CAF50]" />
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                className="bg-[#25D366] hover:bg-[#128C7E] border-none h-12 text-lg font-bold rounded-lg"
                onClick={() => router.push("/dashboard/timetable")}
              >
                View My Meal Plan
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
