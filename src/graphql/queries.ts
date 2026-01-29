import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
    }
  }
`;

export const GET_MEAL_SUGGESTIONS = gql`
  query GetMealSuggestions($query: String!, $limit: Int) {
    mealSuggestions(query: $query, limit: $limit) {
      id
      name
      description
      calories
      protein
      carbs
      fat
    }
  }
`;

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    myProfile {
      id
      name
      email
      phone
      deliveryAddress
      pictureURL
    }
  }
`;

export const GET_MY_MEAL_PREFERENCES = gql`
  query GetMyMealPreferences {
    myMealPreferences {
      id
      dietaryRestrictions
      familySize
      budget
      favoriteMeals {
        id
        name
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    myNotificationPreferences {
      pushNotifications
      emailUpdates
      orderUpdates
    }
  }
`;

export const GET_FAQS = gql`
  query GetFaqs {
    faqs {
      id
      title
      content
    }
  }
`;

export const GET_MEAL_BY_NAME = gql`
  query GetMealByName($name: String!) {
    getMealByName(name: $name) {
      id
      name
      description
      calories
      protein
      carbs
      fat
      image
      ingredients
      instructions
    }
  }
`;
