# D'Calabash Hotel & Restaurant – Web Platform

> **"Your Best Experience is Guaranteed."**  
> Location: Congo Town Back Road, Monrovia, Liberia, 231  
> Telephone: [+231 77 763 7559](tel:+231777637559)  
> Email: admin@dcalabashhotel.co  
> Facebook: [D'Calabash Hotel](https://www.facebook.com/share/1fCqL8ELkw/?mibextid=wwXIfr)  
> Instagram: [@dcalabashhotel](https://www.instagram.com/dcalabashhotel)

---

## Overview

A premium, modern, responsive hospitality website and reservation management platform for **D'Calabash Hotel**, seamlessly integrating two primary operations into one cohesive experience:

1. **Hotel Accommodation & Guest Services**: Suite inventory management, real-time availability calculation, multi-step customer booking engine, booking references, and admin check-in/out workflows.
2. **Restaurant, Dining & Food Services**: Table management, seating area preferences (indoor dining, garden veranda, private room), digital food menu with Liberian specialties and fresh seafood, and direct WhatsApp ordering.
3. **Administrative Backend (`/admin` or `#admin`)**: Role-based portal (Super Admin, Hotel Manager, Restaurant Manager, Receptionist, Restaurant Staff), occupancy calendar, manual walk-in/telephone booking recording, menu manager, multi-currency USD/LRD rate configuration, and CSV exports.

### Staff & Administrative Credentials

Access the management dashboard by clicking **Staff Portal** in the navigation bar or visiting `#admin`:
- **Username**: `dcalabash` (or `admin@dcalabashhotel.co`)
- **Password**: `dcalabash@2026`

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Google Fonts (`Playfair Display` + `Plus Jakarta Sans`)
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS) & concurrency safeguards
- **Data Architecture**: Reactive store with instant browser persistence + live Supabase client synchronization
- **Deployment**: Vercel / GitHub ready

---

## Supabase PostgreSQL Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the complete SQL migration file located in this repository at:
   ```bash
   supabase/migrations/20261030000000_dcalabash_init.sql
   ```
4. Copy your **Project URL** and **Anon / Public Key** from **Project Settings → API**.
5. Add them to your environment variables or paste them directly in the **Admin Portal → Supabase & Database** tab:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-or-publishable-key"
   ```

---

## Features

- **Official Brand Assets**: Uses the official D'Calabash Hotel logo (`/assets/aistudio/dcalabash_logo_51d89ca5.jpeg`).
- **Inventory & Overlap Safeguard**: Prevents overlapping confirmed room bookings from exceeding actual suite inventory.
- **Dual Currency Support**: Instant conversion between US Dollars (USD) and Liberian Dollars (LRD) with configurable exchange rate.
- **WhatsApp Concierge**: Direct links with pre-filled booking details, table reservations, and menu inquiries using international format `+231 77 763 7559`.
- **Draft Content Compliance**: Clearly identifies draft room categories and menu prices awaiting administrative approval.
- **SEO & Structured Data**: Built-in OpenGraph cards, Twitter cards, and Schema.org `Hotel` + `Restaurant` JSON-LD metadata for Monrovia and Congo Town search visibility.
