import type { Profile, Address } from "./profile";
import type { Meal, Faq, Order, Vendor } from "./entities";

export type GetMyProfileResult = { myProfile: Profile };

export type GetNotificationsResult = {
  myNotificationPreferences: {
    pushNotifications: boolean;
    emailUpdates: boolean;
    orderUpdates: boolean;
  };
};

export type GetMyMealPreferencesResult = {
  myMealPreferences: {
    favoriteMeals: { name: string }[];
    dietaryRestrictions: string[];
    familySize: number;
    budget: number;
  };
};

export type GetMealSuggestionsResult = { searchFoods: Meal[] };

export type GetMealByNameResult = { getFoodByName: Meal | null };

export type RAGMealSlot = { id: string; name: string; price: number; category: string; quantity: number } | null;
export type RAGMealComposition = {
  base: RAGMealSlot;
  protein: RAGMealSlot;
  soup: RAGMealSlot;
  sides: RAGMealSlot[];
  totalCost: number;
};

export type WeeklyMealPlanInput = {
  monday?: DailyMealPlanInput;
  tuesday?: DailyMealPlanInput;
  wednesday?: DailyMealPlanInput;
  thursday?: DailyMealPlanInput;
  friday?: DailyMealPlanInput;
  saturday?: DailyMealPlanInput;
  sunday?: DailyMealPlanInput;
  weeklyCost?: number;
  budgetTier?: string;
  name?: string;
};

export type DailyMealPlanInput = {
  breakfast?: MealCompositionInput;
  lunch?: MealCompositionInput;
  dinner?: MealCompositionInput;
};

export type MealCompositionInput = {
  base?: MealSlotInput;
  protein?: MealSlotInput;
  sides?: MealSlotInput[];
  soup?: MealSlotInput;
};

export type MealSlotInput = {
  id: string;
  quantity: number;
  name?: string;
  price?: number;
  category?: string;
};

export type SaveWeeklyMealPlanResult = {
  saveWeeklyMealPlan: {
    id: number;
    name: string;
    totalPrice: number;
    createdAt: string;
  };
};

export type RecalculateMealPlanResult = {
  recalculateMealPlan: WeeklyMealPlan;
};
export type RAGDailyMealPlan = {
  breakfast: RAGMealComposition;
  lunch: RAGMealComposition;
  dinner: RAGMealComposition;
  dailyCost: number;
};
export type WeeklyMealPlan = {
  monday: RAGDailyMealPlan;
  tuesday: RAGDailyMealPlan;
  wednesday: RAGDailyMealPlan;
  thursday: RAGDailyMealPlan;
  friday: RAGDailyMealPlan;
  saturday: RAGDailyMealPlan;
  sunday: RAGDailyMealPlan;
  weeklyCost: number;
  budgetTier: string;
};
export type GenerateRAGMealPlanVariables = {
  input: {
    selectedFoods: string[];
    budgetType: string;
    weeklyBudget: number;
    dietaryRestrictions?: string[];
  };
};
export type GenerateRAGMealPlanResult = {
  generateRAGMealPlan: WeeklyMealPlan;
};

export type GetLatestMealPlanResult = {
  latestMealPlan: WeeklyMealPlan | null;
};

export type SaveWeeklyMealPlanVariables = {
  input: WeeklyMealPlanInput;
};

export type RecalculateMealPlanVariables = {
  plan: WeeklyMealPlanInput;
};

export type GetFaqsResult = { faqs: Faq[] };

export type UpdateProfileVariables = {
  input: {
    name?: string;
    email?: string;
    phone?: string;
    deliveryAddress?: string;
  };
};

export type UpdateProfileResult = {
  updateMyProfile: Profile;
};

export type SetNotificationPreferencesVariables = {
  input: {
    pushNotifications: boolean;
    emailUpdates: boolean;
    orderUpdates: boolean;
  };
};

export type SetNotificationPreferencesResult = {
  setNotificationPreferences: {
    pushNotifications: boolean;
    emailUpdates: boolean;
    orderUpdates: boolean;
  };
};

export type UploadProfilePictureVariables = {
  file: any; // Upload scalar
};

export type UploadProfilePictureResult = {
  uploadProfilePicture: Profile;
};

export type RegisterUserVariables = {
  name: string;
  role: string;
};

export type RegisterUserResult = {
  registerUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};
export type FoodPreferencesInput = {
  favoriteFoodNames: string[];
  favoriteFoodIds: number[];
  dietaryRestrictions: string; // JSON string
  familySize: number;
  budget: number;
};
export type UpsertFoodPreferencesVariables = {
  input: FoodPreferencesInput;
};

export type UpsertFoodPreferencesResult = {
  upsertFoodPreferences: {
    id: number;
    favoriteFoods: { id: number; name: string }[];
    dietaryRestrictions: string[];
    familySize: number;
    budget: number;
  };
};

export type MealPlanInput = {
  selectedFoods: string[];
  dietaryConstraints: string[];
  budgetPreference: string;
};

export type DailyMeals = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  dailyTotalCals: number;
};

export type MealPlan = {
  monday: DailyMeals;
  tuesday: DailyMeals;
  wednesday: DailyMeals;
  thursday: DailyMeals;
  friday: DailyMeals;
  saturday: DailyMeals;
  sunday: DailyMeals;
  weeklyTotals: {
    proteinCals: number;
    carbCals: number;
    fatCals: number;
    totalCals: number;
    totalPrice: number;
  };
};

export type GenerateMealPlanVariables = {
  input: MealPlanInput;
};

export type GenerateMealPlanResult = {
  generateMealPlan: MealPlan;
};

export type BroadcastTimetableInput = {
  timetableID: number;
  deliveryDate: string;
  deliveryAddress: string;
  notes?: string;
  expiresInHours?: number;
};

export type BroadcastTimetableVariables = {
  input: BroadcastTimetableInput;
};

export type BroadcastTimetableResult = {
  broadcastTimetable: {
    id: number;
    isActive: boolean;
    expiresAt: string;
  };
};

export type AddressInput = {
  label?: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

export type AddAddressVariables = {
  input: AddressInput;
};

export type AddAddressResult = {
  addAddress: Address;
};

export type UpdateAddressVariables = {
  id: string;
  input: AddressInput;
};

export type UpdateAddressResult = {
  updateAddress: Address;
};

export type DeleteAddressVariables = {
  id: string;
};

export type DeleteAddressResult = {
  deleteAddress: boolean;
};

export type SetDefaultAddressVariables = {
  id: string;
};

export type SetDefaultAddressResult = {
  setDefaultAddress: boolean;
};

export type GetMyOrdersResult = {
  myOrders: Order[];
};

export type GetMyOrderResult = {
  myOrder: Order;
};

export type GetVendorsResult = {
  vendors: Vendor[];
};
