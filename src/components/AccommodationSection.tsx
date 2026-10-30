import React, { useState } from 'react';
import { RoomCategory, Currency } from '../types';
import { DCalabashStore } from '../lib/store';
import { generateRoomEnquiryWhatsApp, HOTEL_INFO } from '../constants/hotelInfo';
import { Users, Bed, Check, MessageSquare, Calendar, Sparkles, Info, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

interface AccommodationSectionProps {
  currentCurrency: Currency;
  onBookRoomCategory: (category: RoomCategory) => void;
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({
  currentCurrency,
  onBookRoomCategory,
}) => {
  const [categories, setCategories] = useState<RoomCategory[]>(DCalabashStore.getRoomCategories());
  const [selectedDetailsCategory, setSelectedDetailsCategory] = useState<RoomCategory | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Subscribe to store updates
  React.useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setCategories(DCalabashStore.getRoomCategories());
    });
  }, []);

  return (
    <section id="accommodation" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Accommodation &amp; Suites</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Spacious Comfort in Congo Town, Monrovia
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Each suite at D'Calabash Hotel is carefully designed for peaceful rest, featuring plush bedding, air conditioning, modern ensuite bathrooms, and reliable high-speed Wi-Fi.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-md border border-amber-200/60 text-left">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>Draft Room Rates:</strong> Room categories and rates are draft placeholders subject to administrative confirmation in the management portal.
            </span>
          </div>
        </div>

        {/* Room Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {categories.map((room) => {
            const hasPromo = room.promotionalPriceUsd && room.promotionalPriceUsd < room.pricePerNightUsd;
            const effectivePrice = hasPromo ? room.promotionalPriceUsd! : room.pricePerNightUsd;

            return (
              <div
                key={room.id}
                className="flex flex-col bg-[#FAF8F5] rounded-xl overflow-hidden border border-slate-200 hover:border-[#0F3827]/30 transition-all hover:shadow-lg"
              >
                {/* Visual Media Carrier with Real Suite Photography */}
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />

                  {/* Room Image */}
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />

                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {room.isDraft ? (
                        <span className="text-[11px] font-medium bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded shadow-sm">
                          Draft Rate · Admin Review
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium bg-[#0F3827] text-white px-2 py-0.5 rounded">
                          Published Rate
                        </span>
                      )}

                      {room.isTemporaryImage && (
                        <span className="text-[10px] font-medium bg-black/60 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <ImageIcon className="w-2.5 h-2.5 text-[#C59B27]" />
                          <span>Illustrative Photo</span>
                        </span>
                      )}
                    </div>

                    {hasPromo && (
                      <span className="text-[11px] font-bold bg-[#C59B27] text-slate-950 px-2 py-0.5 rounded shadow-sm">
                        Special Promo
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay with Price and Title */}
                  <div className="absolute bottom-3 left-4 right-4 z-20 text-white flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {room.name}
                      </h3>
                      <p className="text-xs text-slate-200 line-clamp-1">{room.tagline}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-bold font-serif text-[#C59B27]">
                        {DCalabashStore.formatCurrency(effectivePrice, currentCurrency)}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {currentCurrency === 'LRD' ? 'per night (approx)' : 'per night + tax'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content & Specifications */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Specs & Capacity Strip */}
                  <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#0F3827]" />
                      <span>{room.bedConfiguration}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0F3827]" />
                      <span>Max {room.maxAdults} Adults {room.maxChildren > 0 ? `· ${room.maxChildren} Child` : ''}</span>
                    </div>
                  </div>

                  {/* Amenities Highlights */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Included Amenities:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                      {room.amenities.slice(0, 4).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDetailsCategory(room);
                        setActiveImageIndex(0);
                      }}
                      className="text-xs font-semibold text-[#0F3827] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View Suite Gallery ({1 + (room.additionalImages?.length || 0)} photos)
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={generateRoomEnquiryWhatsApp(room.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="Enquire on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                      </a>

                      <button
                        type="button"
                        onClick={() => onBookRoomCategory(room)}
                        className="px-4 py-2 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Book Room</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Details & Multi-Photo Gallery Modal */}
      {selectedDetailsCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#C59B27] uppercase tracking-wider">
                  Suite Gallery &amp; Details
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  {selectedDetailsCategory.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetailsCategory(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Image */}
            {(() => {
              const allImages = [
                selectedDetailsCategory.imageUrl,
                ...(selectedDetailsCategory.additionalImages || []),
              ];
              const curImg = allImages[activeImageIndex] || selectedDetailsCategory.imageUrl;

              return (
                <div className="space-y-2">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 shadow-md">
                    <img
                      src={curImg}
                      alt={selectedDetailsCategory.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>

                  {/* Thumbnail Selector */}
                  {allImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                            activeImageIndex === idx
                              ? 'border-[#0F3827] ring-1 ring-[#0F3827]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="space-y-3 text-sm text-slate-700">
              <p>{selectedDetailsCategory.description}</p>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nightly Rate:</span>
                  <span className="font-bold text-[#0F3827]">
                    {DCalabashStore.formatCurrency(selectedDetailsCategory.pricePerNightUsd, currentCurrency)} / night
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Bed Configuration:</span>
                  <span className="font-medium">{selectedDetailsCategory.bedConfiguration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Capacity:</span>
                  <span className="font-medium">
                    Up to {selectedDetailsCategory.maxAdults} Adults, {selectedDetailsCategory.maxChildren} Children
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Room Size:</span>
                  <span className="font-medium">Approx. {selectedDetailsCategory.roomSizeM2 || 35} m²</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider mb-2">
                  Complete Suite Amenities:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedDetailsCategory.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedDetailsCategory(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const cat = selectedDetailsCategory;
                  setSelectedDetailsCategory(null);
                  onBookRoomCategory(cat);
                }}
                className="px-5 py-2.5 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35] transition-colors"
              >
                Proceed to Book This Suite
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
