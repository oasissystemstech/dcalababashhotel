import React, { useState, useEffect } from 'react';
import { HOTEL_INFO, createWhatsAppUrl } from '../constants/hotelInfo';
import { DCalabashStore } from '../lib/store';
import { BusinessSettings } from '../types';
import { Calendar, UtensilsCrossed, MessageSquare, ArrowRight, MapPin, CheckCircle2, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

interface HeroProps {
  onOpenHotelBookingWithDates?: (checkIn: string, checkOut: string, adults: number, rooms: number) => void;
  onOpenHotelBooking: () => void;
  onOpenRestaurantBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenHotelBookingWithDates,
  onOpenHotelBooking,
  onOpenRestaurantBooking,
}) => {
  const [settings, setSettings] = useState<BusinessSettings>(DCalabashStore.getSettings());

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setSettings(DCalabashStore.getSettings());
    });
  }, []);

  // Booking bar state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkIn, setCheckIn] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState<string>(dayAfter.toISOString().split('T')[0]);
  const [adults, setAdults] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'hotel' | 'dining'>('hotel');

  const handleSearchRooms = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenHotelBookingWithDates) {
      onOpenHotelBookingWithDates(checkIn, checkOut, adults, rooms);
    } else {
      onOpenHotelBooking();
    }
  };

  const heroImage = settings.heroImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#FAF8F5] pt-8 sm:pt-12 pb-16">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#0F3827]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Main Grid: Editorial Typography + Photorealistic Hospitality Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-12 sm:mb-16">
          {/* Left Column: Hospitality Messaging */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
              <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Oldest Congo Town Road, Monrovia, Liberia</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#C59B27]">Waterfront Resort &amp; Suites</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] text-balance">
              Where Liberian Warmth Meets Modern Comfort
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
              Welcome to <strong className="text-[#0F3827] font-semibold">D'Calabash Hotel &amp; Restaurant</strong>. 
              Discover tranquil boutique suites, an open-air scenic veranda overlooking the lagoon, and an acclaimed kitchen serving authentic local delicacies, fresh coastal seafood, and crafted cocktails.
            </p>

            <blockquote className="border-l-2 border-[#C59B27] pl-4 py-1 italic text-slate-600 font-serif text-sm sm:text-base">
              "{HOTEL_INFO.brandPromise}"
            </blockquote>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenHotelBooking}
                className="px-6 py-3.5 bg-[#0F3827] hover:bg-[#164E35] text-white font-medium text-sm rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C59B27]" />
                <span>Book Hotel Accommodation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenRestaurantBooking}
                className="px-6 py-3.5 bg-white border border-[#0F3827]/20 hover:border-[#0F3827] text-[#0F3827] font-medium text-sm rounded-lg transition-colors shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#C59B27]" />
                <span>Reserve Dining Table</span>
              </button>

              <a
                href={createWhatsAppUrl("Hello D'Calabash Hotel, I would like to enquire about your accommodation and dining services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct WhatsApp</span>
              </a>
            </div>

            {/* Trust Marks / Service Guarantees */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F3827]" />
                <span>24/7 Security &amp; Power</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F3827]" />
                <span>Scenic Waterfront Setting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Fresh Local Seafood</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hospitality Photography with Brand Badge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
              {/* Image Container with Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={heroImage}
                  alt="D'Calabash Hotel & Resort Grounds"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85';
                  }}
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Official Logo Brand Overlay in Corner */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/40 flex items-center gap-2.5">
                  <img
                    src={HOTEL_INFO.logoUrl}
                    alt="Official D'Calabash Hotel Logo"
                    className="h-9 w-auto object-contain"
                  />
                  <div className="pr-1">
                    <div className="font-serif text-xs font-bold text-[#0F3827] leading-none">
                      D'Calabash
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#C59B27] font-bold">
                      Monrovia, Liberia
                    </div>
                  </div>
                </div>

                {/* Temporary illustrative tag if applicable */}
                {settings.isHeroImageTemporary && (
                  <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-1 rounded flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#C59B27]" />
                    <span>Illustrative Preview</span>
                  </div>
                )}

                {/* Bottom Photo Title & Atmosphere */}
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27] block mb-0.5">
                    Resort &amp; Veranda Grounds
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white leading-tight">
                    Relaxed Tropical Ambiance on the Lagoon
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                    Boutique accommodation, open-air dining, and evening deck lounge.
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-4 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium">Open 7 Days a Week</span>
                </div>
                <div className="text-[11px] text-[#0F3827] font-semibold">
                  Hotel · Restaurant · Deck Bar · Events
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Availability & Booking Strip */}
        <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('hotel')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'hotel'
                    ? 'bg-[#0F3827] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Hotel Room Availability
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dining')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'dining'
                    ? 'bg-[#0F3827] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Restaurant Table Reservation
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Live Room &amp; Table Inventory</span>
            </div>
          </div>

          {activeTab === 'hotel' ? (
            <form onSubmit={handleSearchRooms} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Guests (Adults)
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4+ Adults</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Rooms
                </label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                >
                  <option value={1}>1 Room</option>
                  <option value={2}>2 Rooms</option>
                  <option value={3}>3+ Rooms</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C59B27]" />
                  <span>Check Available Rooms</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
              <div className="space-y-1 text-left w-full sm:w-auto">
                <p className="text-sm font-semibold text-slate-900">
                  Dine at D'Calabash Restaurant &amp; Bar
                </p>
                <p className="text-xs text-slate-600">
                  Daily Breakfast (7:00 AM) · Lunch &amp; Fresh Grilled Seafood · Evening Dinner · Veranda Seating
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href="#menu"
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                >
                  Browse Menu First
                </a>
                <button
                  onClick={onOpenRestaurantBooking}
                  className="px-5 py-2.5 bg-[#C59B27] hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Reserve Table Online
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
