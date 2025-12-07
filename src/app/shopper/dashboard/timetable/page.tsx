"use client";

import { useState } from "react";
import Link from "next/link";
import { Spin, Modal } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { FaExclamation, FaCheck } from "react-icons/fa6";
import Sidebar from "../_components/Sidebar";
import conts from "@/lib/conts";
import { useQuery } from "@apollo/client/react";
import { GET_MEAL_SUGGESTIONS, GET_MEAL_BY_NAME } from "@/graphql/queries";
import { GetMealSuggestionsResult, GetMealByNameResult } from "@/lib/types";

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
            <div className="hidden lg:block w-6" />{" "}
            {/* Spacer for alignment if needed */}
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
                <h2 className="text-sm font-semibold text-text1 mb-1">
                  Weekly Budget
                </h2>
                <p className="text-3xl font-bold text-text1">₦45,500</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={conts.paths.timetable + "/edit"}
                  className="px-6 py-3 rounded-lg font-semibold text-app_secondary text-sm border border-app_secondary hover:bg-orange-50 transition-colors flex items-center gap-2"
                >
                  <EditOutlined className="text-base" />
                  Edit Timetable
                </Link>
                <Link
                  href={conts.paths.checkout}
                  className="bg-app_secondary hover:bg-[#F4511E] text-white text-sm px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ShoppingCartOutlined className="text-base" />
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
                    <tr className="bg-gray-100 border-b border-gray-100">
                      <th className="p-4 text-left text-xs font-bold text-text1 uppercase tracking-wider w-24" />
                      {DAYS.map((day) => (
                        <th
                          key={day}
                          className="p-4 text-center text-sm font-semibold text-text1 min-w-[140px]"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MEAL_TYPES.map((mealType) => (
                      <tr
                        key={mealType}
                        className="hover:bg-gray-50/50 transition-colors divide-x divide-gray-100"
                      >
                        <td className="p-4 align-top text-xs font-bold text-text2 uppercase tracking-wide bg-gray-100">
                          {mealType}
                        </td>
                        {DAYS.map((day) => (
                          <td
                            key={`${day}-${mealType}`}
                            className="p-4 align-top"
                          >
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
              <h3 className="text-base font-bold text-text1 mb-6">
                Nutrition Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <p className="text-xs text-text2 mb-1">Daily Average</p>
                  <p className="text-xl font-bold text-text1">2,100 kcal</p>
                </div>
                <div>
                  <p className="text-xs text-text2 mb-1">Protein</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-text1">95g</p>
                    <FaCheck className="text-app_secondary text-sm" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text2 mb-1">Carbs</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-text1">240g</p>
                    <FaExclamation className="text-app_secondary text-sm" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text2 mb-1">Fat</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-text1">65g</p>
                    <FaCheck className="text-app_secondary text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Meals Section */}
            <RecommendedMeals tab={selectedTab} />
          </div>
        </main>
      </div>
    </div>
  );
}

// ... (existing code)

function RecommendedMeals({ tab }: { tab: string }) {
  const { data, loading, error } = useQuery<GetMealSuggestionsResult>(
    GET_MEAL_SUGGESTIONS,
    {
      variables: { query: tab, limit: 4 },
    }
  );
  const [selectedMealName, setSelectedMealName] = useState<string | null>(null);

  const meals = data?.mealSuggestions || [];

  if (meals.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-text1 mb-4">
          Recommended {tab} Meals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((meal: any) => (
            <div
              key={meal.id}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMealName(meal.name)}
            >
              <h4 className="font-semibold text-text1 mb-2">{meal.name}</h4>
              <p className="text-xs text-text2 line-clamp-2 mb-3">
                {meal.description}
              </p>
              <div className="flex gap-2 text-xs text-text2">
                <span className="bg-orange-50 text-app_secondary px-2 py-1 rounded">
                  {meal.calories} kcal
                </span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                  {meal.protein}g protein
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMealName && (
        <MealDetailsModal
          name={selectedMealName}
          onClose={() => setSelectedMealName(null)}
        />
      )}
    </>
  );
}

function MealDetailsModal({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { data, loading, error } = useQuery<GetMealByNameResult>(
    GET_MEAL_BY_NAME,
    {
      variables: { name },
    }
  );

  const meal = data?.getMealByName;

  return (
    <Modal open={true} onCancel={onClose} footer={null} title={name}>
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin />
        </div>
      ) : error ? (
        <p className="text-red-500">Error loading meal details</p>
      ) : meal ? (
        <div className="space-y-4">
          <p className="text-gray-600">{meal.description}</p>

          <div className="flex gap-4 text-sm">
            <div className="bg-orange-50 text-app_secondary px-3 py-1 rounded-full font-medium">
              {meal.calories} kcal
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
              {meal.protein}g Protein
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
              {meal.carbs}g Carbs
            </div>
            <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium">
              {meal.fat}g Fat
            </div>
          </div>

          <div>
            <h4 className="font-bold text-text1 mb-2">Ingredients</h4>
            <ul className="list-disc list-inside text-text2 space-y-1">
              {meal.ingredients?.map((ingredient: string, index: number) => (
                <li key={index}>{ingredient}</li>
              )) || <li>No ingredients listed</li>}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text1 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside text-text2 space-y-2">
              {meal.instructions?.map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              )) || <li>No instructions listed</li>}
            </ol>
          </div>
        </div>
      ) : (
        <p>Meal not found</p>
      )}
    </Modal>
  );
}
