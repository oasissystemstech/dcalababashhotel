import React, { useState, useEffect } from 'react';
import { SpecialOffer, Testimonial } from '../types';
import { DCalabashStore } from '../lib/store';
import { createWhatsAppUrl } from '../constants/hotelInfo';
import { Gift, Star, MessageSquare, ExternalLink, Quote, Image as ImageIcon } from 'lucide-react';

interface OffersAndEventsProps {
  onOpenHotelBooking: () => void;
  onOpenRestaurantBooking: () => void;
}

export const OffersAndEventsSection: React.FC<OffersAndEventsProps> = ({
  onOpenHotelBooking,
  onOpenRestaurantBooking,
}) => {
  const [offers, setOffers] = useState<SpecialOffer[]>(DCalabashStore.getOffers());
  const testimonials = DCalabashStore.getTestimonials();

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setOffers(DCalabashStore.getOffers());
    });
  }, []);

  return (
    <section id="offers" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20">
        {/* Special Offers & Packages */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
              <Gift className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Packages &amp; Special Offers</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Curated Experiences for Every Occasion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Discover exclusive seasonal packages for leisure stays, weekend family dining, and corporate executive gatherings on Congo Town Back Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#FAF8F5] rounded-xl overflow-hidden border border-slate-200 hover:border-[#0F3827]/40 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                {/* Specific Package Photography */}
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden group">
                  <img
                    src={offer.imageUrl || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'}
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-950 bg-[#C59B27] px-2 py-0.5 rounded shadow-sm">
                      {offer.discountBadge}
                    </span>
                  </div>

                  {offer.isTemporaryImage && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[9px] bg-black/60 text-white/90 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5 text-[#C59B27]" />
                        <span>Illustrative</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium">
                    Valid: {offer.validUntil}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                      {offer.title}
                    </h3>

                    <p className="text-xs font-semibold text-[#0F3827]">
                      {offer.tagline}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={
                        offer.offerType === 'hotel'
                          ? onOpenHotelBooking
                          : onOpenRestaurantBooking
                      }
                      className="text-xs font-semibold text-[#0F3827] hover:underline"
                    >
                      Book Package
                    </button>

                    <a
                      href={createWhatsAppUrl(
                        `Hello D'Calabash Hotel,\n\nI would like to enquire about the "${offer.title}" package.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Inquiry</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Testimonials & Google Reviews Integration */}
        <div className="pt-10 border-t border-slate-200 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0F3827]">
                Verified Guest Experiences
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                What Our Guests Say About D'Calabash
              </h2>
            </div>

            <a
              href="https://www.google.com/search?q=d%27calabash+liberia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0F3827]" />
              <span>View on Google Business Profile</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                  </div>

                  <Quote className="w-6 h-6 text-[#C59B27]/40" />

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{t.authorName}</h4>
                    <p className="text-[11px] text-slate-500">{t.authorLocation}</p>
                  </div>

                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Guest
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
