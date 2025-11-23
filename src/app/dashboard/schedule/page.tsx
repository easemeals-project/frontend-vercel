"use client";

import { useState } from "react";
import { Card, Input, Radio, Checkbox, Button } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Sidebar from "../_components/Sidebar";

const DAYS = [
  { label: "31", day: "TODAY", weekday: "THU" },
  { label: "1", day: "FRI", weekday: "FRI" },
  { label: "2", day: "SAT", weekday: "SAT" },
  { label: "3", day: "SUN", weekday: "SUN" },
  { label: "4", day: "MON", weekday: "MON" },
  { label: "5", day: "TUE", weekday: "TUE" },
  { label: "6", day: "WED", weekday: "WED" },
];

export default function SchedulePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState("31");
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["Dinner"]);

  const handleMealToggle = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  return (
    <div className="min-h-screen bg-app_bg flex font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text1 hover:text-app_primary transition-colors"
            >
              <MenuOutlined className="text-xl" />
            </button>
            <div className="hidden lg:block w-6" />
          </div>
          
          <h1 className="text-xl font-bold text-text1 absolute left-1/2 transform -translate-x-1/2">
            Schedule
          </h1>

          <div className="flex items-center gap-4">
            <button className="text-text2 hover:text-text1 transition-colors">
              <DownloadOutlined className="text-xl" />
            </button>
            <button className="text-text2 hover:text-text1 transition-colors">
              <ReloadOutlined className="text-xl" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 flex items-start justify-center overflow-y-auto">
          <Card className="w-full max-w-4xl shadow-sm rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-text1 mb-8">
              Schedule Your Meal Delivery
            </h2>

            {/* Delivery Location */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-text2 mb-2">
                Delivery Location
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter your delivery address"
                  className="flex-1 h-11 rounded-lg border-gray-300 hover:border-app_primary focus:border-app_primary"
                />
                <button
                  className="bg-app_secondary hover:bg-[#F4511E] text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                >
                  <EnvironmentOutlined />
                  Use Current Location
                </button>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-text2 mb-3">
                Delivery Options
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="now"
                    name="delivery"
                    value="now"
                    checked={deliveryOption === "now"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="w-4 h-4 text-app_primary border-gray-300 focus:ring-app_primary"
                  />
                  <label htmlFor="now" className="text-text1">Deliver Now</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="schedule"
                    name="delivery"
                    value="schedule"
                    checked={deliveryOption === "schedule"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="w-4 h-4 text-app_primary border-gray-300 focus:ring-app_primary"
                  />
                  <label htmlFor="schedule" className="text-text1">Schedule for Later</label>
                </div>
              </div>
            </div>

            {/* Select Date */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-text2 mb-3">
                Select Date
              </label>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {DAYS.map((day) => (
                  <button
                    key={day.label}
                    onClick={() => setSelectedDate(day.label)}
                    className={`flex flex-col items-center justify-center w-[72px] h-[84px] rounded-xl border transition-all shrink-0 ${
                      selectedDate === day.label
                        ? "bg-app_secondary border-app_secondary text-white shadow-md transform scale-105"
                        : "bg-white border-gray-200 text-text1 hover:border-gray-300"
                    }`}
                  >
                    <span className={`text-2xl font-bold ${selectedDate === day.label ? "text-white" : "text-text1"}`}>
                      {day.label}
                    </span>
                    {day.day === "TODAY" ? (
                      <span className="text-[10px] font-medium mt-1">TODAY</span>
                    ) : (
                      <span className="text-[10px] font-medium mt-1 uppercase">{day.weekday}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Types */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-text2 mb-3">
                Select Meal Types, Times & Locations
              </label>
              <div className="space-y-4">
                {[
                  { name: "Breakfast", time: "7:00-8:00 AM" },
                  { name: "Lunch", time: "12:00-1:00 PM" },
                  { name: "Dinner", time: "7:00-8:00 PM" },
                ].map((meal) => (
                  <div
                    key={meal.name}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-3 w-32">
                      <Checkbox
                        checked={selectedMeals.includes(meal.name)}
                        onChange={() => handleMealToggle(meal.name)}
                        className="scale-110"
                      />
                      <span className="text-text1 font-medium">{meal.name}</span>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-text2 text-sm">
                      {meal.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-8 p-4 bg-[#E3F2FD] border border-[#BBDEFB] rounded-lg">
              <p className="text-sm text-[#1565C0]">
                <span className="font-bold">Note:</span> You will be notified about each meal 20 minutes before its
                scheduled delivery time to the specified location.
              </p>
            </div>

            {/* Confirm Button */}
            <button
              className="w-full bg-app_secondary hover:bg-[#F4511E] text-white py-4 rounded-lg text-lg font-bold shadow-sm transition-colors"
            >
              Confirm Schedule
            </button>
          </Card>
        </main>
      </div>
    </div>
  );
}

