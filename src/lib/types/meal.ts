export type Meal = {
  id: string;
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbohydrate?: number;
  fat?: number;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
};
