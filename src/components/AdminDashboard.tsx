import React, { useState, useEffect } from 'react';
import {
  HotelBooking,
  RestaurantReservation,
  RoomCategory,
  MenuItem,
  BusinessSettings,
  ContactEnquiry,
  GalleryItem,
  SpecialOffer,
  AdminRole,
  ImageSourceType,
} from '../types';
import { DCalabashStore } from '../lib/store';
import { HOTEL_INFO } from '../constants/hotelInfo';
import {
  getSupabaseConfig,
  setSupabaseConfig,
  clearSupabaseConfig,
  isSupabaseConfigured,
  testSupabaseConnection,
  uploadImageToSupabase,
} from '../lib/supabase';
import { compressImageFile } from '../lib/imageOptimizer';
import {
  Shield,
  LayoutDashboard,
  Bed,
  Calendar,
  UtensilsCrossed,
  Flame,
  Settings,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Database,
  ArrowLeft,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Upload,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  FolderOpen,
  Lock,
  User,
  LogOut,
  DollarSign,
  Globe,
  Clock,
  FileText,
  Sparkles,
  Sliders,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  RotateCcw,
  Camera,
} from 'lucide-react';

const ADMIN_USERNAME = 'dcalabash';
const ADMIN_PASSWORD = 'dcalabash@2026';
const AUTH_STORAGE_KEY = 'dcalabash_admin_auth_v1';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
        localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError(null);

    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (
      (cleanUser === ADMIN_USERNAME.toLowerCase() || cleanUser === 'admin@dcalabashhotel.co') &&
      cleanPass === ADMIN_PASSWORD
    ) {
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      }
      setIsAuthenticated(true);
      setLoginError(null);
      setIsSubmittingLogin(false);
    } else {
      setLoginError('Invalid username or password. Please verify your credentials.');
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  // Current admin role
  const [currentRole, setCurrentRole] = useState<AdminRole>('hotel_manager');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hotel_bookings' | 'room_categories' | 'restaurant_res' | 'menu_manager' | 'media_manager' | 'enquiries' | 'settings' | 'supabase_sync'
  >('overview');

  // Store data state
  const [settings, setSettings] = useState<BusinessSettings>(DCalabashStore.getSettings());
  const [bookings, setBookings] = useState<HotelBooking[]>(DCalabashStore.getHotelBookings());
  const [reservations, setReservations] = useState<RestaurantReservation[]>(DCalabashStore.getRestaurantReservations());
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(DCalabashStore.getRoomCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DCalabashStore.getMenuItems());
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DCalabashStore.getGalleryItems());
  const [offers, setOffers] = useState<SpecialOffer[]>(DCalabashStore.getOffers());
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(DCalabashStore.getEnquiries());

  // Search & Filter
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'temporary' | 'approved'>('all');

  // Manual Booking Modal
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualGuestName, setManualGuestName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualInDate, setManualInDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualOutDate, setManualOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [manualCategoryId, setManualCategoryId] = useState('');
  const [manualRoomsCount, setManualRoomsCount] = useState(1);
  const [manualSource, setManualSource] = useState<'whatsapp' | 'phone' | 'walk_in'>('whatsapp');
  const [manualError, setManualError] = useState<string | null>(null);

  // Edit Room Category Modal
  const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);

  // Edit Menu Item Modal
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // Universal Image Replacement Modal
  const [imageModalTarget, setImageModalTarget] = useState<{
    type: 'banner' | 'room' | 'menu' | 'gallery' | 'offer';
    id?: string;
    title: string;
    currentUrl: string;
    sourceType: ImageSourceType;
    isTemporary: boolean;
  } | null>(null);
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [inputImageSource, setInputImageSource] = useState<ImageSourceType>('actual_business_photo');
  const [inputIsTemporary, setInputIsTemporary] = useState(false);

  // Supabase Configuration State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(getSupabaseConfig().key);
  const [supabaseSaveSuccess, setSupabaseSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string; hasSchema?: boolean } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [isUploadingToStorage, setIsUploadingToStorage] = useState(false);
  const [uploadStorageNotice, setUploadStorageNotice] = useState<string | null>(null);

  // Settings Tab Sub-Navigation & Logo / Page Editing State
  const [settingsSubTab, setSettingsSubTab] = useState<'logo' | 'pages' | 'rates' | 'operations' | 'contact'>('logo');
  const [pagesSection, setPagesSection] = useState<'hero' | 'about' | 'restaurant'>('hero');
  const [logoInputUrl, setLogoInputUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoNotice, setLogoNotice] = useState<string | null>(null);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  const [settingsSaveMessage, setSettingsSaveMessage] = useState('Settings & Rates saved successfully!');

  useEffect(() => {
    return DCalabashStore.subscribe(() => {
      const updated = DCalabashStore.getSettings();
      setSettings(updated);
      setBookings(DCalabashStore.getHotelBookings());
      setReservations(DCalabashStore.getRestaurantReservations());
      setRoomCategories(DCalabashStore.getRoomCategories());
      setMenuItems(DCalabashStore.getMenuItems());
      setGalleryItems(DCalabashStore.getGalleryItems());
      setOffers(DCalabashStore.getOffers());
      setEnquiries(DCalabashStore.getEnquiries());
    });
  }, []);

  // CALCULATED ANALYTICS
  const totalHotelBookings = bookings.length;
  const pendingHotelBookings = bookings.filter((b) => b.status === 'pending').length;
  const checkedInCount = bookings.filter((b) => b.status === 'checked_in').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingArrivals = bookings.filter((b) => b.checkInDate === todayStr && b.status !== 'cancelled').length;

  const totalRestaurantRes = reservations.length;
  const todayRestaurantRes = reservations.filter((r) => r.reservationDate === todayStr).length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const totalCalculatedRevenueUsd = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalAmountUsd || 0), 0);

  // Image audit counts
  const allImageSlots = [
    { title: 'Hero Banner', isTemp: settings.isHeroImageTemporary },
    { title: 'Restaurant Banner', isTemp: settings.isRestaurantHeroImageTemporary },
    { title: 'About Welcome Photo', isTemp: settings.isAboutImageTemporary },
    ...roomCategories.map((r) => ({ title: r.name, isTemp: r.isTemporaryImage })),
    ...menuItems.map((m) => ({ title: m.name, isTemp: m.isTemporaryImage })),
    ...galleryItems.map((g) => ({ title: g.title, isTemp: g.isTemporaryImage })),
    ...offers.map((o) => ({ title: o.title, isTemp: o.isTemporaryImage })),
  ];
  const totalImagesCount = allImageSlots.length;
  const temporaryImagesCount = allImageSlots.filter((i) => i.isTemp).length;
  const approvedImagesCount = totalImagesCount - temporaryImagesCount;

  // CSV EXPORTS
  const exportBookingsToCSV = () => {
    const headers = [
      'Reference',
      'Guest Name',
      'Email',
      'Phone',
      'Room Category',
      'Check In',
      'Check Out',
      'Nights',
      'Rooms',
      'Total USD',
      'Status',
      'Payment Status',
      'Source',
    ];
    const rows = bookings.map((b) => [
      b.bookingReference,
      `"${b.guestFullName}"`,
      b.guestEmail,
      b.guestPhone,
      `"${b.roomCategoryName || ''}"`,
      b.checkInDate,
      b.checkOutDate,
      b.numberOfNights,
      b.roomsCount,
      b.totalAmountUsd,
      b.status,
      b.paymentStatus,
      b.source,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dcalabash_hotel_bookings_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportReservationsToCSV = () => {
    const headers = [
      'Reference',
      'Guest Name',
      'Email',
      'Phone',
      'Date',
      'Time',
      'Party Size',
      'Seating Area',
      'Status',
      'Table',
    ];
    const rows = reservations.map((r) => [
      r.reservationReference,
      `"${r.guestFullName}"`,
      r.guestEmail,
      r.guestPhone,
      r.reservationDate,
      r.reservationTime,
      r.partySize,
      r.seatingArea,
      r.status,
      r.tableNumber || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dcalabash_restaurant_reservations_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Manual Booking Creation
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    const category = roomCategories.find((c) => c.id === (manualCategoryId || roomCategories[0]?.id));
    if (!category) {
      setManualError('Please select a valid room category.');
      return;
    }

    const res = await DCalabashStore.createHotelBooking({
      roomCategoryId: category.id,
      roomCategoryName: category.name,
      checkInDate: manualInDate,
      checkOutDate: manualOutDate,
      adultsCount: 2,
      childrenCount: 0,
      roomsCount: manualRoomsCount,
      guestFullName: manualGuestName.trim(),
      guestEmail: manualEmail.trim() || 'walkin@dcalabashhotel.co',
      guestPhone: manualPhone.trim() || '+231',
      guestCountry: 'Liberia',
      specialRequests: `Manual booking entered by staff (${manualSource})`,
      roomRatePerNightUsd: category.pricePerNightUsd,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentMethod: 'pay_on_arrival',
      source: manualSource,
    });

    if (res.success) {
      setShowManualBookingModal(false);
      setManualGuestName('');
      setManualPhone('');
    } else {
      setManualError(res.error || 'Failed to create manual booking.');
    }
  };

  // Open Image Replacement Modal
  const openImageModal = (
    type: 'banner' | 'room' | 'menu' | 'gallery' | 'offer',
    title: string,
    currentUrl: string,
    sourceType: ImageSourceType = 'licensed_stock',
    isTemporary: boolean = true,
    id?: string
  ) => {
    setImageModalTarget({ type, id, title, currentUrl, sourceType, isTemporary });
    setInputImageUrl(currentUrl);
    setInputImageSource(sourceType);
    setInputIsTemporary(isTemporary);
  };

  // Save Image Replacement
  const handleSaveImageReplacement = () => {
    if (!imageModalTarget) return;

    const url = inputImageUrl.trim() || imageModalTarget.currentUrl;

    if (imageModalTarget.type === 'banner') {
      if (imageModalTarget.id === 'restaurant_hero') {
        DCalabashStore.updateSettings({
          restaurantHeroImageUrl: url,
          restaurantHeroImageSourceType: inputImageSource,
          isRestaurantHeroImageTemporary: inputIsTemporary,
        });
      } else if (imageModalTarget.id === 'about_photo') {
        DCalabashStore.updateSettings({
          aboutImageUrl: url,
          aboutImageSourceType: inputImageSource,
          isAboutImageTemporary: inputIsTemporary,
        });
      } else {
        DCalabashStore.updateHeroImage(url, inputImageSource, inputIsTemporary);
      }
    } else if (imageModalTarget.type === 'room' && imageModalTarget.id) {
      DCalabashStore.updateRoomCategoryImage(imageModalTarget.id, url, inputImageSource, inputIsTemporary);
    } else if (imageModalTarget.type === 'menu' && imageModalTarget.id) {
      DCalabashStore.updateMenuItemImage(imageModalTarget.id, url, inputImageSource, inputIsTemporary);
    } else if (imageModalTarget.type === 'gallery' && imageModalTarget.id) {
      DCalabashStore.updateGalleryItemImage(imageModalTarget.id, url, inputImageSource, inputIsTemporary);
    } else if (imageModalTarget.type === 'offer' && imageModalTarget.id) {
      DCalabashStore.updateOfferImage(imageModalTarget.id, url, inputImageSource, inputIsTemporary);
    }

    setImageModalTarget(null);
  };

  // Handle local file upload with automated image compression and persistent storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToStorage(true);
    setUploadStorageNotice('Compressing and optimizing photograph for web display...');

    try {
      // 1. Automatically compress camera/phone photo to ~150KB web-optimized JPEG
      const optimized = await compressImageFile(file, 1600, 0.82);
      setInputImageUrl(optimized.dataUrl);
      setInputImageSource('actual_business_photo');
      setInputIsTemporary(false);
      setUploadStorageNotice(`Photo optimized to ${optimized.optimizedSizeKb} KB (saved to IndexedDB & browser storage).`);

      // 2. If Supabase is connected, also upload the compressed image to Supabase Storage bucket
      if (isSupabaseConfigured() && imageModalTarget) {
        let bucket = 'hotel-gallery';
        if (imageModalTarget.type === 'room') bucket = 'room-images';
        else if (imageModalTarget.type === 'menu') bucket = 'menu-images';
        else if (imageModalTarget.type === 'banner') bucket = 'restaurant-images';
        else if (imageModalTarget.type === 'offer') bucket = 'promotional-images';

        setUploadStorageNotice(`Uploading to Supabase Storage bucket (${bucket})...`);
        const res = await uploadImageToSupabase(bucket, optimized.file);
        if (res.success && res.url) {
          setInputImageUrl(res.url);
          setUploadStorageNotice(`Uploaded to Supabase Storage: ${res.url}`);
        } else {
          setUploadStorageNotice(
            `Saved locally to browser IndexedDB (${optimized.optimizedSizeKb} KB). Image will persist across page refreshes.`
          );
        }
      }
    } catch (err: any) {
      console.warn('Image optimization error, falling back to direct load:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setInputImageUrl(event.target.result as string);
          setInputImageSource('actual_business_photo');
          setInputIsTemporary(false);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingToStorage(false);
    }
  };

  // Handle Logo Upload with automatic compression and persistent storage
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setLogoNotice('Optimizing and compressing logo image...');

    try {
      // Compress logo to crisp 800px max width/height, 90% quality
      const optimized = await compressImageFile(file, 800, 0.90);
      setLogoInputUrl(optimized.dataUrl);
      DCalabashStore.updateLogo(optimized.dataUrl, 'actual_business_photo', false);
      setLogoNotice(`Logo optimized to ${optimized.optimizedSizeKb} KB and updated site-wide!`);

      // Try uploading to Supabase Storage if configured
      if (isSupabaseConfigured()) {
        setLogoNotice('Uploading logo to Supabase Storage...');
        const res = await uploadImageToSupabase('hotel-gallery', optimized.file);
        if (res.success && res.url) {
          setLogoInputUrl(res.url);
          DCalabashStore.updateLogo(res.url, 'actual_business_photo', false);
          setLogoNotice('Logo uploaded to Supabase Storage and updated site-wide!');
        }
      }
      triggerSettingsSuccess('Hotel logo updated successfully across the entire website!');
    } catch (err: any) {
      console.warn('Logo optimization error:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setLogoInputUrl(dataUrl);
          DCalabashStore.updateLogo(dataUrl, 'actual_business_photo', false);
          setLogoNotice('Logo updated and saved locally in browser storage.');
          triggerSettingsSuccess('Hotel logo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleApplyLogoUrl = () => {
    if (!logoInputUrl.trim()) return;
    DCalabashStore.updateLogo(logoInputUrl.trim(), 'actual_business_photo', false);
    setLogoNotice('New logo web URL applied site-wide.');
    triggerSettingsSuccess('Logo URL updated across navigation, footer, and branding!');
  };

  const handleResetLogoToDefault = () => {
    setLogoInputUrl(HOTEL_INFO.logoUrl);
    DCalabashStore.updateLogo(HOTEL_INFO.logoUrl, 'actual_business_photo', false);
    setLogoNotice("Official D'Calabash Hotel logo restored.");
    triggerSettingsSuccess('Official default logo restored site-wide.');
  };

  const triggerSettingsSuccess = (message: string = 'Changes saved successfully to database!') => {
    setSettingsSaveMessage(message);
    setSettingsSaveSuccess(true);
    setTimeout(() => {
      setSettingsSaveSuccess(false);
    }, 3500);
  };

  // AUTHENTICATION GATE
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
          {/* Header */}
          <div className="bg-[#0F3827] text-white p-6 sm:p-8 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="Return to Website"
            >
              ✕
            </button>
            <div className="inline-block p-2 bg-white rounded-2xl shadow-lg mb-3">
              <img
                src={HOTEL_INFO.logoUrl}
                alt="D'Calabash Hotel"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/30 text-[#C59B27] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3" />
              <span>Staff &amp; Management Portal</span>
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-tight">
              Administrative Access
            </h3>
            <p className="text-xs text-white/75 mt-1 font-sans">
              Oldest Congo Town Road, Monrovia · Official Dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
            <p className="text-xs text-slate-600">
              Please enter your authorized username and password to manage suite bookings, dining reservations, digital menu, and media assets.
            </p>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username or Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="e.g. dcalabash"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F3827] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F3827] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0F3827] focus:ring-[#0F3827]"
                />
                <span>Remember session</span>
              </label>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSubmittingLogin ? 'Verifying...' : 'Sign In to Management Portal'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Return to Public Website
              </button>
            </div>

            {/* Quick credentials helper banner */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 space-y-1 mt-4">
              <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Authorized Administrative Credentials:</span>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                <div className="bg-white/80 px-2 py-1 rounded border border-amber-200">
                  <span className="text-slate-500">User: </span>
                  <strong className="text-slate-900">dcalabash</strong>
                </div>
                <div className="bg-white/80 px-2 py-1 rounded border border-amber-200">
                  <span className="text-slate-500">Pass: </span>
                  <strong className="text-slate-900">dcalabash@2026</strong>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Admin Header */}
      <header className="bg-[#0F3827] text-white px-6 py-3.5 border-b border-[#0F3827]/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl || HOTEL_INFO.logoUrl}
              alt="D'Calabash Hotel"
              className="h-10 w-auto object-contain bg-white rounded p-1"
            />
            <div>
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                D'Calabash Hotel &amp; Restaurant
                <span className="text-[10px] font-mono uppercase bg-[#C59B27] text-slate-950 font-bold px-2 py-0.5 rounded">
                  Admin Portal
                </span>
              </h2>
              <p className="text-[11px] text-white/80">
                Oldest Congo Town Road, Monrovia · Database &amp; Reservations
              </p>
            </div>
          </div>
        </div>

        {/* Role Switcher & Exit */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/60">Active Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as AdminRole)}
              className="bg-white/10 text-white text-xs font-semibold px-2.5 py-1.5 rounded border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
            >
              <option value="super_admin" className="text-slate-900">Super Administrator</option>
              <option value="hotel_manager" className="text-slate-900">Hotel Manager</option>
              <option value="restaurant_manager" className="text-slate-900">Restaurant Manager</option>
              <option value="receptionist" className="text-slate-900">Front Desk Receptionist</option>
              <option value="restaurant_staff" className="text-slate-900">Restaurant Staff</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 ${
              isSupabaseConfigured() ? 'bg-emerald-800/80 text-emerald-200' : 'bg-amber-800/80 text-amber-200'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured() ? 'Supabase Live' : 'Local Storage Sync'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 border border-red-700/40"
              title="Log Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden bg-slate-100">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
                Operations
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'overview'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('hotel_bookings')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'hotel_bookings'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>Hotel Bookings</span>
                  </div>
                  {pendingHotelBookings > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {pendingHotelBookings}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('room_categories')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'room_categories'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bed className="w-4 h-4" />
                  <span>Rooms &amp; Categories</span>
                </button>
              </nav>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
                Dining &amp; Bar
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('restaurant_res')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'restaurant_res'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Table Reservations</span>
                  </div>
                  {todayRestaurantRes > 0 && (
                    <span className="bg-[#C59B27] text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {todayRestaurantRes}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('menu_manager')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'menu_manager'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>Digital Menu Items</span>
                </button>
              </nav>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
                Media &amp; Content
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('media_manager')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'media_manager'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-[#C59B27]" />
                    <span>Media &amp; Images</span>
                  </div>
                  {temporaryImagesCount > 0 && (
                    <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {temporaryImagesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'enquiries'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Guest Enquiries</span>
                  </div>
                  {pendingEnquiriesCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {pendingEnquiriesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'settings'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Hotel Settings &amp; Rates</span>
                </button>

                <button
                  onClick={() => setActiveTab('supabase_sync')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                    activeTab === 'supabase_sync'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Supabase &amp; Storage</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Quick CSV Export Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={exportBookingsToCSV}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Bookings CSV</span>
            </button>
            <button
              onClick={exportReservationsToCSV}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dining CSV</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* TAB: MEDIA & IMAGE MANAGEMENT (Section 5) */}
          {activeTab === 'media_manager' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                    Media &amp; Image Management
                    <span className="text-xs bg-[#C59B27]/20 text-[#0F3827] font-semibold px-2 py-0.5 rounded font-sans">
                      Live Replacements
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Replace illustrative placeholder photographs with actual photographs from D'Calabash Hotel management.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMediaFilter('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                      mediaFilter === 'all' ? 'bg-[#0F3827] text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    All ({totalImagesCount})
                  </button>
                  <button
                    onClick={() => setMediaFilter('temporary')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                      mediaFilter === 'temporary' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    Needs Replacement ({temporaryImagesCount})
                  </button>
                  <button
                    onClick={() => setMediaFilter('approved')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                      mediaFilter === 'approved' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    Verified ({approvedImagesCount})
                  </button>
                </div>
              </div>

              {/* Status Alert Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <h4 className="font-bold">Image Status Audit:</h4>
                  <p>
                    The website is currently populated with high-quality illustrative hospitality photographs from licensed stock collections.
                    When official photographs of the D'Calabash Hotel building, rooms, or dishes are received, upload them here or enter their Supabase Storage paths to update the public website instantly without code changes.
                  </p>
                </div>
              </div>

              {/* Group 1: Website Banners & Atmosphere */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-slate-900 border-b pb-2">
                  1. Homepage &amp; Atmosphere Banners
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Hero Banner */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="aspect-[16/10] bg-slate-900 relative">
                        <img
                          src={settings.heroImageUrl}
                          alt="Hero Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {settings.isHeroImageTemporary ? (
                            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">
                              Temporary Illustrative
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                              Official Photo
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h5 className="font-bold text-xs text-slate-900">Hero Section Resort Showcase</h5>
                        <p className="text-[11px] text-slate-500">Source: {settings.heroImageSourceType?.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        onClick={() => openImageModal(
                          'banner',
                          'Hero Section Resort Showcase',
                          settings.heroImageUrl || '',
                          settings.heroImageSourceType || 'licensed_stock',
                          settings.isHeroImageTemporary ?? true,
                          'hero'
                        )}
                        className="w-full py-1.5 bg-[#0F3827] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#164E35]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Restaurant Banner */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="aspect-[16/10] bg-slate-900 relative">
                        <img
                          src={settings.restaurantHeroImageUrl}
                          alt="Restaurant Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {settings.isRestaurantHeroImageTemporary ? (
                            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">
                              Temporary Illustrative
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                              Official Photo
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h5 className="font-bold text-xs text-slate-900">Restaurant &amp; Bar Dining Hall</h5>
                        <p className="text-[11px] text-slate-500">Source: {settings.restaurantHeroImageSourceType?.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        onClick={() => openImageModal(
                          'banner',
                          'Restaurant & Bar Dining Hall',
                          settings.restaurantHeroImageUrl || '',
                          settings.restaurantHeroImageSourceType || 'licensed_stock',
                          settings.isRestaurantHeroImageTemporary ?? true,
                          'restaurant_hero'
                        )}
                        className="w-full py-1.5 bg-[#0F3827] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#164E35]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* About Image */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="aspect-[16/10] bg-slate-900 relative">
                        <img
                          src={settings.aboutImageUrl}
                          alt="About Image"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {settings.isAboutImageTemporary ? (
                            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">
                              Temporary Illustrative
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                              Official Photo
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h5 className="font-bold text-xs text-slate-900">About Us Hospitality Welcome</h5>
                        <p className="text-[11px] text-slate-500">Source: {settings.aboutImageSourceType?.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        onClick={() => openImageModal(
                          'banner',
                          'About Us Hospitality Welcome',
                          settings.aboutImageUrl || '',
                          settings.aboutImageSourceType || 'licensed_stock',
                          settings.isAboutImageTemporary ?? true,
                          'about_photo'
                        )}
                        className="w-full py-1.5 bg-[#0F3827] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#164E35]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 2: Suites & Room Categories */}
              <div className="space-y-3 pt-4">
                <h4 className="font-serif font-bold text-base text-slate-900 border-b pb-2">
                  2. Suite &amp; Room Photographs
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roomCategories.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[4/3] bg-slate-900 relative">
                          <img
                            src={room.imageUrl}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {room.isTemporaryImage ? (
                              <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                                Temporary
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                                Official
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 space-y-0.5">
                          <h5 className="font-bold text-xs text-slate-900">{room.name}</h5>
                          <p className="text-[11px] text-slate-500">${room.pricePerNightUsd}/night</p>
                        </div>
                      </div>

                      <div className="p-3 pt-0">
                        <button
                          onClick={() => openImageModal(
                            'room',
                            room.name,
                            room.imageUrl,
                            room.imageSourceType || 'licensed_stock',
                            room.isTemporaryImage ?? true,
                            room.id
                          )}
                          className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Change Room Image</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 3: Menu Dishes */}
              <div className="space-y-3 pt-4">
                <h4 className="font-serif font-bold text-base text-slate-900 border-b pb-2">
                  3. Restaurant Menu Item Photographs
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-slate-900 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {item.isTemporaryImage ? (
                              <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                                Temporary
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                                Official
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-2.5 space-y-0.5">
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</h5>
                          <p className="text-[11px] text-[#0F3827] font-semibold">${item.priceUsd.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="p-2.5 pt-0">
                        <button
                          onClick={() => openImageModal(
                            'menu',
                            item.name,
                            item.imageUrl || '',
                            item.imageSourceType || 'licensed_stock',
                            item.isTemporaryImage ?? true,
                            item.id
                          )}
                          className="w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Replace Dish Photo</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group 4: Photo Gallery Items */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    4. Photo Gallery Items ({galleryItems.length})
                  </h4>

                  <button
                    onClick={() => {
                      const newId = `gal-${Date.now()}`;
                      DCalabashStore.upsertGalleryItem({
                        id: newId,
                        title: 'New Gallery Photograph',
                        category: 'restaurant',
                        categoryLabel: 'Restaurant & Dining',
                        description: 'Atmosphere photograph of D\'Calabash Hotel.',
                        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
                        imageSourceType: 'licensed_stock',
                        isTemporaryImage: true,
                      });
                    }}
                    className="px-3 py-1 bg-[#0F3827] text-white rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Gallery Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {galleryItems.map((gal) => (
                    <div
                      key={gal.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[4/3] bg-slate-900 relative">
                          <img
                            src={gal.imageUrl}
                            alt={gal.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {gal.isTemporaryImage ? (
                              <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                                Temporary
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                                Official
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-2.5 space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-[#C59B27] block">
                            {gal.categoryLabel || gal.category}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{gal.title}</h5>
                        </div>
                      </div>

                      <div className="p-2.5 pt-0 flex items-center gap-1">
                        <button
                          onClick={() => openImageModal(
                            'gallery',
                            gal.title,
                            gal.imageUrl,
                            gal.imageSourceType || 'licensed_stock',
                            gal.isTemporaryImage ?? true,
                            gal.id
                          )}
                          className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Replace</span>
                        </button>

                        <button
                          onClick={() => DCalabashStore.deleteGalleryItem(gal.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Hospitality Management Overview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated in real-time from active store and database records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowManualBookingModal(true)}
                    className="px-4 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35] flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record Walk-in / Phone Booking</span>
                  </button>
                </div>
              </div>

              {/* KPI Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Total Hotel Bookings
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">
                    {totalHotelBookings}
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium">
                    {pendingHotelBookings} pending approval
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Current In-House Occupancy
                  </div>
                  <div className="text-2xl font-bold text-[#0F3827] font-mono">
                    {checkedInCount} <span className="text-xs font-normal text-slate-500">Rooms</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {upcomingArrivals} expected arrival(s) today
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Today's Dining Tables
                  </div>
                  <div className="text-2xl font-bold text-[#C59B27] font-mono">
                    {todayRestaurantRes}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {totalRestaurantRes} total table reservations
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Recorded Room Revenue
                  </div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">
                    ${totalCalculatedRevenueUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ≈ {DCalabashStore.formatCurrency(totalCalculatedRevenueUsd, 'LRD')}
                  </div>
                </div>
              </div>

              {/* Photo Status Callout in Overview */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Website Media Status</h4>
                    <p className="text-xs text-slate-500">
                      {temporaryImagesCount} temporary illustrative photographs active · {approvedImagesCount} verified official photos.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('media_manager')}
                  className="px-4 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35] shrink-0"
                >
                  Manage &amp; Replace Images
                </button>
              </div>

              {/* Recent Bookings and Dining Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Hotel Bookings */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-slate-900">
                      Recent Hotel Reservations
                    </h4>
                    <button
                      onClick={() => setActiveTab('hotel_bookings')}
                      className="text-xs font-semibold text-[#0F3827] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {bookings.slice(0, 4).map((b) => (
                      <div
                        key={b.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{b.guestFullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{b.bookingReference} · {b.roomCategoryName}</div>
                          <div className="text-[11px] text-slate-600">{b.checkInDate} to {b.checkOutDate} ({b.numberOfNights} nights)</div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="font-bold text-[#0F3827]">${b.totalAmountUsd}</div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              b.status === 'confirmed' || b.status === 'checked_in'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Restaurant Bookings */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-slate-900">
                      Upcoming Dining Reservations
                    </h4>
                    <button
                      onClick={() => setActiveTab('restaurant_res')}
                      className="text-xs font-semibold text-[#0F3827] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {reservations.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{r.guestFullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{r.reservationReference} · {r.partySize} Guests</div>
                          <div className="text-[11px] text-slate-600">{r.reservationDate} at {r.reservationTime} ({r.seatingArea.replace('_', ' ')})</div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="font-semibold text-slate-700 block">
                            {r.tableNumber || 'Table Unassigned'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800">
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOTEL BOOKINGS MANAGEMENT */}
          {activeTab === 'hotel_bookings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Hotel Bookings Management
                </h3>

                <button
                  onClick={() => setShowManualBookingModal(true)}
                  className="px-4 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35] flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Manual Booking</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by reference, guest name, phone, or suite..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Status:</span>
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Guest</th>
                        <th className="py-3 px-4">Suite Category</th>
                        <th className="py-3 px-4">Dates &amp; Nights</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings
                        .filter((b) => {
                          if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
                          if (bookingSearch.trim()) {
                            const q = bookingSearch.toLowerCase();
                            return (
                              b.bookingReference.toLowerCase().includes(q) ||
                              b.guestFullName.toLowerCase().includes(q) ||
                              b.guestPhone.includes(q) ||
                              (b.roomCategoryName && b.roomCategoryName.toLowerCase().includes(q))
                            );
                          }
                          return true;
                        })
                        .map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-mono font-bold text-[#0F3827]">
                              {b.bookingReference}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{b.guestFullName}</div>
                              <div className="text-[11px] text-slate-500">{b.guestPhone}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-700">
                              {b.roomCategoryName}
                              {b.roomsCount > 1 && <span className="text-[10px] text-slate-500"> ({b.roomsCount} rms)</span>}
                            </td>
                            <td className="py-3 px-4 text-slate-700">
                              <div>{b.checkInDate} to {b.checkOutDate}</div>
                              <div className="text-[10px] text-slate-500">{b.numberOfNights} Night(s)</div>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              ${b.totalAmountUsd}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  b.status === 'confirmed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : b.status === 'checked_in'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'checked_out'
                                    ? 'bg-slate-200 text-slate-800'
                                    : b.status === 'cancelled'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[11px] text-slate-600 block">{b.paymentStatus}</span>
                              <span className="text-[10px] text-slate-400">{b.paymentMethod}</span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => DCalabashStore.updateHotelBookingStatus(b.id, 'confirmed')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold"
                                  title="Confirm Reservation"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status === 'confirmed' && (
                                <button
                                  onClick={() => DCalabashStore.updateHotelBookingStatus(b.id, 'checked_in')}
                                  className="px-2 py-1 bg-[#0F3827] hover:bg-[#164E35] text-white rounded text-[10px] font-semibold"
                                  title="Check-in Guest"
                                >
                                  Check In
                                </button>
                              )}
                              {b.status === 'checked_in' && (
                                <button
                                  onClick={() => DCalabashStore.updateHotelBookingStatus(b.id, 'checked_out')}
                                  className="px-2 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-[10px] font-semibold"
                                  title="Check-out Guest"
                                >
                                  Check Out
                                </button>
                              )}
                              {b.status !== 'cancelled' && b.status !== 'checked_out' && (
                                <button
                                  onClick={() => DCalabashStore.updateHotelBookingStatus(b.id, 'cancelled')}
                                  className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-semibold"
                                  title="Cancel Booking"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOM CATEGORIES MANAGEMENT */}
          {activeTab === 'room_categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Room Categories &amp; Pricing Management
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure room inventory, nightly rates in USD/LRD, and review draft status.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategory({
                      id: `cat-${Date.now()}`,
                      name: 'New Suite Category',
                      slug: `suite-${Date.now()}`,
                      tagline: 'Refined comfort and luxury',
                      description: 'Suite description awaiting management entry.',
                      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                      additionalImages: [],
                      maxAdults: 2,
                      maxChildren: 1,
                      bedConfiguration: '1 King Bed',
                      totalRooms: 4,
                      pricePerNightUsd: 110.0,
                      amenities: ['Wi-Fi', 'Air Conditioning', 'Smart TV', 'Private Bathroom'],
                      isActive: true,
                      isDraft: false,
                      imageSourceType: 'licensed_stock',
                      isTemporaryImage: true,
                    });
                  }}
                  className="px-4 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35] flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-16 h-12 object-cover rounded-lg border"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-base text-slate-900">{cat.name}</h4>
                            {cat.isDraft && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                Draft Review
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{cat.tagline}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold font-serif text-[#0F3827]">
                          ${cat.pricePerNightUsd.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ≈ {DCalabashStore.formatCurrency(cat.pricePerNightUsd, 'LRD')}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{cat.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Total Rooms: <strong className="text-slate-900">{cat.totalRooms}</strong></span>
                      <span>Bed: <strong className="text-slate-900">{cat.bedConfiguration}</strong></span>
                      <span>Capacity: <strong className="text-slate-900">{cat.maxAdults} Adults</strong></span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => openImageModal('room', cat.name, cat.imageUrl, cat.imageSourceType || 'licensed_stock', cat.isTemporaryImage ?? true, cat.id)}
                        className="text-xs text-[#0F3827] font-semibold hover:underline flex items-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Suite</span>
                        </button>

                        {roomCategories.length > 1 && (
                          <button
                            onClick={() => DCalabashStore.deleteRoomCategory(cat.id)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RESTAURANT TABLE RESERVATIONS */}
          {activeTab === 'restaurant_res' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Restaurant Table Reservations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage dining bookings, table assignments, and guest seating.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Guest</th>
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">Party Size</th>
                        <th className="py-3 px-4">Seating Area</th>
                        <th className="py-3 px-4">Table</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-[#0F3827]">
                            {r.reservationReference}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{r.guestFullName}</div>
                            <div className="text-[11px] text-slate-500">{r.guestPhone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            <div>{r.reservationDate}</div>
                            <div className="text-[10px] text-slate-500">{r.reservationTime}</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {r.partySize} Guests
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {r.seatingArea.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              defaultValue={r.tableNumber || ''}
                              placeholder="e.g. T4"
                              onBlur={(e) => {
                                DCalabashStore.updateRestaurantReservationStatus(r.id, r.status, e.target.value);
                              }}
                              className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-semibold text-center"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                r.status === 'confirmed' || r.status === 'seated'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'no_show'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            {r.status === 'pending' && (
                              <button
                                onClick={() => DCalabashStore.updateRestaurantReservationStatus(r.id, 'confirmed')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold"
                              >
                                Confirm
                              </button>
                            )}
                            {r.status === 'confirmed' && (
                              <button
                                onClick={() => DCalabashStore.updateRestaurantReservationStatus(r.id, 'seated')}
                                className="px-2 py-1 bg-[#0F3827] hover:bg-[#164E35] text-white rounded text-[10px] font-semibold"
                              >
                                Seat
                              </button>
                            )}
                            {r.status === 'seated' && (
                              <button
                                onClick={() => DCalabashStore.updateRestaurantReservationStatus(r.id, 'completed')}
                                className="px-2 py-1 bg-slate-700 text-white rounded text-[10px] font-semibold"
                              >
                                Complete
                              </button>
                            )}
                            {r.status !== 'cancelled' && (
                              <button
                                onClick={() => DCalabashStore.updateRestaurantReservationStatus(r.id, 'no_show')}
                                className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-[10px] font-semibold"
                              >
                                No Show
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DIGITAL MENU MANAGEMENT */}
          {activeTab === 'menu_manager' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Digital Food Menu Management
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add or update dishes, prices, availability, and draft approval.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingMenuItem({
                      id: `item-${Date.now()}`,
                      categoryId: 'cat-liberian',
                      name: 'New Culinary Dish',
                      description: 'Delicious dish description and seasonings.',
                      priceUsd: 12.0,
                      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
                      imageSourceType: 'licensed_stock',
                      isTemporaryImage: true,
                      isAvailable: true,
                      isFeatured: false,
                      dietaryTags: ['Fresh'],
                      preparationTimeMins: 20,
                      isDraft: false,
                    });
                  }}
                  className="px-4 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35] flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Menu Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border shrink-0"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                            {item.isDraft && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                                Draft Price
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif font-bold text-[#0F3827] text-sm">
                            ${item.priceUsd.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 pt-2">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={(e) => {
                            DCalabashStore.upsertMenuItem({
                              ...item,
                              isAvailable: e.target.checked,
                            });
                          }}
                          className="rounded text-[#0F3827]"
                        />
                        <span>Available</span>
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openImageModal('menu', item.name, item.imageUrl || '', item.imageSourceType || 'licensed_stock', item.isTemporaryImage ?? true, item.id)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Change Dish Image"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingMenuItem(item)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => DCalabashStore.deleteMenuItem(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GUEST ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Guest Enquiries &amp; Messages
              </h3>

              <div className="space-y-3">
                {enquiries.length === 0 ? (
                  <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                    No enquiries submitted yet.
                  </div>
                ) : (
                  enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{enq.name}</h4>
                          <div className="text-xs text-slate-500">{enq.email} · {enq.phone || 'No phone'}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#0F3827]">
                        Subject: {enq.subject}
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        "{enq.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: HOTEL SETTINGS, LOGO & WEBSITE PAGE BUILDER */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-6">
              {/* Top Banner Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#C59B27]" />
                    <span>Hotel Settings, Logo &amp; Website Content</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload official logo, edit public website sections, configure multi-currency rates and operational policies.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerSettingsSuccess('All settings and website page changes have been saved!')}
                    className="px-4 py-2 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              {settingsSaveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="font-bold">{settingsSaveMessage}</strong>
                    <p className="text-[11px] text-emerald-700">Changes are saved in high-capacity storage and reflected live on public pages.</p>
                  </div>
                </div>
              )}

              {/* Sub-Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('logo')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    settingsSubTab === 'logo'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Logo &amp; Brand Identity</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('pages')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    settingsSubTab === 'pages'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Website Pages &amp; Copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('rates')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    settingsSubTab === 'rates'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Rates &amp; Multi-Currency</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('operations')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    settingsSubTab === 'operations'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Hours &amp; Policies</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsSubTab('contact')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    settingsSubTab === 'contact'
                      ? 'bg-[#0F3827] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Contact, Location &amp; Social</span>
                </button>
              </div>

              {/* SUB-TAB 1: LOGO & BRAND IDENTITY */}
              {settingsSubTab === 'logo' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">
                      Hotel Logo &amp; Visual Branding
                    </h4>
                    <p className="text-xs text-slate-500">
                      Upload an official hotel logo file, enter a hosted image URL, or reset to the original default.
                    </p>
                  </div>

                  {/* Dual Background Logo Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Light Background Preview */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Preview on Light (Navigation Bar / Documents)
                      </span>
                      <div className="h-28 w-full flex items-center justify-center p-3 bg-[#FAF8F5] rounded-lg border border-slate-100">
                        <img
                          src={settings.logoUrl || HOTEL_INFO.logoUrl}
                          alt="D'Calabash Hotel Logo"
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Standard Ivory/White Background
                      </span>
                    </div>

                    {/* Dark Background Preview */}
                    <div className="p-4 bg-[#0F3827] text-white rounded-xl border border-[#0F3827] flex flex-col items-center justify-center text-center space-y-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                        Preview on Dark (Footer / Mobile Header)
                      </span>
                      <div className="h-28 w-full flex items-center justify-center p-3 bg-white/10 rounded-lg border border-white/20">
                        <img
                          src={settings.logoUrl || HOTEL_INFO.logoUrl}
                          alt="D'Calabash Hotel Logo"
                          className="max-h-24 max-w-full object-contain bg-white rounded p-1"
                        />
                      </div>
                      <span className="text-[11px] text-white/80 font-medium">
                        Forest Green Brand Tone
                      </span>
                    </div>
                  </div>

                  {/* Logo Status Badge */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Active Logo Source:</span>
                      {(!settings.logoUrl || settings.logoUrl === HOTEL_INFO.logoUrl) ? (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
                          Official D'Calabash Default Logo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                          Custom Uploaded Logo
                        </span>
                      )}
                    </div>

                    {settings.logoUrl && settings.logoUrl !== HOTEL_INFO.logoUrl && (
                      <button
                        type="button"
                        onClick={handleResetLogoToDefault}
                        className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Default Logo</span>
                      </button>
                    )}
                  </div>

                  {/* Action 1: Upload File */}
                  <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-3">
                    <div className="flex items-center gap-2 text-[#0F3827]">
                      <Upload className="w-4 h-4 text-[#C59B27]" />
                      <h5 className="font-bold text-xs uppercase tracking-wider">
                        Upload New Logo File
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600">
                      Select a PNG, SVG, or JPG image file. The image is automatically compressed, cached in persistent browser storage, and uploaded to your cloud storage bucket.
                    </p>

                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F3827] hover:bg-[#164E35] text-white text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{isUploadingLogo ? 'Processing & Optimizing...' : 'Choose Logo File'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleLogoFileUpload}
                        disabled={isUploadingLogo}
                        className="hidden"
                      />
                    </label>

                    {logoNotice && (
                      <p className="text-[11px] font-medium text-emerald-800 pt-1">
                        {logoNotice}
                      </p>
                    )}
                  </div>

                  {/* Action 2: Enter Web URL */}
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Globe className="w-4 h-4 text-[#C59B27]" />
                      <h5 className="font-bold text-xs uppercase tracking-wider">
                        Or Enter Direct Web Image URL
                      </h5>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={logoInputUrl}
                        onChange={(e) => setLogoInputUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyLogoUrl}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>

                  {/* Business Name & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ businessName: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Brand Tagline / Slogan
                      </label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ tagline: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: WEBSITE PAGES & COPY */}
              {settingsSubTab === 'pages' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">
                      Website Pages &amp; Section Copy Editor
                    </h4>
                    <p className="text-xs text-slate-500">
                      Edit text headlines, introductory paragraphs, and background imagery for each section of the public website.
                    </p>
                  </div>

                  {/* Section Selector Pills */}
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setPagesSection('hero')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        pagesSection === 'hero'
                          ? 'bg-white text-[#0F3827] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Homepage &amp; Hero Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => setPagesSection('about')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        pagesSection === 'about'
                          ? 'bg-white text-[#0F3827] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      About Story &amp; Heritage
                    </button>
                    <button
                      type="button"
                      onClick={() => setPagesSection('restaurant')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        pagesSection === 'restaurant'
                          ? 'bg-white text-[#0F3827] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Restaurant &amp; Dining
                    </button>
                  </div>

                  {/* 1. Hero / Homepage */}
                  {pagesSection === 'hero' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Hero Main Headline
                        </label>
                        <input
                          type="text"
                          value={settings.heroHeadline || 'Where Liberian Warmth Meets Modern Comfort'}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ heroHeadline: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Hero Welcoming Subheadline &amp; Intro
                        </label>
                        <textarea
                          rows={3}
                          value={settings.heroSubheadline || ''}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ heroSubheadline: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          placeholder="Welcome to D'Calabash Hotel & Restaurant..."
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Hero Showcase Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={settings.heroImageUrl || ''}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ heroImageUrl: e.target.value });
                            }}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => openImageModal(
                              'banner',
                              'Hero Homepage Banner',
                              settings.heroImageUrl || '',
                              settings.heroImageSourceType || 'licensed_stock',
                              settings.isHeroImageTemporary || false,
                              'hero'
                            )}
                            className="px-3 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      </div>

                      {/* Hero Image Preview */}
                      {settings.heroImageUrl && (
                        <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden border border-slate-200">
                          <img
                            src={settings.heroImageUrl}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                            <p className="text-white text-sm font-serif font-bold">
                              {settings.heroHeadline || 'Where Liberian Warmth Meets Modern Comfort'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. About Story & Heritage */}
                  {pagesSection === 'about' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          About D'Calabash Hotel Story &amp; History
                        </label>
                        <textarea
                          rows={4}
                          value={settings.aboutStory}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ aboutStory: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Mission Statement
                          </label>
                          <textarea
                            rows={3}
                            value={settings.missionStatement}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ missionStatement: e.target.value });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Vision Statement
                          </label>
                          <textarea
                            rows={3}
                            value={settings.visionStatement}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ visionStatement: e.target.value });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          The Calabash Cultural Meaning Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={settings.calabashMeaningText || ''}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ calabashMeaningText: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          placeholder="In Liberian and West African tradition, the calabash is a timeless vessel..."
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          About Section Showcase Image
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={settings.aboutImageUrl || ''}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ aboutImageUrl: e.target.value });
                            }}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => openImageModal(
                              'banner',
                              'About Section Photo',
                              settings.aboutImageUrl || '',
                              settings.aboutImageSourceType || 'licensed_stock',
                              settings.isAboutImageTemporary || false,
                              'about_photo'
                            )}
                            className="px-3 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Restaurant & Dining */}
                  {pagesSection === 'restaurant' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Restaurant Main Headline
                        </label>
                        <input
                          type="text"
                          value={settings.restaurantHeadline || 'Authentic Liberian Flavours & Coastal Grills'}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ restaurantHeadline: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Restaurant Atmosphere &amp; Culinary Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={settings.restaurantDescription || ''}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ restaurantDescription: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          placeholder="At D'Calabash Restaurant & Bar, dining is a celebration..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Breakfast Serving Hours
                          </label>
                          <input
                            type="text"
                            value={settings.breakfastHours || '7:00 AM – 10:30 AM Daily'}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ breakfastHours: e.target.value });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Lunch &amp; Grills Hours
                          </label>
                          <input
                            type="text"
                            value={settings.lunchHours || '12:00 PM – 3:30 PM Fresh Catch'}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ lunchHours: e.target.value });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Dinner &amp; Bar Hours
                          </label>
                          <input
                            type="text"
                            value={settings.dinnerHours || '6:00 PM – Late Veranda Lounge'}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ dinnerHours: e.target.value });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Restaurant Atmosphere Photo URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={settings.restaurantHeroImageUrl || ''}
                            onChange={(e) => {
                              DCalabashStore.updateSettings({ restaurantHeroImageUrl: e.target.value });
                            }}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => openImageModal(
                              'banner',
                              'Restaurant Atmosphere Banner',
                              settings.restaurantHeroImageUrl || '',
                              settings.restaurantHeroImageSourceType || 'licensed_stock',
                              settings.isRestaurantHeroImageTemporary || false,
                              'restaurant_hero'
                            )}
                            className="px-3 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 3: RATES & MULTI-CURRENCY */}
              {settingsSubTab === 'rates' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">
                      Exchange Rates, Taxes &amp; Currency Settings
                    </h4>
                    <p className="text-xs text-slate-500">
                      Configure USD to Liberian Dollar conversion, tax rates, and default currency display.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-amber-950 text-xs">
                        Exchange Rate: 1 USD to Liberian Dollars (LRD)
                      </label>
                      <span className="text-[11px] text-amber-800 font-mono">
                        Active: $1.00 USD = {settings.exchangeRateUsdToLrd} LRD
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                          LRD
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          value={settings.exchangeRateUsdToLrd}
                          onChange={(e) => {
                            DCalabashStore.updateSettings({ exchangeRateUsdToLrd: Number(e.target.value) });
                          }}
                          className="w-full pl-12 pr-3 py-2 border border-amber-300 rounded-lg text-sm font-bold text-[#0F3827] bg-white"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex gap-1">
                        {[190, 195, 200, 205].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => DCalabashStore.updateSettings({ exchangeRateUsdToLrd: rate })}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded border transition-colors ${
                              settings.exchangeRateUsdToLrd === rate
                                ? 'bg-[#0F3827] text-white border-[#0F3827]'
                                : 'bg-white hover:bg-amber-100 text-slate-700 border-amber-200'
                            }`}
                          >
                            {rate}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Live Converter Preview */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-200 text-center font-mono text-[11px]">
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <span className="text-slate-500">$50 USD = </span>
                        <strong className="text-emerald-800">LRD {(50 * settings.exchangeRateUsdToLrd).toLocaleString()}</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <span className="text-slate-500">$100 USD = </span>
                        <strong className="text-emerald-800">LRD {(100 * settings.exchangeRateUsdToLrd).toLocaleString()}</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <span className="text-slate-500">$165 USD = </span>
                        <strong className="text-emerald-800">LRD {(165 * settings.exchangeRateUsdToLrd).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Currency & Tax Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Default Website Currency
                      </label>
                      <select
                        value={settings.defaultCurrency}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ defaultCurrency: e.target.value as any });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option value="USD">United States Dollars (USD $)</option>
                        <option value="LRD">Liberian Dollars (LRD)</option>
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Default currency displayed to guests when visiting the website.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Room Occupancy Tax / VAT Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={settings.taxRatePercent}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ taxRatePercent: Number(e.target.value) });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Applied during room booking total calculation.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Service Charge Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={settings.serviceChargePercent}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ serviceChargePercent: Number(e.target.value) });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Buffet / Gourmet Breakfast Add-on Price ($ USD)
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={settings.breakfastPriceUsd || 15}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ breakfastPriceUsd: Number(e.target.value) });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Standard pricing per guest per morning.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: HOURS & OPERATIONS */}
              {settingsSubTab === 'operations' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">
                      Operational Policies &amp; Reception Hours
                    </h4>
                    <p className="text-xs text-slate-500">
                      Define guest check-in/out schedules and dining opening hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Hotel Check-in Time (24h format)
                      </label>
                      <input
                        type="text"
                        value={settings.hotelCheckInTime}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ hotelCheckInTime: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="14:00"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">e.g. 14:00 (2:00 PM)</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Hotel Check-out Time (24h format)
                      </label>
                      <input
                        type="text"
                        value={settings.hotelCheckOutTime}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ hotelCheckOutTime: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="11:00"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">e.g. 11:00 (11:00 AM)</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Restaurant Opening Time
                      </label>
                      <input
                        type="text"
                        value={settings.restaurantOpenTime}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ restaurantOpenTime: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="07:00"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Restaurant Closing Time
                      </label>
                      <input
                        type="text"
                        value={settings.restaurantCloseTime}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ restaurantCloseTime: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="23:00"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        Online Direct Bookings Status
                      </span>
                      <span className="text-[11px] text-slate-500">
                        When active, guests can book rooms directly through the website.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        DCalabashStore.updateSettings({ isOnlineBookingActive: !settings.isOnlineBookingActive });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        settings.isOnlineBookingActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {settings.isOnlineBookingActive ? 'Active (Accepting)' : 'Paused (Maintenance)'}
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: CONTACT, LOCATION & SOCIAL */}
              {settingsSubTab === 'contact' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">
                      Contact Information, Concierge &amp; Social Links
                    </h4>
                    <p className="text-xs text-slate-500">
                      Keep your front desk numbers, WhatsApp concierge, and address updated across the public website and reservation confirmations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Front Desk Telephone (Public Format)
                      </label>
                      <input
                        type="text"
                        value={settings.telephone}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ telephone: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="+231 77 763 7559"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        WhatsApp Concierge Number (Digits with Country Code)
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ whatsappNumber: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                        placeholder="231777637559"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Used for one-click chat links. Do not include spaces or '+'.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Official Hotel Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ email: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="admin@dcalabashhotel.co"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Physical Hotel Address
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ address: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="Congo Town Back Road, Monrovia, Liberia, 231"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Driving Directions &amp; Landmarks
                      </label>
                      <input
                        type="text"
                        value={settings.directionsText || ''}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ directionsText: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        placeholder="Opposite the serene lagoon waterway, accessible via Tubman Boulevard..."
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Official Facebook Page URL
                      </label>
                      <input
                        type="url"
                        value={settings.facebookUrl}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ facebookUrl: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Official Instagram Profile URL
                      </label>
                      <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => {
                          DCalabashStore.updateSettings({ instagramUrl: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SUPABASE SYNC & CLOUD DEPLOYMENT */}
          {activeTab === 'supabase_sync' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0F3827] text-[#C59B27] flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">
                      Supabase PostgreSQL Connection &amp; Storage Buckets
                    </h3>
                    <p className="text-xs text-slate-500">
                      Connect your production Supabase database or view setup instructions.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">How to connect Supabase &amp; Storage Buckets:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                    <li>Create a project at <strong>supabase.com</strong>.</li>
                    <li>Open <strong>Project Settings → API</strong> to copy your <strong>Project URL</strong> and <strong>anon / public key</strong>.</li>
                    <li>Run the migration file located at <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#0F3827]">supabase/migrations/20261030000000_dcalabash_init.sql</code> in the Supabase SQL Editor.</li>
                    <li>In <strong>Supabase Storage</strong>, create public buckets for: <code className="bg-white px-1 py-0.5 rounded border">hotel-gallery</code>, <code className="bg-white px-1 py-0.5 rounded border">room-images</code>, <code className="bg-white px-1 py-0.5 rounded border">menu-images</code>.</li>
                    <li>Enter the credentials below to sync live reservations directly with PostgreSQL.</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      VITE_SUPABASE_URL
                    </label>
                    <input
                      type="text"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      VITE_SUPABASE_ANON_KEY
                    </label>
                    <input
                      type="password"
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
                        setSupabaseSaveSuccess(true);
                        setTimeout(() => setSupabaseSaveSuccess(false), 3000);
                      }}
                      className="px-5 py-2 bg-[#0F3827] text-white text-xs font-semibold rounded-lg hover:bg-[#164E35]"
                    >
                      Save &amp; Connect
                    </button>

                    <button
                      disabled={isTestingConnection}
                      onClick={async () => {
                        setIsTestingConnection(true);
                        setTestResult(null);
                        const result = await testSupabaseConnection();
                        setTestResult(result);
                        setIsTestingConnection(false);
                      }}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      {isTestingConnection ? 'Testing Connection...' : 'Test Live Connection'}
                    </button>

                    <button
                      disabled={isSyncingData}
                      onClick={async () => {
                        setIsSyncingData(true);
                        setSyncStatusMessage(null);
                        const res = await DCalabashStore.syncCatalogToSupabase();
                        setIsSyncingData(false);
                        if (res.success) {
                          setSyncStatusMessage(`Successfully pushed ${res.count} records (settings, suites, menu dishes) to Supabase PostgreSQL!`);
                        } else {
                          setSyncStatusMessage(`Push note: ${res.error}. Ensure the SQL migration script has been executed in the Supabase SQL Editor.`);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      {isSyncingData ? 'Pushing Data...' : 'Push Local Data to Database'}
                    </button>

                    <button
                      onClick={async () => {
                        const res = await DCalabashStore.fetchFromSupabase();
                        setSyncStatusMessage(res.message);
                      }}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      Fetch from Database
                    </button>

                    {isSupabaseConfigured() && (
                      <button
                        onClick={() => {
                          clearSupabaseConfig();
                          setSupabaseUrlInput('');
                          setSupabaseKeyInput('');
                          setTestResult(null);
                          setSyncStatusMessage(null);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>

                  {supabaseSaveSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Configuration saved successfully! Connected to Supabase.</span>
                    </div>
                  )}

                  {testResult && (
                    <div
                      className={`p-3 text-xs rounded-lg border flex items-start gap-2 ${
                        testResult.connected
                          ? testResult.hasSchema
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-red-50 text-red-900 border-red-200'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          testResult.connected
                            ? testResult.hasSchema
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      />
                      <div>
                        <p className="font-semibold">
                          {testResult.connected
                            ? testResult.hasSchema
                              ? 'Live Database Connection Verified'
                              : 'Connected to Supabase Project (Tables Not Found)'
                            : 'Connection Attempt Unsuccessful'}
                        </p>
                        <p className="text-[11px] mt-0.5">{testResult.message}</p>
                      </div>
                    </div>
                  )}

                  {syncStatusMessage && (
                    <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-lg border border-blue-200">
                      <p className="font-semibold">Sync Status:</p>
                      <p className="text-[11px] mt-0.5">{syncStatusMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* UNIVERSAL IMAGE REPLACEMENT MODAL (Section 5) */}
      {imageModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                  Media Management
                </span>
                <h4 className="font-serif font-bold text-lg text-slate-900">
                  Replace: {imageModalTarget.title}
                </h4>
              </div>
              <button
                onClick={() => setImageModalTarget(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Current Image Preview vs New Preview */}
            <div className="aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden relative border shadow-inner">
              <img
                src={inputImageUrl || imageModalTarget.currentUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                Live Preview
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Option A: File Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <label className="block font-semibold text-slate-900">
                  Option 1: Upload Image File (Local / Phone / Camera)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0F3827] file:text-white hover:file:bg-[#164E35]"
                />
                {isUploadingToStorage && (
                  <p className="text-[11px] text-[#0F3827] font-semibold animate-pulse">
                    Uploading directly to Supabase Storage bucket...
                  </p>
                )}
                {uploadStorageNotice && !isUploadingToStorage && (
                  <p className="text-[11px] text-slate-600 bg-white p-1 rounded border border-slate-200">
                    {uploadStorageNotice}
                  </p>
                )}
              </div>

              {/* Option B: Image URL or Supabase Storage Path */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Option 2: Direct Image URL or Supabase Storage Public Path
                </label>
                <input
                  type="url"
                  value={inputImageUrl}
                  onChange={(e) => setInputImageUrl(e.target.value)}
                  placeholder="https://...supabase.co/storage/v1/object/public/... or https://..."
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              {/* Metadata: Source Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Image Source Classification
                  </label>
                  <select
                    value={inputImageSource}
                    onChange={(e) => setInputImageSource(e.target.value as ImageSourceType)}
                    className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                  >
                    <option value="actual_business_photo">Actual Business Photo (D'Calabash)</option>
                    <option value="licensed_stock">Licensed Hospitality Stock</option>
                    <option value="ai_generated">AI Generated / Rendered</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Verification Status
                  </label>
                  <div className="pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!inputIsTemporary}
                        onChange={(e) => setInputIsTemporary(!e.target.checked)}
                        className="rounded text-[#0F3827]"
                      />
                      <span className="font-semibold text-emerald-800">Verified Official Asset</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImageModalTarget(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveImageReplacement}
                  className="px-5 py-2 bg-[#0F3827] text-white font-semibold rounded-lg hover:bg-[#164E35]"
                >
                  Save &amp; Apply Immediately
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-lg text-slate-900">
                Create Manual Reservation
              </h4>
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {manualError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200">
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  value={manualGuestName}
                  onChange={(e) => setManualGuestName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Telephone *</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Booking Source</label>
                  <select
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="whatsapp">WhatsApp Inquiry</option>
                    <option value="phone">Telephone Call</option>
                    <option value="walk_in">Walk-in Reception</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Check-in</label>
                  <input
                    type="date"
                    value={manualInDate}
                    onChange={(e) => setManualInDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Check-out</label>
                  <input
                    type="date"
                    value={manualOutDate}
                    onChange={(e) => setManualOutDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Suite Category</label>
                <select
                  value={manualCategoryId}
                  onChange={(e) => setManualCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {roomCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.pricePerNightUsd}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualBookingModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F3827] text-white font-semibold rounded-lg hover:bg-[#164E35]"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-serif font-bold text-lg text-slate-900">
              Edit Room Category
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Room Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Nightly Price ($ USD)</label>
                  <input
                    type="number"
                    value={editingCategory.pricePerNightUsd}
                    onChange={(e) => setEditingCategory({ ...editingCategory, pricePerNightUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Rooms</label>
                  <input
                    type="number"
                    value={editingCategory.totalRooms}
                    onChange={(e) => setEditingCategory({ ...editingCategory, totalRooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Photo URL</label>
                <input
                  type="text"
                  value={editingCategory.imageUrl}
                  onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!editingCategory.isDraft}
                  onChange={(e) => setEditingCategory({ ...editingCategory, isDraft: !e.target.checked })}
                />
                <span>Approve from Draft to Published</span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    DCalabashStore.upsertRoomCategory(editingCategory);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 bg-[#0F3827] text-white font-semibold rounded-lg hover:bg-[#164E35]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-serif font-bold text-lg text-slate-900">
              Edit Menu Dish
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingMenuItem.name}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingMenuItem.priceUsd}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, priceUsd: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Photo URL</label>
                <input
                  type="text"
                  value={editingMenuItem.imageUrl || ''}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingMenuItem.description}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isAvailable}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isAvailable: e.target.checked })}
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isFeatured}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isFeatured: e.target.checked })}
                  />
                  <span>Chef's Special</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    DCalabashStore.upsertMenuItem(editingMenuItem);
                    setEditingMenuItem(null);
                  }}
                  className="px-4 py-2 bg-[#0F3827] text-white font-semibold rounded-lg hover:bg-[#164E35]"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
