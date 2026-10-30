import React, { useState } from 'react';
import { DCalabashStore } from '../lib/store';
import { HotelBooking, RestaurantReservation } from '../types';
import { generateBookingStatusWhatsApp } from '../constants/hotelInfo';
import { X, Search, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({ isOpen, onClose }) => {
  const [reference, setReference] = useState('');
  const [guestVerification, setGuestVerification] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [hotelBooking, setHotelBooking] = useState<HotelBooking | null>(null);
  const [restaurantRes, setRestaurantRes] = useState<RestaurantReservation | null>(null);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setHotelBooking(null);
    setRestaurantRes(null);

    const cleanRef = reference.trim().toUpperCase();
    const cleanVerif = guestVerification.trim().toLowerCase();

    // Check hotel booking
    const hBooking = DCalabashStore.getBookingByReference(cleanRef);
    if (hBooking) {
      if (
        !cleanVerif ||
        hBooking.guestEmail.toLowerCase().includes(cleanVerif) ||
        hBooking.guestPhone.includes(cleanVerif)
      ) {
        setHotelBooking(hBooking);
        return;
      }
    }

    // Check restaurant reservation
    const rRes = DCalabashStore.getReservationByReference(cleanRef);
    if (rRes) {
      if (
        !cleanVerif ||
        rRes.guestEmail.toLowerCase().includes(cleanVerif) ||
        rRes.guestPhone.includes(cleanVerif)
      ) {
        setRestaurantRes(rRes);
        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="bg-[#0F3827] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#C59B27]" />
            <h3 className="font-serif text-lg font-bold">Find My Reservation</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Reference *
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. DC-HTL-2026-1042 or DC-RST-2026-8092"
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 uppercase tracking-wider focus:ring-2 focus:ring-[#0F3827]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guest Email or Telephone * (Verification)
              </label>
              <input
                type="text"
                value={guestVerification}
                onChange={(e) => setGuestVerification(e.target.value)}
                placeholder="e.g. marcus.f@example.com or +231..."
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Search className="w-4 h-4 text-[#C59B27]" />
              <span>Search Reservation</span>
            </button>
          </form>

          {hasSearched && (
            <div className="pt-2 border-t border-slate-100">
              {hotelBooking ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-serif text-sm">
                      {hotelBooking.roomCategoryName || 'Hotel Suite'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        hotelBooking.status === 'confirmed' || hotelBooking.status === 'checked_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hotelBooking.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Status: {hotelBooking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span>Guest:</span> <strong className="text-slate-900 block">{hotelBooking.guestFullName}</strong>
                    </div>
                    <div>
                      <span>Reference:</span> <strong className="text-slate-900 block font-mono">{hotelBooking.bookingReference}</strong>
                    </div>
                    <div>
                      <span>Dates:</span> <strong className="text-slate-900 block">{hotelBooking.checkInDate} to {hotelBooking.checkOutDate}</strong>
                    </div>
                    <div>
                      <span>Amount:</span> <strong className="text-[#0F3827] block">${hotelBooking.totalAmountUsd}</strong>
                    </div>
                  </div>

                  <a
                    href={generateBookingStatusWhatsApp(hotelBooking.bookingReference, hotelBooking.guestFullName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact Front Desk for this Booking</span>
                  </a>
                </div>
              ) : restaurantRes ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-serif text-sm">
                      Restaurant Dining Table
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Status: {restaurantRes.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span>Guest:</span> <strong className="text-slate-900 block">{restaurantRes.guestFullName}</strong>
                    </div>
                    <div>
                      <span>Reference:</span> <strong className="text-slate-900 block font-mono">{restaurantRes.reservationReference}</strong>
                    </div>
                    <div>
                      <span>Date &amp; Time:</span> <strong className="text-slate-900 block">{restaurantRes.reservationDate} at {restaurantRes.reservationTime}</strong>
                    </div>
                    <div>
                      <span>Party:</span> <strong className="text-slate-900 block">{restaurantRes.partySize} Guests ({restaurantRes.seatingArea.replace('_', ' ')})</strong>
                    </div>
                  </div>

                  <a
                    href={generateBookingStatusWhatsApp(restaurantRes.reservationReference, restaurantRes.guestFullName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enquire with Restaurant Host</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 space-y-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="font-semibold">No Matching Reservation Found</p>
                  <p className="text-[11px] text-amber-800">
                    Please verify the reference code (e.g. DC-HTL-...) and matching email/phone, or contact our reservations desk directly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
