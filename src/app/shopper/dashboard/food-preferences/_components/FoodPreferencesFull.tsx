"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import { GET_MY_MEAL_PREFERENCES, GET_MEAL_SUGGESTIONS } from "@/graphql/queries";
import { UPSERT_FOOD_PREFERENCES } from "@/graphql/mutations";
import { Input, Slider, message, AutoComplete } from "antd";
import {
    PlusOutlined,
    CloseOutlined,
    UpOutlined,
    DownOutlined,
    ThunderboltOutlined,
    CheckOutlined,
    FireOutlined,
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

const SUGGESTED_FOOD_CATEGORIES: Record<string, string[]> = {
    "Popular": [
        "Jollof Rice",
        "Pounded Yam",
        "Fried Plantain",
        "Amala",
        "White Rice",
        "Egusi",
        "Semovita",
        "Ofada Rice",
        "Efo Riro",
        "Moi Moi Leaf",
        "Turkey",
        "Croaker Fish",
    ],
    "Rice & Grains": [
        "Jollof Rice",
        "White Rice",
        "Ofada Rice",
        "Basmati Rice",
        "Native Rice",
        "Rice & Beans",
        "Egg Fried Rice M",
        "White Spaghetti",
    ],
    "Swallows & Soups": [
        "Pounded Yam",
        "Amala",
        "Semovita",
        "Garri",
        "Fufu",
        "Starch",
        "Wheat",
        "Egusi",
        "Efo Riro",
        "Ewedu",
        "Ogbono",
        "Afang",
        "Edikaikong",
        "Banga & Fish",
    ],
    "Proteins & Sides": [
        "Turkey",
        "Goat Meat",
        "Croaker Fish",
        "Catfish",
        "Titus Fish",
        "Stew Chicken",
        "Beef",
        "Snail Big",
        "Fried Plantain",
        "Moi Moi Leaf",
        "Stewed Beans",
        "Yam Pottage",
    ],
    "Breakfast": [
        "Agege Bread",
        "Akara",
        "Pap",
        "Boiled Egg",
        "Scrambled Egg",
        "Omelette",
        "Pancake",
        "Waffle Crunch",
        "Custard",
        "Oat",
        "Big Boiled Yam",
        "Fried Yam",
    ],
};

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
    const [budget, setBudget] = useState<"low" | "medium" | "high">("medium");
    const [showAdditional, setShowAdditional] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("Popular");
    const [options, setOptions] = useState<{ value: string; label?: React.ReactNode }[]>([]);

    // Fetch suggestions for autocomplete
    const [searchFoods, { data: suggestionsData }] = useLazyQuery<GetMealSuggestionsResult>(GET_MEAL_SUGGESTIONS, {
        fetchPolicy: "network-only",
    });

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            if (value && value.trim().length >= 1) {
                searchFoods({ variables: { query: value.trim(), limit: 8 } });
            } else {
                setOptions([]);
            }
        }, 250),
        [searchFoods]
    );

    const handleSearch = (value: string) => {
        setFoodInput(value);
        debouncedSearch(value);
    };

    // Combine backend search results with local curated matches for instant feedback
    useEffect(() => {
        const query = foodInput.trim().toLowerCase();
        if (!query) {
            setOptions([]);
            return;
        }

        const allLocal = Array.from(
            new Set(Object.values(SUGGESTED_FOOD_CATEGORIES).flat())
        );
        const localMatches = allLocal.filter(
            (item) =>
                item.toLowerCase().includes(query) &&
                !favoriteFoods.includes(item)
        );

        const remoteMatches = (suggestionsData?.searchFoods || [])
            .map((m: any) => m.name as string)
            .filter((name: string) => !favoriteFoods.includes(name));

        const merged = Array.from(new Set([...remoteMatches, ...localMatches])).slice(0, 8);
        setOptions(
            merged.map((name) => ({
                value: name,
                label: (
                    <div className="flex items-center justify-between py-0.5">
                        <span className="font-medium text-text1">{name}</span>
                        <span className="text-xs text-app_primary font-semibold">+ Add</span>
                    </div>
                ),
            }))
        );
    }, [suggestionsData, foodInput, favoriteFoods]);

    const { data } = useQuery<GetMyMealPreferencesResult>(
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
            // Map budget (Backend float: 1.0=Low, 2.0=Medium, 3.0=High, or Naira weekly values)
            const bVal = prefs.budget;
            if (bVal) {
                if (bVal <= 1 || (bVal > 10 && bVal <= 94500)) setBudget("low");
                else if (bVal === 3 || bVal > 140000) setBudget("high");
                else setBudget("medium");
            }
        }
    }, [data]);

    // Calculate progress (capped at 100%)
    const progressPercent = Math.min((favoriteFoods.length / 6) * 100, 100);

    const handleAddFood = (val?: string) => {
        const foodToAdd = (val ?? foodInput).trim();
        if (!foodToAdd) return;
        if (favoriteFoods.length >= MAX_FOODS) {
            message.info(`You can select up to ${MAX_FOODS} foods.`);
            return;
        }
        if (!favoriteFoods.includes(foodToAdd)) {
            setFavoriteFoods((prev) => [...prev, foodToAdd]);
        }
        setFoodInput("");
        setOptions([]);
    };

    const handleToggleSuggestedFood = (foodName: string) => {
        if (favoriteFoods.includes(foodName)) {
            setFavoriteFoods((prev) => prev.filter((f) => f !== foodName));
        } else {
            if (favoriteFoods.length >= MAX_FOODS) {
                message.info(`Maximum of ${MAX_FOODS} foods reached.`);
                return;
            }
            setFavoriteFoods((prev) => [...prev, foodName]);
        }
    };

    const handleQuickFillSix = () => {
        const pool = SUGGESTED_FOOD_CATEGORIES["Popular"];
        const current = new Set(favoriteFoods);
        for (const item of pool) {
            if (current.size >= 6) break;
            current.add(item);
        }
        setFavoriteFoods(Array.from(current));
        message.success("Added popular Nigerian favorites!");
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

    // Map budget tier to per-meal & weekly Naira amounts:
    // Low: ₦2,000 - ₦4,500 / meal (weekly cap: ₦94,500)
    // Medium: ₦3,500 - ₦6,500 / meal (weekly cap: ₦136,500)
    // High: > ₦7,000 / meal (weekly cap: ₦250,000)
    const budgetConfig = useMemo(() => {
        switch (budget) {
            case "low":
                return {
                    tierNum: 1,
                    tierEnum: "LOW",
                    timetableTab: "Low Budget",
                    label: "Low",
                    range: "₦2,000 - ₦4,500",
                    weeklyEstimate: "₦42,000 - ₦94,500 / wk",
                    weeklyBudgetValue: 94500 * Math.max(1, familySize),
                    color: "text-green-600",
                    bgActive: "border-green-600 bg-green-50/70 text-green-800",
                };
            case "high":
                return {
                    tierNum: 3,
                    tierEnum: "LUXURY",
                    timetableTab: "Luxury",
                    label: "High",
                    range: "> ₦7,000",
                    weeklyEstimate: "₦147,000+ / wk",
                    weeklyBudgetValue: 250000 * Math.max(1, familySize),
                    color: "text-purple-600",
                    bgActive: "border-purple-600 bg-purple-50/70 text-purple-800",
                };
            default:
                return {
                    tierNum: 2,
                    tierEnum: "STANDARD",
                    timetableTab: "Healthy",
                    label: "Medium",
                    range: "₦3,500 - ₦6,500",
                    weeklyEstimate: "₦73,500 - ₦136,500 / wk",
                    weeklyBudgetValue: 136500 * Math.max(1, familySize),
                    color: "text-blue-600",
                    bgActive: "border-blue-600 bg-blue-50/70 text-blue-800",
                };
        }
    }, [budget, familySize]);

    const handleSave = async () => {
        if (favoriteFoods.length < MIN_FOODS) {
            message.warning(`Please select at least ${MIN_FOODS} food items.`);
            return;
        }

        try {
            const input: FoodPreferencesInput = {
                favoriteFoodNames: favoriteFoods,
                favoriteFoodIds: [],
                dietaryRestrictions: JSON.stringify(dietaryRestrictions),
                familySize: Number(familySize),
                budget: budgetConfig.tierNum,
            };

            await upsertPreferences({ variables: { input } });
            message.success("Preferences saved successfully!");
        } catch (err: any) {
            message.error("Failed to save preferences: " + err.message);
        }
    };

    const handleGenerateTimetable = async () => {
        await handleSave();

        sessionStorage.setItem("foodPreferences", JSON.stringify({
            favoriteFoods,
            dietaryRestrictions,
            familySize,
            budget: budgetConfig.tierEnum,
            timetableTab: budgetConfig.timetableTab,
            weeklyBudget: budgetConfig.weeklyBudgetValue,
        }));

        if (favoriteFoods.length >= MIN_FOODS) {
            sessionStorage.setItem("needs_regeneration", "true");
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

    const budgetTiers: { key: "low" | "medium" | "high"; title: string; range: string; subtitle: string }[] = [
        { key: "low", title: "Low", range: "₦2,000 - ₦4,500", subtitle: "per meal" },
        { key: "medium", title: "Medium", range: "₦3,500 - ₦6,500", subtitle: "per meal" },
        { key: "high", title: "High", range: "> ₦7,000", subtitle: "per meal" },
    ];

    return (
        <div className="min-h-screen bg-app_bg flex flex-col items-center pt-12 px-4 pb-12">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text1 mb-1">
                        Food Preferences
                    </h1>
                    <p className="text-text2 text-sm">
                        Tap suggestions below or search to build your personalized meal plan
                    </p>
                </div>

                {/* Progress Section */}
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-text1 uppercase tracking-wide">
                            Selected Foods ({favoriteFoods.length}/{MAX_FOODS})
                        </label>
                        {favoriteFoods.length < 6 && (
                            <button
                                type="button"
                                onClick={handleQuickFillSix}
                                className="text-xs font-bold text-app_secondary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <ThunderboltOutlined /> Auto-pick 6 popular foods
                            </button>
                        )}
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                            className="h-2 rounded-full transition-all duration-300 bg-app_primary"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-text2">
                        {favoriteFoods.length < MIN_FOODS
                            ? `Select at least ${MIN_FOODS - favoriteFoods.length} more food(s) to continue (6 recommended)`
                            : "Great choices! You can add up to 10 foods or generate your timetable now."}
                    </p>
                </div>

                {/* Favorite Foods Search Input */}
                <div className="mb-5">
                    <div className="flex mb-3 shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-white">
                        <AutoComplete
                            value={foodInput}
                            options={options}
                            onSearch={handleSearch}
                            onSelect={(val) => handleAddFood(val)}
                            className="flex-1"
                            onKeyDown={(e) => e.key === "Enter" && handleAddFood()}
                        >
                            <Input
                                placeholder="Type a food name (e.g., Jollof Rice, Amala, Plantain)..."
                                className="h-full px-4 py-3 text-sm text-text1 placeholder-gray-400 font-semibold outline-none border-none bg-white"
                                style={{ border: "none", boxShadow: "none" }}
                            />
                        </AutoComplete>
                        <button
                            type="button"
                            onClick={() => handleAddFood()}
                            disabled={favoriteFoods.length >= MAX_FOODS}
                            className="bg-app_secondary text-white px-5 flex items-center justify-center hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <PlusOutlined className="text-lg" />
                        </button>
                    </div>

                    {/* Selected Food Tags */}
                    {favoriteFoods.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {favoriteFoods.map((food, index) => (
                                <span
                                    key={index}
                                    className="bg-green-50 text-app_primary font-semibold px-3 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 border border-green-200"
                                >
                                    {food}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFood(index)}
                                        className="text-green-700 hover:text-red-500 transition-colors flex items-center p-0.5 cursor-pointer"
                                    >
                                        <CloseOutlined className="text-[10px]" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quick Suggestions Box */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-text1 flex items-center gap-1.5">
                                <FireOutlined className="text-app_secondary" />
                                Quick-Add Suggestions
                            </span>
                            <span className="text-[11px] text-text2">Tap to select</span>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 custom-scrollbar">
                            {Object.keys(SUGGESTED_FOOD_CATEGORIES).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        activeCategory === cat
                                            ? "bg-app_primary text-white shadow-sm"
                                            : "bg-gray-100 text-text2 hover:bg-gray-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Suggestion Chips */}
                        <div className="flex flex-wrap gap-2">
                            {(SUGGESTED_FOOD_CATEGORIES[activeCategory] || []).map((item) => {
                                const isAdded = favoriteFoods.includes(item);
                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => handleToggleSuggestedFood(item)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                            isAdded
                                                ? "bg-app_primary text-white border-app_primary shadow-sm"
                                                : "bg-gray-50 text-text1 border-gray-200 hover:border-app_secondary hover:bg-orange-50/40"
                                        }`}
                                    >
                                        {isAdded ? (
                                            <CheckOutlined className="text-[10px]" />
                                        ) : (
                                            <PlusOutlined className="text-[10px] text-app_secondary" />
                                        )}
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Budget & Additional Preferences */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => setShowAdditional(!showAdditional)}
                    >
                        <div>
                            <h3 className="text-sm font-bold text-text1">
                                Budget & Dietary Preferences
                            </h3>
                            <p className="text-xs text-text2">
                                Meal Budget: <span className={`font-bold ${budgetConfig.color}`}>{budgetConfig.label} ({budgetConfig.range})</span>
                            </p>
                        </div>
                        <span className="text-text2 text-xs">
                            {showAdditional ? <UpOutlined /> : <DownOutlined />}
                        </span>
                    </div>

                    {showAdditional && (
                        <div className="px-4 pb-6 pt-2 space-y-6 border-t border-gray-100">
                            {/* Budget Per Meal Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-xs font-bold text-text1 uppercase tracking-wide">
                                        Budget Per Meal
                                    </label>
                                    <span className={`text-xs font-bold ${budgetConfig.color}`}>
                                        {budgetConfig.label}: {budgetConfig.range} ({budgetConfig.weeklyEstimate})
                                    </span>
                                </div>

                                {/* Clickable Budget Tier Cards */}
                                <div className="grid grid-cols-3 gap-2.5 mb-3">
                                    {budgetTiers.map((tier) => {
                                        const isSelected = budget === tier.key;
                                        return (
                                            <button
                                                key={tier.key}
                                                type="button"
                                                onClick={() => setBudget(tier.key)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                                    isSelected
                                                        ? "border-app_secondary bg-orange-50/60 shadow-sm"
                                                        : "border-gray-200 bg-white hover:border-gray-300"
                                                }`}
                                            >
                                                <p className="text-xs font-bold text-text1">{tier.title}</p>
                                                <p className="text-xs font-extrabold text-app_secondary mt-0.5">
                                                    {tier.range}
                                                </p>
                                                <p className="text-[10px] text-text2">{tier.subtitle}</p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="px-2">
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
                                            0: "Low (₦2k-4.5k)",
                                            1: "Medium (₦3.5k-6.5k)",
                                            2: "High (>₦7k)",
                                        }}
                                        tooltip={{ open: false }}
                                    />
                                </div>
                            </div>

                            {/* Dietary Restrictions */}
                            <div>
                                <label className="block text-xs font-bold text-text1 uppercase tracking-wide mb-3">
                                    Dietary Restrictions
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {dietaryOptions.map((option) => {
                                        const isSelected = dietaryRestrictions.includes(option);
                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => handleDietaryChange(option, !isSelected)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                                    isSelected
                                                        ? "bg-app_primary text-white border-app_primary shadow-sm"
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
                                <label className="block text-xs font-bold text-text1 uppercase tracking-wide mb-2">
                                    Family Size (Servings)
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={familySize}
                                    onChange={(e) => setFamilySize(Math.max(1, Number(e.target.value)))}
                                    className="w-full h-10 rounded-md border-gray-200"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Generate Button */}
                <button
                    type="button"
                    onClick={handleGenerateTimetable}
                    disabled={favoriteFoods.length < MIN_FOODS || saving}
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-[0.98] cursor-pointer ${
                        favoriteFoods.length >= MIN_FOODS
                            ? "bg-app_secondary hover:opacity-90 shadow-orange-200"
                            : "bg-gray-400 cursor-not-allowed shadow-none"
                    }`}
                >
                    {saving ? "Saving Preferences..." : "Generate Timetable"}
                </button>
            </div>
        </div>
    );
}
