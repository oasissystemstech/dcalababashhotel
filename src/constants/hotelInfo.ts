export const HOTEL_INFO = {
  name: "D'Calabash Hotel",
  shortName: "D'Calabash",
  brandPromise: "Your Best Experience is Guaranteed.",
  logoUrl: "/assets/aistudio/dcalabash_logo_51d89ca5.jpeg",
  address: "Congo Town Back Road, Monrovia, Liberia, 231",
  telephone: "+231 77 763 7559",
  cleanPhone: "231777637559", // For tel: and wa.me
  email: "admin@dcalabashhotel.co",
  facebookUrl: "https://www.facebook.com/share/1fCqL8ELkw/?mibextid=wwXIfr",
  instagramUrl: "https://www.instagram.com/dcalabashhotel",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=D%27Calabash+Hotel+Congo+Town+Back+Road+Monrovia+Liberia",
  defaultCurrency: "USD" as const,
  defaultExchangeRate: 195, // 1 USD = 195 LRD (configurable by admin)
  operatingHours: {
    frontDesk: "24 Hours Daily",
    checkIn: "2:00 PM (14:00)",
    checkOut: "11:00 AM (11:00)",
    restaurantBreakfast: "7:00 AM – 10:30 AM",
    restaurantLunch: "12:00 PM – 3:30 PM",
    restaurantDinner: "6:00 PM – 10:30 PM",
    barLounge: "4:00 PM – 12:00 AM (Midnight)",
  },
};

export function createWhatsAppUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${HOTEL_INFO.cleanPhone}?text=${encoded}`;
}

export function generateRoomEnquiryWhatsApp(roomName: string, checkIn?: string, checkOut?: string, guests?: number): string {
  let message = `Hello D'Calabash Hotel,\n\nI would like to enquire about booking the ${roomName}.`;
  if (checkIn && checkOut) {
    message += `\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}`;
  }
  if (guests) {
    message += `\nGuests: ${guests}`;
  }
  message += `\n\nPlease let me know availability and pricing details. Thank you!`;
  return createWhatsAppUrl(message);
}

export function generateTableBookingWhatsApp(date: string, time: string, guests: number, seating?: string): string {
  const message = `Hello D'Calabash Restaurant,\n\nI would like to reserve a dining table.\nDate: ${date}\nTime: ${time}\nParty size: ${guests} guest(s)\nPreference: ${seating || 'Standard'}\n\nPlease confirm availability. Thank you!`;
  return createWhatsAppUrl(message);
}

export function generateMenuEnquiryWhatsApp(itemName?: string): string {
  const message = itemName
    ? `Hello D'Calabash Restaurant,\n\nI am interested in ordering / enquiring about "${itemName}". What are the current specials today?`
    : `Hello D'Calabash Restaurant,\n\nI would like to see today's fresh culinary specials and place an order or enquiry.`;
  return createWhatsAppUrl(message);
}

export function generateGeneralEnquiryWhatsApp(): string {
  const message = `Hello D'Calabash Hotel & Restaurant,\n\nI have a general enquiry regarding your hospitality services at Congo Town Back Road, Monrovia.`;
  return createWhatsAppUrl(message);
}

export function generateBookingStatusWhatsApp(reference: string, guestName: string): string {
  const message = `Hello D'Calabash Hotel Reservations,\n\nI am checking on the status of my booking reference #${reference} under the name of ${guestName}. Could you please assist?`;
  return createWhatsAppUrl(message);
}
