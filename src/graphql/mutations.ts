import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $role: String!) {
    registerUser(name: $name, role: $role) {
      id
      name
      role
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      id
      name
      phone
      deliveryAddress
    }
  }
`;

export const SET_NOTIFICATION_PREFERENCES = gql`
  mutation SetNotificationPreferences($input: NotificationPreferencesInput!) {
    setNotificationPreferences(input: $input) {
      pushNotifications
      emailUpdates
      orderUpdates
    }
  }
`;

export const UPSERT_FOOD_PREFERENCES = gql`
  mutation UpsertFoodPreferences($input: FoodPreferencesInput!) {
    upsertFoodPreferences(input: $input) {
      id
      favoriteFoods {
        id
        name
      }
      dietaryRestrictions
      familySize
      budget
    }
  }
`;

export const UPLOAD_PROFILE_PICTURE = gql`
  mutation UploadProfilePicture($file: Upload!) {
    uploadProfilePicture(file: $file) {
      id
      pictureURL
    }
  }
`;

export const GENERATE_MEAL_PLAN = gql`
  mutation GenerateMealPlan($input: MealPlanInput!) {
    generateMealPlan(input: $input) {
      id
      monday {
        breakfast
        lunch
        dinner
      }
      tuesday {
        breakfast
        lunch
        dinner
      }
      wednesday {
        breakfast
        lunch
        dinner
      }
      thursday {
        breakfast
        lunch
        dinner
      }
      friday {
        breakfast
        lunch
        dinner
      }
      saturday {
        breakfast
        lunch
        dinner
      }
      sunday {
        breakfast
        lunch
        dinner
      }
      weeklyTotals {
        proteinCals
        carbCals
        fatCals
        totalCals
        totalPrice
      }
    }
  }
`;

export const BROADCAST_TIMETABLE = gql`
  mutation BroadcastTimetable($input: BroadcastTimetableInput!) {
    broadcastTimetable(input: $input) {
      id
      isActive
      expiresAt
    }
  }
`;


