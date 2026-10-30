import React, { useState, useEffect } from 'react';
import { RoomCategory, Currency, HotelBooking, PaymentMethod } from '../types';
import { DCalabashStore } from '../lib/store';
import { HOTEL_INFO, createWhatsAppUrl } from '../constants/hotelInfo';
import { X, Calendar, Check, AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, MessageSquare, Printer, Copy } from 'lucide-react';

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCategory?: RoomCategory | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialRooms?: number;
  currentCurrency: Currency;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedCategory,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 2,
  initialRooms = 1,
  currentCurrency,
}) => {
  // Wizard steps: 1 = Dates & Room Choice, 2 = Guest Details, 3 = Summary & Confirm, 4 = Success
  const [step, setStep] = useState<number>(1);

  // Form states
  const defaultIn = initialCheckIn || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const defaultOut = initialCheckOut || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  })();

  const [checkInDate, setCheckInDate] = useState<string>(defaultIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultOut);
  const [adultsCount, setAdultsCount] = useState<number>(initialAdults);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(initialRooms);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    preSelectedCategory ? preSelectedCategory.id : ''
  );

  // Guest Details
  const [guestFullName, setGuestFullName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestCountry, setGuestCountry] = useState<string>('Liberia');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_on_arrival');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<HotelBooking | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Available room categories
  const [categories, setCategories] = useState<RoomCategory[]>(DCalabashStore.getRoomCategories());

  useEffect(() => {
    if (preSelectedCategory) {
      setSelectedCategoryId(preSelectedCategory.id);
    } else if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [preSelectedCategory, categories]);

  if (!isOpen) return null;

  // Nights calculation
  const inTime = new Date(checkInDate).getTime();
  const outTime = new Date(checkOutDate).getTime();
  const numberOfNights = Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)));

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const ratePerNight = selectedCategory?.promotionalPriceUsd || selectedCategory?.pricePerNightUsd || 100;
  const subtotal = ratePerNight * numberOfNights * roomsCount;
  const tax = Math.round((subtotal * 0.1) * 100) / 100; // 10% tax
  const totalUsd = Math.round((subtotal + tax) * 100) / 100;

  // Check inventory for the chosen category and dates
  const availability = selectedCategoryId
    ? DCalabashStore.checkRoomCategoryAvailability(selectedCategoryId, checkInDate, checkOutDate)
    : { availableRooms: 0, isAvailable: false, totalInventory: 0 };

  const handleDatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (inTime >= outTime) {
      setBookingError('Check-out date must be after check-in date.');
      return;
    }

    if (!selectedCategory) {
      setBookingError('Please select a suite category.');
      return;
    }

    if (availability.availableRooms < roomsCount) {
      setBookingError(
        `Only ${availability.availableRooms} suite(s) available for these dates. Please reduce the number of rooms or adjust dates.`
      );
      return;
    }

    setStep(2);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!guestFullName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setBookingError('Please complete all required contact fields.');
      return;
    }

    setStep(3);
  };

  const handleFinalBookingSubmit = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    setBookingError(null);

    const result = await DCalabashStore.createHotelBooking({
      roomCategoryId: selectedCategory.id,
      roomCategoryName: selectedCategory.name,
      checkInDate,
      checkOutDate,
      numberOfNights,
      adultsCount,
      childrenCount,
      roomsCount,
      guestFullName: guestFullName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      guestCountry: guestCountry.trim(),
      specialRequests: specialRequests.trim(),
      roomRatePerNightUsd: ratePerNight,
      status: 'pending', // Pending administrator approval
      paymentStatus: 'pending',
      paymentMethod,
      source: 'website',
    });

    setIsSubmitting(false);

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      setStep(4);
    } else {
      setBookingError(result.error || 'Failed to complete booking. Please try again.');
    }
  };

  const handleCopyReference = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.bookingReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0F3827] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C59B27]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                Hotel Room Reservation
              </h3>
              <p className="text-[11px] text-white/80">
                D'Calabash Hotel · Congo Town Back Road, Monrovia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker (Steps 1 to 3) */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-medium text-slate-500">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0F3827] font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-[#0F3827] text-white' : 'bg-slate-200'
              }`}>1</span>
              <span>Dates &amp; Room</span>
            </div>
            <span className="text-slate-300">──</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0F3827] font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? 'bg-[#0F3827] text-white' : 'bg-slate-200'
              }`}>2</span>
              <span>Guest Details</span>
            </div>
            <span className="text-slate-300">──</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#0F3827] font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 3 ? 'bg-[#0F3827] text-white' : 'bg-slate-200'
              }`}>3</span>
              <span>Confirmation</span>
            </div>
          </div>
        )}

        {/* Body Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {bookingError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* STEP 1: DATES & ROOM CATEGORY SELECTION */}
          {step === 1 && (
            <form onSubmit={handleDatesSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Standard check-in from 2:00 PM</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Standard check-out by 11:00 AM</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adults
                  </label>
                  <select
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Children
                  </label>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rooms
                  </label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Categories Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Room Category:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isSelected = cat.id === selectedCategoryId;
                    const catAvail = DCalabashStore.checkRoomCategoryAvailability(
                      cat.id,
                      checkInDate,
                      checkOutDate
                    );
                    const isAvail = catAvail.availableRooms >= roomsCount;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#0F3827] bg-[#0F3827]/5 ring-1 ring-[#0F3827]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{cat.name}</span>
                            {cat.isDraft && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 rounded">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{cat.bedConfiguration} · Max {cat.maxAdults} Adults</p>
                          <div className="text-[10px] text-slate-600">
                            Status: {isAvail ? (
                              <span className="text-emerald-700 font-semibold">{catAvail.availableRooms} rooms available</span>
                            ) : (
                              <span className="text-rose-600 font-semibold">Fully booked for selected dates</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-serif font-bold text-sm text-[#0F3827]">
                            {DCalabashStore.formatCurrency(cat.promotionalPriceUsd || cat.pricePerNightUsd, currentCurrency)}
                          </div>
                          <div className="text-[10px] text-slate-500">per night</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stay Calculation Preview */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-600">Total Duration:</span>{' '}
                  <strong className="text-slate-900">{numberOfNights} Night{numberOfNights > 1 ? 's' : ''}</strong>
                </div>
                <div>
                  <span className="text-slate-600">Estimated Total:</span>{' '}
                  <strong className="text-[#0F3827] text-sm">
                    {DCalabashStore.formatCurrency(totalUsd, currentCurrency)}
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Continue to Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={guestFullName}
                    onChange={(e) => setGuestFullName(e.target.value)}
                    placeholder="e.g. Samuel K. Johnson"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. samuel@example.com"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telephone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. +231 77 123 4567"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                    required
                  />
                  <span className="text-[10px] text-slate-500">Used for booking confirmation and arrival coordination</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={guestCountry}
                    onChange={(e) => setGuestCountry(e.target.value)}
                    placeholder="Liberia"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 border rounded-lg text-xs cursor-pointer text-center ${
                      paymentMethod === 'pay_on_arrival'
                        ? 'border-[#0F3827] bg-[#0F3827]/5 font-semibold text-[#0F3827]'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'pay_on_arrival'}
                      onChange={() => setPaymentMethod('pay_on_arrival')}
                      className="sr-only"
                    />
                    Pay on Arrival
                  </label>

                  <label
                    className={`p-2.5 border rounded-lg text-xs cursor-pointer text-center ${
                      paymentMethod === 'mobile_money'
                        ? 'border-[#0F3827] bg-[#0F3827]/5 font-semibold text-[#0F3827]'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'mobile_money'}
                      onChange={() => setPaymentMethod('mobile_money')}
                      className="sr-only"
                    />
                    Mobile Money (Lonestar/Orange)
                  </label>

                  <label
                    className={`p-2.5 border rounded-lg text-xs cursor-pointer text-center ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#0F3827] bg-[#0F3827]/5 font-semibold text-[#0F3827]'
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="sr-only"
                    />
                    Bank Transfer
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requests / Arrival Notes (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. High floor room, late night arrival estimate, dietary needs..."
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Review Booking Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUMMARY & FINAL SUBMIT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#0F3827] border-b border-slate-200 pb-2">
                  Reservation Summary
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Suite Category:</span>
                    <p className="font-bold text-slate-900">{selectedCategory?.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Number of Rooms:</span>
                    <p className="font-bold text-slate-900">{roomsCount} Room(s)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Check-in:</span>
                    <p className="font-bold text-slate-900">{checkInDate} (2:00 PM)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Check-out:</span>
                    <p className="font-bold text-slate-900">{checkOutDate} (11:00 AM)</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Guests:</span>
                    <p className="font-bold text-slate-900">{adultsCount} Adults {childrenCount > 0 ? `, ${childrenCount} Children` : ''}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Duration:</span>
                    <p className="font-bold text-slate-900">{numberOfNights} Night(s)</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Nightly Rate:</span>
                    <span>${ratePerNight.toFixed(2)} × {numberOfNights} nights × {roomsCount} room(s)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Hospitality Tax &amp; Service (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#0F3827] pt-2 border-t border-slate-200">
                    <span>Total Amount Due:</span>
                    <span>
                      ${totalUsd.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-slate-600">
                        (approx. {DCalabashStore.formatCurrency(totalUsd, 'LRD')})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-semibold">Hotel Booking Policy:</p>
                <p className="text-[11px] text-amber-800">
                  Online submissions are sent directly to D'Calabash Hotel reservations desk. 
                  Our front desk confirms your room allocation and can reach out via WhatsApp/Phone for arrivals or deposit instructions if needed.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Details
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalBookingSubmit}
                  className="px-6 py-2.5 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                  <span>{isSubmitting ? 'Securing Booking...' : 'Confirm & Submit Reservation'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION & VOUCHER */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-bold text-slate-900">
                  Reservation Received!
                </h4>
                <p className="text-xs text-slate-600">
                  Thank you, <strong className="text-slate-900">{confirmedBooking.guestFullName}</strong>. Your reservation request has been registered in the D'Calabash database.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-[#FAF8F5] border-2 border-dashed border-[#0F3827]/30 rounded-xl p-4 max-w-md mx-auto text-center space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Unique Booking Reference
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F3827] tracking-wider">
                    {confirmedBooking.bookingReference}
                  </span>
                  <button
                    onClick={handleCopyReference}
                    className="p-1.5 text-slate-500 hover:text-[#0F3827] hover:bg-white rounded transition-colors"
                    title="Copy Reference"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedRef && (
                  <div className="text-[10px] text-emerald-700 font-medium">Copied to clipboard!</div>
                )}
                <div className="text-[11px] text-slate-600">
                  Keep this reference code for check-in and booking lookup.
                </div>
              </div>

              {/* Quick WhatsApp Share Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={createWhatsAppUrl(
                    `Hello D'Calabash Hotel Reservations,\n\nI just submitted an online room reservation for the ${confirmedBooking.roomCategoryName}.\nBooking Reference: ${confirmedBooking.bookingReference}\nGuest: ${confirmedBooking.guestFullName}\nCheck-in: ${confirmedBooking.checkInDate}\nCheck-out: ${confirmedBooking.checkOutDate}\nTotal: $${confirmedBooking.totalAmountUsd}\n\nPlease confirm availability and details. Thank you!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Confirmation to Hotel WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35]"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
