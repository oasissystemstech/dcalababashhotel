import React, { useState, useEffect } from 'react';
import { MenuItem, MenuCategory, Currency } from '../types';
import { DCalabashStore } from '../lib/store';
import { generateMenuEnquiryWhatsApp } from '../constants/hotelInfo';
import { Search, Flame, MessageSquare, Info, Image as ImageIcon } from 'lucide-react';

interface DigitalMenuSectionProps {
  currentCurrency: Currency;
  onOpenTableBooking: () => void;
}

export const DigitalMenuSection: React.FC<DigitalMenuSectionProps> = ({
  currentCurrency,
  onOpenTableBooking,
}) => {
  const [categories, setCategories] = useState<MenuCategory[]>(DCalabashStore.getMenuCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DCalabashStore.getMenuItems());
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setCategories(DCalabashStore.getMenuCategories());
      setMenuItems(DCalabashStore.getMenuItems());
    });
  }, []);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (!item.isAvailable) return false;

    // Category filter
    if (activeCategorySlug !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategorySlug);
      if (cat && item.categoryId !== cat.id) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.dietaryTags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  return (
    <section id="menu" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
            <Flame className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Digital Culinary Menu</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            Crafted Liberian &amp; Continental Offerings
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Browse our freshly prepared dishes featuring authentic Liberian recipes and coastal Atlantic seafood. Reserve a table or order directly on WhatsApp.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-md border border-amber-200/60 text-left">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>Draft Menu Offerings:</strong> Menu items and prices are draft selections awaiting final sign-off in the management portal.
            </span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-10">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Jollof, Barracuda, Pepper Soup, Steak)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 px-1">
            <button
              onClick={() => setActiveCategorySlug('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                activeCategorySlug === 'all'
                  ? 'bg-[#0F3827] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Items ({menuItems.filter((i) => i.isAvailable).length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategorySlug === cat.slug
                    ? 'bg-[#0F3827] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto p-6 space-y-3">
            <p className="text-sm font-medium text-slate-700">No dishes match your search or filter.</p>
            <button
              onClick={() => {
                setActiveCategorySlug('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#0F3827] underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 hover:border-[#0F3827]/40 bg-[#FAF8F5] transition-all hover:shadow-md flex flex-col sm:flex-row overflow-hidden"
              >
                {/* Specific Food Photography */}
                <div className="relative sm:w-44 h-40 sm:h-auto shrink-0 bg-slate-900 overflow-hidden group">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {item.isFeatured && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="text-[9px] font-bold text-slate-950 bg-[#C59B27] px-1.5 py-0.5 rounded shadow-sm">
                        Chef's Pick
                      </span>
                    </div>
                  )}
                  {item.isTemporaryImage && (
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="text-[9px] bg-black/60 text-white/90 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5 text-[#C59B27]" />
                        <span>Illustrative</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details & Pricing */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                            {item.name}
                          </h3>
                          {item.isDraft && (
                            <span className="text-[9px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-serif font-bold text-base text-[#0F3827]">
                          {DCalabashStore.formatCurrency(item.priceUsd, currentCurrency)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {currentCurrency === 'USD'
                            ? `≈ ${DCalabashStore.formatCurrency(item.priceUsd, 'LRD')}`
                            : `($${item.priceUsd.toFixed(2)})`}
                        </div>
                      </div>
                    </div>

                    {/* Dietary Metadata */}
                    <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                      {item.dietaryTags.map((tag, i) => (
                        <React.Fragment key={i}>
                          <span className="text-slate-700 font-medium">{tag}</span>
                          {i < item.dietaryTags.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                      {item.preparationTimeMins && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.preparationTimeMins} mins</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={onOpenTableBooking}
                      className="text-xs font-semibold text-[#0F3827] hover:underline"
                    >
                      Reserve Table
                    </button>

                    <a
                      href={generateMenuEnquiryWhatsApp(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Order</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
