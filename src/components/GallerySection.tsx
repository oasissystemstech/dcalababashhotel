import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { DCalabashStore } from '../lib/store';
import { Sparkles, Eye, X, Image as ImageIcon } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DCalabashStore.getGalleryItems());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setGalleryItems(DCalabashStore.getGalleryItems());
    });
  }, []);

  const filtered = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Visual Experience</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Atmosphere &amp; Hospitality in Pictures
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Take a visual tour through our suites, restaurant dining spaces, authentic Liberian culinary presentations, and scenic veranda on Congo Town Back Road.
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-4 flex items-center justify-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'exterior', label: 'Hotel Grounds' },
              { id: 'rooms', label: 'Suites & Rooms' },
              { id: 'restaurant', label: 'Restaurant & Dining' },
              { id: 'food', label: 'Liberian Food' },
              { id: 'events', label: 'Events & Lounge' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#0F3827] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 shadow-md border border-slate-200 cursor-pointer hover:shadow-xl transition-all"
            >
              {/* Media Content */}
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80';
                }}
              />

              {/* Temporary Illustrative Indicator */}
              {item.isTemporaryImage && (
                <div className="absolute top-2.5 right-2.5 z-20 bg-black/60 backdrop-blur-sm text-white/90 text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                  <ImageIcon className="w-2.5 h-2.5 text-[#C59B27]" />
                  <span>Illustrative</span>
                </div>
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F3827]/90 via-[#0F3827]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C59B27]">
                  {item.categoryLabel || item.category}
                </span>
                <h4 className="font-serif font-bold text-sm leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-2 pt-1">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] text-[#C59B27] font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enlarge Photograph</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                  {lightboxItem.categoryLabel || lightboxItem.category}
                </span>
                {lightboxItem.isTemporaryImage && (
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Illustrative Sample Photo
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {lightboxItem.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lightboxItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
