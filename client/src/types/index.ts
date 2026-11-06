export type StudioCategory =
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Art Workshop';

export interface User {
  userId: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  instagram?: string;
  createdAt?: string;
}

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  additionalImages?: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  rules?: string[];
  dimensionsSqFt?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  hourlyRate: number;
  renterName: string;
  renterEmail: string;
  renterPhone?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  securityDeposit: number;
  guestCount: number;
  specialNotes?: string;
  status: BookingStatus;
  createdAt: string;
}

