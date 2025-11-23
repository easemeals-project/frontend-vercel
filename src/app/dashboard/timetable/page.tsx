"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import Sidebar from "../_components/Sidebar";
import conts from "@/lib/conts";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

const SAMPLE_MEALS: Record<string, Record<string, string>> = {
  Monday: {
    Breakfast: "Oat and Tiger Nuts Pap",
    Lunch: "Coconut Rice and Grilled Fish",
    Dinner: "Wheat and Vegetable Soup",
  },
  Tuesday: {
    Breakfast: "Wheat Meal and Vegetable",
    Lunch: "Ofada Rice and Vegetable Sauce",
    Dinner: "Semolina and Efo Riro",
  },
  Wednesday: {
    Breakfast: "Moi Moi and Zobo Drink",
    Lunch: "Beans and Vegetable Salad",
    Dinner: "Eba and Okra Soup",
  },
  Thursday: {
    Breakfast: "Boiled Plantain and Fish Sauce",
    Lunch: "Boiled Yam and Fish Sauce",
    Dinner: "Unripe Plantain and Vegetable Sauce",
  },
  Friday: {
    Breakfast: "Acha and Vegetable Sauce",
    Lunch: "Brown Rice Jollof",
    Dinner: "Amala and Ewedu Soup",
  },
  Saturday: {
    Breakfast: "Unripe Plantain Porridge",
    Lunch: "Moin Moin and Vegetable Salad",
    Dinner: "Boiled Sweet Potato and Fish Sauce",
  },
  Sunday: {
    Breakfast: "Oatmeal and Fruit Salad",
    Lunch: "Unripe Plantain Porridge",
    Dinner: "Vegetable Yam Porridge",
  },
};

export default function TimetablePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Healthy");

  return (
    <div className="min-h-screen bg-app_bg flex font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text1 hover:text-app_primary transition-colors"
            >
              <MenuOutlined className="text-xl" />
            </button>
            <div className="hidden lg:block w-6" /> {/* Spacer for alignment if needed */}
          </div>
          
          <h1 className="text-xl font-bold text-text1 absolute left-1/2 transform -translate-x-1/2">
            Weekly Meal Plan
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

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Weekly Budget Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-text1 mb-1">Weekly Budget</h2>
                <p className="text-3xl font-bold text-text1">₦45,500</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={conts.paths.timetable + "/edit"}
                  className="px-6 py-3 rounded-lg font-semibold text-app_secondary border border-app_secondary hover:bg-orange-50 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">✏️</span>
                  Edit Timetable
                </Link>
                <Link
                  href={conts.paths.checkout}
                  className="bg-app_secondary hover:bg-[#F4511E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ShoppingCartOutlined className="text-lg" />
                  Checkout
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 px-2">
              {["Low Budget", "Healthy", "Luxury"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-3 text-sm font-medium transition-all relative ${
                    selectedTab === tab
                      ? "text-app_primary"
                      : "text-text2 hover:text-text1"
                  }`}
                >
                  {tab}
                  {selectedTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-app_primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Meal Plan Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-100">
                      <th className="p-4 text-left text-xs font-bold text-text1 uppercase tracking-wider w-24">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-app_secondary">
                          <span className="text-lg">📝</span> 
                        </div>
                      </th>
                      {DAYS.map((day) => (
                        <th
                          key={day}
                          className="p-4 text-left text-sm font-semibold text-text1 min-w-[140px]"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MEAL_TYPES.map((mealType) => (
                      <tr key={mealType} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-xs font-bold text-text2 uppercase tracking-wide bg-gray-50/30">
                          {mealType}
                        </td>
                        {DAYS.map((day) => (
                          <td key={`${day}-${mealType}`} className="p-4 align-top">
                            <p className="text-xs text-text2 leading-relaxed">
                              {SAMPLE_MEALS[day]?.[mealType] || "-"}
                            </p>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-text1 mb-6">Nutrition Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <p className="text-xs text-text2 mb-1">Daily Average</p>
                  <p className="text-xl font-bold text-text1">2,100 kcal</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <p className="text-xs text-text2 mb-1">Protein</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-text1">95g</p>
                      <CheckCircleFilled className="text-app_secondary text-sm" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <p className="text-xs text-text2 mb-1">Carbs</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-text1">240g</p>
                      <span className="text-yellow-400 text-sm font-bold">!</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <p className="text-xs text-text2 mb-1">Fat</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-text1">65g</p>
                      <CheckCircleFilled className="text-app_secondary text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

