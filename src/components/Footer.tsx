import React from 'react';
import { HOTEL_INFO } from '../constants/hotelInfo';
import { Phone, Mail, MapPin, Shield, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenLookup }) => {
  return (
    <footer className="bg-[#0F3827] text-white border-t border-[#0F3827]/40">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Identity & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={HOTEL_INFO.logoUrl}
                alt="D'Calabash Hotel Logo"
                className="h-14 w-auto object-contain bg-white rounded-lg p-1"
              />
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                  D'Calabash
                </h3>
                <p className="text-[10px] font-semibold tracking-wider text-[#C59B27] uppercase">
                  Hotel &amp; Restaurant
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Boutique accommodation, tranquil suites, and premier Liberian &amp; continental dining in Congo Town Back Road, Monrovia, Liberia.
            </p>

            <blockquote className="border-l-2 border-[#C59B27] pl-3 py-0.5 text-xs italic text-[#C59B27] font-serif">
              "{HOTEL_INFO.brandPromise}"
            </blockquote>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={HOTEL_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-medium text-white transition-colors flex items-center gap-1.5"
                title="D'Calabash Hotel on Facebook"
              >
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3 text-[#C59B27]" />
              </a>

              <a
                href={HOTEL_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-medium text-white transition-colors flex items-center gap-1.5"
                title="D'Calabash Hotel on Instagram"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 text-[#C59B27]" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#accommodation" className="hover:text-white transition-colors">
                  Suites &amp; Rooms
                </a>
              </li>
              <li>
                <a href="#restaurant" className="hover:text-white transition-colors">
                  Restaurant &amp; Bar
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Digital Food Menu
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-white transition-colors">
                  Special Packages
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About D'Calabash
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact &amp; Map
                </a>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              Guest Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-white transition-colors text-left"
                >
                  Lookup Reservation Status
                </button>
              </li>
              <li>
                <a
                  href={`tel:${HOTEL_INFO.cleanPhone}`}
                  className="hover:text-white transition-colors"
                >
                  24-Hour Front Desk
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Airport Shuttle Request
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Private Event Enquiries
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-[#C59B27] font-semibold transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Management Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              Location &amp; Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <span>{HOTEL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                <a href={`tel:${HOTEL_INFO.cleanPhone}`} className="hover:text-white font-medium">
                  {HOTEL_INFO.telephone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
                <a href={`mailto:${HOTEL_INFO.email}`} className="hover:text-white font-medium">
                  {HOTEL_INFO.email}
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Monrovia, Montserrado County, Republic of Liberia (Timezone: Africa/Monrovia)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} D'Calabash Hotel &amp; Restaurant. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with Liberian Hospitality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
