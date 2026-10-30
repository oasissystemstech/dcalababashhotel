import React, { useState, useEffect } from 'react';
import { HOTEL_INFO, createWhatsAppUrl } from '../constants/hotelInfo';
import { DCalabashStore } from '../lib/store';
import { BusinessSettings } from '../types';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle, ExternalLink, Navigation } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(DCalabashStore.getSettings());

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      setSettings(DCalabashStore.getSettings());
    });
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    const res = await DCalabashStore.submitEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject,
      message: message.trim(),
    });

    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      setErrorMsg('Failed to send enquiry. Please contact us directly via telephone or WhatsApp.');
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Direct Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#0F3827]">
                Location &amp; Inquiries
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Connect With D'Calabash Hotel
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We are conveniently located along the quiet Congo Town Back Road in Monrovia. Whether you have questions regarding accommodation availability, dining reservations, or event bookings, our staff is at your service.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Telephone */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-[#0F3827] text-[#C59B27] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase text-slate-500">
                    Telephone Assistance
                  </div>
                  <a
                    href={`tel:${settings.whatsappNumber || HOTEL_INFO.cleanPhone}`}
                    className="font-bold text-sm text-slate-900 hover:text-[#0F3827]"
                  >
                    {settings.telephone || HOTEL_INFO.telephone}
                  </a>
                  <p className="text-[11px] text-slate-500">24/7 Front Desk Hotline</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase text-emerald-800">
                    Direct WhatsApp
                  </div>
                  <a
                    href={createWhatsAppUrl("Hello D'Calabash Hotel, I have an inquiry.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-emerald-950 hover:underline flex items-center gap-1"
                  >
                    Chat on WhatsApp
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[11px] text-emerald-700">Instant messaging with concierge</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-[#0F3827] text-[#C59B27] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase text-slate-500">
                    Official Email
                  </div>
                  <a
                    href={`mailto:${settings.email || HOTEL_INFO.email}`}
                    className="font-bold text-sm text-slate-900 hover:text-[#0F3827]"
                  >
                    {settings.email || HOTEL_INFO.email}
                  </a>
                  <p className="text-[11px] text-slate-500">Business &amp; Reservation Inquiries</p>
                </div>
              </div>

              {/* Physical Address & Maps */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-[#0F3827] text-[#C59B27] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase text-slate-500">
                    Physical Address
                  </div>
                  <p className="font-bold text-sm text-slate-900">
                    {settings.address || HOTEL_INFO.address}
                  </p>
                  {settings.directionsText && (
                    <p className="text-xs text-slate-500 mt-1 italic">
                      {settings.directionsText}
                    </p>
                  )}
                  <a
                    href={HOTEL_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#0F3827] hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">
              Send an Enquiry
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Fill out the form below and our management team will reply promptly to your email or telephone number.
            </p>

            {isSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-emerald-950">
                  Enquiry Successfully Sent!
                </h4>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out. A guest relations officer has received your message and will be in touch shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Samuel B. Dennis"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. samuel@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+231..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Room Booking">Hotel Room Reservation</option>
                      <option value="Restaurant / Dining">Restaurant &amp; Dining Table</option>
                      <option value="Private Function / Event">Private Function / Event Hosting</option>
                      <option value="Airport Shuttle">Airport Transportation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can assist your visit to D'Calabash Hotel..."
                    rows={4}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0F3827] bg-white text-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4 text-[#C59B27]" />
                  <span>{isSubmitting ? 'Sending Enquiry...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
