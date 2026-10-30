import React, { useState } from 'react';
import { HOTEL_INFO, createWhatsAppUrl } from '../constants/hotelInfo';
import { MessageSquare, X, Calendar, UtensilsCrossed, HelpCircle, Flame } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Popover Options Card */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">D'Calabash WhatsApp</h4>
                <p className="text-[10px] text-slate-500">Online Front Desk Assistance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <a
              href={createWhatsAppUrl("Hello D'Calabash Hotel, I would like to enquire about room availability and rates.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
            >
              <Calendar className="w-4 h-4 text-[#0F3827] shrink-0" />
              <span>Room Availability Enquiry</span>
            </a>

            <a
              href={createWhatsAppUrl("Hello D'Calabash Restaurant, I would like to reserve a dining table.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>Dining Table Reservation</span>
            </a>

            <a
              href={createWhatsAppUrl("Hello D'Calabash Restaurant, what are today's special food dishes?")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
            >
              <Flame className="w-4 h-4 text-[#C85A17] shrink-0" />
              <span>Today's Culinary Specials</span>
            </a>

            <a
              href={createWhatsAppUrl("Hello D'Calabash Hotel, I have a general enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>General Assistance</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 text-center">
            {HOTEL_INFO.telephone}
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with D'Calabash Hotel on WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <MessageSquare className="w-7 h-7 fill-white" />
      </button>
    </div>
  );
};
