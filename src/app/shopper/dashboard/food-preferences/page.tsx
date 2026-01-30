"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_MEAL_PREFERENCES } from "@/graphql/queries";
import { UPSERT_FOOD_PREFERENCES } from "@/graphql/mutations";
import { Spin, Alert, Checkbox, Input, Slider, Button, message } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import conts from "@/lib/conts";
import {
  GetMyMealPreferencesResult,
  UpsertFoodPreferencesResult,
  UpsertFoodPreferencesVariables,
  FoodPreferencesInput,
} from "@/lib/types/graphql";

const MIN_FOODS = 3;
const MAX_FOODS = 10;

export default function FoodPreferencesPage() {
  const router = useRouter();
  const [foodInput, setFoodInput] = useState("");
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [familySize, setFamilySize] = useState(1);
  const [budget, setBudget] = useState("medium");
  const [showAdditional, setShowAdditional] = useState(false);


  const { data, loading, error, refetch } = useQuery<GetMyMealPreferencesResult>(
    GET_MY_MEAL_PREFERENCES
  );

  const [upsertPreferences, { loading: saving }] = useMutation<
    UpsertFoodPreferencesResult,
    UpsertFoodPreferencesVariables
  >(UPSERT_FOOD_PREFERENCES);

  useEffect(() => {
    if (data?.myMealPreferences) {
      const prefs = data.myMealPreferences;
      setFavoriteFoods(prefs.favoriteMeals.map((m: any) => m.name));
      setDietaryRestrictions(prefs.dietaryRestrictions);
      setFamilySize(prefs.familySize);
      // Map budget (Backend float: 1.0=Low, 2.0=Medium, 3.0=High)
      // If backend returns different values, adjust here. Assuming 1=Low, 2=Med, 3=High
      const bVal = prefs.budget;
      if (bVal && bVal <= 1) setBudget("low");
      else if (bVal && bVal > 2) setBudget("high");
      else setBudget("medium");
    }
  }, [data]);

  // Calculate progress (capped at 100%)
  const progress = Math.min((favoriteFoods.length / MIN_FOODS) * 100, 100);
  const progressPercent = (favoriteFoods.length / MAX_FOODS) * 100;

  const handleAddFood = () => {
    if (foodInput.trim() && favoriteFoods.length < MAX_FOODS) {
      setFavoriteFoods([...favoriteFoods, foodInput.trim()]);
      setFoodInput("");
    }
  };

  const handleRemoveFood = (index: number) => {
    setFavoriteFoods(favoriteFoods.filter((_, i) => i !== index));
  };

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    } else {
      setDietaryRestrictions(
        dietaryRestrictions.filter((r) => r !== restriction)
      );
    }
  };

  const handleSave = async () => {
    if (favoriteFoods.length < MIN_FOODS) {
      message.warning(`Please add at least ${MIN_FOODS} food items.`);
      return;
    }

    // Map budget string to number
    let budgetNum = 2; // medium
    if (budget === "low") budgetNum = 1;
    if (budget === "high") budgetNum = 3;

    try {
      const input: FoodPreferencesInput = {
        favoriteFoodNames: favoriteFoods,
        favoriteFoodIds: [], // Not using IDs for now, just names
        dietaryRestrictions: JSON.stringify(dietaryRestrictions),
        familySize: Number(familySize),
        budget: budgetNum,
      };

      await upsertPreferences({ variables: { input } });
      message.success("Preferences saved successfully!");
      // Optionally navigate
      // router.push(conts.paths.timetable);
    } catch (err: any) {
      message.error("Failed to save preferences: " + err.message);
    }
  };

  const handleGenerateTimetable = async () => {
    await handleSave();
    if (favoriteFoods.length >= MIN_FOODS) {
      router.push(conts.paths.timetable);
    }
  };

  const dietaryOptions = [
    "Vegan",
    "Vegetarian",
    "Gluten-free",
    "Dairy-free",
    "Nut-free",
  ];

  // if (loading) {
  //    return <div className="min-h-screen flex items-center justify-center"><Spin size="large" /></div>;
  // }

  return (
    <div className="min-h-screen bg-app_bg flex flex-col items-center pt-20 px-4 pb-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-text1 mb-2">
            Food Preferences
          </h1>
          <p className="text-text2 text-sm">Tell us what foods you enjoy</p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-text2 uppercase tracking-wide">
              Progress
            </label>
            <span className="text-xs text-text2">
              {favoriteFoods.length} foods added
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${favoriteFoods.length >= MIN_FOODS
                ? "bg-app_primary"
                : "bg-app_primary"
                }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-text2">
            Input {MIN_FOODS}-{MAX_FOODS} foods for best personalization
          </p>
        </div>

        {/* Favorite Foods Input */}
        <div className="mb-6">
          <div className="flex mb-4 shadow-sm rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter your favorite foods..."
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFood()}
              className="flex-1 px-4 py-3 text-sm text-text1 placeholder-gray-400 outline-none border-none"
            />
            <button
              onClick={handleAddFood}
              disabled={favoriteFoods.length >= MAX_FOODS}
              className="bg-app_secondary text-white px-5 flex items-center justify-center hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              <PlusOutlined className="text-lg" />
            </button>
          </div>

          {/* Food Tags */}
          <div className="flex flex-wrap gap-2">
            {favoriteFoods.map((food, index) => (
              <span
                key={index}
                className="bg-white text-text1 px-3 py-1.5 rounded-full text-sm shadow-sm flex items-center gap-2 border border-gray-100"
              >
                {food}
                <button
                  onClick={() => handleRemoveFood(index)}
                  className="text-gray-400 hover:text-app_secondary transition-colors flex items-center"
                >
                  <CloseOutlined className="text-xs" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Additional Preferences Accordion */}
        <div className="mb-8 bg-white rounded-lg shadow-sm">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setShowAdditional(!showAdditional)}
          >
            <h3 className="text-sm font-semibold text-text1">
              Additional Preferences (Optional)
            </h3>
            <span className="text-text2 text-xs">
              {showAdditional ? <UpOutlined /> : <DownOutlined />}
            </span>
          </div>

          {showAdditional && (
            <div className="px-4 pb-6 pt-0 space-y-6 border-t border-gray-50">
              {/* Dietary Restrictions */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-text2 mb-3">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {dietaryOptions.map((option) => (
                    <Checkbox
                      key={option}
                      checked={dietaryRestrictions.includes(option)}
                      className="text-sm text-text1"
                    >
                      {option}
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Family Size */}
              <div>
                <label className="block text-xs font-semibold text-text2 mb-2">
                  Family Size
                </label>
                <Input
                  type="number"
                  min={1}
                  value={familySize}
                  className="w-full h-10 rounded-md border-gray-200"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold text-text2 mb-2">
                  Budget
                </label>
                <div className="px-1">
                  <Slider
                    min={0}
                    max={2}
                    value={budget === "low" ? 0 : budget === "medium" ? 1 : 2}
                    onChange={(val) => {
                      if (val === 0) setBudget("low");
                      else if (val === 1) setBudget("medium");
                      else setBudget("high");
                    }}
                    marks={{
                      0: "Low",
                      1: "Medium",
                      2: "High",
                    }}
                    tooltip={{ open: false }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateTimetable}
          disabled={favoriteFoods.length < MIN_FOODS || saving}
          className={`w-full py-3.5 rounded-lg font-bold text-white shadow-md transition-all transform active:scale-[0.98] ${favoriteFoods.length >= MIN_FOODS
            ? "bg-app_secondary hover:opacity-90 shadow-orange-200"
            : "bg-gray-400 cursor-not-allowed shadow-none"
            }`}
        >
          Generate Timetable
        </button>
      </div>
    </div>
  );
}
