/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Currency, RoomCategory } from './types';
import { DCalabashStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AccommodationSection } from './components/AccommodationSection';
import { RestaurantSection } from './components/RestaurantSection';
import { DigitalMenuSection } from './components/DigitalMenuSection';
import { GallerySection } from './components/GallerySection';
import { OffersAndEventsSection } from './components/OffersAndEventsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HotelBookingModal } from './components/HotelBookingModal';
import { RestaurantBookingModal } from './components/RestaurantBookingModal';
import { BookingLookupModal } from './components/BookingLookupModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [currency, setCurrency] = useState<Currency>(DCalabashStore.getSettings().defaultCurrency);

  // Modals
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [lookupModalOpen, setLookupModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Pre-selected parameters for booking modal
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);
  const [bookingDates, setBookingDates] = useState<{
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    rooms?: number;
  }>({});

  // Check URL hash for direct admin routing (e.g. #admin or /admin)
  useEffect(() => {
    // Hydrate persistent images and store data from IndexedDB
    DCalabashStore.hydrateFromIndexedDb();

    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleCurrency = () => {
    const next: Currency = currency === 'USD' ? 'LRD' : 'USD';
    setCurrency(next);
  };

  const handleOpenHotelBooking = () => {
    setSelectedCategory(null);
    setBookingDates({});
    setHotelModalOpen(true);
  };

  const handleOpenHotelBookingWithDates = (
    checkIn: string,
    checkOut: string,
    adults: number,
    rooms: number
  ) => {
    setSelectedCategory(null);
    setBookingDates({ checkIn, checkOut, adults, rooms });
    setHotelModalOpen(true);
  };

  const handleBookSpecificRoom = (category: RoomCategory) => {
    setSelectedCategory(category);
    setHotelModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans selection:bg-[#0F3827] selection:text-white">
      {/* Primary Sticky Top Bar */}
      <Navbar
        currentCurrency={currency}
        onCurrencyToggle={toggleCurrency}
        onOpenHotelBooking={handleOpenHotelBooking}
        onOpenRestaurantBooking={() => setRestaurantModalOpen(true)}
        onOpenLookup={() => setLookupModalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Page Flow */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenHotelBooking={handleOpenHotelBooking}
          onOpenHotelBookingWithDates={handleOpenHotelBookingWithDates}
          onOpenRestaurantBooking={() => setRestaurantModalOpen(true)}
        />

        {/* Accommodation Section */}
        <AccommodationSection
          currentCurrency={currency}
          onBookRoomCategory={handleBookSpecificRoom}
        />

        {/* Restaurant & Dining Section */}
        <RestaurantSection
          onOpenTableBooking={() => setRestaurantModalOpen(true)}
        />

        {/* Digital Food Menu */}
        <DigitalMenuSection
          currentCurrency={currency}
          onOpenTableBooking={() => setRestaurantModalOpen(true)}
        />

        {/* Gallery */}
        <GallerySection />

        {/* Offers, Events & Guest Testimonials */}
        <OffersAndEventsSection
          onOpenHotelBooking={handleOpenHotelBooking}
          onOpenRestaurantBooking={() => setRestaurantModalOpen(true)}
        />

        {/* About Section */}
        <AboutSection />

        {/* Contact & Directions */}
        <ContactSection />
      </main>

      {/* Comprehensive Footer */}
      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenLookup={() => setLookupModalOpen(true)}
      />

      {/* Floating WhatsApp Concierge */}
      <FloatingWhatsApp />

      {/* Hotel Room Reservation Modal */}
      <HotelBookingModal
        isOpen={hotelModalOpen}
        onClose={() => setHotelModalOpen(false)}
        preSelectedCategory={selectedCategory}
        initialCheckIn={bookingDates.checkIn}
        initialCheckOut={bookingDates.checkOut}
        initialAdults={bookingDates.adults}
        initialRooms={bookingDates.rooms}
        currentCurrency={currency}
      />

      {/* Restaurant Table Reservation Modal */}
      <RestaurantBookingModal
        isOpen={restaurantModalOpen}
        onClose={() => setRestaurantModalOpen(false)}
      />

      {/* Reservation Lookup Modal */}
      <BookingLookupModal
        isOpen={lookupModalOpen}
        onClose={() => setLookupModalOpen(false)}
      />

      {/* Protected Administrative Dashboard */}
      {adminOpen && (
        <AdminDashboard
          onClose={() => {
            setAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
        />
      )}
    </div>
  );
}
