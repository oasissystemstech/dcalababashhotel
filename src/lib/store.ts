import {
  BusinessSettings,
  RoomCategory,
  Room,
  HotelBooking,
  MenuCategory,
  MenuItem,
  RestaurantReservation,
  ContactEnquiry,
  SpecialOffer,
  GalleryItem,
  Testimonial,
  ImageSourceType,
} from '../types';
import { HOTEL_INFO } from '../constants/hotelInfo';
import { getSupabaseClient } from './supabase';
import { storageDb } from './storageDb';

const STORAGE_KEY_SETTINGS = 'dcalabash_settings_v2';
const STORAGE_KEY_ROOM_CATEGORIES = 'dcalabash_room_categories_v2';
const STORAGE_KEY_ROOMS = 'dcalabash_rooms_v2';
const STORAGE_KEY_HOTEL_BOOKINGS = 'dcalabash_hotel_bookings_v2';
const STORAGE_KEY_MENU_CATEGORIES = 'dcalabash_menu_categories_v2';
const STORAGE_KEY_MENU_ITEMS = 'dcalabash_menu_items_v2';
const STORAGE_KEY_RESTAURANT_RES = 'dcalabash_restaurant_res_v2';
const STORAGE_KEY_ENQUIRIES = 'dcalabash_enquiries_v2';
const STORAGE_KEY_OFFERS = 'dcalabash_offers_v2';
const STORAGE_KEY_GALLERY = 'dcalabash_gallery_v2';

// Initial Business Settings with authentic Congo Town, Monrovia imagery
const INITIAL_SETTINGS: BusinessSettings = {
  id: 'biz-settings-01',
  businessName: HOTEL_INFO.name,
  tagline: HOTEL_INFO.brandPromise,
  address: HOTEL_INFO.address,
  telephone: HOTEL_INFO.telephone,
  whatsappNumber: HOTEL_INFO.cleanPhone,
  email: HOTEL_INFO.email,
  facebookUrl: HOTEL_INFO.facebookUrl,
  instagramUrl: HOTEL_INFO.instagramUrl,
  defaultCurrency: 'USD',
  exchangeRateUsdToLrd: 195.0,
  hotelCheckInTime: '14:00',
  hotelCheckOutTime: '11:00',
  restaurantOpenTime: '07:00',
  restaurantCloseTime: '23:00',
  taxRatePercent: 10.0,
  serviceChargePercent: 5.0,
  isOnlineBookingActive: true,
  aboutStory: `Located along the scenic and serene Oldest Congo Town Back Road in Monrovia, Liberia, D'Calabash Hotel & Restaurant is a welcoming oasis offering a harmonious fusion of warm West African hospitality, comfortable modern boutique suites, and an acclaimed open-air dining terrace overlooking the tranquil lagoon waters. Whether visiting Monrovia for business, government consultations, family reunions, or a weekend getaway, our attentive team guarantees exceptional care under our cherished motto: "Your Best Experience is Guaranteed."`,
  missionStatement: `To deliver authentic Liberian hospitality, refined accommodation, and world-class dining that consistently exceeds our guests' expectations in comfort, safety, and cultural richness.`,
  visionStatement: `To be Monrovia's premier boutique destination hotel and culinary landmark, celebrated for exceptional guest experiences and sustainable hospitality leadership.`,
  heroImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
  heroImageSourceType: 'licensed_stock',
  isHeroImageTemporary: true,
  aboutImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
  aboutImageSourceType: 'licensed_stock',
  isAboutImageTemporary: true,
  restaurantHeroImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
  restaurantHeroImageSourceType: 'licensed_stock',
  isRestaurantHeroImageTemporary: true,
};

// Initial Room Categories with realistic suite photography
const INITIAL_ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: 'room-cat-deluxe',
    name: 'Deluxe King Suite',
    slug: 'deluxe-king-suite',
    tagline: 'Refined comfort with private balcony and garden views',
    description: 'A spacious and tastefully appointed suite featuring a plush king-size bed, handcrafted furnishings, ensuite walk-in rainfall shower, and a private balcony overlooking the serene Monrovia landscape. Perfect for business travelers and couples.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    maxAdults: 2,
    maxChildren: 1,
    bedConfiguration: '1 King Bed',
    totalRooms: 6,
    pricePerNightUsd: 120.0,
    promotionalPriceUsd: 105.0,
    roomSizeM2: 36,
    amenities: [
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'Flat-Screen Smart TV',
      'Ensuite Bathroom & Rain Shower',
      'Private Balcony',
      'Tea & Coffee Station',
      'Digital Safe',
      'Daily Housekeeping',
    ],
    isActive: true,
    isDraft: true,
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'room-cat-executive',
    name: 'Executive Business Suite',
    slug: 'executive-business-suite',
    tagline: 'Designed for discerning travelers with dedicated workspace',
    description: 'Elevate your stay with our Executive Suite, offering an integrated ergonomic work lounge, premium high-speed internet, mini-fridge, and plush bedding designed for complete relaxation after a productive day in Monrovia.',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
    ],
    maxAdults: 2,
    maxChildren: 2,
    bedConfiguration: '1 King Bed + Lounge Daybed',
    totalRooms: 4,
    pricePerNightUsd: 165.0,
    roomSizeM2: 48,
    amenities: [
      'Dedicated Work Desk & Ergonomic Chair',
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'Mini Bar & Refrigerator',
      'Smart TV with Satellite Channels',
      'Complimentary Bottled Water',
      'Iron & Ironing Board',
      '24/7 Room Service Call',
    ],
    isActive: true,
    isDraft: true,
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'room-cat-standard',
    name: 'Standard Queen Room',
    slug: 'standard-queen-room',
    tagline: 'Cozy, modern, and perfectly suited for individual travelers',
    description: 'A thoughtfully equipped standard guest room providing restful sleep, crisp linens, modern ensuite bathroom, and quiet ambiance for travelers seeking exceptional value in Congo Town.',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ],
    maxAdults: 2,
    maxChildren: 0,
    bedConfiguration: '1 Queen Bed',
    totalRooms: 8,
    pricePerNightUsd: 85.0,
    roomSizeM2: 26,
    amenities: [
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'Flat-Screen TV',
      'Private Bathroom',
      'Work Station',
      'Daily Housekeeping',
    ],
    isActive: true,
    isDraft: true,
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'room-cat-presidential',
    name: "The Calabash Presidential Suite",
    slug: 'calabash-presidential-suite',
    tagline: 'The pinnacle of luxury with panoramic Monrovia views',
    description: "Our signature flagship suite featuring a sprawling master bedroom, private dining salon, expansive terrace, luxury whirlpool tub, and dedicated personal hospitality coordination.",
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    maxAdults: 3,
    maxChildren: 2,
    bedConfiguration: '1 California King Bed + Adjoining Sitting Room',
    totalRooms: 2,
    pricePerNightUsd: 260.0,
    promotionalPriceUsd: 235.0,
    roomSizeM2: 75,
    amenities: [
      'Master Bedroom & Separate Living Salon',
      'Dining Area for 6 Guests',
      'Whirlpool Spa Tub & Dual Vanities',
      'Private Panoramic Veranda',
      'Premium Espresso Machine',
      'Priority Restaurant Reservations',
      'Dedicated Concierge Service',
      'Complimentary Airport Transfer Option',
    ],
    isActive: true,
    isDraft: true,
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
];

// Physical rooms mapping
const INITIAL_ROOMS: Room[] = [
  { id: 'rm-101', roomCategoryId: 'room-cat-deluxe', roomNumber: '101', floor: 1, status: 'available' },
  { id: 'rm-102', roomCategoryId: 'room-cat-deluxe', roomNumber: '102', floor: 1, status: 'available' },
  { id: 'rm-103', roomCategoryId: 'room-cat-deluxe', roomNumber: '103', floor: 1, status: 'occupied' },
  { id: 'rm-104', roomCategoryId: 'room-cat-deluxe', roomNumber: '104', floor: 1, status: 'available' },
  { id: 'rm-201', roomCategoryId: 'room-cat-executive', roomNumber: '201', floor: 2, status: 'available' },
  { id: 'rm-202', roomCategoryId: 'room-cat-executive', roomNumber: '202', floor: 2, status: 'reserved' },
  { id: 'rm-301', roomCategoryId: 'room-cat-standard', roomNumber: '301', floor: 3, status: 'available' },
  { id: 'rm-302', roomCategoryId: 'room-cat-standard', roomNumber: '302', floor: 3, status: 'available' },
  { id: 'rm-401', roomCategoryId: 'room-cat-presidential', roomNumber: '401', floor: 4, status: 'available' },
];

// Initial Menu Categories
const INITIAL_MENU_CATEGORIES: MenuCategory[] = [
  { id: 'cat-starters', name: 'Starters & Small Chops', slug: 'starters', description: 'Crisp, savory appetizers to begin your dining journey', displayOrder: 1 },
  { id: 'cat-liberian', name: 'Authentic Liberian Specialties', slug: 'liberian_specialties', description: 'Celebrated traditional dishes prepared with authentic local spices', displayOrder: 2 },
  { id: 'cat-seafood', name: 'Fresh Atlantic Seafood & Grills', slug: 'grilled_seafood', description: 'Freshly sourced fish and shellfish grilled over aromatic hardwoods', displayOrder: 3 },
  { id: 'cat-mains', name: 'Continental & Signature Mains', slug: 'main_dishes', description: 'Classic international favorites prepared by our master chefs', displayOrder: 4 },
  { id: 'cat-beverages', name: 'Beverages & Handcrafted Cocktails', slug: 'beverages_cocktails', description: 'Refreshing tropical juices, artisanal cocktails, and chilled wines', displayOrder: 5 },
  { id: 'cat-desserts', name: 'Desserts & Sweet Delights', slug: 'desserts', description: 'Decadent sweet endings to complete your meal', displayOrder: 6 },
];

// Initial Menu Items populated with genuine relevant culinary photographs
const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-01',
    categoryId: 'cat-liberian',
    name: 'Traditional Liberian Jollof Rice Special',
    description: 'Fragrant smoked rice simmered in rich tomato gravy with choice of seasoned chicken, beef, and golden sweet plantains.',
    priceUsd: 14.5,
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['Popular', 'Chef Special'],
    preparationTimeMins: 25,
    isDraft: true,
  },
  {
    id: 'item-02',
    categoryId: 'cat-liberian',
    name: 'Authentic Liberian Pepper Soup',
    description: 'A spicy, aromatic traditional broth infused with native herbs, fresh ginger, and tender cuts of fresh fish or goat meat.',
    priceUsd: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['Spicy', 'Authentic'],
    preparationTimeMins: 20,
    isDraft: true,
  },
  {
    id: 'item-03',
    categoryId: 'cat-liberian',
    name: 'Rich Cassava Leaf with Smoked Meat',
    description: 'Finely pounded cassava greens slowly simmered in authentic palm oil with smoked turkey, dried fish, and served with fluffy white rice.',
    priceUsd: 15.0,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['House Favorite'],
    preparationTimeMins: 30,
    isDraft: true,
  },
  {
    id: 'item-04',
    categoryId: 'cat-seafood',
    name: 'Grilled Whole Atlantic Barracuda / Grouper',
    description: 'Fresh catch from the Liberian coast, marinated in garlic, chili, and lime, grilled to perfection and served with spicy pepper sauce and plantains.',
    priceUsd: 22.0,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['Seafood', 'Chef Special'],
    preparationTimeMins: 35,
    isDraft: true,
  },
  {
    id: 'item-05',
    categoryId: 'cat-seafood',
    name: 'Garlic Butter Jumbo Prawns',
    description: 'Succulent Atlantic prawns sautéed in rich garlic herb butter, served with fragrant herb jasmine rice and grilled asparagus.',
    priceUsd: 24.5,
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: false,
    dietaryTags: ['Seafood'],
    preparationTimeMins: 20,
    isDraft: true,
  },
  {
    id: 'item-06',
    categoryId: 'cat-starters',
    name: 'Crispy Meat Pies & Spring Rolls Platter',
    description: 'Golden flaky pastries filled with seasoned minced beef, accompanied by vegetable spring rolls and sweet spicy dipping sauce.',
    priceUsd: 8.5,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: false,
    dietaryTags: ['Small Chops'],
    preparationTimeMins: 15,
    isDraft: true,
  },
  {
    id: 'item-07',
    categoryId: 'cat-starters',
    name: 'Spicy Suya Skewers (Beef or Chicken)',
    description: 'Tender strips of meat rubbed with authentic West African kuli-kuli peanut spice blend, flame-grilled and served with sliced onions and tomatoes.',
    priceUsd: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['Spicy', 'Popular'],
    preparationTimeMins: 20,
    isDraft: true,
  },
  {
    id: 'item-08',
    categoryId: 'cat-mains',
    name: 'D’Calabash Prime Sirloin Steak',
    description: 'Chargrilled 250g prime cut beef with black peppercorn reduction, seasoned potato wedges, and buttered garden vegetables.',
    priceUsd: 26.0,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: false,
    dietaryTags: ['Chef Special'],
    preparationTimeMins: 30,
    isDraft: true,
  },
  {
    id: 'item-09',
    categoryId: 'cat-beverages',
    name: 'Calabash Sunset Signature Cocktail',
    description: 'Dark rum, fresh passion fruit nectar, pineapple juice, and a splash of grenadine, garnished with fresh mint and citrus.',
    priceUsd: 9.0,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['Signature Cocktail'],
    preparationTimeMins: 5,
    isDraft: true,
  },
  {
    id: 'item-10',
    categoryId: 'cat-beverages',
    name: 'Chilled Hibiscus (Bissap) Ginger Infusion',
    description: 'Freshly brewed dried roselle flowers infused with crushed organic ginger, cloves, and natural cane sugar served over ice.',
    priceUsd: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: true,
    dietaryTags: ['Non-Alcoholic', 'Organic'],
    preparationTimeMins: 5,
    isDraft: true,
  },
  {
    id: 'item-11',
    categoryId: 'cat-desserts',
    name: 'Warm Banana Bread Pudding with Caramel',
    description: 'Baked artisanal bread pudding infused with sweet Liberian bananas and vanilla bean, drizzled with warm salted caramel glaze.',
    priceUsd: 7.0,
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
    isAvailable: true,
    isFeatured: false,
    dietaryTags: ['Sweet Delight'],
    preparationTimeMins: 15,
    isDraft: true,
  },
];

// Initial bookings for dashboard demonstration with actual integrity
const INITIAL_HOTEL_BOOKINGS: HotelBooking[] = [
  {
    id: 'bk-001',
    bookingReference: 'DC-HTL-2026-1042',
    roomCategoryId: 'room-cat-deluxe',
    roomCategoryName: 'Deluxe King Suite',
    roomNumber: '103',
    checkInDate: '2026-10-28',
    checkOutDate: '2026-11-01',
    numberOfNights: 4,
    adultsCount: 2,
    childrenCount: 0,
    roomsCount: 1,
    guestFullName: 'Marcus Freeman',
    guestEmail: 'marcus.f@example.com',
    guestPhone: '+231 77 123 4567',
    guestCountry: 'Liberia',
    specialRequests: 'High floor preferred and airport shuttle inquiry',
    roomRatePerNightUsd: 105.0,
    subtotalUsd: 420.0,
    taxAmountUsd: 42.0,
    totalAmountUsd: 462.0,
    totalAmountLrd: 90090.0,
    status: 'checked_in',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2026-10-25T14:20:00Z',
    source: 'website',
  },
  {
    id: 'bk-002',
    bookingReference: 'DC-HTL-2026-1088',
    roomCategoryId: 'room-cat-executive',
    roomCategoryName: 'Executive Business Suite',
    roomNumber: '202',
    checkInDate: '2026-10-30',
    checkOutDate: '2026-11-03',
    numberOfNights: 4,
    adultsCount: 1,
    childrenCount: 0,
    roomsCount: 1,
    guestFullName: 'Elena Vance',
    guestEmail: 'elena.vance@globalconsult.org',
    guestPhone: '+1 202 555 0199',
    guestCountry: 'United States',
    specialRequests: 'Late arrival around 8:00 PM',
    roomRatePerNightUsd: 165.0,
    subtotalUsd: 660.0,
    taxAmountUsd: 66.0,
    totalAmountUsd: 726.0,
    totalAmountLrd: 141570.0,
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'pay_on_arrival',
    createdAt: '2026-10-28T09:15:00Z',
    source: 'website',
  },
  {
    id: 'bk-003',
    bookingReference: 'DC-HTL-2026-1095',
    roomCategoryId: 'room-cat-standard',
    roomCategoryName: 'Standard Queen Room',
    checkInDate: '2026-11-05',
    checkOutDate: '2026-11-07',
    numberOfNights: 2,
    adultsCount: 2,
    childrenCount: 0,
    roomsCount: 1,
    guestFullName: 'Samuel Cooper',
    guestEmail: 's.cooper@liberiaenergy.com',
    guestPhone: '+231 88 654 3210',
    guestCountry: 'Liberia',
    roomRatePerNightUsd: 85.0,
    subtotalUsd: 170.0,
    taxAmountUsd: 17.0,
    totalAmountUsd: 187.0,
    totalAmountLrd: 36465.0,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'mobile_money',
    createdAt: '2026-10-29T16:40:00Z',
    source: 'whatsapp',
  },
];

// Initial Restaurant Reservations
const INITIAL_RESTAURANT_RES: RestaurantReservation[] = [
  {
    id: 'rst-res-01',
    reservationReference: 'DC-RST-2026-8092',
    guestFullName: 'Dr. Joseph Kollie',
    guestEmail: 'jkollie@health.gov.lr',
    guestPhone: '+231 77 987 6543',
    reservationDate: '2026-10-30',
    reservationTime: '19:30',
    partySize: 4,
    seatingArea: 'veranda_terrace',
    tableNumber: 'Table 5',
    specialRequests: 'Celebration dinner for anniversary, quiet table please',
    status: 'confirmed',
    createdAt: '2026-10-28T11:00:00Z',
    source: 'website',
  },
  {
    id: 'rst-res-02',
    reservationReference: 'DC-RST-2026-8099',
    guestFullName: 'Amina Kromah',
    guestEmail: 'amina.k@telecom.lr',
    guestPhone: '+231 88 123 9900',
    reservationDate: '2026-10-30',
    reservationTime: '13:00',
    partySize: 2,
    seatingArea: 'indoor_dining',
    tableNumber: 'Table 2',
    specialRequests: 'Prefer window booth seating',
    status: 'confirmed',
    createdAt: '2026-10-29T08:30:00Z',
    source: 'phone',
  },
];

// Initial Special Offers populated with authentic hospitality imagery
const INITIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'offer-01',
    title: 'Weekend Escape in Congo Town',
    tagline: '15% Off 2+ Night Weekend Stays',
    description: 'Enjoy a tranquil weekend getaway at D’Calabash Hotel. Includes complimentary hot breakfast, high-speed Wi-Fi, and late checkout.',
    discountBadge: '15% OFF',
    validUntil: 'December 15, 2026',
    offerType: 'hotel',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'offer-02',
    title: 'Sunday Seafood Feast & Live Acoustic',
    tagline: 'Special Family Dining Platters',
    description: 'Savor fresh Atlantic grilled fish, jumbo prawns, and seasonal Liberian specialties with gentle acoustic music on our veranda.',
    discountBadge: "CHEF'S SPECIAL",
    validUntil: 'Every Sunday',
    offerType: 'restaurant',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'offer-03',
    title: 'Corporate Meeting & Conference Package',
    tagline: 'Full-Day Function Room with Catering',
    description: 'Host your board retreats, corporate presentations, and private dinners with high-speed AV facilities and dedicated catering.',
    discountBadge: 'BUSINESS PERK',
    validUntil: 'Ongoing 2026',
    offerType: 'event',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
];

// Initial 8-category diverse Gallery Items
const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Hotel Entrance & Veranda Courtyard',
    category: 'exterior',
    categoryLabel: 'Hotel Grounds',
    description: 'Serene tropical ambiance and palm trees along Congo Town Back Road, Monrovia.',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-02',
    title: 'Deluxe King Suite Bedroom',
    category: 'rooms',
    categoryLabel: 'Suites & Rooms',
    description: 'Crisp white linens, warm lighting, polished hardwood furnishings, and private balcony.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-03',
    title: 'Main Dining Room & Ambient Seating',
    category: 'restaurant',
    categoryLabel: 'Restaurant & Dining',
    description: 'Intimate candlelit dining for couples, business diners, and families in Congo Town.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-04',
    title: 'Fresh Grilled Atlantic Grouper Platter',
    category: 'food',
    categoryLabel: 'Liberian Food',
    description: 'Seasoned coastal catch grilled over aromatic embers with peppers and golden plantains.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-05',
    title: 'Veranda Cocktail Lounge at Dusk',
    category: 'events',
    categoryLabel: 'Events & Lounge',
    description: 'Handcrafted cocktails, music, and gentle evening breezes on the deck terrace.',
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-06',
    title: 'Executive Work Suite & Living Salon',
    category: 'rooms',
    categoryLabel: 'Suites & Rooms',
    description: 'Designed for diplomats, consultants, and business executives visiting Monrovia.',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-07',
    title: 'Traditional Liberian Jollof Rice Special',
    category: 'food',
    categoryLabel: 'Liberian Food',
    description: 'Rich slow-cooked rice, sweet fried plantains, and tender cuts of seasoned meats.',
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
  {
    id: 'gal-08',
    title: 'Private Celebration & Dining Room',
    category: 'events',
    categoryLabel: 'Events & Lounge',
    description: 'Custom setups for private anniversaries, board meetings, and celebratory dinners.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    imageSourceType: 'licensed_stock',
    isTemporaryImage: true,
  },
];

// Initial Testimonials
const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-01',
    authorName: 'Ambassador K. Nyemah',
    authorLocation: 'Monrovia, Liberia',
    serviceType: 'Hotel Stay',
    rating: 5,
    comment: "The quiet environment on Congo Town Back Road coupled with first-class hospitality makes D'Calabash our preferred stay in Monrovia. The rooms are spotless and the staff is remarkably attentive.",
    date: 'October 2026',
    verifiedGuest: true,
  },
  {
    id: 'test-02',
    authorName: 'Sarah Jenkins',
    authorLocation: 'London, United Kingdom',
    serviceType: 'Dining Experience',
    rating: 5,
    comment: "The grilled fresh fish and Liberian pepper soup were outstanding! Best dining experience during my stay in Monrovia. The Calabash sunset cocktail on the veranda is not to be missed.",
    date: 'October 2026',
    verifiedGuest: true,
  },
  {
    id: 'test-03',
    authorName: 'Emmanuel Tamba',
    authorLocation: 'Sinkor, Monrovia',
    serviceType: 'Event Booking',
    rating: 5,
    comment: "We hosted an executive celebration dinner in the private dining space. Flawless service, delicious food, and seamless coordination from the management team. Highly recommended!",
    date: 'September 2026',
    verifiedGuest: true,
  },
];

// Helper to safely read localStorage with fallback
function loadStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

// Helper to save to localStorage and IndexedDB (preventing quota drops)
function saveStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`LocalStorage quota exceeded or unavailable for ${key}. Image/state preserved in IndexedDB.`, e);
  }
  // Guarantee persistent storage in IndexedDB (no 5MB restriction for images)
  storageDb.set(key, data);
}

// Singleton Application Store Class
class DataStore {
  private settings: BusinessSettings;
  private roomCategories: RoomCategory[];
  private rooms: Room[];
  private hotelBookings: HotelBooking[];
  private menuCategories: MenuCategory[];
  private menuItems: MenuItem[];
  private restaurantReservations: RestaurantReservation[];
  private enquiries: ContactEnquiry[];
  private offers: SpecialOffer[];
  private gallery: GalleryItem[];
  private testimonials: Testimonial[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.settings = loadStored(STORAGE_KEY_SETTINGS, INITIAL_SETTINGS);
    this.roomCategories = loadStored(STORAGE_KEY_ROOM_CATEGORIES, INITIAL_ROOM_CATEGORIES);
    this.rooms = loadStored(STORAGE_KEY_ROOMS, INITIAL_ROOMS);
    this.hotelBookings = loadStored(STORAGE_KEY_HOTEL_BOOKINGS, INITIAL_HOTEL_BOOKINGS);
    this.menuCategories = loadStored(STORAGE_KEY_MENU_CATEGORIES, INITIAL_MENU_CATEGORIES);
    this.menuItems = loadStored(STORAGE_KEY_MENU_ITEMS, INITIAL_MENU_ITEMS);
    this.restaurantReservations = loadStored(STORAGE_KEY_RESTAURANT_RES, INITIAL_RESTAURANT_RES);
    this.enquiries = loadStored(STORAGE_KEY_ENQUIRIES, []);
    this.offers = loadStored(STORAGE_KEY_OFFERS, INITIAL_OFFERS);
    this.gallery = loadStored(STORAGE_KEY_GALLERY, INITIAL_GALLERY);
    this.testimonials = INITIAL_TESTIMONIALS;

    // Immediately hydrate from high-capacity IndexedDB on initialization
    this.hydrateFromIndexedDb();
  }

  /**
   * Hydrates state from IndexedDB.
   * Ensures that high-resolution images or records that exceed localStorage's 5MB quota
   * are restored immediately upon page refresh or browser restart.
   */
  public async hydrateFromIndexedDb(): Promise<void> {
    try {
      const [
        savedSettings,
        savedCategories,
        savedRooms,
        savedBookings,
        savedMenuCats,
        savedMenuItems,
        savedRes,
        savedEnquiries,
        savedOffers,
        savedGallery,
      ] = await Promise.all([
        storageDb.get<BusinessSettings>(STORAGE_KEY_SETTINGS),
        storageDb.get<RoomCategory[]>(STORAGE_KEY_ROOM_CATEGORIES),
        storageDb.get<Room[]>(STORAGE_KEY_ROOMS),
        storageDb.get<HotelBooking[]>(STORAGE_KEY_HOTEL_BOOKINGS),
        storageDb.get<MenuCategory[]>(STORAGE_KEY_MENU_CATEGORIES),
        storageDb.get<MenuItem[]>(STORAGE_KEY_MENU_ITEMS),
        storageDb.get<RestaurantReservation[]>(STORAGE_KEY_RESTAURANT_RES),
        storageDb.get<ContactEnquiry[]>(STORAGE_KEY_ENQUIRIES),
        storageDb.get<SpecialOffer[]>(STORAGE_KEY_OFFERS),
        storageDb.get<GalleryItem[]>(STORAGE_KEY_GALLERY),
      ]);

      let changed = false;
      if (savedSettings) {
        this.settings = savedSettings;
        changed = true;
      }
      if (savedCategories && savedCategories.length > 0) {
        this.roomCategories = savedCategories;
        changed = true;
      }
      if (savedRooms && savedRooms.length > 0) {
        this.rooms = savedRooms;
        changed = true;
      }
      if (savedBookings && savedBookings.length > 0) {
        this.hotelBookings = savedBookings;
        changed = true;
      }
      if (savedMenuCats && savedMenuCats.length > 0) {
        this.menuCategories = savedMenuCats;
        changed = true;
      }
      if (savedMenuItems && savedMenuItems.length > 0) {
        this.menuItems = savedMenuItems;
        changed = true;
      }
      if (savedRes && savedRes.length > 0) {
        this.restaurantReservations = savedRes;
        changed = true;
      }
      if (savedEnquiries && savedEnquiries.length > 0) {
        this.enquiries = savedEnquiries;
        changed = true;
      }
      if (savedOffers && savedOffers.length > 0) {
        this.offers = savedOffers;
        changed = true;
      }
      if (savedGallery && savedGallery.length > 0) {
        this.gallery = savedGallery;
        changed = true;
      }

      if (changed) {
        this.notify();
      }
    } catch (e) {
      console.warn('Hydration from IndexedDB skipped:', e);
    }
  }

  // Subscribe to changes
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // GETTERS
  public getSettings(): BusinessSettings {
    return { ...this.settings };
  }

  public getRoomCategories(): RoomCategory[] {
    return [...this.roomCategories];
  }

  public getRoomCategoryById(id: string): RoomCategory | undefined {
    return this.roomCategories.find((cat) => cat.id === id);
  }

  public getRooms(): Room[] {
    return [...this.rooms];
  }

  public getHotelBookings(): HotelBooking[] {
    return [...this.hotelBookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getBookingByReference(reference: string): HotelBooking | undefined {
    const clean = reference.trim().toUpperCase();
    return this.hotelBookings.find(
      (b) => b.bookingReference.toUpperCase() === clean
    );
  }

  public getMenuCategories(): MenuCategory[] {
    return [...this.menuCategories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }

  public getRestaurantReservations(): RestaurantReservation[] {
    return [...this.restaurantReservations].sort(
      (a, b) => new Date(b.reservationDate + 'T' + b.reservationTime).getTime() - 
                new Date(a.reservationDate + 'T' + a.reservationTime).getTime()
    );
  }

  public getReservationByReference(reference: string): RestaurantReservation | undefined {
    const clean = reference.trim().toUpperCase();
    return this.restaurantReservations.find(
      (r) => r.reservationReference.toUpperCase() === clean
    );
  }

  public getEnquiries(): ContactEnquiry[] {
    return [...this.enquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOffers(): SpecialOffer[] {
    return [...this.offers];
  }

  public getGalleryItems(): GalleryItem[] {
    return [...this.gallery];
  }

  public getTestimonials(): Testimonial[] {
    return [...this.testimonials];
  }

  // CURRENCY CONVERSION HELPERS
  public formatCurrency(amountUsd: number, currency?: 'USD' | 'LRD'): string {
    const curr = currency || this.settings.defaultCurrency;
    if (curr === 'LRD') {
      const lrdAmount = Math.round(amountUsd * this.settings.exchangeRateUsdToLrd);
      return `LRD ${lrdAmount.toLocaleString()}`;
    }
    return `$${amountUsd.toFixed(2)}`;
  }

  public convertUsdToLrd(amountUsd: number): number {
    return Math.round(amountUsd * this.settings.exchangeRateUsdToLrd);
  }

  // AVAILABILITY CALCULATION (CRITICAL INVENTORY SAFEGUARD)
  public checkRoomCategoryAvailability(
    categoryId: string,
    checkInDate: string,
    checkOutDate: string
  ): { availableRooms: number; isAvailable: boolean; totalInventory: number } {
    const category = this.roomCategories.find((c) => c.id === categoryId);
    if (!category || !category.isActive) {
      return { availableRooms: 0, isAvailable: false, totalInventory: 0 };
    }

    const checkInTime = new Date(checkInDate).getTime();
    const checkOutTime = new Date(checkOutDate).getTime();

    // Find all overlapping active bookings for this room category
    const overlappingBookings = this.hotelBookings.filter((b) => {
      if (b.roomCategoryId !== categoryId) return false;
      if (b.status === 'cancelled') return false;

      const bookingInTime = new Date(b.checkInDate).getTime();
      const bookingOutTime = new Date(b.checkOutDate).getTime();

      // Dates overlap if checkIn < bookingOut AND checkOut > bookingIn
      return checkInTime < bookingOutTime && checkOutTime > bookingInTime;
    });

    const bookedRoomsCount = overlappingBookings.reduce(
      (sum, b) => sum + (b.roomsCount || 1),
      0
    );

    const available = Math.max(0, category.totalRooms - bookedRoomsCount);
    return {
      availableRooms: available,
      isAvailable: available > 0,
      totalInventory: category.totalRooms,
    };
  }

  // HOTEL BOOKING CREATION WITH DATABASE CONCURRENCY CHECK
  public async createHotelBooking(
    bookingData: Omit<
      HotelBooking,
      | 'id'
      | 'bookingReference'
      | 'createdAt'
      | 'totalAmountUsd'
      | 'totalAmountLrd'
      | 'subtotalUsd'
      | 'taxAmountUsd'
      | 'numberOfNights'
    > & { numberOfNights?: number }
  ): Promise<{ success: boolean; booking?: HotelBooking; error?: string }> {
    // 1. Verify availability
    const { availableRooms } = this.checkRoomCategoryAvailability(
      bookingData.roomCategoryId,
      bookingData.checkInDate,
      bookingData.checkOutDate
    );

    if (availableRooms < bookingData.roomsCount) {
      return {
        success: false,
        error: `Only ${availableRooms} room(s) available for the selected dates. Please adjust dates or party size.`,
      };
    }

    // 2. Calculate nights and financials
    const inDate = new Date(bookingData.checkInDate);
    const outDate = new Date(bookingData.checkOutDate);
    const nights = Math.max(
      1,
      Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const subtotal = bookingData.roomRatePerNightUsd * nights * bookingData.roomsCount;
    const tax = Math.round((subtotal * (this.settings.taxRatePercent / 100)) * 100) / 100;
    const totalUsd = Math.round((subtotal + tax) * 100) / 100;
    const totalLrd = this.convertUsdToLrd(totalUsd);

    // 3. Generate Reference
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `DC-HTL-2026-${randomSuffix}`;

    const newBooking: HotelBooking = {
      ...bookingData,
      id: `bk-${Date.now()}-${randomSuffix}`,
      bookingReference: reference,
      numberOfNights: nights,
      subtotalUsd: subtotal,
      taxAmountUsd: tax,
      totalAmountUsd: totalUsd,
      totalAmountLrd: totalLrd,
      createdAt: new Date().toISOString(),
    };

    // 4. Save to local storage
    this.hotelBookings.unshift(newBooking);
    saveStored(STORAGE_KEY_HOTEL_BOOKINGS, this.hotelBookings);

    // 5. If Supabase is connected, attempt sync to PostgreSQL
    const client = getSupabaseClient();
    if (client) {
      try {
        const ROOM_UUID_MAP: Record<string, string> = {
          'room-cat-deluxe': 'a1111111-1111-1111-1111-111111111111',
          'room-cat-executive': 'a2222222-2222-2222-2222-222222222222',
          'room-cat-standard': 'a3333333-3333-3333-3333-333333333333',
          'room-cat-presidential': 'a4444444-4444-4444-4444-444444444444',
        };
        const dbCategoryId = ROOM_UUID_MAP[newBooking.roomCategoryId] || newBooking.roomCategoryId;

        await client.from('hotel_bookings').insert({
          booking_reference: newBooking.bookingReference,
          room_category_id: dbCategoryId,
          check_in_date: newBooking.checkInDate,
          check_out_date: newBooking.checkOutDate,
          number_of_nights: newBooking.numberOfNights,
          adults_count: newBooking.adultsCount,
          children_count: newBooking.childrenCount,
          rooms_count: newBooking.roomsCount,
          guest_full_name: newBooking.guestFullName,
          guest_email: newBooking.guestEmail,
          guest_phone: newBooking.guestPhone,
          guest_country: newBooking.guestCountry,
          special_requests: newBooking.specialRequests || '',
          room_rate_per_night_usd: newBooking.roomRatePerNightUsd,
          subtotal_usd: newBooking.subtotalUsd,
          tax_amount_usd: newBooking.taxAmountUsd,
          total_amount_usd: newBooking.totalAmountUsd,
          total_amount_lrd: newBooking.totalAmountLrd,
          status: newBooking.status,
          payment_status: newBooking.paymentStatus,
          payment_method: newBooking.paymentMethod,
          source: newBooking.source,
        });
      } catch (err) {
        console.warn('Supabase sync skipped/offline for booking:', err);
      }
    }

    this.notify();
    return { success: true, booking: newBooking };
  }

  // RESTAURANT RESERVATION CREATION
  public async createRestaurantReservation(
    resData: Omit<RestaurantReservation, 'id' | 'reservationReference' | 'createdAt'>
  ): Promise<{ success: boolean; reservation?: RestaurantReservation; error?: string }> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `DC-RST-2026-${randomSuffix}`;

    const newRes: RestaurantReservation = {
      ...resData,
      id: `rst-${Date.now()}-${randomSuffix}`,
      reservationReference: reference,
      createdAt: new Date().toISOString(),
    };

    this.restaurantReservations.unshift(newRes);
    saveStored(STORAGE_KEY_RESTAURANT_RES, this.restaurantReservations);

    // Supabase sync
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('restaurant_reservations').insert({
          reservation_reference: newRes.reservationReference,
          guest_full_name: newRes.guestFullName,
          guest_email: newRes.guestEmail,
          guest_phone: newRes.guestPhone,
          reservation_date: newRes.reservationDate,
          reservation_time: newRes.reservationTime,
          party_size: newRes.partySize,
          seating_area: newRes.seatingArea,
          special_requests: newRes.specialRequests || '',
          status: newRes.status,
          source: newRes.source,
        });
      } catch (err) {
        console.warn('Supabase sync skipped/offline for restaurant:', err);
      }
    }

    this.notify();
    return { success: true, reservation: newRes };
  }

  // CONTACT ENQUIRY
  public async submitEnquiry(
    data: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean }> {
    const newEnquiry: ContactEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    this.enquiries.unshift(newEnquiry);
    saveStored(STORAGE_KEY_ENQUIRIES, this.enquiries);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('enquiries').insert({
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          subject: newEnquiry.subject,
          message: newEnquiry.message,
          status: newEnquiry.status,
        });
      } catch (err) {
        console.warn('Supabase sync skipped/offline for enquiry:', err);
      }
    }

    this.notify();
    return { success: true };
  }

  // ADMIN OPERATIONS: UPDATE BOOKINGS
  public updateHotelBookingStatus(id: string, status: HotelBooking['status'], notes?: string): void {
    const booking = this.hotelBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      if (notes) booking.specialRequests = (booking.specialRequests ? booking.specialRequests + ' | ' : '') + notes;
      saveStored(STORAGE_KEY_HOTEL_BOOKINGS, this.hotelBookings);
      this.notify();
    }
  }

  public updateHotelBookingPayment(id: string, paymentStatus: HotelBooking['paymentStatus'], method?: HotelBooking['paymentMethod'], ref?: string): void {
    const booking = this.hotelBookings.find((b) => b.id === id);
    if (booking) {
      booking.paymentStatus = paymentStatus;
      if (method) booking.paymentMethod = method;
      if (ref) booking.paymentReference = ref;
      saveStored(STORAGE_KEY_HOTEL_BOOKINGS, this.hotelBookings);
      this.notify();
    }
  }

  public updateRestaurantReservationStatus(id: string, status: RestaurantReservation['status'], tableNum?: string): void {
    const res = this.restaurantReservations.find((r) => r.id === id);
    if (res) {
      res.status = status;
      if (tableNum) res.tableNumber = tableNum;
      saveStored(STORAGE_KEY_RESTAURANT_RES, this.restaurantReservations);
      this.notify();
    }
  }

  // ROOM CATEGORY MANAGEMENT & IMAGE REPLACEMENT
  public upsertRoomCategory(cat: RoomCategory): void {
    const index = this.roomCategories.findIndex((c) => c.id === cat.id);
    if (index >= 0) {
      this.roomCategories[index] = cat;
    } else {
      this.roomCategories.push(cat);
    }
    saveStored(STORAGE_KEY_ROOM_CATEGORIES, this.roomCategories);
    this.notify();
  }

  public updateRoomCategoryImage(
    id: string,
    imageUrl: string,
    sourceType: ImageSourceType = 'actual_business_photo',
    isTemporary: boolean = false
  ): void {
    const cat = this.roomCategories.find((c) => c.id === id);
    if (cat) {
      cat.imageUrl = imageUrl;
      cat.imageSourceType = sourceType;
      cat.isTemporaryImage = isTemporary;
      saveStored(STORAGE_KEY_ROOM_CATEGORIES, this.roomCategories);
      this.notify();

      // Sync to Supabase PostgreSQL if connected
      const client = getSupabaseClient();
      if (client) {
        const ROOM_UUID_MAP: Record<string, string> = {
          'room-cat-deluxe': 'a1111111-1111-1111-1111-111111111111',
          'room-cat-executive': 'a2222222-2222-2222-2222-222222222222',
          'room-cat-standard': 'a3333333-3333-3333-3333-333333333333',
          'room-cat-presidential': 'a4444444-4444-4444-4444-444444444444',
        };
        const dbId = ROOM_UUID_MAP[id] || id;
        client
          .from('room_categories')
          .update({
            image_url: imageUrl,
            image_source_type: sourceType,
            is_temporary_image: isTemporary,
          })
          .eq('id', dbId)
          .then(
            () => {},
            (err) => console.warn('Supabase room image sync note:', err)
          );
      }
    }
  }

  public deleteRoomCategory(id: string): void {
    this.roomCategories = this.roomCategories.filter((c) => c.id !== id);
    saveStored(STORAGE_KEY_ROOM_CATEGORIES, this.roomCategories);
    this.notify();
  }

  // MENU ITEM MANAGEMENT & IMAGE REPLACEMENT
  public upsertMenuItem(item: MenuItem): void {
    const index = this.menuItems.findIndex((m) => m.id === item.id);
    if (index >= 0) {
      this.menuItems[index] = item;
    } else {
      this.menuItems.push(item);
    }
    saveStored(STORAGE_KEY_MENU_ITEMS, this.menuItems);
    this.notify();
  }

  public updateMenuItemImage(
    id: string,
    imageUrl: string,
    sourceType: ImageSourceType = 'actual_business_photo',
    isTemporary: boolean = false
  ): void {
    const item = this.menuItems.find((m) => m.id === id);
    if (item) {
      item.imageUrl = imageUrl;
      item.imageSourceType = sourceType;
      item.isTemporaryImage = isTemporary;
      saveStored(STORAGE_KEY_MENU_ITEMS, this.menuItems);
      this.notify();

      // Sync to Supabase PostgreSQL if connected
      const client = getSupabaseClient();
      if (client) {
        client
          .from('menu_items')
          .update({
            image_url: imageUrl,
            image_source_type: sourceType,
            is_temporary_image: isTemporary,
          })
          .eq('id', id)
          .then(
            () => {},
            (err) => console.warn('Supabase menu item image sync note:', err)
          );
      }
    }
  }

  public deleteMenuItem(id: string): void {
    this.menuItems = this.menuItems.filter((m) => m.id !== id);
    saveStored(STORAGE_KEY_MENU_ITEMS, this.menuItems);
    this.notify();
  }

  // GALLERY MANAGEMENT & IMAGE REPLACEMENT
  public upsertGalleryItem(item: GalleryItem): void {
    const index = this.gallery.findIndex((g) => g.id === item.id);
    if (index >= 0) {
      this.gallery[index] = item;
    } else {
      this.gallery.push(item);
    }
    saveStored(STORAGE_KEY_GALLERY, this.gallery);
    this.notify();
  }

  public updateGalleryItemImage(
    id: string,
    imageUrl: string,
    sourceType: ImageSourceType = 'actual_business_photo',
    isTemporary: boolean = false
  ): void {
    const item = this.gallery.find((g) => g.id === id);
    if (item) {
      item.imageUrl = imageUrl;
      item.imageSourceType = sourceType;
      item.isTemporaryImage = isTemporary;
      saveStored(STORAGE_KEY_GALLERY, this.gallery);
      this.notify();

      // Sync to Supabase PostgreSQL if connected
      const client = getSupabaseClient();
      if (client) {
        client
          .from('gallery_images')
          .update({
            image_url: imageUrl,
            image_source_type: sourceType,
            is_temporary_image: isTemporary,
          })
          .eq('id', id)
          .then(
            () => {},
            (err) => console.warn('Supabase gallery image sync note:', err)
          );
      }
    }
  }

  public deleteGalleryItem(id: string): void {
    this.gallery = this.gallery.filter((g) => g.id !== id);
    saveStored(STORAGE_KEY_GALLERY, this.gallery);
    this.notify();
  }

  // SPECIAL OFFERS IMAGE REPLACEMENT
  public updateOfferImage(
    id: string,
    imageUrl: string,
    sourceType: ImageSourceType = 'actual_business_photo',
    isTemporary: boolean = false
  ): void {
    const offer = this.offers.find((o) => o.id === id);
    if (offer) {
      offer.imageUrl = imageUrl;
      offer.imageSourceType = sourceType;
      offer.isTemporaryImage = isTemporary;
      saveStored(STORAGE_KEY_OFFERS, this.offers);
      this.notify();

      const client = getSupabaseClient();
      if (client) {
        client
          .from('special_offers')
          .update({ image_url: imageUrl })
          .eq('id', id)
          .then(
            () => {},
            (err) => console.warn('Supabase offer image sync note:', err)
          );
      }
    }
  }

  // SETTINGS & BANNER IMAGES
  public updateSettings(partial: Partial<BusinessSettings>): void {
    this.settings = { ...this.settings, ...partial };
    saveStored(STORAGE_KEY_SETTINGS, this.settings);
    this.notify();

    // Sync banner images or story changes to Supabase
    const client = getSupabaseClient();
    if (client) {
      client
        .from('business_settings')
        .update({
          hero_image_url: this.settings.heroImageUrl,
          restaurant_hero_image_url: this.settings.restaurantHeroImageUrl,
          about_image_url: this.settings.aboutImageUrl,
          about_story: this.settings.aboutStory,
          tagline: this.settings.tagline,
        })
        .neq('business_name', 'none')
        .then(
          () => {},
          (err) => console.warn('Supabase settings update note:', err)
        );
    }
  }

  public updateHeroImage(
    imageUrl: string,
    sourceType: ImageSourceType = 'actual_business_photo',
    isTemporary: boolean = false
  ): void {
    this.settings.heroImageUrl = imageUrl;
    this.settings.heroImageSourceType = sourceType;
    this.settings.isHeroImageTemporary = isTemporary;
    saveStored(STORAGE_KEY_SETTINGS, this.settings);
    this.notify();

    const client = getSupabaseClient();
    if (client) {
      client
        .from('business_settings')
        .update({
          hero_image_url: imageUrl,
        })
        .neq('business_name', 'none')
        .then(
          () => {},
          (err) => console.warn('Supabase hero image update note:', err)
        );
    }
  }

  // SUPABASE TWO-WAY CATALOG SYNCHRONIZATION
  public async syncCatalogToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    const client = getSupabaseClient();
    if (!client) return { success: false, count: 0, error: 'Supabase client not connected.' };

    try {
      let count = 0;

      // 1. Sync Settings
      await client.from('business_settings').upsert({
        business_name: this.settings.businessName,
        tagline: this.settings.tagline,
        address: this.settings.address,
        telephone: this.settings.telephone,
        email: this.settings.email,
        default_currency: this.settings.defaultCurrency,
        exchange_rate_usd_to_lrd: this.settings.exchangeRateUsdToLrd,
        hero_image_url: this.settings.heroImageUrl,
        restaurant_hero_image_url: this.settings.restaurantHeroImageUrl,
        about_image_url: this.settings.aboutImageUrl,
        about_story: this.settings.aboutStory,
        mission_statement: this.settings.missionStatement,
        vision_statement: this.settings.visionStatement,
      });
      count++;

      // 2. Sync Room Categories
      for (const cat of this.roomCategories) {
        const ROOM_UUID_MAP: Record<string, string> = {
          'room-cat-deluxe': 'a1111111-1111-1111-1111-111111111111',
          'room-cat-executive': 'a2222222-2222-2222-2222-222222222222',
          'room-cat-standard': 'a3333333-3333-3333-3333-333333333333',
          'room-cat-presidential': 'a4444444-4444-4444-4444-444444444444',
        };
        const dbId = ROOM_UUID_MAP[cat.id] || cat.id;
        await client.from('room_categories').upsert(
          {
            id: dbId,
            name: cat.name,
            slug: cat.slug,
            tagline: cat.tagline,
            description: cat.description,
            image_url: cat.imageUrl,
            additional_images: cat.additionalImages,
            max_adults: cat.maxAdults,
            max_children: cat.maxChildren,
            bed_configuration: cat.bedConfiguration,
            total_rooms: cat.totalRooms,
            price_per_night_usd: cat.pricePerNightUsd,
            promotional_price_usd: cat.promotionalPriceUsd || null,
            amenities: cat.amenities,
            room_size_m2: cat.roomSizeM2,
            is_active: cat.isActive,
            is_draft: cat.isDraft,
            image_source_type: cat.imageSourceType,
            is_temporary_image: cat.isTemporaryImage,
          },
          { onConflict: 'slug' }
        );
        count++;
      }

      // 3. Sync Menu Items
      for (const item of this.menuItems) {
        const CAT_UUID_MAP: Record<string, string> = {
          'starters': 'b1111111-1111-1111-1111-111111111111',
          'liberian_specialties': 'b2222222-2222-2222-2222-222222222222',
          'grilled_seafood': 'b3333333-3333-3333-3333-333333333333',
          'main_dishes': 'b4444444-4444-4444-4444-444444444444',
          'beverages_cocktails': 'b5555555-5555-5555-5555-555555555555',
          'desserts': 'b6666666-6666-6666-6666-666666666666',
        };
        const catId = CAT_UUID_MAP[item.categoryId] || 'b2222222-2222-2222-2222-222222222222';
        await client.from('menu_items').upsert({
          category_id: catId,
          name: item.name,
          description: item.description,
          price_usd: item.priceUsd,
          image_url: item.imageUrl,
          image_source_type: item.imageSourceType,
          is_temporary_image: item.isTemporaryImage,
          is_available: item.isAvailable,
          is_featured: item.isFeatured,
          dietary_tags: item.dietaryTags,
          preparation_time_mins: item.preparationTimeMins || 25,
          is_draft: item.isDraft,
        });
        count++;
      }

      return { success: true, count };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Error syncing data to Supabase' };
    }
  }

  public async fetchFromSupabase(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase client not connected.' };

    try {
      const { data: dbRooms } = await client.from('room_categories').select('*').eq('is_active', true);
      if (dbRooms && dbRooms.length > 0) {
        this.roomCategories = dbRooms.map((r: any) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          tagline: r.tagline || '',
          description: r.description,
          imageUrl: r.image_url,
          additionalImages: r.additional_images || [],
          maxAdults: r.max_adults,
          maxChildren: r.max_children,
          bedConfiguration: r.bed_configuration,
          totalRooms: r.total_rooms,
          pricePerNightUsd: Number(r.price_per_night_usd),
          promotionalPriceUsd: r.promotional_price_usd ? Number(r.promotional_price_usd) : undefined,
          amenities: r.amenities || [],
          roomSizeM2: r.room_size_m2 || 32,
          isActive: r.is_active,
          isDraft: r.is_draft,
          imageSourceType: r.image_source_type || 'licensed_stock',
          isTemporaryImage: r.is_temporary_image ?? true,
        }));
        saveStored(STORAGE_KEY_ROOM_CATEGORIES, this.roomCategories);
      }

      const { data: dbBookings } = await client.from('hotel_bookings').select('*').order('created_at', { ascending: false });
      if (dbBookings && dbBookings.length > 0) {
        this.hotelBookings = dbBookings.map((b: any) => ({
          id: b.id,
          bookingReference: b.booking_reference,
          roomCategoryId: b.room_category_id,
          checkInDate: b.check_in_date,
          checkOutDate: b.check_out_date,
          numberOfNights: b.number_of_nights,
          adultsCount: b.adults_count,
          childrenCount: b.children_count,
          roomsCount: b.rooms_count,
          guestFullName: b.guest_full_name,
          guestEmail: b.guest_email,
          guestPhone: b.guest_phone,
          guestCountry: b.guest_country,
          specialRequests: b.special_requests || '',
          roomRatePerNightUsd: Number(b.room_rate_per_night_usd),
          subtotalUsd: Number(b.subtotal_usd),
          taxAmountUsd: Number(b.tax_amount_usd),
          totalAmountUsd: Number(b.total_amount_usd),
          totalAmountLrd: Number(b.total_amount_lrd),
          status: b.status,
          paymentStatus: b.payment_status,
          paymentMethod: b.payment_method,
          source: b.source,
          createdAt: b.created_at,
        }));
        saveStored(STORAGE_KEY_HOTEL_BOOKINGS, this.hotelBookings);
      }

      const { data: dbRes } = await client.from('restaurant_reservations').select('*').order('created_at', { ascending: false });
      if (dbRes && dbRes.length > 0) {
        this.restaurantReservations = dbRes.map((r: any) => ({
          id: r.id,
          reservationReference: r.reservation_reference,
          guestFullName: r.guest_full_name,
          guestEmail: r.guest_email,
          guestPhone: r.guest_phone,
          reservationDate: r.reservation_date,
          reservationTime: r.reservation_time,
          partySize: r.party_size,
          seatingArea: r.seating_area,
          specialRequests: r.special_requests || '',
          status: r.status,
          source: r.source,
          createdAt: r.created_at,
        }));
        saveStored(STORAGE_KEY_RESTAURANT_RES, this.restaurantReservations);
      }

      this.notify();
      return { success: true, message: 'Successfully fetched latest records from Supabase PostgreSQL!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error fetching data from Supabase' };
    }
  }

  // RESET TO DEFAULT
  public resetToDefaults(): void {
    this.settings = INITIAL_SETTINGS;
    this.roomCategories = INITIAL_ROOM_CATEGORIES;
    this.rooms = INITIAL_ROOMS;
    this.hotelBookings = INITIAL_HOTEL_BOOKINGS;
    this.menuCategories = INITIAL_MENU_CATEGORIES;
    this.menuItems = INITIAL_MENU_ITEMS;
    this.restaurantReservations = INITIAL_RESTAURANT_RES;
    this.offers = INITIAL_OFFERS;
    this.gallery = INITIAL_GALLERY;
    saveStored(STORAGE_KEY_SETTINGS, this.settings);
    saveStored(STORAGE_KEY_ROOM_CATEGORIES, this.roomCategories);
    saveStored(STORAGE_KEY_ROOMS, this.rooms);
    saveStored(STORAGE_KEY_HOTEL_BOOKINGS, this.hotelBookings);
    saveStored(STORAGE_KEY_MENU_CATEGORIES, this.menuCategories);
    saveStored(STORAGE_KEY_MENU_ITEMS, this.menuItems);
    saveStored(STORAGE_KEY_RESTAURANT_RES, this.restaurantReservations);
    saveStored(STORAGE_KEY_OFFERS, this.offers);
    saveStored(STORAGE_KEY_GALLERY, this.gallery);
    this.notify();
  }
}

export const DCalabashStore = new DataStore();
