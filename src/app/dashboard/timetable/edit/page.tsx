"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
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

const INITIAL_MEALS: Record<string, Record<string, string>> = {
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

export default function EditTimetablePage() {
  const [meals, setMeals] = useState(INITIAL_MEALS);

  const handleMealChange = (
    day: string,
    mealType: string,
    value: string
  ) => {
    setMeals({
      ...meals,
      [day]: {
        ...meals[day],
        [mealType]: value,
      },
    });
  };

  return (
    <div className="min-h-screen bg-app_bg font-sans">
      {/* Header - Fixed at top */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={conts.paths.timetable}
              className="text-text2 hover:text-text1 transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftOutlined className="text-xl" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-text1 leading-tight">Edit Timetable</h1>
              <p className="text-xs text-text2">Customize your weekly meal plan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={conts.paths.foodPreferences}
              className="px-4 py-2 rounded-lg font-medium text-app_secondary border border-app_secondary hover:bg-orange-50 transition-colors text-sm"
            >
              Edit Preferences
            </Link>
            <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2">
              <SaveOutlined />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Days Grid */}
        <div className="space-y-6">
          {DAYS.map((day) => (
            <div key={day} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-text1 mb-4">{day}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MEAL_TYPES.map((mealType) => (
                  <div key={mealType} className="space-y-1.5">
                    <label className="block text-xs font-medium text-text2">
                      {mealType}
                    </label>
                    <input
                      type="text"
                      value={meals[day]?.[mealType] || ""}
                      onChange={(e) =>
                        handleMealChange(day, mealType, e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-text1 focus:outline-none focus:ring-2 focus:ring-app_primary/20 focus:border-app_primary transition-all placeholder-gray-300"
                      placeholder={`Enter ${mealType.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Meal Planning Tips */}
        <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-6">
          <h3 className="text-base font-bold text-[#0D47A1] mb-3">
            Meal Planning Tips
          </h3>
          <ul className="space-y-2">
            {[
              "Include a variety of proteins, carbs, and vegetables",
              "Plan for leftovers to save time and money",
              "Consider seasonal ingredients for better taste and value",
              "Balance heavy and light meals throughout the week"
            ].map((tip, i) => (
              <li key={i} className="text-sm text-[#1565C0] flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[#1976D2] shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

