export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  instructions?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  deliveryAddress?: string;
  profilePicture?: string;
}

export type Meal = {
  id: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
};

export type Faq = { id: string; title: string; content: string };
