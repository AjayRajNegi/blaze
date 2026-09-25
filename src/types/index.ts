export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  _count: { sublocations: number };
}

export interface Sublocations {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  _count: { cars: number };
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  registrationNo: string;
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "CNG";
  transmission: "MANUAL" | "AUTOMATIC";
  seats: number;
  kmLimitPerDay: number;
  pricePerHour: number;
  pricePerDay: number;
  extraKmCharge: number;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE";
  images: string[];
  features: string[];
  subLocationsId: string;
  subLocation: {
    id: string;
    name: string;
    address: string;
    city: { id: string; name: string };
  };
}

export interface Booking {
  id: string;
  userId: string;
  cardId: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  totalHours: number;
  basePrice: number;
  totalPrice: number;
  kmLimitTotal: number;
  pickupAddress: string;
  notes?: string;
  createdAt: string;
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    images: string;
    fuelType: string;
    transmission: string;
    seats: number;
    sublocation: {
      name: string;
      address: string;
      city: { name: string };
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
