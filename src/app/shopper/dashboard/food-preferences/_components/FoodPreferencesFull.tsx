"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import { GET_MY_MEAL_PREFERENCES, GET_MEAL_SUGGESTIONS } from "@/graphql/queries";
import { UPSERT_FOOD_PREFERENCES } from "@/graphql/mutations";
import { Checkbox, Input, Slider, message, AutoComplete } from "antd";
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
    GetMealSuggestionsResult,
} from "@/lib/types/graphql";

const MIN_FOODS = 3;
const MAX_FOODS = 10;

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function FoodPreferencesFull() {
    const router = useRouter();
    const [foodInput, setFoodInput] = useState("");
    const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
    const [familySize, setFamilySize] = useState(1);
    const [budget, setBudget] = useState("medium");
    const [showAdditional, setShowAdditional] = useState(false);
    const [options, setOptions] = useState<{ value: string }[]>([]);

    // Fetch suggestions for autocomplete
    const [searchFoods, { data: suggestionsData }] = useLazyQuery<GetMealSuggestionsResult>(GET_MEAL_SUGGESTIONS, {
        fetchPolicy: "network-only",
    });

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            if (value && value.length > 2) {
                searchFoods({ variables: { query: value, limit: 5 } });
            } else {
                setOptions([]);
            }
        }, 500),
        [searchFoods]
    );

    const handleSearch = (value: string) => {
        setFoodInput(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        if (suggestionsData?.searchFoods) {
            setOptions(suggestionsData.searchFoods.map((m: any) => ({ value: m.name })));
        }
    }, [suggestionsData]);


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
            const bVal = prefs.budget;
            if (bVal && bVal <= 1) setBudget("low");
            else if (bVal && bVal > 2) setBudget("high");
            else setBudget("medium");
        }
    }, [data]);

    // Calculate progress (capped at 100%)
    const progressPercent = Math.min((favoriteFoods.length / MAX_FOODS) * 100, 100);

    const handleAddFood = (val?: string) => {
        const foodToAdd = val || foodInput;
        if (foodToAdd.trim() && favoriteFoods.length < MAX_FOODS) {
            if (!favoriteFoods.includes(foodToAdd.trim())) {
                setFavoriteFoods([...favoriteFoods, foodToAdd.trim()]);
            }
            setFoodInput("");
            setOptions([]);
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
        } catch (err: any) {
            message.error("Failed to save preferences: " + err.message);
        }
    };

    const handleGenerateTimetable = async () => {
        await handleSave();

        let budgetEnum = "HEALTHY";
        if (budget === "low") budgetEnum = "LOW";
        else if (budget === "high") budgetEnum = "LUXURY";

        sessionStorage.setItem("foodPreferences", JSON.stringify({
            favoriteFoods,
            dietaryRestrictions,
            familySize,
            budget: budgetEnum
        }));

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

    // Price tags logic
    const getPriceTag = (value: string) => {
        switch (value) {
            case "low":
                return { label: "Low", range: "< ₦2,000", color: "text-green-600" };
            case "medium":
                return { label: "Medium", range: "₦2,000 - ₦5,000", color: "text-blue-600" };
            case "high":
                return { label: "High", range: "> ₦5,000", color: "text-purple-600" };
            default:
                return { label: "Medium", range: "₦2,000 - ₦5,000", color: "text-blue-600" };
        }
    };

    const currentPriceTag = getPriceTag(budget);

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
                        <AutoComplete
                            value={foodInput}
                            options={options}
                            onSearch={handleSearch}
                            onSelect={(val) => handleAddFood(val)}
                            className="flex-1"
                            onKeyDown={(e) => e.key === "Enter" && handleAddFood()}
                        >
                            <Input
                                placeholder="Enter or search your favorite foods..."
                                className="h-full px-4 py-3 text-sm text-text1 placeholder-gray-500 font-semibold outline-none border-none bg-white"
                                style={{ border: "none", boxShadow: "none" }}
                            />
                        </AutoComplete>
                        <button
                            onClick={() => handleAddFood()}
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
                                    className="text-gray-400 hover:text-app_secondary transition-colors flex items-center p-1 -mr-1"
                                >
                                    <CloseOutlined className="text-[10px]" />
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
                                <div className="flex flex-wrap gap-2">
                                    {dietaryOptions.map((option) => {
                                        const isSelected = dietaryRestrictions.includes(option);
                                        return (
                                            <button
                                                key={option}
                                                onClick={() => handleDietaryChange(option, !isSelected)}
                                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${isSelected
                                                    ? "bg-app_primary text-white border-app_primary shadow-md"
                                                    : "bg-white text-text2 border-gray-200 hover:border-app_primary hover:text-app_primary"
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
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
                                    onChange={(e) => setFamilySize(Number(e.target.value))}
                                    className="w-full h-10 rounded-md border-gray-200"
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-text2">
                                        Budget
                                    </label>
                                    <span className={`text-xs font-bold ${currentPriceTag.color}`}>
                                        {currentPriceTag.label}: {currentPriceTag.range}
                                    </span>
                                </div>

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
