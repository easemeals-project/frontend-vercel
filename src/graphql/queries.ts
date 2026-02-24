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
    searchFoods(query: $query, limit: $limit) {
      id
      name
      price
      protein
      carbohydrate
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
      addresses {
        id
        label
        fullAddress
        latitude
        longitude
        isDefault
      }
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
    getFoodByName(name: $name) {
      id
      name
      protein
      carbohydrate
      fat
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      orderNumber
      status
      totalPrice
      deliveryDate
      createdAt
    }
  }
`;

export const GET_MY_ORDER = gql`
  query GetMyOrder($id: Int!) {
    myOrder(id: $id) {
      id
      orderNumber
      status
      totalPrice
      deliveryDate
      deliveryAddress
      createdAt
      updatedAt
      shippedAt
      deliveredAt
      orderItems {
        id
        quantity
        price
        meal {
          name
          image
        }
      }
    }
  }
`;

export const GET_VENDORS = gql`
  query GetVendors {
    vendors {
      id
      businessName
      cuisine: description
      rating: monthlyIncome
      description
      pictureURL
      latitude
      longitude
      hours {
        dayOfWeek
        isOpen
        openTime
        closeTime
      }
      foods {
        id
        name
        price
      }
    }
  }
`;

export const GET_MY_WALLET = gql`
  query GetMyWallet {
    myWallet {
      id
      balance
      currency
      isActive
      transactions(limit: 20) {
        id
        amount
        type
        status
        description
        ref: reference
        createdAt
      }
    }
  }
`;
