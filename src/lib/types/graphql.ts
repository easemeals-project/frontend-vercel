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
