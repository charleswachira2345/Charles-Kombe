export interface User {
  id: string;
  name: string;
  avatar: string;
  isSeller: boolean;
  location: string;
  bio?: string;
  rating: number;
  joinedDate: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: string;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
}

export enum ServiceCategory {
  TUTORING = 'Tutoring',
  HOME_REPAIR = 'Home Repair',
  TECH = 'Tech Support',
  BEAUTY = 'Beauty & Wellness',
  CREATIVE = 'Creative & Design',
  TRANSPORT = 'Transport',
  OTHER = 'Other'
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  providerName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

export interface ChartDataPoint {
  name: string;
  amount: number;
}