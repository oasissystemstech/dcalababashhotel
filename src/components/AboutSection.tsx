import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../constants/hotelInfo';
import { DCalabashStore } from '../lib/store';
import { BusinessSettings } from '../types';
import { Sparkles, HeartHandshake, Compass, Award, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(DCalabashStore.getSettings());

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setSettings(DCalabashStore.getSettings());
    });
  }, []);

  const aboutImage = settings.aboutImageUrl || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85';

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase Card with Genuine Hospitality Photo & Official Brand Seal */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-md w-full">
              {/* Hotel Hospitality Photography */}
              <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                <img
                  src={aboutImage}
                  alt="D'Calabash Hotel Hospitality"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {settings.isAboutImageTemporary && (
                  <div className="absolute top-3 right-3 z-10 bg-black/60 text-white/90 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                    <ImageIcon className="w-2.5 h-2.5 text-[#C59B27]" />
                    <span>Illustrative Photo</span>
                  </div>
                )}
              </div>

              {/* Trust Details */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-[#C59B27] pl-3">
                  "{settings.tagline}"
                </p>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>24/7 Security</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Continuous Power</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dedicated Concierge</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Waterfront Dining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>About Our Establishment</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Hospitality Rooted in Liberian Tradition &amp; Modern Elegance
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {settings.aboutStory}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-white rounded-xl border border-slate-200/90 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-[#0F3827]">
                  <Compass className="w-4 h-4 text-[#C59B27]" />
                  <h3 className="font-serif font-bold text-sm">Our Mission</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {settings.missionStatement}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200/90 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-[#0F3827]">
                  <Award className="w-4 h-4 text-[#C59B27]" />
                  <h3 className="font-serif font-bold text-sm">Our Vision</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {settings.visionStatement}
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-[#C59B27] text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>The Calabash Meaning</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {settings.calabashMeaningText || "In Liberian and West African tradition, the calabash is a timeless vessel of gathering, sharing refreshment, and warm welcome. At D'Calabash Hotel, every guest is welcomed as family into an oasis of comfort, scenic beauty, and sincere respect."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
