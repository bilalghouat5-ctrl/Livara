export type Language = 'ar' | 'fr' | 'en' | 'kab';

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: Record<Language, string>;
}

export interface Listing {
  id: string;
  category: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  location: Record<Language, string>;
  wilaya: string; // Algeria Wilaya name
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  hostName: string;
  hostImage: string;
  hostRating?: number;
  beds: number;
  bathrooms: number;
  guests: number;
  features: Record<Language, string[]>;
  reviews: Review[];
  size?: string; // e.g., "150m²"
}

export interface Booking {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guestsCount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  listingTitle: Record<Language, string>;
  listingImage: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  conversation: {
    id: string;
    sender: 'user' | 'host';
    text: string;
    time: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  bio: string;
  avatar: string;
  verified: boolean;
  wilaya: string;
}
