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
