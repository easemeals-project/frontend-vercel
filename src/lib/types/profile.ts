export interface Address {
  id: string;
  label?: string | null;
  fullAddress: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  deliveryAddress?: string; // Deprecated
  pictureURL?: string;
  memberSince?: string;
  totalOrders?: number;
  addresses: Address[];
}
