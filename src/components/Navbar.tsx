import React, { useState } from 'react';
import { HOTEL_INFO } from '../constants/hotelInfo';
import { Currency } from '../types';
import { Menu, X, Phone, MessageSquare, Shield, Calendar, UtensilsCrossed, Search } from 'lucide-react';

interface NavbarProps {
  currentCurrency: Currency;
  onCurrencyToggle: () => void;
  onOpenHotelBooking: () => void;
  onOpenRestaurantBooking: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyToggle,
  onOpenHotelBooking,
  onOpenRestaurantBooking,
  onOpenLookup,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#0F3827]/10 transition-colors">
      {/* Top micro-bar for quick contact and currency */}
      <div className="hidden lg:block bg-[#0F3827] text-white text-xs py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></span>
              Congo Town Back Road, Monrovia, Liberia
            </span>
            <a
              href={`tel:${HOTEL_INFO.cleanPhone}`}
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C59B27]" />
              {HOTEL_INFO.telephone}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLookup}
              className="flex items-center gap-1 text-xs text-white/90 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              <Search className="w-3 h-3 text-[#C59B27]" />
              Find My Booking
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={onCurrencyToggle}
              className="font-medium text-xs text-[#C59B27] hover:text-amber-300 transition-colors cursor-pointer"
              title="Click to toggle between USD and Liberian Dollars (LRD)"
            >
              Currency: <span className="font-bold underline">{currentCurrency}</span>
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
            >
              <Shield className="w-3 h-3 text-[#C59B27]" />
              Staff Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark + Official Brand Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <img
              src={HOTEL_INFO.logoUrl}
              alt="D'Calabash Hotel Logo"
              referrerPolicy="no-referrer"
              className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F3827]">
                D'Calabash
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#C59B27]">
                Hotel & Restaurant
              </span>
            </div>
          </a>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-700">
            <a
              href="#accommodation"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              Accommodation
            </a>
            <a
              href="#restaurant"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              Restaurant & Dining
            </a>
            <a
              href="#menu"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              Food Menu
            </a>
            <a
              href="#gallery"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              Gallery
            </a>
            <a
              href="#offers"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              Offers & Events
            </a>
            <a
              href="#about"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              About
            </a>
            <a
              href="#contact"
              className="whitespace-nowrap shrink-0 hover:text-[#0F3827] transition-colors relative py-1 hover:border-b-2 hover:border-[#0F3827]"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenRestaurantBooking}
              className="px-3.5 py-2 text-xs font-semibold text-[#0F3827] bg-[#0F3827]/10 hover:bg-[#0F3827]/15 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              onClick={onOpenHotelBooking}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F3827] hover:bg-[#164E35] rounded-md transition-colors shadow-sm hover:shadow whitespace-nowrap flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book a Room
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onCurrencyToggle}
              className="px-2 py-1 text-xs font-bold text-[#0F3827] bg-white border border-[#0F3827]/20 rounded"
            >
              {currentCurrency}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0F3827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3827]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-800">
            <a
              href="#accommodation"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              Accommodation & Suites
            </a>
            <a
              href="#restaurant"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              Restaurant & Dining
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              Digital Food Menu
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              Photo Gallery
            </a>
            <a
              href="#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              Offers & Special Events
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              About D'Calabash
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              Contact & Directions
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHotelBooking();
              }}
              className="w-full py-2.5 px-3 bg-[#0F3827] text-white text-xs font-semibold rounded text-center flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Book Room
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRestaurantBooking();
              }}
              className="w-full py-2.5 px-3 bg-[#C59B27] text-slate-900 text-xs font-semibold rounded text-center flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Reserve Table
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="text-[#0F3827] font-medium underline"
            >
              Check Booking Status
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
            >
              <Shield className="w-3.5 h-3.5" />
              Staff Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
