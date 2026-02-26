"use client";

import { Card, Button, Modal } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  DownloadOutlined,
  HomeOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { message } from "antd";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [timetable, setTimetable] = useState<any>(null); // Using any for simplicity here to avoid full type imports if not needed, or import MealPlan
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  useEffect(() => {
    const savedTimetable = sessionStorage.getItem("currentTimetable");
    const savedAddresses = localStorage.getItem("userAddresses"); // Assuming we saved the used address here or we can just mock the user info for now if not explicitly passed

    if (savedTimetable) {
      setTimetable(JSON.parse(savedTimetable));
    }

    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      if (parsed.length > 0) setDeliveryInfo(parsed[0]);
    }
  }, []);

  const handleDownload = async () => {
    console.log("Download triggered (Confirmation)");
    const timetableElement = document.getElementById("timetable-capture");
    if (!timetableElement) {
      console.error("Timetable element not found");
      Modal.error({
        title: "Download Failed",
        content: "Could not find the timetable element. ID: timetable-capture"
      });
      return;
    }

    try {
      message.loading({ content: "Generating Confirmation PDF...", key: "downloading" });

      const canvas = await html2canvas(timetableElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        windowWidth: timetableElement.scrollWidth,
        windowHeight: timetableElement.scrollHeight
      });

      console.log("Canvas generated successfully (Confirmation)");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`EaseMeals-Order-Confirmation-${new Date().toISOString().split('T')[0]}.pdf`);

      message.success({ content: "Order summary downloaded!", key: "downloading" });
    } catch (error: any) {
      console.error("PDF generation failed", error);
      message.error({ content: "Download failed", key: "downloading" });
      Modal.error({
        title: "Download Failed",
        content: `Error: ${error.message || "Unknown error during PDF generation"}`
      });
    }
  };


  const getNextMonday = () => {
    const now = new Date();
    const nextMonday = new Date(now.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7));
    return nextMonday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
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
            Order Confirmed
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="text-text2 hover:text-text1 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Download Confirmation"
            >
              <DownloadOutlined className="text-xl" />
            </button>
            <Link href={conts.paths.dashboard} className="text-text2 hover:text-text1 transition-colors">
              <HomeOutlined className="text-xl" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl flex flex-col gap-5 mx-auto p-4 lg:p-8">
        {/* Success Banner */}
        <Card className="shadow-sm border-none rounded-xl mb-8 text-center py-12">
          <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckOutlined className="text-4xl text-[#4CAF50]" />
          </div>
          <h2 className="text-2xl font-bold text-text1 mb-2">
            Your order has been confirmed!
          </h2>
          <p className="text-text2 mb-8">
            Order #{Math.floor(Math.random() * 100000)} was placed successfully. You will receive an email
            confirmation shortly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-[#F5F5F5] px-6 py-4 rounded-lg flex items-center gap-3 min-w-[280px] justify-center">
              <CalendarOutlined className="text-text2 text-lg" />
              <span className="text-text1 font-medium">Delivery starts: {getNextMonday()}</span>
            </div>
            <div className="bg-[#F5F5F5] px-6 py-4 rounded-lg flex items-center gap-3 min-w-[280px] justify-center">
              <ClockCircleOutlined className="text-text2 text-lg" />
              <span className="text-text1 font-medium">Estimated time: 9:00 AM - 11:00 AM</span>
            </div>
          </div>
        </Card>

        <div id="timetable-capture" className="bg-app_bg">
          <div className="mb-6 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border-b border-gray-100 print:flex">
            <div className="flex flex-col gap-2">
              <img src="/easemeals-logo.png" alt="EaseMeals" className="h-10 object-contain w-fit" />
              <p className="text-xs text-text2 font-bold uppercase tracking-wider">Order Receipt • {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-text1">PAID</p>
              <p className="text-xs text-app_secondary font-bold">₦{timetable ? (timetable.weeklyCost || timetable.weeklyTotals.totalPrice + 1500).toLocaleString() : "0"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Delivery Information */}
              <Card className="shadow-sm border-none rounded-xl">
                <h3 className="text-lg font-bold text-text1 mb-6">
                  Delivery Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-text2 mb-1">Full Name</p>
                    <p className="font-medium text-text1 text-base">{deliveryInfo?.fullName || "Guest User"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text2 mb-1">Phone Number</p>
                    <p className="font-medium text-text1 text-base">{deliveryInfo?.phoneNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text2 mb-1">Delivery Address</p>
                    <p className="font-medium text-text1 text-base">
                      {deliveryInfo?.address || "No address provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text2 mb-1">Delivery Instructions</p>
                    <p className="font-medium text-text1 text-base">
                      {deliveryInfo?.instructions || "None"}
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
                  <CheckCircleFilled className="text-app_primary/80! text-xl mt-1" />
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
                    <span className="font-medium text-text1">
                      {timetable ? Math.round(timetable.weeklyTotals.totalCals) : 0} kcal
                    </span>
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
                          {timetable?.monday?.breakfast?.[0] || "..."}
                        </p>
                      </div>
                    </div>
                    {/* Just showing one example dynamically to keep it clean */}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text2">Meal Plan Cost</span>
                    <span className="font-medium text-text1">
                      ₦{timetable ? timetable.weeklyTotals.totalPrice.toLocaleString() : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text2">Delivery Fee</span>
                    <span className="font-medium text-text1">₦1,500</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4">
                    <span className="text-text1">Total</span>
                    <span className="text-text1">
                      ₦{timetable ? (timetable.weeklyTotals.totalPrice + 1500).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                  <span className="text-sm text-text2">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text1">Wallet</span>
                    <CheckCircleFilled className="text-app_primary/80!" />
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  className="bg-app_primary! hover:bg-app_primary/80! border-none h-12 text-lg font-bold rounded-lg"
                  onClick={() => router.push("/dashboard/timetable")}
                >
                  View My Meal Plan
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
