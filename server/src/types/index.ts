export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  photoURL?: string;
  role?: 'creator' | 'host' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export type StudioCategory = 
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Art Workshop';

export interface IStudio {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface IBooking {
  _id?: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  hourlyRate: number;
  renterName: string;
  renterEmail: string;
  renterPhone?: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm format, e.g. "09:00"
  endTime: string;     // HH:mm format, e.g. "13:00"
  totalHours: number;
  totalPrice: number;
  securityDeposit: number;
  guestCount: number;
  specialNotes?: string;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlist {
  _id?: string;
  userEmail: string;
  studioId: string;
  createdAt?: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
  photoURL?: string;
  role: string;
}

