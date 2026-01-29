import type { Profile, Meal, Faq } from "./entities";

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

export type GetMealSuggestionsResult = { mealSuggestions: Meal[] };

export type GetMealByNameResult = { getMealByName: Meal | null };

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
  id: number;
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
