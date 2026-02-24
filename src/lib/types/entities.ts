

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

export type Faq = { id: string; title: string; content: string };

export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  meal: {
    name: string;
    image?: string;
  };
};

export type Order = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  deliveryDate: string;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  orderItems: OrderItem[];
};

export type BusinessHour = {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type Vendor = {
  id: number;
  businessName: string;
  description: string;
  pictureURL?: string;
  latitude?: number;
  longitude?: number;
  hours: BusinessHour[];
  foods: Meal[];
  // Calculated fields for UI
  distance?: string;
  rating?: number;
  reviews?: number;
  cuisine?: string;
  deliveryTime?: string;
};
