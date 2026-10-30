-- ==============================================================================
-- D'CALABASH HOTEL & RESTAURANT - COMPLETE SUPABASE SETUP SCRIPT
-- Location: Oldest Congo Town Road, Monrovia, Liberia
-- Timezone: Africa/Monrovia
-- Includes: Extensions, Tables, Foreign Keys, Concurrency Functions,
--           Row Level Security (RLS) Policies, Storage Buckets, and Seed Data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM (
    'super_admin',
    'hotel_manager',
    'restaurant_manager',
    'receptionist',
    'restaurant_staff'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE hotel_booking_status AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM (
    'pending',
    'partially_paid',
    'paid',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE restaurant_res_status AS ENUM (
    'pending',
    'confirmed',
    'seated',
    'completed',
    'cancelled',
    'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES & ROLES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role_type NOT NULL DEFAULT 'receptionist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 4. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'D''Calabash Hotel',
  tagline TEXT NOT NULL DEFAULT 'Your Best Experience is Guaranteed.',
  address TEXT NOT NULL DEFAULT 'Oldest Congo Town Road, Monrovia, Liberia, 231',
  telephone TEXT NOT NULL DEFAULT '+231 77 763 7559',
  email TEXT NOT NULL DEFAULT 'admin@dcalabashhotel.co',
  facebook_url TEXT DEFAULT 'https://www.facebook.com/share/1fCqL8ELkw/?mibextid=wwXIfr',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/dcalabashhotel',
  default_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  exchange_rate_usd_to_lrd NUMERIC(10, 2) NOT NULL DEFAULT 195.00,
  hotel_check_in_time TEXT NOT NULL DEFAULT '14:00',
  hotel_check_out_time TEXT NOT NULL DEFAULT '11:00',
  restaurant_open_time TEXT NOT NULL DEFAULT '07:00',
  restaurant_close_time TEXT NOT NULL DEFAULT '23:00',
  tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  service_charge_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
  is_online_booking_active BOOLEAN NOT NULL DEFAULT TRUE,
  about_story TEXT NOT NULL DEFAULT 'Located along the scenic Oldest Congo Town Road in Monrovia, Liberia, D''Calabash Hotel & Restaurant is a welcoming waterfront oasis.',
  mission_statement TEXT NOT NULL DEFAULT 'To deliver authentic Liberian hospitality, refined accommodation, and world-class dining that consistently exceeds our guests'' expectations.',
  vision_statement TEXT NOT NULL DEFAULT 'To be Monrovia''s premier boutique destination hotel and culinary landmark.',
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
  restaurant_hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
  about_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 5. ROOM CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS room_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  additional_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_adults INT NOT NULL DEFAULT 2,
  max_children INT NOT NULL DEFAULT 1,
  bed_configuration TEXT NOT NULL DEFAULT '1 King Bed',
  total_rooms INT NOT NULL DEFAULT 4,
  price_per_night_usd NUMERIC(10, 2) NOT NULL,
  promotional_price_usd NUMERIC(10, 2),
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  room_size_m2 INT DEFAULT 32,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_draft BOOLEAN NOT NULL DEFAULT FALSE,
  image_source_type TEXT DEFAULT 'licensed_stock',
  is_temporary_image BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 6. PHYSICAL ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL UNIQUE,
  floor INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 7. HOTEL BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL UNIQUE,
  room_category_id UUID NOT NULL REFERENCES room_categories(id),
  room_id UUID REFERENCES rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_nights INT NOT NULL CHECK (number_of_nights > 0),
  adults_count INT NOT NULL DEFAULT 1,
  children_count INT NOT NULL DEFAULT 0,
  rooms_count INT NOT NULL DEFAULT 1,
  guest_full_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_country TEXT NOT NULL DEFAULT 'Liberia',
  special_requests TEXT,
  room_rate_per_night_usd NUMERIC(10, 2) NOT NULL,
  subtotal_usd NUMERIC(10, 2) NOT NULL,
  tax_amount_usd NUMERIC(10, 2) NOT NULL,
  total_amount_usd NUMERIC(10, 2) NOT NULL,
  total_amount_lrd NUMERIC(12, 2) NOT NULL,
  status hotel_booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'pay_on_arrival',
  payment_reference TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now()),
  CONSTRAINT valid_booking_dates CHECK (check_out_date > check_in_date)
);

-- 8. RESTAURANT MENU CATEGORIES & ITEMS
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  image_source_type TEXT DEFAULT 'licensed_stock',
  is_temporary_image BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  dietary_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  preparation_time_mins INT DEFAULT 25,
  is_draft BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 9. RESTAURANT TABLES & RESERVATIONS
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 4,
  seating_area TEXT NOT NULL DEFAULT 'indoor_dining',
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS restaurant_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_reference TEXT NOT NULL UNIQUE,
  guest_full_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INT NOT NULL CHECK (party_size > 0),
  seating_area TEXT NOT NULL DEFAULT 'indoor_dining',
  table_id UUID REFERENCES restaurant_tables(id),
  special_requests TEXT,
  status restaurant_res_status NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 10. GALLERY & SPECIAL OFFERS TABLES
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  image_source_type TEXT DEFAULT 'licensed_stock',
  is_temporary_image BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

CREATE TABLE IF NOT EXISTS special_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  discount_badge TEXT NOT NULL,
  valid_until TEXT,
  offer_type TEXT NOT NULL DEFAULT 'hotel',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 11. CONTACT ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Monrovia', now())
);

-- ==============================================================================
-- 13. CONCURRENCY-SAFE INVENTORY FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION check_room_availability(
  p_category_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS INT AS $$
DECLARE
  v_total_rooms INT;
  v_booked_rooms INT;
BEGIN
  SELECT total_rooms INTO v_total_rooms FROM room_categories WHERE id = p_category_id;
  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Count overlapping active bookings
  SELECT COALESCE(SUM(rooms_count), 0) INTO v_booked_rooms
  FROM hotel_bookings
  WHERE room_category_id = p_category_id
    AND status IN ('confirmed', 'checked_in')
    AND check_in_date < p_check_out
    AND check_out_date > p_check_in;

  RETURN GREATEST(0, v_total_rooms - v_booked_rooms);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view active room categories" ON room_categories;
  DROP POLICY IF EXISTS "Public can view active menu categories" ON menu_categories;
  DROP POLICY IF EXISTS "Public can view active menu items" ON menu_items;
  DROP POLICY IF EXISTS "Public can view business settings" ON business_settings;
  DROP POLICY IF EXISTS "Public can view gallery" ON gallery_images;
  DROP POLICY IF EXISTS "Public can view special offers" ON special_offers;
  DROP POLICY IF EXISTS "Public can submit hotel booking" ON hotel_bookings;
  DROP POLICY IF EXISTS "Public can view hotel booking by reference" ON hotel_bookings;
  DROP POLICY IF EXISTS "Public can submit restaurant reservation" ON restaurant_reservations;
  DROP POLICY IF EXISTS "Public can view restaurant reservation by reference" ON restaurant_reservations;
  DROP POLICY IF EXISTS "Public can submit contact enquiries" ON enquiries;
  DROP POLICY IF EXISTS "Authenticated users have full management access" ON room_categories;
  DROP POLICY IF EXISTS "Authenticated users have full booking access" ON hotel_bookings;
  DROP POLICY IF EXISTS "Authenticated users have full dining access" ON restaurant_reservations;
  DROP POLICY IF EXISTS "Authenticated users have full menu access" ON menu_items;
  DROP POLICY IF EXISTS "Authenticated users have full gallery access" ON gallery_images;
  DROP POLICY IF EXISTS "Authenticated users have full settings access" ON business_settings;
EXCEPTION WHEN OTHERS THEN null;
END $$;

-- Public Read Policies
CREATE POLICY "Public can view active room categories" ON room_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active menu categories" ON menu_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active menu items" ON menu_items FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Public can view business settings" ON business_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public can view gallery" ON gallery_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view special offers" ON special_offers FOR SELECT USING (is_active = TRUE);

-- Public Write (Insert) Policies
CREATE POLICY "Public can submit hotel booking" ON hotel_bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public can view hotel booking by reference" ON hotel_bookings FOR SELECT USING (TRUE);
CREATE POLICY "Public can submit restaurant reservation" ON restaurant_reservations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public can view restaurant reservation by reference" ON restaurant_reservations FOR SELECT USING (TRUE);
CREATE POLICY "Public can submit contact enquiries" ON enquiries FOR INSERT WITH CHECK (TRUE);

-- Staff / Authenticated Management Full Access Policies
CREATE POLICY "Authenticated users have full management access" ON room_categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users have full booking access" ON hotel_bookings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users have full dining access" ON restaurant_reservations FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users have full menu access" ON menu_items FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users have full gallery access" ON gallery_images FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users have full settings access" ON business_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 15. SUPABASE STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('hotel-logo', 'hotel-logo', true),
  ('hotel-gallery', 'hotel-gallery', true),
  ('room-images', 'room-images', true),
  ('restaurant-images', 'restaurant-images', true),
  ('menu-images', 'menu-images', true),
  ('promotional-images', 'promotional-images', true),
  ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Access
DO $$ BEGIN
  CREATE POLICY "Public Access for hotel assets" ON storage.objects FOR SELECT USING (bucket_id IN ('hotel-logo', 'hotel-gallery', 'room-images', 'restaurant-images', 'menu-images', 'promotional-images', 'event-images'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Authenticated Staff Upload Access
DO $$ BEGIN
  CREATE POLICY "Authenticated staff can upload assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('hotel-logo', 'hotel-gallery', 'room-images', 'restaurant-images', 'menu-images', 'promotional-images', 'event-images'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 16. SEED DATA (INITIAL SUITES, MENU ITEMS, GALLERY & SETTINGS)
-- ==============================================================================

-- Seed Business Settings
INSERT INTO business_settings (
  business_name, tagline, address, telephone, email, default_currency, exchange_rate_usd_to_lrd,
  hero_image_url, restaurant_hero_image_url, about_image_url
) VALUES (
  'D''Calabash Hotel',
  'Your Best Experience is Guaranteed.',
  'Oldest Congo Town Road, Monrovia, Liberia, 231',
  '+231 77 763 7559',
  'admin@dcalabashhotel.co',
  'USD',
  195.00,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'
) ON CONFLICT DO NOTHING;

-- Seed Room Categories
INSERT INTO room_categories (
  id, name, slug, tagline, description, image_url, additional_images,
  max_adults, max_children, bed_configuration, total_rooms, price_per_night_usd, promotional_price_usd,
  amenities, is_active, is_draft, image_source_type, is_temporary_image
) VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Deluxe King Suite',
  'deluxe-king-suite',
  'Refined comfort with private balcony and garden views',
  'A spacious and tastefully appointed suite featuring a plush king-size bed, handcrafted furnishings, ensuite walk-in rainfall shower, and a private balcony overlooking the serene Monrovia landscape.',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
  2, 1, '1 King Bed', 6, 120.00, 105.00,
  ARRAY['High-Speed Wi-Fi', 'Air Conditioning', 'Flat-Screen Smart TV', 'Ensuite Bathroom & Rain Shower', 'Private Balcony', 'Tea & Coffee Station'],
  TRUE, TRUE, 'licensed_stock', TRUE
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Executive Business Suite',
  'executive-business-suite',
  'Designed for discerning travelers with dedicated workspace',
  'Elevate your stay with our Executive Suite, offering an integrated ergonomic work lounge, premium high-speed internet, mini-fridge, and plush bedding.',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'],
  2, 2, '1 King Bed + Lounge Daybed', 4, 165.00, NULL,
  ARRAY['Dedicated Work Desk', 'High-Speed Wi-Fi', 'Air Conditioning', 'Mini Bar & Refrigerator', 'Smart TV with Satellite Channels', '24/7 Room Service'],
  TRUE, TRUE, 'licensed_stock', TRUE
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Standard Queen Room',
  'standard-queen-room',
  'Cozy, modern, and perfectly suited for individual travelers',
  'A thoughtfully equipped standard guest room providing restful sleep, crisp linens, modern ensuite bathroom, and quiet ambiance for travelers in Congo Town.',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'],
  2, 0, '1 Queen Bed', 8, 85.00, NULL,
  ARRAY['High-Speed Wi-Fi', 'Air Conditioning', 'Flat-Screen TV', 'Private Bathroom', 'Daily Housekeeping'],
  TRUE, TRUE, 'licensed_stock', TRUE
),
(
  'a4444444-4444-4444-4444-444444444444',
  'The Calabash Presidential Suite',
  'calabash-presidential-suite',
  'The pinnacle of luxury with panoramic Monrovia views',
  'Our signature flagship suite featuring a sprawling master bedroom, private dining salon, expansive terrace, luxury whirlpool tub, and dedicated personal hospitality coordination.',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
  3, 2, '1 California King Bed + Adjoining Sitting Room', 2, 260.00, 235.00,
  ARRAY['Master Bedroom & Salon', 'Dining Area for 6', 'Whirlpool Spa Tub', 'Private Veranda', 'Dedicated Concierge'],
  TRUE, TRUE, 'licensed_stock', TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Seed Menu Categories
INSERT INTO menu_categories (id, name, slug, description, display_order)
VALUES 
  ('b1111111-1111-1111-1111-111111111111', 'Starters & Small Chops', 'starters', 'Crisp, savory appetizers to begin your dining journey', 1),
  ('b2222222-2222-2222-2222-222222222222', 'Authentic Liberian Specialties', 'liberian_specialties', 'Celebrated traditional dishes prepared with authentic local spices', 2),
  ('b3333333-3333-3333-3333-333333333333', 'Fresh Atlantic Seafood & Grills', 'grilled_seafood', 'Freshly sourced fish and shellfish grilled over aromatic hardwoods', 3),
  ('b4444444-4444-4444-4444-444444444444', 'Continental & Signature Mains', 'main_dishes', 'Classic international favorites prepared by our master chefs', 4),
  ('b5555555-5555-5555-5555-555555555555', 'Beverages & Handcrafted Cocktails', 'beverages_cocktails', 'Refreshing tropical juices, artisanal cocktails, and chilled wines', 5),
  ('b6666666-6666-6666-6666-666666666666', 'Desserts & Sweet Delights', 'desserts', 'Decadent sweet endings to complete your meal', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample Menu Dishes with authentic photography
INSERT INTO menu_items (
  category_id, name, description, price_usd, image_url, is_available, is_featured, dietary_tags, is_draft
) VALUES 
(
  'b2222222-2222-2222-2222-222222222222',
  'Traditional Liberian Jollof Rice Special',
  'Fragrant smoked rice simmered in rich tomato gravy with choice of seasoned chicken, beef, and golden sweet plantains.',
  14.50,
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, ARRAY['Popular', 'Chef Special'], TRUE
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Authentic Liberian Pepper Soup',
  'A spicy, aromatic traditional broth infused with native herbs, fresh ginger, and tender cuts of fresh fish or goat meat.',
  12.00,
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, ARRAY['Spicy', 'Authentic'], TRUE
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Rich Cassava Leaf with Smoked Meat',
  'Finely pounded cassava greens slowly simmered in authentic palm oil with smoked turkey, dried fish, and served with fluffy white rice.',
  15.00,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, ARRAY['House Favorite'], TRUE
),
(
  'b3333333-3333-3333-3333-333333333333',
  'Grilled Whole Atlantic Barracuda / Grouper',
  'Fresh catch from the Liberian coast, marinated in garlic, chili, and lime, grilled to perfection and served with spicy pepper sauce and plantains.',
  22.00,
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, ARRAY['Seafood', 'Chef Special'], TRUE
),
(
  'b3333333-3333-3333-3333-333333333333',
  'Garlic Butter Jumbo Prawns',
  'Succulent Atlantic prawns sautéed in rich garlic herb butter, served with fragrant herb jasmine rice and grilled asparagus.',
  24.50,
  'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
  TRUE, FALSE, ARRAY['Seafood'], TRUE
),
(
  'b5555555-5555-5555-5555-555555555555',
  'Calabash Sunset Signature Cocktail',
  'Dark rum, fresh passion fruit nectar, pineapple juice, and a splash of grenadine, garnished with fresh mint and citrus.',
  9.00,
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, ARRAY['Signature Cocktail'], TRUE
) ON CONFLICT DO NOTHING;

-- Seed Gallery Items
INSERT INTO gallery_images (title, category, category_label, description, image_url)
VALUES 
  ('Hotel Entrance & Veranda Courtyard', 'exterior', 'Hotel Grounds', 'Serene tropical ambiance along Oldest Congo Town Road.', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80'),
  ('Deluxe King Suite Bedroom', 'rooms', 'Suites & Rooms', 'Crisp white linens, warm lighting, and private balcony.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'),
  ('Main Dining Room & Ambient Seating', 'restaurant', 'Restaurant & Dining', 'Intimate candlelit dining for couples and families.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'),
  ('Fresh Grilled Atlantic Grouper Platter', 'food', 'Liberian Food', 'Seasoned coastal catch grilled over embers with plantains.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80')
ON CONFLICT DO NOTHING;

-- Seed Special Offers
INSERT INTO special_offers (title, tagline, description, discount_badge, valid_until, offer_type, image_url)
VALUES 
  ('Weekend Escape in Congo Town', '15% Off 2+ Night Weekend Stays', 'Includes complimentary hot breakfast and late checkout.', '15% OFF', 'December 15, 2026', 'hotel', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'),
  ('Sunday Seafood Feast & Live Acoustic', 'Special Family Dining Platters', 'Savor fresh Atlantic grilled fish with gentle acoustic music.', 'CHEF''S SPECIAL', 'Every Sunday', 'restaurant', 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;

-- Seed Restaurant Tables
INSERT INTO restaurant_tables (table_number, capacity, seating_area)
VALUES 
  ('T1', 4, 'indoor_dining'),
  ('T2', 2, 'indoor_dining'),
  ('T3', 4, 'indoor_dining'),
  ('T4', 6, 'indoor_dining'),
  ('V1', 4, 'veranda_terrace'),
  ('V2', 4, 'veranda_terrace'),
  ('V3', 2, 'veranda_terrace'),
  ('P1', 10, 'private_dining')
ON CONFLICT (table_number) DO NOTHING;
