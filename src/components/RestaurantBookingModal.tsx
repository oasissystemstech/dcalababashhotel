import React, { useState } from 'react';
import { SeatingArea, RestaurantReservation } from '../types';
import { DCalabashStore } from '../lib/store';
import { createWhatsAppUrl } from '../constants/hotelInfo';
import { X, UtensilsCrossed, Calendar, Clock, Users, ArrowRight, ArrowLeft, CheckCircle2, MessageSquare, Copy } from 'lucide-react';

interface RestaurantBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantBookingModal: React.FC<RestaurantBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>('19:00');
  const [partySize, setPartySize] = useState<number>(2);
  const [seatingArea, setSeatingArea] = useState<SeatingArea>('veranda_terrace');
  const [guestFullName, setGuestFullName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [step, setStep] = useState<1 | 2>(1); // 1 = Details, 2 = Confirmation
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<RestaurantReservation | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!guestFullName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setErrorMsg('Please provide your name, email, and telephone number.');
      return;
    }

    setIsSubmitting(true);
    const result = await DCalabashStore.createRestaurantReservation({
      guestFullName: guestFullName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      reservationDate: date,
      reservationTime: time,
      partySize,
      seatingArea,
      specialRequests: specialRequests.trim(),
      status: 'pending', // Awaiting dining staff confirmation
      source: 'website',
    });

    setIsSubmitting(false);

    if (result.success && result.reservation) {
      setConfirmedReservation(result.reservation);
      setStep(2);
    } else {
      setErrorMsg(result.error || 'Could not submit reservation. Please try again.');
    }
  };

  const handleCopyRef = () => {
    if (confirmedReservation) {
      navigator.clipboard.writeText(confirmedReservation.reservationReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0F3827] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C59B27]">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                Table Reservation
              </h3>
              <p className="text-[11px] text-white/80">
                D'Calabash Restaurant &amp; Bar · Monrovia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dining Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={todayStr}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reservation Time *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                  >
                    <optgroup label="Breakfast">
                      <option value="07:30">7:30 AM</option>
                      <option value="08:30">8:30 AM</option>
                      <option value="09:30">9:30 AM</option>
                    </optgroup>
                    <optgroup label="Lunch">
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                    </optgroup>
                    <optgroup label="Dinner & Drinks">
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="19:30">7:30 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="20:30">8:30 PM</option>
                      <option value="21:00">9:00 PM</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Guests *
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seating Area
                  </label>
                  <select
                    value={seatingArea}
                    onChange={(e) => setSeatingArea(e.target.value as SeatingArea)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                  >
                    <option value="veranda_terrace">Veranda / Garden Terrace</option>
                    <option value="indoor_dining">Air-Conditioned Indoor Dining</option>
                    <option value="private_dining">Private Dining Room (Events)</option>
                    <option value="bar_lounge">Bar &amp; Cocktail Lounge</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={guestFullName}
                    onChange={(e) => setGuestFullName(e.target.value)}
                    placeholder="e.g. Marie Cooper"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="marie@example.com"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+231 77 123 4567"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Birthday celebration, anniversary, high chair needed, dietary restrictions..."
                    rows={2}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Reserving...' : 'Submit Table Reservation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-bold text-slate-900">
                  Table Reservation Received!
                </h4>
                <p className="text-xs text-slate-600">
                  We look forward to hosting you, <strong className="text-slate-900">{confirmedReservation?.guestFullName}</strong>.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border-2 border-dashed border-[#0F3827]/30 rounded-xl p-4 text-center space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Reservation Reference
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl font-bold text-[#0F3827]">
                    {confirmedReservation?.reservationReference}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 text-slate-500 hover:text-[#0F3827]"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedRef && <div className="text-[10px] text-emerald-700">Copied!</div>}

                <div className="text-xs text-slate-600 pt-1">
                  {confirmedReservation?.reservationDate} at {confirmedReservation?.reservationTime} · {confirmedReservation?.partySize} Guests · {confirmedReservation?.seatingArea.replace('_', ' ')}
                </div>
              </div>

              {/* Direct WhatsApp Confirmation Button */}
              {confirmedReservation && (
                <a
                  href={createWhatsAppUrl(
                    `Hello D'Calabash Restaurant,\n\nI just reserved a table online!\nReference: ${confirmedReservation.reservationReference}\nName: ${confirmedReservation.guestFullName}\nDate: ${confirmedReservation.reservationDate}\nTime: ${confirmedReservation.reservationTime}\nGuests: ${confirmedReservation.partySize}\nArea: ${confirmedReservation.seatingArea}\n\nLooking forward to dining with you!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Restaurant Desk on WhatsApp</span>
                </a>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
