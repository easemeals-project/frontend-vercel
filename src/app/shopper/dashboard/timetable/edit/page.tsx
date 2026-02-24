"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { Spin, Modal, AutoComplete, Input, Badge, Button, Empty } from "antd";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import conts from "@/lib/conts";
import { RECALCULATE_MEAL_PLAN, SAVE_WEEKLY_MEAL_PLAN } from "@/graphql/mutations";
import { GET_MEAL_SUGGESTIONS } from "@/graphql/queries";
import {
  WeeklyMealPlan,
  RecalculateMealPlanResult,
  RecalculateMealPlanVariables,
  SaveWeeklyMealPlanResult,
  SaveWeeklyMealPlanVariables,
  WeeklyMealPlanInput,
  GetMealSuggestionsResult
} from "@/lib/types/graphql";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

export default function EditTimetablePage() {
  const router = useRouter();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Mutations ---
  const [recalculateMutation, { loading: isRecalculating }] = useMutation<RecalculateMealPlanResult, RecalculateMealPlanVariables>(
    RECALCULATE_MEAL_PLAN
  );
  const [saveMutation, { loading: isSaving }] = useMutation<SaveWeeklyMealPlanResult, SaveWeeklyMealPlanVariables>(
    SAVE_WEEKLY_MEAL_PLAN
  );

  useEffect(() => {
    const saved = localStorage.getItem("currentTimetable") || sessionStorage.getItem("currentTimetable");
    if (saved) {
      setWeeklyPlan(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const convertToInput = (plan: WeeklyMealPlan): WeeklyMealPlanInput => {
    const input: any = {};
    DAYS.forEach(day => {
      const d = day.toLowerCase();
      const daily = (plan as any)[d];
      input[d] = {
        breakfast: mapComposition(daily.breakfast),
        lunch: mapComposition(daily.lunch),
        dinner: mapComposition(daily.dinner)
      };
    });
    input.weeklyCost = plan.weeklyCost;
    input.budgetTier = plan.budgetTier;
    return input;
  };

  const mapComposition = (comp: any) => {
    const mapSlot = (s: any) => s ? {
      id: s.id || s.name,
      name: s.name,
      price: s.price || 0,
      category: s.category || "",
      quantity: s.quantity || 1
    } : null;

    return {
      base: mapSlot(comp.base),
      protein: mapSlot(comp.protein),
      soup: mapSlot(comp.soup),
      sides: comp.sides?.filter((s: any) => s && s.id !== "new").map(mapSlot) || []
    };
  };

  const handleRecalculate = async (currentPlan: WeeklyMealPlan) => {
    try {
      const input = convertToInput(currentPlan);
      const res = await recalculateMutation({
        variables: { plan: input }
      });
      if (res.data?.recalculateMealPlan) {
        setWeeklyPlan(res.data.recalculateMealPlan);
      }
    } catch (e) {
      console.error("Recalculate failed", e);
    }
  };

  const handleSave = async () => {
    if (!weeklyPlan) return;
    try {
      const input = convertToInput(weeklyPlan);
      input.name = "Edited Meal Plan " + new Date().toLocaleDateString();
      const res = await saveMutation({
        variables: { input }
      });
      if (res.data?.saveWeeklyMealPlan) {
        Modal.confirm({
          title: 'Changes Saved Successfully!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          content: 'Your meal plan has been updated. What would you like to do next?',
          okText: 'Go to Checkout',
          cancelText: 'Stay Here',
          onOk: () => router.push(conts.paths.checkout),
          onCancel: () => { }
        });
      }
    } catch (e) {
      console.error("Save failed", e);
      Modal.error({ title: 'Save Failed', content: 'Could not save your changes. Please check your network and try again.' });
    }
  };

  const updateSlot = (day: string, mealType: string, slotType: string, food: any, sideIndex?: number) => {
    if (!weeklyPlan) return;
    const newPlan = JSON.parse(JSON.stringify(weeklyPlan));
    const meal = newPlan[day.toLowerCase()][mealType.toLowerCase()];

    const slotData = food ? {
      id: food.id,
      name: food.name,
      price: food.price || 0,
      quantity: 1,
      category: food.category
    } : null;

    if (slotType === 'sides') {
      if (sideIndex !== undefined) {
        if (food === null) {
          meal.sides.splice(sideIndex, 1);
        } else {
          meal.sides[sideIndex] = slotData;
        }
      } else if (food) {
        if (!meal.sides) meal.sides = [];
        meal.sides.push(slotData);
      }
    } else {
      meal[slotType] = slotData;
    }

    setWeeklyPlan(newPlan);
    handleRecalculate(newPlan);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-app_bg"><Spin size="large" tip="Loading your plan..." /></div>;
  if (!weeklyPlan) return <div className="p-12 text-center bg-app_bg min-h-screen flex flex-col items-center justify-center gap-4">
    <Empty description="No active plan found to edit" />
    <Link href={conts.paths.timetable} className="px-6 py-2 bg-app_primary text-white rounded-lg font-bold">Go Back</Link>
  </div>;

  return (
    <div className="min-h-screen bg-app_bg font-sans pb-32">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link href={conts.paths.timetable} className="text-text2 hover:text-text1 transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center">
              <ArrowLeftOutlined className="text-xl" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-text1 leading-none mb-1 text-app_primary">Editor</h1>
              <p className="text-xs text-text2 font-medium uppercase tracking-widest opacity-70">Customize Your Delicacies</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-text2 uppercase font-bold tracking-tighter">Current Total</p>
              <p className="text-xl font-black text-app_primary leading-none">₦{weeklyPlan.weeklyCost.toLocaleString()}</p>
            </div>
            <Badge status={weeklyPlan.budgetTier.toUpperCase() === 'LOW' ? 'warning' : 'success'} text={<span className="font-bold text-text2">{weeklyPlan.budgetTier}</span>} />
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {DAYS.map((day) => (
          <section key={day} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-app_primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-app_primary/20">
                {day.charAt(0)}
              </div>
              <h2 className="text-2xl font-black text-text1">{day}</h2>
              <div className="flex-1 h-px bg-gray-200 ml-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MEAL_TYPES.map((mealType) => (
                <MealEditor
                  key={mealType}
                  day={day}
                  type={mealType}
                  composition={(weeklyPlan as any)[day.toLowerCase()][mealType.toLowerCase()]}
                  onUpdate={(slot, food, index) => updateSlot(day, mealType, slot, food, index)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Sticky Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text2 uppercase">Total Cost</span>
            <span className="text-3xl font-black text-text1 leading-none flex items-baseline gap-2">
              ₦{weeklyPlan.weeklyCost.toLocaleString()}
              {isRecalculating && <Spin size="small" className="ml-2" />}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => router.push(conts.paths.foodPreferences)}
              className="hidden md:flex font-bold text-text2"
            >
              Preferences
            </Button>
            <Button
              type="primary"
              size="large"
              icon={isSaving ? <Spin size="small" /> : <SaveOutlined />}
              onClick={handleSave}
              disabled={isSaving || isRecalculating}
              className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-app_primary/20 flex items-center gap-2 bg-app_primary border-none"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MealEditor({ day, type, composition, onUpdate }: { day: string, type: string, composition: any, onUpdate: (slot: string, food: any, index?: number) => void }) {
  const isSelected = (slot: any) => !!slot && slot.name !== "Searching...";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5 hover:shadow-xl hover:border-app_primary/20 transition-all group overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-app_primary/5 rounded-full blur-2xl group-hover:bg-app_primary/10 transition-colors" />

      <div className="flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSelected(composition.base) ? 'bg-app_primary' : 'bg-gray-200 animate-pulse'}`} />
          <h3 className="font-black text-lg text-text1 tracking-tight">{type}</h3>
        </div>
        <Badge
          count={`₦${Math.round(composition.totalCost).toLocaleString()}`}
          style={{ backgroundColor: '#F1F8E9', color: '#2E7D32', fontWeight: '900', border: 'none', padding: '0 12px', height: '24px', lineHeight: '24px' }}
        />
      </div>

      <div className="space-y-4 pt-2">
        <SlotSelector
          label="Base"
          value={composition.base}
          onSelect={(f) => onUpdate('base', f)}
          onRemove={() => onUpdate('base', null)}
        />

        <SlotSelector
          label="Protein"
          value={composition.protein}
          onSelect={(f) => onUpdate('protein', f)}
          onRemove={() => onUpdate('protein', null)}
        />

        {composition.soup !== undefined && (
          <SlotSelector
            label="Soup"
            value={composition.soup}
            onSelect={(f) => onUpdate('soup', f)}
            onRemove={() => onUpdate('soup', null)}
          />
        )}

        <div className="space-y-2 pt-2 border-t border-gray-50">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] font-black text-text2 uppercase tracking-widest opacity-60">Sides</label>
            <span className="text-[10px] font-bold text-app_primary">{composition.sides?.length || 0} items</span>
          </div>
          <div className="space-y-3">
            {composition.sides?.map((side: any, i: number) => (
              <SlotSelector
                key={i}
                label={`Side ${i + 1}`}
                value={side}
                onSelect={(f) => onUpdate('sides', f, i)}
                onRemove={() => onUpdate('sides', null, i)}
              />
            ))}
            <button
              onClick={() => onUpdate('sides', { name: "Searching...", id: "new", price: 0 })}
              className="w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text2 hover:border-app_primary hover:text-app_primary hover:bg-app_primary/5 transition-all flex items-center justify-center gap-2"
            >
              <PlusOutlined /> Add Side
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotSelector({ label, value, onSelect, onRemove }: { label: string, value: any, onSelect: (food: any) => void, onRemove?: () => void }) {
  const [options, setOptions] = useState<{ value: string, label: string, food: any }[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [searchFoods, { loading, data }] = useLazyQuery<GetMealSuggestionsResult>(GET_MEAL_SUGGESTIONS);

  useEffect(() => {
    if (data?.searchFoods) {
      setOptions(data.searchFoods.map((f: any) => ({
        value: f.name,
        label: `${f.name} - ₦${f.price || 500}`,
        food: f
      })));
    }
  }, [data]);

  const handleSearch = (v: string) => {
    setSearchValue(v);
    if (v.length > 2) {
      searchFoods({ variables: { query: v, limit: 10 } });
    }
  };

  const isSet = !!value && value.id !== "new";

  return (
    <div className={`space-y-1 transition-all ${isFocused ? 'scale-[1.02]' : ''}`}>
      <div className="flex justify-between items-center px-1">
        <label className="text-[9px] font-black text-text2 uppercase tracking-widest opacity-40">{label}</label>
        {isSet && !searchValue && (
          <span className="text-[10px] font-black text-app_primary">₦{value.price?.toLocaleString()}</span>
        )}
      </div>

      <AutoComplete
        options={options}
        onSearch={handleSearch}
        onSelect={(val, opt) => {
          onSelect(opt.food);
          setSearchValue("");
        }}
        value={searchValue || (isSet ? value.name : "")}
        className="w-full"
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setSearchValue("");
        }}
      >
        <Input
          prefix={<SearchOutlined className={`transition-colors ${isSet ? 'text-app_primary' : 'text-gray-300'}`} />}
          placeholder={isSet ? value.name : `Select ${label}...`}
          className={`rounded-xl text-xs py-2.5 bg-gray-50/50 border-none hover:bg-gray-100 transition-all ${isSet ? 'font-bold text-text1 shadow-sm' : 'italic text-gray-400'}`}
          suffix={
            <div className="flex items-center gap-2">
              {loading && <Spin size="small" />}
              {onRemove && (isSet || searchValue) && (
                <DeleteOutlined
                  className="text-gray-300 hover:text-red-500 cursor-pointer transition-all hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchValue("");
                    onRemove();
                  }}
                />
              )}
            </div>
          }
        />
      </AutoComplete>
    </div>
  );
}
