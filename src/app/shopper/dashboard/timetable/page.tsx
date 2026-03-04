"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin, Modal, message } from "antd";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  EditOutlined,
  SaveOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { FaExclamation, FaCheck } from "react-icons/fa6";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Sidebar from "../_components/Sidebar";
import conts from "@/lib/conts";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MEAL_SUGGESTIONS, GET_MEAL_BY_NAME, GET_MY_MEAL_PREFERENCES, GET_LATEST_MEAL_PLAN } from "@/graphql/queries";
import { GENERATE_RAG_MEAL_PLAN, SAVE_WEEKLY_MEAL_PLAN } from "@/graphql/mutations";
import { generateICal, downloadICal } from "@/lib/utils/calendar";
import {
  GetMealSuggestionsResult,
  GetMealByNameResult,
  GenerateRAGMealPlanResult,
  GenerateRAGMealPlanVariables,
  WeeklyMealPlan,
  GetMyMealPreferencesResult,
  SaveWeeklyMealPlanResult,
  SaveWeeklyMealPlanVariables,
  GetLatestMealPlanResult,
} from "@/lib/types/graphql";

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

export default function TimetablePage() {
  // --- Dynamic State ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string>("HEALTHY");
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch prefs if needed
  const { data: prefsData } = useQuery<GetMyMealPreferencesResult>(GET_MY_MEAL_PREFERENCES, {
    skip: typeof window !== 'undefined' && !!sessionStorage.getItem("foodPreferences")
  });

  // Fetch latest saved plan
  const { data: savedPlanData, loading: isLoadingSaved, refetch: refetchLatest } = useQuery<GetLatestMealPlanResult>(GET_LATEST_MEAL_PLAN, {
    fetchPolicy: 'network-only'
  });

  // --- Backend Mutation ---
  const [generateMutation] = useMutation<GenerateRAGMealPlanResult, GenerateRAGMealPlanVariables>(
    GENERATE_RAG_MEAL_PLAN
  );
  const [saveMutation, { loading: isSaving }] = useMutation<SaveWeeklyMealPlanResult, SaveWeeklyMealPlanVariables>(
    SAVE_WEEKLY_MEAL_PLAN
  );

  // --- Generator Logic ---
  const generateTimetable = async () => {
    setIsGenerating(true);
    try {
      // 1. Get Preferences
      const storedPrefs = sessionStorage.getItem("foodPreferences");
      let favoriteFoods: string[] = [];
      let dietaryRestrictions: string[] = [];
      let budgetTier = "STANDARD";
      let weeklyBudget = 100000;

      if (storedPrefs) {
        const p = JSON.parse(storedPrefs);
        favoriteFoods = p.favoriteFoods || [];
        dietaryRestrictions = p.dietaryRestrictions || [];
        if (p.budgetType) budgetTier = p.budgetType.toUpperCase();
        if (p.weeklyBudget) weeklyBudget = p.weeklyBudget;
      } else if (prefsData?.myMealPreferences) {
        const p = prefsData.myMealPreferences;
        favoriteFoods = p.favoriteMeals.map((m: any) => m.name);
        dietaryRestrictions = p.dietaryRestrictions;
        // Simple mapping if backend still uses numeric budget
        if (p.budget > 150000) budgetTier = "LUXURY";
        else if (p.budget < 50000) budgetTier = "LOW";
        else budgetTier = "STANDARD";
        weeklyBudget = p.budget || 100000;
      }

      // If no stored budget, map selected tab to backend enum
      if (selectedBudget === "Low Budget") budgetTier = "LOW";
      else if (selectedBudget === "Luxury") budgetTier = "LUXURY";
      else budgetTier = "STANDARD";

      // 2. Call Backend
      const res = await generateMutation({
        variables: {
          input: {
            selectedFoods: favoriteFoods.slice(0, 6), // RAG expects exactly 6
            dietaryRestrictions: dietaryRestrictions.map(d => d.toUpperCase().replace("-", "_")),
            budgetType: budgetTier,
            weeklyBudget: weeklyBudget
          }
        }
      });

      if (res.data?.generateRAGMealPlan) {
        setWeeklyPlan(res.data.generateRAGMealPlan);
        sessionStorage.setItem("currentTimetable", JSON.stringify(res.data.generateRAGMealPlan));
        localStorage.setItem("currentTimetable", JSON.stringify(res.data.generateRAGMealPlan));
        localStorage.setItem("onboarding_complete", "true");
      }

    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setIsGenerating(false);
      setIsInitialLoad(false);
    }
  };


  const handleDownload = async () => {
    console.log("Download triggered");
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
      message.loading({ content: "Generating PDF...", key: "downloading" });

      const canvas = await html2canvas(timetableElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: timetableElement.scrollWidth,
        windowHeight: timetableElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Deep strip styles that cause PDF generation failures (oklch/oklab/shadows)
          const problematicElements = clonedDoc.querySelectorAll(
            '.sticky, [class*="backdrop-blur"], [class*="shadow"], .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl'
          );
          problematicElements.forEach((el: any) => {
            el.style.position = 'static';
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
            el.style.boxShadow = 'none';
            el.style.textShadow = 'none';
          });

          // Ensure the capture area is fully visible in the clone
          const captureEl = clonedDoc.getElementById('timetable-capture');
          if (captureEl) {
            captureEl.style.overflow = 'visible';
            captureEl.style.height = 'auto';
          }
        }
      });

      console.log("Canvas generated successfully");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`EaseMeals-Timetable-${new Date().toISOString().split('T')[0]}.pdf`);

      message.success({ content: "Timetable downloaded successfully!", key: "downloading" });
    } catch (error: any) {
      console.error("PDF generation failed", error);
      message.error({ content: "Download failed", key: "downloading" });
      Modal.error({
        title: "Download Failed",
        content: `Error: ${error.message || "Unknown error during PDF generation"}`
      });
    }
  };

  const handleExportToCalendar = () => {
    if (!weeklyPlan) return;
    try {
      const ics = generateICal(weeklyPlan);
      downloadICal(ics, `EaseMeals-Plan-${new Date().toISOString().split('T')[0]}.ics`);
      message.success("Calendar export successful!");
    } catch (e) {
      console.error("Calendar export failed", e);
      message.error("Failed to export calendar");
    }
  };

  const handleSavePlan = async () => {
    if (!weeklyPlan) return;

    try {
      // Convert current plan to input format
      const input: any = {};
      DAYS.forEach(day => {
        const d = day.toLowerCase();
        const daily = (weeklyPlan as any)[d];
        input[d] = {
          breakfast: {
            base: daily.breakfast.base ? { id: daily.breakfast.base.id || daily.breakfast.base.name, quantity: 1 } : null,
            protein: daily.breakfast.protein ? { id: daily.breakfast.protein.id || daily.breakfast.protein.name, quantity: 1 } : null,
            soup: daily.breakfast.soup ? { id: daily.breakfast.soup.id || daily.breakfast.soup.name, quantity: 1 } : null,
            sides: daily.breakfast.sides?.map((s: any) => ({ id: s.id || s.name, quantity: 1 })) || []
          },
          lunch: {
            base: daily.lunch.base ? { id: daily.lunch.base.id || daily.lunch.base.name, quantity: 1 } : null,
            protein: daily.lunch.protein ? { id: daily.lunch.protein.id || daily.lunch.protein.name, quantity: 1 } : null,
            soup: daily.lunch.soup ? { id: daily.lunch.soup.id || daily.lunch.soup.name, quantity: 1 } : null,
            sides: daily.lunch.sides?.map((s: any) => ({ id: s.id || s.name, quantity: 1 })) || []
          },
          dinner: {
            base: daily.dinner.base ? { id: daily.dinner.base.id || daily.dinner.base.name, quantity: 1 } : null,
            protein: daily.dinner.protein ? { id: daily.dinner.protein.id || daily.dinner.protein.name, quantity: 1 } : null,
            soup: daily.dinner.soup ? { id: daily.dinner.soup.id || daily.dinner.soup.name, quantity: 1 } : null,
            sides: daily.dinner.sides?.map((s: any) => ({ id: s.id || s.name, quantity: 1 })) || []
          }
        };
      });

      input.weeklyCost = weeklyPlan.weeklyCost;
      input.budgetTier = weeklyPlan.budgetTier;
      input.name = "Weekly Meal Plan " + new Date().toLocaleDateString();

      const res = await saveMutation({
        variables: { input }
      });

      if (res.data?.saveWeeklyMealPlan) {
        Modal.success({
          title: 'Plan Saved!',
          content: 'Your meal plan has been permanently saved to your account.',
        });
      }
    } catch (e) {
      console.error("Save failed", e);
      Modal.error({
        title: 'Save Failed',
        content: 'There was an error saving your meal plan. Please try again.',
      });
    }
  };

  // --- Sync Tier selection with Backend enum ---
  useEffect(() => {
    if (!isInitialLoad) {
      generateTimetable();
    }
  }, [selectedBudget]);

  // Trigger on Mount or Data Change
  useEffect(() => {
    const init = async () => {
      // 0. Check for regeneration signal (from preferences)
      const needsRegen = sessionStorage.getItem("needs_regeneration") === "true";
      if (needsRegen) {
        sessionStorage.removeItem("needs_regeneration");
        generateTimetable();
        setIsInitialLoad(false);
        return;
      }

      // 1. Prioritize Backend Data if available
      if (!isLoadingSaved && savedPlanData?.latestMealPlan) {
        setWeeklyPlan(savedPlanData.latestMealPlan);
        const planStr = JSON.stringify(savedPlanData.latestMealPlan);
        localStorage.setItem("currentTimetable", planStr);
        sessionStorage.setItem("currentTimetable", planStr);
        setIsInitialLoad(false);
        return;
      }

      // 2. Fallback to local cache only if backend is still loading or empty
      if (isLoadingSaved) {
        const cached = localStorage.getItem("currentTimetable") || sessionStorage.getItem("currentTimetable");
        if (cached) {
          setWeeklyPlan(JSON.parse(cached));
          setIsInitialLoad(false);
          return;
        }
      }

      // 3. Fallback to generation if no saved plan and not loading
      if (!isLoadingSaved && !savedPlanData?.latestMealPlan) {
        generateTimetable();
        setIsInitialLoad(false);
      }
    };

    init();
  }, [savedPlanData, isLoadingSaved]);


  // --- Loading Overlay Render ---
  if (isInitialLoad && isGenerating) {
    return (
      <div className="fixed inset-0 z-50 bg-app_bg flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="relative w-32 h-32 mb-8 animate-pulse">
          {/* Using the Logo Image we saw in Auth Layout */}
          <img
            src="/easemeals-logo.png"
            alt="EaseMeals Loading"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        <h2 className="text-xl font-bold text-text1 mb-2">Generating Your Plan...</h2>
        <p className="text-text2 text-sm">Curating meals based on your preferences</p>
      </div>
    );
  }

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

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportToCalendar}
              className="p-2.5 rounded-full bg-gray-50 text-text2 hover:text-app_secondary hover:bg-orange-50 transition-all active:scale-95 shadow-sm"
              title="Export to Calendar"
            >
              <CalendarOutlined className="text-xl" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 rounded-full bg-gray-50 text-text2 hover:text-app_secondary hover:bg-orange-50 transition-all active:scale-95 shadow-sm"
              title="Download Timetable"
            >
              <DownloadOutlined className="text-xl" />
            </button>
            <button
              onClick={() => generateTimetable()}
              disabled={isGenerating}
              className="p-2.5 rounded-full bg-gray-50 text-text2 hover:text-app_primary hover:bg-green-50 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              title="Refresh/Regenerate Timetable"
            >
              <ReloadOutlined className={`text-xl ${isGenerating ? 'animate-spin' : ''}`} />
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
                <p className="text-3xl font-bold text-text1">
                  {weeklyPlan ? `₦${weeklyPlan.weeklyCost.toLocaleString()}` : "..."}
                </p>
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  href={conts.paths.foodPreferences}
                  className="px-4 py-3 rounded-full font-bold text-app_primary text-sm border-2 border-app_primary hover:bg-green-50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                >
                  <ReloadOutlined className="text-base" />
                  Regenerate
                </Link>
                <button
                  onClick={handleSavePlan}
                  disabled={isSaving || !weeklyPlan}
                  className="px-4 py-3 rounded-full font-bold text-white bg-app_secondary hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-orange-100"
                >
                  <SaveOutlined className="text-base" />
                  {isSaving ? "Saving..." : "Save Plan"}
                </button>
                <Link
                  href={conts.paths.timetable + "/edit"}
                  className="px-4 py-3 rounded-full font-bold text-app_secondary text-sm border-2 border-app_secondary hover:bg-orange-50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                >
                  <EditOutlined className="text-base" />
                  Edit
                </Link>
                <Link
                  href={conts.paths.checkout}
                  className="bg-app_secondary hover:bg-[#F4511E] text-white text-sm px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-orange-100"
                >
                  <ShoppingCartOutlined className="text-base" />
                  Checkout
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 px-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
              {["Low Budget", "Healthy", "Luxury"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedBudget(tab)}
                  className={`pb-4 px-2 text-sm font-bold transition-all relative ${selectedBudget === tab
                    ? "text-app_secondary"
                    : "text-text2 hover:text-text1"
                    }`}
                >
                  {tab}
                  {selectedBudget === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-app_secondary rounded-t-full shadow-[0_-2px_4px_rgba(255,107,53,0.2)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Meal Plan Table */}
            <div id="timetable-capture" className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-4">
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <img src="/easemeals-logo.png" alt="EaseMeals" className="h-8 object-contain" />
                <div className="text-center sm:text-right">
                  <h3 className="text-lg font-bold text-text1">Weekly Meal Plan</h3>
                  <div className="flex items-center justify-center sm:justify-end gap-2 text-xs text-text2 italic">
                    <span>{selectedBudget} Tier</span>
                    <span className="lg:hidden flex items-center gap-1 text-app_secondary animate-pulse">
                      <ShoppingCartOutlined className="rotate-90" /> Swipe to view
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[800px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-100 border-b border-gray-100 shadow-sm">
                      <th className="p-4 text-left text-xs font-bold text-text1 uppercase tracking-wider w-24 bg-gray-100 sticky left-0 z-20" />
                      {DAYS.map((day) => (
                        <th
                          key={day}
                          className="p-4 text-center text-sm font-bold text-text1 min-w-[140px] bg-gray-100"
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
                        <td className="p-4 align-top text-xs font-black text-text1 uppercase tracking-wide bg-gray-100/90 backdrop-blur sticky left-0 z-10 border-r border-gray-200">
                          {mealType}
                        </td>
                        {DAYS.map((day) => {
                          const dailyPlan = (weeklyPlan as any)?.[day.toLowerCase()];
                          const meal = (dailyPlan as any)?.[mealType.toLowerCase()];

                          const items = [];
                          if (meal?.base) items.push(meal.base.name);
                          if (meal?.protein) items.push(meal.protein.name);
                          if (meal?.soup) items.push(meal.soup.name);
                          if (meal?.sides?.length) items.push(...meal.sides.map((s: any) => s.name));
                          const displayText = items.filter(Boolean).join(", ");

                          return (
                            <td
                              key={`${day}-${mealType}`}
                              className="p-4 align-top"
                            >
                              <p className="text-xs text-text2 leading-relaxed">
                                {isGenerating ? (
                                  <Spin size="small" />
                                ) : (
                                  displayText || "-"
                                )}
                              </p>
                            </td>
                          );
                        })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-orange-600 mb-1">Weekly Average Cost</p>
                  <p className="text-2xl font-black text-text1">
                    {weeklyPlan ? `₦${Math.round(weeklyPlan.weeklyCost / 7).toLocaleString()}` : "₦0"}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-green-700 mb-1">Budget Status</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-text1 uppercase">
                      {weeklyPlan?.budgetTier || "Standard"}
                    </p>
                    <FaCheck className="text-app_primary text-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Meals Section */}
            <RecommendedMeals tab={selectedBudget} />
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

  const meals = data?.searchFoods || [];

  if (meals.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-text1 mb-4 px-1">
          Recommended {tab} Meals
        </h3>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 custom-scrollbar px-1 -mx-1">
          {meals.map((meal: any) => (
            <div
              key={meal.id}
              className="flex-shrink-0 w-[240px] sm:w-auto border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => setSelectedMealName(meal.name)}
            >
              <h4 className="font-bold text-text1 text-sm mb-2 line-clamp-1">{meal.name}</h4>
              <p className="text-xs text-text2 font-medium line-clamp-2 mb-3">
                {meal.description}
              </p>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="bg-orange-50 text-app_secondary px-2 py-1 rounded-full">
                  {meal.calories} kcal
                </span>
                <span className="bg-green-50 text-app_primary px-2 py-1 rounded-full">
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

  const meal = data?.getFoodByName;

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
          {meal.description && <p className="text-gray-600">{meal.description}</p>}
          <div className="flex gap-4 text-sm">
            {meal.calories && (
              <div className="bg-orange-50 text-app_secondary px-3 py-1 rounded-full font-medium">
                {meal.calories} kcal
              </div>
            )}
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
              {meal.protein}g Protein
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
              {(meal as any).carbohydrate || (meal as any).carbs}g Carbs
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
