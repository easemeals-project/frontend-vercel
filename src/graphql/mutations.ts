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

export const GENERATE_RAG_MEAL_PLAN = gql`
  mutation GenerateRAGMealPlan($input: RAGMealPlanInput!) {
    generateRAGMealPlan(input: $input) {
      monday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      tuesday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      wednesday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      thursday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      friday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      saturday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      sunday {
        breakfast { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        lunch { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dinner { base { id name price category quantity } protein { id name price category quantity } soup { id name price category quantity } sides { id name price category quantity } totalCost }
        dailyCost
      }
      weeklyCost
      budgetTier
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


export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
  addAddress(input: $input) {
    id
    label
    fullAddress
    latitude
    longitude
    isDefault
  }
}
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: String!, $input: AddressInput!) {
  updateAddress(id: $id, input: $input) {
    id
    label
    fullAddress
    latitude
    longitude
    isDefault
  }
}
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: String!) {
  deleteAddress(id: $id)
}
`;

export const SET_DEFAULT_ADDRESS = gql`
  mutation SetDefaultAddress($id: String!) {
  setDefaultAddress(id: $id)
}
`;

export const SAVE_WEEKLY_MEAL_PLAN = gql`
  mutation SaveWeeklyMealPlan($input: WeeklyMealPlanInput!) {
    saveWeeklyMealPlan(input: $input) {
      id
      name
      totalPrice
      createdAt
    }
  }
`;

export const RECALCULATE_MEAL_PLAN = gql`
  mutation RecalculateMealPlan($plan: WeeklyMealPlanInput!) {
    recalculateMealPlan(plan: $plan) {
      monday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      tuesday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      wednesday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      thursday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      friday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      saturday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      sunday {
        breakfast { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        lunch { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dinner { base { name price id category quantity } protein { name price id category quantity } soup { name price id category quantity } sides { name price id category quantity } totalCost }
        dailyCost
      }
      weeklyCost
      budgetTier
    }
  }
`;

export const TOP_UP_WALLET = gql`
  mutation TopUpWallet($amount: Float!, $reference: String) {
    topUpWallet(amount: $amount, reference: $reference) {
      wallet {
        id
        balance
        currency
      }
      transaction {
        id
        amount
        reference
        status
      }
    }
  }
`;

export const PAY_WITH_WALLET = gql`
  mutation PayWithWallet($amount: Float!, $orderId: Int!) {
    payWithWallet(amount: $amount, orderId: $orderId) {
      id
      amount
      type
      status
      reference
    }
  }
`;
