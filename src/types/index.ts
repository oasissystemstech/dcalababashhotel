export type Currency = 'USD' | 'LRD';

export type ImageSourceType =
  | 'actual_business_photo'
  | 'licensed_stock'
  | 'ai_generated'
  | 'temporary_placeholder';

export interface BusinessSettings {
  id: string;
  businessName: string;
  tagline: string;
  address: string;
  telephone: string;
  whatsappNumber: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  defaultCurrency: Currency;
  exchangeRateUsdToLrd: number; // e.g., 195
  hotelCheckInTime: string; // "14:00"
  hotelCheckOutTime: string; // "11:00"
  restaurantOpenTime: string; // "07:00"
  restaurantCloseTime: string; // "23:00"
  taxRatePercent: number; // e.g. 10
  serviceChargePercent: number; // e.g. 5
  isOnlineBookingActive: boolean;
  aboutStory: string;
  missionStatement: string;
  visionStatement: string;
  heroImageUrl?: string;
  heroImageSourceType?: ImageSourceType;
  isHeroImageTemporary?: boolean;
  aboutImageUrl?: string;
  aboutImageSourceType?: ImageSourceType;
  isAboutImageTemporary?: boolean;
  restaurantHeroImageUrl?: string;
  restaurantHeroImageSourceType?: ImageSourceType;
  isRestaurantHeroImageTemporary?: boolean;
}

export interface RoomCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  maxAdults: number;
  maxChildren: number;
  bedConfiguration: string;
  totalRooms: number;
  pricePerNightUsd: number;
  promotionalPriceUsd?: number;
  amenities: string[];
  isActive: boolean;
  isDraft: boolean; // clearly indicates if placeholder/approved
  roomSizeM2?: number;
  imageSourceType?: ImageSourceType;
  isTemporaryImage?: boolean;
}

export interface Room {
  id: string;
  roomCategoryId: string;
  roomNumber: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  notes?: string;
}

export type HotelBookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partially_paid' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'mobile_money' | 'bank_transfer' | 'credit_card' | 'pay_on_arrival';

export interface HotelBooking {
  id: string;
  bookingReference: string; // e.g. DC-HTL-2026-1042
  roomCategoryId: string;
  roomCategoryName?: string;
  roomNumber?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  numberOfNights: number;
  adultsCount: number;
  childrenCount: number;
  roomsCount: number;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  specialRequests?: string;
  roomRatePerNightUsd: number;
  subtotalUsd: number;
  taxAmountUsd: number;
  totalAmountUsd: number;
  totalAmountLrd: number;
  status: HotelBookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  createdAt: string;
  source: 'website' | 'whatsapp' | 'phone' | 'walk_in';
}

export type MenuCategoryType =
  | 'starters'
  | 'liberian_specialties'
  | 'main_dishes'
  | 'grilled_seafood'
  | 'beverages_cocktails'
  | 'desserts';

export interface MenuCategory {
  id: string;
  name: string;
  slug: MenuCategoryType | string;
  description: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceUsd: number;
  imageUrl?: string;
  imageSourceType?: ImageSourceType;
  isTemporaryImage?: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  dietaryTags: string[]; // e.g. "Spicy", "Chef Special", "Seafood", "Vegetarian", "Popular"
  preparationTimeMins?: number;
  isDraft?: boolean;
}

export type RestaurantReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type SeatingArea = 'indoor_dining' | 'veranda_terrace' | 'private_dining' | 'bar_lounge';

export interface RestaurantReservation {
  id: string;
  reservationReference: string; // e.g. DC-RST-2026-8092
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  partySize: number;
  seatingArea: SeatingArea;
  tableNumber?: string;
  specialRequests?: string;
  status: RestaurantReservationStatus;
  createdAt: string;
  source: 'website' | 'whatsapp' | 'phone' | 'walk_in';
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'responded' | 'archived';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorLocation: string;
  serviceType: 'Hotel Stay' | 'Dining Experience' | 'Event Booking';
  rating: number;
  comment: string;
  date: string;
  verifiedGuest: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  discountBadge: string;
  validUntil: string;
  offerType: 'hotel' | 'restaurant' | 'event';
  isActive: boolean;
  imageUrl?: string;
  imageSourceType?: ImageSourceType;
  isTemporaryImage?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'exterior' | 'rooms' | 'restaurant' | 'food' | 'events' | 'lounge';
  categoryLabel?: string;
  imageUrl: string;
  caption?: string;
  description?: string;
  imageSourceType?: ImageSourceType;
  isTemporaryImage?: boolean;
}

export type AdminRole = 'super_admin' | 'hotel_manager' | 'restaurant_manager' | 'receptionist' | 'restaurant_staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}
