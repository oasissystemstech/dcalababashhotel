import React, { useState, useEffect } from 'react';
import { HOTEL_INFO, generateTableBookingWhatsApp } from '../constants/hotelInfo';
import { DCalabashStore } from '../lib/store';
import { BusinessSettings } from '../types';
import { UtensilsCrossed, Clock, Sparkles, Calendar, MessageSquare, ArrowRight, Wine, Coffee, Flame, Image as ImageIcon } from 'lucide-react';

interface RestaurantSectionProps {
  onOpenTableBooking: () => void;
}

export const RestaurantSection: React.FC<RestaurantSectionProps> = ({
  onOpenTableBooking,
}) => {
  const [settings, setSettings] = useState<BusinessSettings>(DCalabashStore.getSettings());

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setSettings(DCalabashStore.getSettings());
    });
  }, []);

  const restaurantImage = settings.restaurantHeroImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85';

  return (
    <section id="restaurant" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Split: Restaurant Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Story & Dining Atmosphere */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Dining &amp; Gastronomy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-balance">
              {settings.restaurantHeadline || 'Authentic Liberian Flavours & Coastal Grills'}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {settings.restaurantDescription || "At D'Calabash Restaurant & Bar, dining is a celebration of Liberian culinary heritage combined with contemporary international classics. From simmered pepper soup and slow-cooked cassava leaf to fresh Atlantic barracuda grilled over wood coals on our scenic open-air veranda, our chefs craft every plate with authentic pride."}
            </p>

            {/* Atmosphere Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-sm">
                <Coffee className="w-5 h-5 text-[#C59B27]" />
                <h3 className="font-semibold text-xs text-slate-900">Breakfast</h3>
                <p className="text-[11px] text-slate-500">{settings.breakfastHours || '7:00 AM – 10:30 AM Daily'}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-sm">
                <Flame className="w-5 h-5 text-[#C85A17]" />
                <h3 className="font-semibold text-xs text-slate-900">Lunch &amp; Grills</h3>
                <p className="text-[11px] text-slate-500">{settings.lunchHours || '12:00 PM – 3:30 PM Fresh Catch'}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-sm">
                <Wine className="w-5 h-5 text-[#0F3827]" />
                <h3 className="font-semibold text-xs text-slate-900">Dinner &amp; Bar</h3>
                <p className="text-[11px] text-slate-500">{settings.dinnerHours || '6:00 PM – Late Veranda Lounge'}</p>
              </div>
            </div>

            {/* Operating Policies & Dining Rules */}
            <div className="p-4 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Clock className="w-4 h-4 text-[#0F3827]" />
                <span>Restaurant Operating Hours</span>
              </div>
              <p className="text-[11px]">
                Located on Oldest Congo Town Road, Monrovia. Open 7 days a week. We welcome hotel residents and walk-in dining guests. Private dining rooms and veranda terrace seating available upon reservation.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenTableBooking}
                className="px-6 py-3 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-all hover:shadow"
              >
                <Calendar className="w-4 h-4 text-[#C59B27]" />
                <span>Reserve a Dining Table</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#menu"
                className="px-5 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#0F3827]" />
                <span>Browse Digital Menu</span>
              </a>

              <a
                href={generateTableBookingWhatsApp("Today", "7:30 PM", 2, "Veranda Deck")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Book Table on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp Reservation</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Fidelity Restaurant Interior Photography */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] shadow-xl border border-slate-200 group">
              <img
                src={restaurantImage}
                alt="D'Calabash Restaurant & Bar Interior"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85';
                }}
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 pointer-events-none" />

              {/* Top Status */}
              {settings.isRestaurantHeroImageTemporary && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-black/60 text-white/90 text-[10px] font-medium px-2 py-1 rounded flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#C59B27]" />
                    <span>Illustrative Photo</span>
                  </span>
                </div>
              )}

              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                  Atmospheric Hospitality
                </div>
                <h3 className="font-serif text-2xl font-bold">
                  The Calabash Dining Experience
                </h3>
                <p className="text-xs text-slate-200">
                  Indoor air-conditioned salon · Covered garden veranda · Craft cocktail bar overlooking the water
                </p>
              </div>
            </div>

            {/* Chef's Note Box */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F3827]">Culinary Philosophy:</span>
                <span className="text-[10px] font-semibold text-[#C59B27] uppercase">Local Sourcing</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                "We partner directly with coastal Liberian fishermen and local farmers in Montserrado County to ensure your seafood and traditional seasonings arrive fresh every morning."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
