import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { Listing } from '../types';
import { 
  Search, SlidersHorizontal, Star, Heart, 
  ChevronLeft, ChevronRight, Waves, Home, TreePine, 
  Award, Flame, Sparkles, Building, Trees, MapPin,
  Warehouse, Store, Map, Car, Factory, Tent,
  Camera, ChefHat, Dumbbell, Scissors, Bath, Thermometer,
  X, ArrowLeft, ArrowRight, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom high-fidelity vector icons matching mockup screenshots
const HouseCustomIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="skyCircle" x1="60" y1="10" x2="60" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.0" />
      </linearGradient>
      <linearGradient id="modernRoof" x1="30" y1="28" x2="100" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="modernWalls" x1="40" y1="58" x2="90" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="glowWindow" x1="45" y1="62" x2="60" y2="82" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="modernDoor" x1="72" y1="68" x2="84" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#9a3412" />
      </linearGradient>
      <linearGradient id="gardenBush" x1="20" y1="75" x2="50" y2="95" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#166534" />
      </linearGradient>
    </defs>
    
    {/* Soft backdrop sun glow ring */}
    <circle cx="60" cy="55" r="42" fill="url(#skyCircle)" />
    
    {/* Floor ground oval */}
    <ellipse cx="60" cy="95" rx="46" ry="6.5" fill="#e2e8f0" />
    <ellipse cx="60" cy="94" rx="38" ry="4" fill="#cbd5e1" />

    {/* Beautiful background forest pine tree silhouette */}
    <path d="M 86 44 L 92 56 L 80 56 Z" fill="#1e293b" opacity="0.12" />
    <path d="M 84 50 L 92 66 L 76 66 Z" fill="#1e293b" opacity="0.12" />
    <path d="M 80 56 L 90 76 L 70 76 Z" fill="#1e293b" opacity="0.15" />
    <line x1="80" y1="72" x2="80" y2="94" stroke="#1e293b" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />

    {/* Luxurious Cabin / Architectural Base */}
    <rect x="36" y="32" width="9" height="30" rx="1.5" fill="#64748b" stroke="#0f172a" strokeWidth="2.5" />
    <rect x="34" y="28" width="13" height="4" rx="1" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
    <circle cx="40" cy="20" r="3" fill="#94a3b8" opacity="0.4" />
    <circle cx="43" cy="14" r="4" fill="#94a3b8" opacity="0.25" />

    {/* Main House Wall Body */}
    <rect x="42" y="52" width="46" height="40" rx="4" fill="url(#modernWalls)" stroke="#0f172a" strokeWidth="2.5" />

    {/* Premium wood panel claddings on the right to look extremely designer */}
    <g opacity="0.85">
      <line x1="45" y1="58" x2="85" y2="58" stroke="#d97706" strokeWidth="1.5" />
      <line x1="45" y1="62" x2="85" y2="62" stroke="#d97706" strokeWidth="1.5" />
      <line x1="45" y1="66" x2="85" y2="66" stroke="#d97706" strokeWidth="1.5" />
    </g>

    {/* Big Gorgeous Modern Glass Grid Window with glowing interior light */}
    <rect x="48" y="58" width="20" height="24" rx="2.5" fill="url(#glowWindow)" stroke="#0f172a" strokeWidth="2.2" />
    <line x1="58" y1="58" x2="58" y2="82" stroke="#0f172a" strokeWidth="1.5" />
    <line x1="48" y1="70" x2="68" y2="70" stroke="#0f172a" strokeWidth="1.5" />
    <path d="M 48 58 Q 54 66 54 74 L 48 74 Z" fill="#ffffff" opacity="0.6" />
    <path d="M 68 58 Q 62 66 62 74 L 68 74 Z" fill="#ffffff" opacity="0.6" />

    {/* Designer Orange Door */}
    <rect x="71" y="67" width="12" height="25" rx="1.5" fill="url(#modernDoor)" stroke="#0f172a" strokeWidth="2.2" />
    <circle cx="75" cy="80" r="1.2" fill="#fbbf24" stroke="#0f172a" strokeWidth="0.8" />
    <circle cx="77" cy="62" r="2.5" fill="#fef08a" />
    <path d="M 74 64 L 80 64" stroke="#0f172a" strokeWidth="1.2" />

    {/* Elegant Overhanging Sloped Roof */}
    <path
      d="M34 54 C34 54, 58 24, 60 22 C62 20, 65 20, 67 22 L94 48 C96 50, 96 53, 94 55"
      stroke="#0f172a"
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M35 52 L62 23 C64 21, 67 21, 69 23 L96 49 C98 51, 98 54, 96 56 Z"
      fill="url(#modernRoof)"
      stroke="#0f172a"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />

    {/* Cute Round Attic Star Window */}
    <circle cx="65.5" cy="38" r="6" fill="#fef08a" stroke="#0f172a" strokeWidth="2" />
    <line x1="65.5" y1="32" x2="65.5" y2="44" stroke="#0f172a" strokeWidth="1" />
    <line x1="59.5" y1="38" x2="71.5" y2="38" stroke="#0f172a" strokeWidth="1" />

    {/* Detailed garden landscaping & bushes */}
    <path
      d="M 24 92 C 24 82, 33 80, 36 84 C 39 80, 46 82, 47 88 C 47 92, 24 92, 24 92 Z"
      fill="url(#gardenBush)"
      stroke="#0f172a"
      strokeWidth="2.2"
    />
    <circle cx="28" cy="81" r="1.5" fill="#f43f5e" />
    <line x1="28" y1="81" x2="28" y2="84" stroke="#166534" strokeWidth="1" />
    <circle cx="33" cy="79" r="1.5" fill="#f43f5e" />
    <line x1="33" y1="79" x2="33" y2="83" stroke="#166534" strokeWidth="1" />
    <circle cx="43" cy="81" r="1.5" fill="#f59e0b" />
    <line x1="43" y1="81" x2="43" y2="85" stroke="#166534" strokeWidth="1" />
  </svg>
);

const HotAirBalloonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="skyCircleBalloon" x1="60" y1="10" x2="60" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
      </linearGradient>
      <linearGradient id="balloonPink" x1="32" y1="18" x2="88" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ff7e79" />
        <stop offset="50%" stopColor="#ff4b5c" />
        <stop offset="100%" stopColor="#d80027" />
      </linearGradient>
      <linearGradient id="balloonStripeYellow" x1="42" y1="20" x2="78" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="65%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="balloonStripeTurquoise" x1="50" y1="20" x2="70" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a5f3fc" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
      <linearGradient id="basketGrad" x1="52" y1="82" x2="68" y2="94" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>

    {/* Soft sky ring background */}
    <circle cx="60" cy="55" r="42" fill="url(#skyCircleBalloon)" />

    {/* Floor ground / Cloud base */}
    <ellipse cx="60" cy="100" rx="20" ry="4" fill="#cbd5e1" opacity="0.4" />

    {/* Twinkling mini stars/magic around */}
    <path d="M 28 35 L 30 38 L 33 35 L 30 32 Z" fill="#fbbf24" opacity="0.8" />
    <path d="M 94 28 L 95.5 31 L 98 28 L 95.5 25 Z" fill="#f59e0b" opacity="0.75" />
    <circle cx="24" cy="46" r="1.5" fill="#f59e0b" opacity="0.6" />
    <circle cx="92" cy="48" r="2" fill="#38bdf8" opacity="0.7" />

    {/* Wicker basket with detailed weaving lines */}
    <rect x="52" y="82" width="16" height="12" rx="2.5" fill="url(#basketGrad)" stroke="#0f172a" strokeWidth="2.5" />
    <line x1="56" y1="82" x2="56" y2="94" stroke="#0f172a" strokeWidth="1" />
    <line x1="64" y1="82" x2="64" y2="94" stroke="#0f172a" strokeWidth="1" />
    <line x1="52" y1="88" x2="68" y2="88" stroke="#0f172a" strokeWidth="1" />

    {/* Burner flame on top of the basket */}
    <path d="M 57 82 Q 60 76 63 82 Z" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />

    {/* Rigging cables connecting basket to balloon */}
    <line x1="54" y1="67" x2="54" y2="82" stroke="#0f172a" strokeWidth="1.8" />
    <line x1="66" y1="67" x2="66" y2="82" stroke="#0f172a" strokeWidth="1.8" />
    <line x1="50" y1="67" x2="53" y2="82" stroke="#0f172a" strokeWidth="1.2" />
    <line x1="70" y1="67" x2="67" y2="82" stroke="#0f172a" strokeWidth="1.2" />

    {/* Balloon envelope structure with rich color waves */}
    <g>
      {/* Outer Envelope */}
      <path
        d="M32 44 C32 18, 88 18, 88 44 C88 59, 72 67, 66 67 L54 67 C48 67, 32 59, 32 44 Z"
        fill="url(#balloonPink)"
        stroke="#0f172a"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      
      {/* Outer Stripe layer 1: Yellow/Orange panels */}
      <path
        d="M42.5 32 C51.5 24, 68.5 24, 77.5 32 C75.5 52, 70.5 65, 66 67 L54 67 C49.5 65, 44.5 52, 42.5 32 Z"
        fill="url(#balloonStripeYellow)"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Center Stripe layer 2: Turquoise / Blue panel */}
      <path
        d="M49.5 26 C54.5 21, 65.5 21, 70.5 26 C68.5 51, 65.5 65, 63 67 L57 67 C54.5 65, 51.5 51, 49.5 26 Z"
        fill="url(#balloonStripeTurquoise)"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Vertical contour highlight lines for 3D realism */}
      <path d="M 60 18 L 60 67" stroke="#0f172a" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
    </g>

    {/* Elegant vector clouds drifting in front & behind balloon */}
    <path
      d="M 18 64 C 18 56, 26 54, 29 58 C 32 54, 38 56, 38 62 C 38 66, 18 66, 18 64 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth="2"
      opacity="0.9"
    />
    <path
      d="M 76 74 C 76 66, 85 64, 89 68 C 93 64, 100 66, 100 72 C 100 78, 76 78, 76 74 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth="2.2"
    />
    <path
      d="M 81 74 C 81 71, 84 70, 86 72"
      stroke="#0f172a"
      strokeWidth="1.5"
    />
  </svg>
);

const ServiceBellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="skyCircleBell" x1="60" y1="10" x2="60" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
      </linearGradient>
      <linearGradient id="bellGoldDome" x1="32" y1="42" x2="88" y2="73" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="20%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="80%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="bellDarkBase" x1="25" y1="73" x2="95" y2="86" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="goldButton" x1="54" y1="38" x2="66" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>

    {/* Soft sky ring background */}
    <circle cx="60" cy="55" r="42" fill="url(#skyCircleBell)" />

    {/* Base floor reflection */}
    <ellipse cx="60" cy="94" rx="38" ry="4.5" fill="#cbd5e1" opacity="0.6" />

    {/* Twinkly service stars */}
    <g>
      <path d="M 23 48 L 25 51 L 28 48 L 25 45 Z" fill="#fbbf24" opacity="0.8" />
      <path d="M 97 38 L 99 41 L 102 38 L 99 35 Z" fill="#ea580c" opacity="0.75" />
      <circle cx="28" cy="33" r="1.5" fill="#fbbf24" opacity="0.7" />
      <circle cx="90" cy="55" r="2.2" fill="#fbbf24" opacity="0.85" />
    </g>

    {/* Glossy Black Base */}
    <path
      d="M26 73 L94 73 C97.5 73, 98.5 75.5, 96.5 78 L90 84 C88 86, 82.5 86.5, 80.5 86.5 L39.5 86.5 C37.5 86.5, 32 86, 30 84 L23.5 78 C21.5 75.5, 22.5 73, 26 73 Z"
      fill="url(#bellDarkBase)"
      stroke="#0f172a"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    
    <path d="M 30 82 L 90 82" stroke="#475569" strokeWidth="1.2" opacity="0.5" />

    {/* Metallic Mirror Golden Dome */}
    <path
      d="M32 73 C31.5 41, 88.5 41, 88 73 Z"
      fill="url(#bellGoldDome)"
      stroke="#0f172a"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />

    {/* Beautiful Mirror Reflection Highlight Flare */}
    <path
      d="M39 64 C41 49, 60 45, 66 45"
      stroke="#ffffff"
      strokeWidth="3.2"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path
      d="M44 67 C45 56, 54 53, 58 53"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />

    {/* Brass golden separation plate between base and dome */}
    <rect x="33" y="70" width="54" height="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.2" />

    {/* STEM & PLUNGER BUTTON PIN ON TOP */}
    <rect x="56.5" y="44" width="7" height="6.5" fill="#475569" stroke="#0f172a" strokeWidth="2.2" />
    <path d="M 55 48 H 65" stroke="#0f172a" strokeWidth="1.5" />

    <ellipse cx="60" cy="40.5" rx="9.5" ry="4" fill="url(#goldButton)" stroke="#0f172a" strokeWidth="2.2" />
    <ellipse cx="58" cy="39" rx="3.5" ry="1" fill="#ffffff" opacity="0.8" />
  </svg>
);

// Unified categories
const categoryMap: Record<string, { tKey: string; icon: React.ReactNode }> = {
  trending: { tKey: 'trending', icon: <Flame className="w-5 h-5 text-rose-500" /> },
  recently_listed: { tKey: 'recently_listed', icon: <Sparkles className="w-5 h-5 text-rose-500" /> },
  algiers_hotels: { tKey: 'algiers_hotels', icon: <Building className="w-5 h-5 text-rose-500" /> },
  summer_houses: { tKey: 'summer_houses', icon: <Home className="w-5 h-5 text-rose-500" /> },
  chalets: { tKey: 'chalets', icon: <TreePine className="w-5 h-5 text-rose-500" /> },
  pools: { tKey: 'pools', icon: <Waves className="w-5 h-5 text-rose-500" /> },
  wedding_halls: { tKey: 'wedding_halls', icon: <Award className="w-5 h-5 text-rose-500" /> },
  farms: { tKey: 'farms', icon: <Trees className="w-5 h-5 text-rose-500" /> },
  warehouses: { tKey: 'warehouses', icon: <Warehouse className="w-5 h-5 text-rose-500" /> },
  shops: { tKey: 'shops', icon: <Store className="w-5 h-5 text-rose-500" /> },
  lands: { tKey: 'lands', icon: <Map className="w-5 h-5 text-rose-500" /> },
  parking: { tKey: 'parking', icon: <Car className="w-5 h-5 text-rose-500" /> },
  factories: { tKey: 'factories', icon: <Factory className="w-5 h-5 text-rose-500" /> },
  sahara: { tKey: 'sahara', icon: <Tent className="w-5 h-5 text-rose-500" /> },
  photography: { tKey: 'photography', icon: <Camera className="w-5 h-5 text-rose-500" /> },
  private_chef: { tKey: 'private_chef', icon: <ChefHat className="w-5 h-5 text-rose-500" /> },
  gym: { tKey: 'gym', icon: <Dumbbell className="w-5 h-5 text-rose-500" /> },
  womens_hair: { tKey: 'womens_hair', icon: <Scissors className="w-5 h-5 text-rose-500" /> },
  traditional_hammam: { tKey: 'traditional_hammam', icon: <Bath className="w-5 h-5 text-rose-500" /> },
  sauna: { tKey: 'sauna', icon: <Thermometer className="w-5 h-5 text-rose-500" /> },
};

const ALGERIAN_WILAYAS = [
  { id: 'All', ar: 'كل الولايات', fr: 'Toutes les Wilayas', en: 'All Provinces' },
  { id: 'Alger', ar: 'الجزائر العاصمة', fr: 'Alger', en: 'Algiers' },
  { id: 'Oran', ar: 'وهران', fr: 'Oran', en: 'Oran' },
  { id: 'Jijel', ar: 'جيجل', fr: 'Jijel', en: 'Jijel' },
  { id: 'Ghardaia', ar: 'غرداية', fr: 'Ghardaïa', en: 'Ghardaia' },
  { id: 'Tipaza', ar: 'تيبازة', fr: 'Tipaza', en: 'Tipaza' },
  { id: 'Blida', ar: 'البليدة', fr: 'Blida', en: 'Blida' },
  { id: 'Bouira', ar: 'البويرة', fr: 'Bouira', en: 'Bouira' },
];

export const ExploreTab: React.FC = () => {
  const { listings, favorites, toggleFavorite, setSelectedListing, searchTerm, setSearchTerm, selectedWilaya, setSelectedWilaya } = useApp();
  const { t, language } = useLanguage();

  const [inputSearch, setInputSearch] = useState('');
  const [guestCountFilter, setGuestCountFilter] = useState<number | 'Any'>('Any');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(60000);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'homes' | 'experiences' | 'services'>('homes');
  const [isLoading, setIsLoading] = useState(false);

  // Custom 3-step interactive search overlay states
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchStep, setSearchStep] = useState<1 | 2 | 3>(1);
  const [searchOverlayTab, setSearchOverlayTab] = useState<'homes' | 'experiences' | 'services'>('homes');
  const [selectedLoc, setSelectedLoc] = useState('');
  const [selectedCheckIn, setSelectedCheckIn] = useState<number | null>(19);
  const [selectedCheckOut, setSelectedCheckOut] = useState<number | null>(25);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // Scroll threshold detection to switch between rich 3D icon and compact text modes
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategoryForAll, setSelectedCategoryForAll] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once at start to check initial value
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Randomly select 3 services from the services categories
  const randomServices = React.useMemo(() => {
    const serviceCategories = ['photography', 'private_chef', 'gym', 'womens_hair', 'traditional_hammam', 'sauna'];
    let filtered = listings.filter(item => serviceCategories.includes(item.category));
    
    // Mix or shuffle them randomly
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [listings]);

  // References to slider items for smooth manual clicking controls
  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const triggerSkeletonRefresh = (action: () => void) => {
    setIsLoading(true);
    action();
    setTimeout(() => {
      setIsLoading(false);
    }, 550);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSkeletonRefresh(() => {
      setSearchTerm(inputSearch);
      setIsSearchExpanded(false);
    });
  };

  const handleWilayaChange = (wilId: string) => {
    triggerSkeletonRefresh(() => setSelectedWilaya(wilId));
  };

  const handleGuestsChange = (val: string) => {
    triggerSkeletonRefresh(() => {
      setGuestCountFilter(val === 'Any' ? 'Any' : parseInt(val));
    });
  };

  const handlePriceChange = (val: number) => {
    triggerSkeletonRefresh(() => {
      setMaxPriceFilter(val);
    });
  };

  // Scroll individual row ref
  const scrollRow = (catId: string, direction: 'left' | 'right') => {
    const slider = sliderRefs.current[catId];
    if (slider) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getFilteredListings = (categoryName: string) => {
    return listings.filter((item) => {
      if (item.category !== categoryName) return false;
      if (selectedWilaya !== 'All' && item.wilaya !== selectedWilaya) return false;
      if (searchTerm) {
        const text = searchTerm.toLowerCase();
        const titleMatch = item.title[language]?.toLowerCase().includes(text);
        const locMatch = item.location[language]?.toLowerCase().includes(text);
        const wilMatch = item.wilaya.toLowerCase().includes(text);
        if (!titleMatch && !locMatch && !wilMatch) return false;
      }
      if (guestCountFilter !== 'Any' && item.guests < guestCountFilter) return false;
      if (item.pricePerNight > maxPriceFilter) return false;
      return true;
    });
  };

  // Categories partition based on Top Navigation tabs
  const getCategoriesForMainTab = () => {
    switch (activeMainTab) {
      case 'homes':
        return [
          'recently_listed',
          'trending',
          'sahara',
          'algiers_hotels',
          'summer_houses',
          'chalets',
          'pools',
          'wedding_halls'
        ];
      case 'experiences':
        return ['pools', 'sahara'];
      case 'services':
        return [
          'photography',
          'private_chef',
          'gym',
          'womens_hair',
          'traditional_hammam',
          'sauna'
        ];
      default:
        return [
          'recently_listed',
          'trending',
          'sahara',
          'algiers_hotels',
          'summer_houses',
          'chalets',
          'pools',
          'wedding_halls'
        ];
    }
  };

  // Header texts based on tab
  const getSubTitleForCategory = (catId: string) => {
    const subtitles: Record<string, Record<string, string>> = {
      recently_listed: {
        ar: 'أحدث العقارات والبيوت التي انضمت إلينا حديثاً في الجزائر',
        fr: 'Les biens et maisons les plus récents ajoutés en Algérie',
        en: 'The newest properties and homes recently listed in Algeria',
        kab: 'Ixxamen imaynuten i d-nerna deg Lezzayer'
      },
      sahara: {
        ar: 'اكتشف سحر الواحات ومخيمات الجنوب الرملية الفاخرة',
        fr: 'Découvrez la magie des oasis et des bivouacs luxueux du Sud',
        en: 'Discover the magic of oases and premium luxury camps in the Great South',
        kab: 'Taznerruft tameqrant n wenẓul d isansayen-is'
      },
      summer_houses: {
        ar: 'شاليهات صيفية وشقق مطلة على البحر للاستمتاع بالعطلة الممتعة',
        fr: 'Chalets d’été et appartements en bord de mer pour des vacances mémorables',
        en: 'Summer cottages and beachfront apartments for memorable holidays',
        kab: 'Ixxamen n unebdu radd rran lebḥer'
      },
      chalets: {
        ar: 'أكواخ خشبية وشاليهات دافئة في أعالي جبال جرجرة وتيكجدا والشريعة',
        fr: 'Chalets en bois et cabanes douillettes sur les hauteurs du Djurdjura et Chréa',
        en: 'Wooden cabins and cozy chalets in the heights of Djurdjura and Chrea',
        kab: 'Ixxamen n wedrar d sbeḥ d wegris'
      },
      pools: {
        ar: 'فلل فاخرة مجهزة بمسابح خاصة للراحة والاسترخاء التام للعائلات',
        fr: 'Villas de luxe équipées de piscines privées pour une détente totale en famille',
        en: 'Luxury villas with private swimming pools for ultimate family relaxation',
        kab: 'Ixxamen s yimsirigen n waman d liser'
      },
      wedding_halls: {
        ar: 'أرقى قاعات الحفلات ومساحات المناسبات السعيدة والأفراح بالمدن',
        fr: 'Les plus belles salles des fêtes et espaces de banquet pour vos mariages',
        en: 'Premium celebration venues and grand halls for your weddings and events',
        kab: 'Tixamin n tmeghriwin tameqrant'
      },
      find_services_mid: {
        ar: 'تصفح باقة مختارة من أرقى الخدمات المحلية المتاحة للحجز الآن',
        fr: 'Explorez une sélection exclusive de services locaux d’excellence',
        en: 'Explore a premium curated selection of expert local services',
        kab: 'Service-at'
      },
      algiers_hotels: {
        ar: 'مجموعة من الفنادق المستقلة والمختارة بعناية في الجزائر العاصمة',
        fr: 'Sélection d’hôtels indépendants soigneusement choisis à Alger',
        en: 'Carefully chosen independent boutique hotels in Algiers',
        kab: 'Hotels n Lezzayer'
      },
      trending: {
        ar: 'العقارات المفضلة والأعلى تقييماً في الجزائر خلال هذا الأسبوع',
        fr: 'Les propriétés coups de cœur les plus cotées de la semaine',
        en: 'The highest-rated and guest favorite properties this week',
        kab: 'Axxam n liser'
      },
      photography: {
        ar: 'مصورون محليون ومحترفون لتغطية حفلاتكم ومناسباتكم الخاصة',
        fr: 'Photographes et vidéastes professionnels pour vos mariages et fêtes',
        en: 'Professional local photographers for weddings and events',
        kab: 'Photography'
      },
      private_chef: {
        ar: 'طهاة محترفون لتجربة طعام فاخرة في بيوتكم أو مناسباتكم',
        fr: 'Chefs professionnels pour une expérience gastronomique à domicile',
        en: 'Catering and professional private chefs for luxury dining',
        kab: 'Chef Privé'
      },
      gym: {
        ar: 'حصص تدريبية وصالات مجهزة بأحدث آلات اللياقة البدنية',
        fr: 'Cours de fitness et salles équipées d’appareils modernes',
        en: 'Fitness training sessions and gym halls with modern equipment',
        kab: 'Gym'
      },
      womens_hair: {
        ar: 'صالونات حلاقة وتزيين نسائية خبيرة لتألقك في كل الأوقات',
        fr: 'Salons de coiffure et de beauté professionnels pour femmes',
        en: 'Expert salons for haircuts and women styling on occasions',
        kab: 'Hair Salon'
      },
      traditional_hammam: {
        ar: 'استمتع بحمام بخار تقليدي جزائري للاسترخاء وإزالة السموم',
        fr: 'Profitez d’un bain maure traditionnel algérien pour vous relaxer',
        en: 'Enjoy a traditional Algerian steam hammam ritual to detoxify',
        kab: 'Hammam'
      },
      sauna: {
        ar: 'جلسات سونا استرخائية وغرف بخار لتجديد الطاقة والنشاط',
        fr: 'Séances de sauna relaxant et hammams pour retrouver votre énergie',
        en: 'Relaxing dry sauna sessions and steam baths to fully recharge',
        kab: 'Sauna'
      }
    };

    if (subtitles[catId]) {
      return subtitles[catId][language] || subtitles[catId]['ar'];
    }
    return '';
  };

  const SkeletonShelfLoader = () => (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="min-w-[210px] max-w-[230px] bg-white rounded-3xl p-3 border border-zinc-100 space-y-3 shadow-xs"
        >
          <div className="aspect-[4/3] rounded-2xl skeleton-shimmer w-full" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-1/3 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-10 rounded-lg skeleton-shimmer" />
            </div>
            <div className="h-4.5 w-5/6 rounded-lg skeleton-shimmer" />
            <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );

  const categoriesToShow = getCategoriesForMainTab();

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-0 pb-6 space-y-5 bg-white text-zinc-900 animate-fade-in" id="explore-tab-container" dir="rtl">
      
      {/* 1. SEAMLESS CLEAN WHITE TOP NAVBAR WITH EMBEDDED SEARCH PILL (STICKY COLLAPSIBLE) */}
      <div className="sticky top-0 z-40 bg-white/98 backdrop-blur-md pt-3 pb-2 border-b border-zinc-100/70 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-all duration-300">
        <div className="space-y-3">
          
          {/* Precise Mockup Search Pill Box */}
          <div className="relative cursor-pointer" onClick={() => { setIsSearchOverlayOpen(true); setSearchStep(1); }}>
            <div className="relative w-full bg-[#f4f4f4] hover:bg-[#eaeaea] border border-transparent transition-all rounded-full h-11 flex items-center justify-center gap-2 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <Search className="w-4 h-4 text-zinc-800 shrink-0 animate-pulse" />
              <span className="text-[12.5px] font-[800] text-zinc-800 text-right">
                {searchTerm || "بدء البحث"}
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                  className="absolute left-4 text-[10px] font-black text-zinc-400 hover:text-zinc-650 transition"
                  title="مسح"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Top category/tab filter: "البيوت" - "تجارب السفر" - "الخدمات" matching mockup style with thick black bottom line */}
          <div className={`flex justify-center items-end gap-x-12 max-w-sm mx-auto transition-all duration-300 ${isScrolled ? 'pt-1 h-8' : 'pt-2 h-20'}`}>
            
            {/* HOMES TAB */}
            <button
              onClick={() => {
                setActiveMainTab('homes');
                setSelectedCategoryForAll(null);
              }}
              className={`pb-1.5 text-[11px] relative transition-all duration-300 cursor-pointer flex flex-col items-center justify-end h-full ${
                activeMainTab === 'homes' 
                  ? 'text-zinc-900 font-extrabold' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              id="top-tab-homes"
            >
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1 w-13 h-13 flex items-center justify-center shrink-0"
                  >
                    <HouseCustomIcon className="w-12 h-12" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={`transition-all duration-300 ${isScrolled ? 'text-[11.5px] font-extrabold' : 'text-[11px] font-[800]'}`}>
                البيوت
              </span>
              {activeMainTab === 'homes' && (
                <motion.div 
                  layoutId="mainTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-950 rounded-full" 
                />
              )}
            </button>

            {/* EXPERIENCES TAB */}
            <button
              onClick={() => {
                setActiveMainTab('experiences');
                setSelectedCategoryForAll(null);
              }}
              className={`pb-1.5 text-[11px] relative transition-all duration-300 cursor-pointer flex flex-col items-center justify-end h-full ${
                activeMainTab === 'experiences' 
                  ? 'text-zinc-900 font-extrabold' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              id="top-tab-experiences"
            >
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1 w-13 h-13 flex items-center justify-center shrink-0 relative"
                  >
                    {/* Badge "جديد" display on the top-left of hot air balloon */}
                    <div className="absolute top-1 -left-4 z-10 bg-[#2b4c7e] text-white px-2 py-0.5 rounded-md text-[7px] font-black leading-none shadow-[0_2px_4px_rgba(0,0,0,0.15)] select-none">
                      جديد
                    </div>
                    <HotAirBalloonIcon className="w-12 h-12" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={`transition-all duration-300 ${isScrolled ? 'text-[11.5px] font-extrabold' : 'text-[11px] font-[800]'}`}>
                تجارب السفر
              </span>
              {activeMainTab === 'experiences' && (
                <motion.div 
                  layoutId="mainTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-950 rounded-full" 
                />
              )}
            </button>

            {/* SERVICES TAB */}
            <button
              onClick={() => {
                setActiveMainTab('services');
                setSelectedCategoryForAll(null);
              }}
              className={`pb-1.5 text-[11px] relative transition-all duration-300 cursor-pointer flex flex-col items-center justify-end h-full ${
                activeMainTab === 'services' 
                  ? 'text-zinc-900 font-extrabold' 
                  : 'text-zinc-400 hover:text-zinc-650'
              }`}
              id="top-tab-services"
            >
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1 w-13 h-13 flex items-center justify-center shrink-0 relative"
                  >
                    {/* Badge "جديد" display on the top-left of the service bell */}
                    <div className="absolute top-1 -left-4 z-10 bg-[#2b4c7e] text-white px-2 py-0.5 rounded-md text-[7px] font-black leading-none shadow-[0_2px_4px_rgba(0,0,0,0.15)] select-none">
                      جديد
                    </div>
                    <ServiceBellIcon className="w-12 h-12" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={`transition-all duration-300 ${isScrolled ? 'text-[11.5px] font-extrabold' : 'text-[11px] font-[800]'}`}>
                الخدمات
              </span>
              {activeMainTab === 'services' && (
                <motion.div 
                  layoutId="mainTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-950 rounded-full" 
                />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* 2. DYNAMIC SLIDING SEGMENTS WITH PRECISE REAL ARROW NAVIGATION OR DEDICATED CATEGORY FULL PAGES */}
      <div className="space-y-8 mt-3">
        {selectedCategoryForAll ? (
          <div className="space-y-6 animate-fade-in" dir="rtl">
            {/* Beautiful Custom Styled Category Header & Navigation Bar */}
            <div className="bg-gradient-to-br from-zinc-50 to-zinc-100/60 p-5 rounded-[2.2rem] border border-zinc-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Back to Home Button */}
                <button
                  onClick={() => setSelectedCategoryForAll(null)}
                  className="bg-white hover:bg-zinc-100 text-zinc-800 p-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-xs border border-zinc-250/70 mt-1"
                  title="الرجوع للرئيسية"
                >
                  {language === 'ar' ? (
                    <ChevronRight className="w-5 h-5 text-zinc-800 stroke-[3]" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-zinc-800 stroke-[3]" />
                  )}
                </button>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 flex-wrap justify-start">
                    <span className="p-1.5 bg-[#2b4c7e]/10 text-[#2b4c7e] rounded-xl text-lg inline-flex items-center justify-center">
                      {selectedCategoryForAll === 'find_services_mid' ? (
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      ) : (
                        categoryMap[selectedCategoryForAll]?.icon || <Sparkles className="w-4 h-4 text-rose-500" />
                      )}
                    </span>
                    <h2 className="text-lg font-black text-zinc-900">
                      {selectedCategoryForAll === 'find_services_mid' 
                        ? 'العثور على خدمات متاحة' 
                        : t(selectedCategoryForAll === 'algiers_hotels' ? 'algiers_hotels' : (selectedCategoryForAll === 'trending' ? 'trending' : categoryMap[selectedCategoryForAll]?.tKey || selectedCategoryForAll))}
                    </h2>
                  </div>
                  <p className="text-[11px] font-bold text-zinc-450 leading-relaxed">
                    {getSubTitleForCategory(selectedCategoryForAll)}
                  </p>
                </div>
              </div>

              {/* Action Buttons and Result Summaries */}
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[11px] font-black bg-zinc-950 text-white px-4 py-1.5 rounded-full shadow-xs">
                  {language === 'ar' 
                    ? `تم العثور على ${(selectedCategoryForAll === 'find_services_mid' ? randomServices : getFilteredListings(selectedCategoryForAll)).length} خيار`
                    : language === 'fr'
                    ? `${(selectedCategoryForAll === 'find_services_mid' ? randomServices : getFilteredListings(selectedCategoryForAll)).length} options trouvées`
                    : language === 'kab'
                    ? `${(selectedCategoryForAll === 'find_services_mid' ? randomServices : getFilteredListings(selectedCategoryForAll)).length} n tansa`
                    : `${(selectedCategoryForAll === 'find_services_mid' ? randomServices : getFilteredListings(selectedCategoryForAll)).length} options found`
                  }
                </span>
                <button
                  onClick={() => setSelectedCategoryForAll(null)}
                  className="text-[11px] font-bold text-zinc-700 bg-white hover:bg-zinc-100 px-3.5 py-1.5 rounded-full border border-zinc-250 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </button>
              </div>
            </div>

            {/* Custom Styled responsive Grid of Category listings */}
            {(selectedCategoryForAll === 'find_services_mid' ? randomServices : getFilteredListings(selectedCategoryForAll)).length === 0 ? (
              <div className="bg-zinc-50 rounded-[2.5rem] py-20 px-6 text-center text-zinc-400 border border-dashed border-zinc-200 text-xs font-bold space-y-4">
                <div>لا توجد خيارات متطابقة حالياً لكلمة البحث أو الولاية المحددة.</div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedWilaya('All');
                    setMaxPriceFilter(60050);
                    setGuestCountFilter('Any');
                  }}
                  className="px-5 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-bold hover:bg-zinc-800 cursor-pointer shadow-xs transition"
                >
                  إعادة تعيين مرشحات البحث
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
                {(selectedCategoryForAll === 'find_services_mid' ? randomServices : getFilteredListings(selectedCategoryForAll)).map((listing) => {
                  const isFav = favorites.includes(listing.id);

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.25 }}
                      key={listing.id}
                      onClick={() => setSelectedListing(listing)}
                      className="group bg-white rounded-2.5xl overflow-hidden cursor-pointer flex flex-col justify-between border border-zinc-150 shadow-sm hover:shadow-md transition-all duration-300 p-3"
                      id={`grid-listing-card-${listing.id}`}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-xs mb-3">
                        <motion.img 
                          layoutId={`listing-image-${listing.id}`}
                          src={listing.images[0]} 
                          alt={listing.title[language]}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Wishlist Heart on Top-Left corner */}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(listing.id);
                          }}
                          className="absolute top-2.5 left-2.5 z-10 bg-transparent text-white hover:scale-115 active:scale-90 transition-all outline-none"
                        >
                          <Heart className={`w-4.5 h-4.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] ${isFav ? 'fill-[#ff385c] text-[#ff385c] stroke-white' : 'text-white'}`} strokeWidth={2.5} />
                        </button>

                        {/* Top-Right Badge (rating or popular) */}
                        {listing.rating >= 4.75 ? (
                          <div className="absolute top-2.5 right-2.5 z-10 bg-white/95 backdrop-blur-xs text-zinc-900 font-extrabold text-[8.5px] py-1 px-3 rounded-full shadow-md border border-zinc-100 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{listing.rating}</span>
                          </div>
                        ) : (
                          <div className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-xs text-zinc-900 font-extrabold text-[8px] py-1 px-2.5 rounded-full shadow-sm">
                            {listing.location[language]}
                          </div>
                        )}
                      </div>

                      {/* Info lines below */}
                      <div className="space-y-1.5 flex-grow flex flex-col justify-between text-right px-1">
                        <div>
                          <h3 className="font-extrabold text-[#111111] text-[12px] leading-snug group-hover:text-[#2b4c7e] transition duration-200 mb-1">
                            {listing.title[language]}
                          </h3>
                          <p className="text-zinc-400 text-[10px] font-bold">
                            {listing.location[language]}
                          </p>
                        </div>

                        {/* Price Row */}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between mt-2">
                          <p className="text-zinc-550 text-[10.5px] font-bold">
                            <span className="text-zinc-900 font-black text-[12.5px]">
                              {listing.pricePerNight.toLocaleString()} دج
                            </span>
                            <span className="text-[10px] text-zinc-400 mr-0.5">/ليلة</span>
                          </p>
                          <div className="text-[9.5px] font-black text-[#2b4c7e] bg-blue-50/50 py-1 px-2 rounded-lg border border-blue-100/40">
                            {listing.beds} {language === 'ar' ? 'أسرة' : 'beds'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeMainTab === 'experiences' ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-zinc-50 rounded-[2.5rem] border border-zinc-100 min-h-[350px] animate-fade-in shadow-xs">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-2">تجارب السفر</h3>
            <p className="text-sm font-bold text-zinc-500 max-w-xs mb-6">
              الخدمة غير متاحة حالياً
            </p>
            <button 
              onClick={() => setActiveMainTab('homes')} 
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-black hover:bg-zinc-800 transition active:scale-95 cursor-pointer shadow-sm"
            >
              الرجوع للرئيسية
            </button>
          </div>
        ) : activeMainTab === 'services' ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-zinc-50 rounded-[2.5rem] border border-zinc-100 min-h-[350px] animate-fade-in shadow-xs">
            <div className="w-14 h-14 bg-blue-50 text-[#2b4c7e] rounded-full flex items-center justify-center mb-5 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-2">الخدمات المهنية</h3>
            <p className="text-sm font-bold text-zinc-500 max-w-xs mb-6">
              الخدمة ليست متاحة حالياً
            </p>
            <button 
              onClick={() => setActiveMainTab('homes')} 
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-black hover:bg-zinc-800 transition active:scale-95 cursor-pointer shadow-sm"
            >
              الرجوع للرئيسية
            </button>
          </div>
        ) : (
          categoriesToShow.map((catId) => {
            const categoryListings = catId === 'find_services_mid' ? randomServices : getFilteredListings(catId);
            const hasSubtitle = getSubTitleForCategory(catId);

            return (
              <div key={catId} className="space-y-4" id={`explore-category-${catId}`}>
              
              {/* Category Segment Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 text-right">
                
                {/* Text titles with clean subtitles */}
                <div className="space-y-0.5 overflow-hidden pr-2 text-right flex-1 select-none">
                  <h2 className="text-base font-black text-zinc-900 leading-tight">
                    {catId === 'find_services_mid' 
                      ? 'العثور على خدمات متاحة' 
                      : t(catId === 'algiers_hotels' ? 'algiers_hotels' : (catId === 'trending' ? 'trending' : categoryMap[catId].tKey))}
                  </h2>
                  {hasSubtitle && (
                    <p className="text-[10px] font-bold text-zinc-400 truncate leading-relaxed">
                      {hasSubtitle}
                    </p>
                  )}
                </div>

                {/* Left controls: "الكل" button and single Arrow button */}
                <div className="flex items-center gap-2.5 shrink-0 pl-1">
                  <button
                    onClick={() => setSelectedCategoryForAll(catId)}
                    className="text-[10.5px] font-black text-[#2b4c7e] hover:text-blue-700 bg-[#2b4c7e]/5 hover:bg-[#2b4c7e]/12 px-3.5 py-1 rounded-full transition-all active:scale-95 cursor-pointer border border-[#2b4c7e]/10 inline-flex items-center justify-center h-8"
                    title={language === 'ar' ? 'عرض الكل' : 'View All'}
                    id={`btn-view-all-${catId}`}
                  >
                    {language === 'ar' ? 'الكل' : language === 'fr' ? 'Tout' : language === 'kab' ? 'Akk' : 'All'}
                  </button>
                  <button
                    onClick={() => scrollRow(catId, 'left')}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-850 p-1.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center justify-center w-7 h-7"
                    title="السابق"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-zinc-800" />
                  </button>
                </div>
              </div>

              {/* Loader or Content */}
              {isLoading ? (
                <SkeletonShelfLoader />
              ) : categoryListings.length === 0 ? (
                <div className="bg-zinc-50 rounded-[2rem] py-14 text-center text-zinc-400 border border-dashed border-zinc-200 text-xs font-bold">
                  لا توجد عقارات متطابقة حالياً. جرب توسيع معايير فلاتر السعر أو الولاية.
                </div>
              ) : (catId === 'find_services_mid' || catId === 'recently_listed') ? (
                <div 
                  ref={(el) => { sliderRefs.current[catId] = el; }}
                  className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar scroll-smooth"
                >
                  {categoryListings.map((listing) => {
                    const isFav = favorites.includes(listing.id);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className={`group bg-white snap-start shrink-0 overflow-hidden cursor-pointer flex flex-col justify-between ${
                          catId === 'recently_listed'
                            ? 'w-[calc((100%-36px)/3.5)] min-w-[calc((100%-36px)/3.5)]'
                            : 'w-[112px] min-w-[112px] sm:w-[124px] sm:min-w-[124px]'
                        }`}
                        id={`listing-card-mini-${listing.id}`}
                      >
                        
                        {/* Smaller card, square image */}
                        <div className="relative aspect-square rounded-[1.2rem] overflow-hidden bg-zinc-50 border border-zinc-100/60 shadow-xs">
                          <motion.img 
                            layoutId={`listing-image-${listing.id}`}
                            src={listing.images[0]} 
                            alt={listing.title[language]}
                            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Mini wish heart */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(listing.id);
                            }}
                            className="absolute top-1.5 left-1.5 z-10 bg-transparent text-white hover:scale-110 active:scale-95 transition-all outline-none"
                          >
                            <Heart className={`w-3.5 h-3.5 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.55)] ${isFav ? 'fill-[#ff385c] text-[#ff385c] stroke-white' : 'text-white stroke-white'}`} strokeWidth={2.5} />
                          </button>

                          {/* Mini rating to fit beautifully */}
                          <div className="absolute top-1.5 right-1.5 z-10 bg-white/95 text-zinc-900 font-extrabold text-[7.5px] py-0.5 px-1.5 rounded-full shadow-xs border border-zinc-100 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>{listing.rating}</span>
                          </div>
                        </div>

                        {/* Text descriptions below the image with direct clear name */}
                        <div className="pt-1.5 px-0.5 text-right">
                          <h3 className="font-extrabold text-[#111111] text-[10.5px] leading-tight truncate">
                            {listing.title[language]}
                          </h3>
                          <p className="text-zinc-550 text-[9px] font-bold mt-0.5">
                            <span className="text-zinc-900 font-extrabold text-[11px]">
                              {listing.pricePerNight.toLocaleString()} دج
                            </span>
                          </p>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div 
                  ref={(el) => { sliderRefs.current[catId] = el; }}
                  className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar scroll-smooth"
                >
                  {categoryListings.map((listing) => {
                    const isFav = favorites.includes(listing.id);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className="group w-[calc((100%-24px)/2.1)] min-w-[calc((100%-24px)/2.1)] bg-white snap-start shrink-0 overflow-hidden cursor-pointer flex flex-col justify-between"
                        id={`listing-card-${listing.id}`}
                      >
                        
                        {/* Image Container with precise rounded borders matching the screenshot */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100/60 shadow-xs">
                          <motion.img 
                            layoutId={`listing-image-${listing.id}`}
                            src={listing.images[0]} 
                            alt={listing.title[language]}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Wishlist Heart on Top-Left corner exactly as shown in the mockup */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(listing.id);
                            }}
                            className="absolute top-2 left-2 z-10 bg-transparent text-white hover:scale-110 active:scale-95 transition-all outline-none"
                          >
                            <Heart className={`w-4 h-4 drop-shadow-[0_2px_4.5px_rgba(0,0,0,0.55)] ${isFav ? 'fill-[#ff385c] text-[#ff385c] stroke-white' : 'text-white stroke-white'}`} strokeWidth={2.5} />
                          </button>

                          {/* "مفضّل لدى الضيوف" badge overlay - precisely replicated on Top-Right corner */}
                          {listing.rating >= 4.75 && (
                            <div className="absolute top-2 right-2 z-10 bg-white text-zinc-900 font-extrabold text-[8.5px] py-0.5 px-2.5 rounded-full shadow-md border border-zinc-100">
                              مفضّل لدى الضيوف
                            </div>
                          )}
                        </div>

                        {/* Text descriptions below the image exactly as shown in the picture */}
                        <div className="pt-1.5 px-0.5 space-y-0.5 flex-grow flex flex-col justify-between text-right">
                          <div className="space-y-0.5">
                            
                            {/* Line 1: Type / Stay Detail with bold black/charcoal text */}
                            <h3 className="font-extrabold text-[#111111] text-[12px] leading-tight truncate">
                              مكان للإقامة في {listing.location[language]}
                            </h3>

                            {/* Line 2: Price and rating info formatted perfectly on one line with nice bullets */}
                            <p className="text-zinc-550 text-[10.5px] font-bold flex items-center justify-start gap-1 flex-wrap">
                              <span className="text-zinc-900 font-extrabold text-[12px]">
                                {listing.pricePerNight.toLocaleString()} دج
                              </span>
                              <span>مقابل ليلة</span>
                              <span className="text-zinc-305 px-0.5">•</span>
                              <span className="flex items-center gap-0.5 font-extrabold text-[#111111]">
                                <span>{listing.rating}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                              </span>
                            </p>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
       )}
      </div>

      {/* 3. THREE-PAGE INTERACTIVE SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOverlayOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-0 bg-[#f4f4f4] z-50 overflow-y-auto font-sans flex flex-col"
            dir="rtl"
          >
            {/* Header section (strictly matches screenshots) */}
            <div className="bg-[#f4f4f4] px-4 pt-6 pb-4">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {/* Close Button ("X") */}
                <button
                  type="button"
                  onClick={() => setIsSearchOverlayOpen(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-sm border border-zinc-100 hover:bg-zinc-50 transition active:scale-95 cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5 text-zinc-800" />
                </button>

                {/* Center Navigation Tabs: "البيوت", "تجارب السفر", "الخدمات" */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setSearchOverlayTab('homes')}
                    className={`pb-1.5 text-xs font-extrabold relative transition-colors cursor-pointer ${
                      searchOverlayTab === 'homes' ? 'text-zinc-900 font-black' : 'text-zinc-400 hover:text-zinc-650'
                    }`}
                  >
                    <span>البيوت</span>
                    {searchOverlayTab === 'homes' && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950 rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => setSearchOverlayTab('experiences')}
                    className={`pb-1.5 text-xs font-extrabold relative transition-colors cursor-pointer ${
                      searchOverlayTab === 'experiences' ? 'text-zinc-900 font-black' : 'text-zinc-400 hover:text-zinc-650'
                    }`}
                  >
                    <span>تجارب السفر</span>
                    {searchOverlayTab === 'experiences' && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950 rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => setSearchOverlayTab('services')}
                    className={`pb-1.5 text-xs font-extrabold relative transition-colors cursor-pointer ${
                      searchOverlayTab === 'services' ? 'text-zinc-900 font-black' : 'text-zinc-400 hover:text-zinc-650'
                    }`}
                  >
                    <span>الخدمات</span>
                    {searchOverlayTab === 'services' && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-950 rounded-full" />
                    )}
                  </button>
                </div>

                {/* Back/Exit Arrow Right Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOverlayOpen(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-sm border border-zinc-100 hover:bg-zinc-50 transition active:scale-95 cursor-pointer shrink-0"
                >
                  <ArrowRight className="w-5 h-5 text-zinc-800" />
                </button>
              </div>
            </div>

            {/* Main Interactive Content */}
            <div className="flex-1 max-w-md mx-auto w-full px-4 pb-24">
              
              {searchOverlayTab === 'experiences' ? (
                /* Blocked Travel Experiences inside overlay too */
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-zinc-100/60 shadow-md min-h-[350px] mt-4 animate-fade-in">
                  <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 mb-2">تجارب السفر</h3>
                  <p className="text-sm font-bold text-zinc-500 max-w-xs">
                    الخدمة غير متاحة حالياً
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* STEP 1: LOCATION (الموقع) */}
                  {searchStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4 pt-1"
                    >
                      {/* Main Location Card */}
                      <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100 space-y-4">
                        <h3 className="text-lg font-extrabold text-zinc-955 text-right">الموقع</h3>
                        
                        {/* Search Input Box */}
                        <div className="relative w-full bg-[#f4f4f4] border border-zinc-200/40 rounded-2xl h-12 flex items-center px-4 gap-2">
                          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                          <input
                            type="text"
                            value={selectedLoc}
                            onChange={(e) => setSelectedLoc(e.target.value)}
                            placeholder="البحث عن وجهات"
                            className="bg-transparent text-xs font-bold text-zinc-900 placeholder-zinc-400 text-right outline-none w-full"
                            dir="rtl"
                          />
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-3 pt-2">
                          <p className="text-[10px] font-black text-zinc-400 text-right">الوجهات المقترحة</p>
                          
                          {/* Suggestion 1: الأماكن المجاورة */}
                          <div 
                            onClick={() => {
                              setSelectedLoc('الأماكن المجاورة');
                              setSearchStep(2);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-2xl transition cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-505 shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>
                            </div>
                            <div className="text-right flex-1">
                              <p className="text-xs font-black text-zinc-900">الأماكن المجاورة</p>
                              <p className="text-[10px] font-bold text-zinc-400">اكتشف المنطقة المحيطة</p>
                            </div>
                          </div>

                          {/* Suggestion 2: برشلونة، إسبانيا */}
                          <div 
                            onClick={() => {
                              setSelectedLoc('برشلونة، إسبانيا');
                              setSearchStep(2);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-2xl transition cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-505 shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <path d="M4 22V10l4-4 4 4v12M20 22V10l-4-4-4 4v12" />
                                <path d="M12 22V6l2-2 2 2v16" />
                                <circle cx="12" cy="10" r="1.5" />
                                <path d="M6 14h2M16 14h2" />
                              </svg>
                            </div>
                            <div className="text-right flex-1">
                              <p className="text-xs font-black text-zinc-900">برشلونة، إسبانيا</p>
                              <p className="text-[10px] font-bold text-zinc-400">وجهة رائجة قرب الشاطئ</p>
                            </div>
                          </div>

                          {/* Suggestion 3: إسطنبول، تركيا */}
                          <div 
                            onClick={() => {
                              setSelectedLoc('إسطنبول، تركيا');
                              setSearchStep(2);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-2xl transition cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-505 shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <path d="M12 2l2 4-1 12H11l-1-12z" />
                                <path d="M10 10h4M9 14h6" />
                                <path d="M4 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
                              </svg>
                            </div>
                            <div className="text-right flex-1">
                              <p className="text-xs font-black text-zinc-900">إسطنبول، تركيا</p>
                              <p className="text-[10px] font-bold text-zinc-400">وجهة تتميز بالمعالم السياحية مثل برج الجلطة</p>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Collapsed steps */}
                      <div 
                        onClick={() => setSearchStep(2)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition"
                      >
                        <span className="text-xs font-bold text-zinc-400">إضافة التواريخ</span>
                        <span className="text-xs font-black text-zinc-800">التاريخ</span>
                      </div>

                      <div 
                        onClick={() => setSearchStep(3)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition"
                      >
                        <span className="text-xs font-bold text-zinc-400">إضافة الضيوف</span>
                        <span className="text-xs font-black text-zinc-800">من</span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DATE SELECTOR (التاريخ) */}
                  {searchStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4 pt-1"
                    >
                      {/* Top quick state buttons */}
                      <div className="flex gap-2 justify-between items-center bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-zinc-100">
                        <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-full">البحث المرن</span>
                        <span className="text-xs font-black text-zinc-800">{selectedLoc || "المكان"}</span>
                      </div>

                      {/* Main Date selection Card */}
                      <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100 space-y-4">
                        <h3 className="text-lg font-extrabold text-zinc-955 text-right">التاريخ</h3>
                        
                        {/* Toggle header capsule */}
                        <div className="w-full bg-zinc-100/80 p-0.5 rounded-full flex">
                          <button className="flex-1 py-11 text-xs font-bold text-zinc-400 text-center rounded-full hover:text-zinc-650 transition cursor-pointer">
                            تواريخ مرنة
                          </button>
                          <button className="flex-1 py-1.5 bg-white text-xs font-black text-zinc-900 text-center rounded-full shadow-sm cursor-pointer">
                            التواريخ
                          </button>
                        </div>

                        {/* Calendar Month representation (June 2026) */}
                        <div className="space-y-3 pt-1">
                          <div className="text-xs font-black text-zinc-800 text-right">جوان 2026</div>
                          
                          {/* Weekdays row RTL */}
                          <div className="grid grid-cols-7 gap-1 text-[10px] font-black text-zinc-400 text-center" dir="rtl">
                            <span>ن</span>
                            <span>ث</span>
                            <span>ر</span>
                            <span>خ</span>
                            <span>ج</span>
                            <span>س</span>
                            <span>ح</span>
                          </div>

                          {/* Days grid RTL June 2026 (Starts Mon June 1st) */}
                          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center font-bold text-xs" dir="rtl">
                            {Array.from({ length: 30 }).map((_, index) => {
                              const day = index + 1;
                              const isPast = day < 18;
                              const isCheckIn = day === selectedCheckIn;
                              const isCheckOut = day === selectedCheckOut;
                              const isBetween = selectedCheckIn && selectedCheckOut && day > selectedCheckIn && day < selectedCheckOut;

                              return (
                                <button
                                  key={day}
                                  disabled={isPast}
                                  onClick={() => {
                                    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
                                      setSelectedCheckIn(day);
                                      setSelectedCheckOut(null);
                                    } else if (day > selectedCheckIn) {
                                      setSelectedCheckOut(day);
                                    } else {
                                      setSelectedCheckIn(day);
                                    }
                                  }}
                                  className={`aspect-square w-full rounded-full flex items-center justify-center text-xs cursor-pointer transition-all ${
                                    isPast ? 'text-zinc-300 line-through cursor-not-allowed' :
                                    isCheckIn ? 'bg-zinc-900 text-white font-black shadow-md' :
                                    isCheckOut ? 'bg-zinc-900 text-white font-black shadow-md' :
                                    isBetween ? 'bg-rose-100/50 text-[#ff385c] font-black text-center' :
                                    'text-zinc-800 hover:bg-zinc-100 hover:text-black'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom offset pills */}
                        <div className="flex gap-1 overflow-x-auto pt-2 pb-1 no-scrollbar justify-start" dir="rtl">
                          <div className="px-3 py-1.5 rounded-full border border-zinc-900/100 bg-[#f7f7f7] text-[10px] font-extrabold text-zinc-900 whitespace-nowrap cursor-pointer">
                            التواريخ الدقيقة
                          </div>
                          <div className="px-3 py-1.5 rounded-full border border-zinc-250 bg-white text-[10px] font-bold text-zinc-650 whitespace-nowrap cursor-pointer hover:bg-zinc-50">
                            ± 1 يوم
                          </div>
                          <div className="px-3 py-1.5 rounded-full border border-zinc-250 bg-white text-[10px] font-bold text-zinc-650 whitespace-nowrap cursor-pointer hover:bg-zinc-50">
                            ± 2 أيام
                          </div>
                        </div>

                      </div>

                      {/* Collapsed steps */}
                      <div 
                        onClick={() => setSearchStep(3)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition"
                      >
                        <span className="text-xs font-bold text-zinc-400">إضافة الضيوف</span>
                        <span className="text-xs font-black text-zinc-800">من</span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: GUEST SELECTOR (الضيوف) */}
                  {searchStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4 pt-1"
                    >
                      {/* Top quick state buttons */}
                      <div className="space-y-2">
                        <div className="flex gap-2 justify-between items-center bg-white px-4 py-2 rounded-xl shadow-xs border border-zinc-100">
                          <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">البحث المرن</span>
                          <span className="text-xs font-black text-zinc-800">{selectedLoc || "المكان"}</span>
                        </div>
                        <div className="flex gap-2 justify-between items-center bg-white px-4 py-2 rounded-xl shadow-xs border border-zinc-100">
                          <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">
                            {selectedCheckIn && selectedCheckOut ? `جوان ${selectedCheckIn} - ${selectedCheckOut}` : "إضافة التواريخ"}
                          </span>
                          <span className="text-xs font-black text-zinc-800">التاريخ</span>
                        </div>
                      </div>

                      {/* Main Guests Card */}
                      <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100 space-y-4">
                        <h3 className="text-lg font-extrabold text-zinc-955 text-right">الضيوف</h3>
                        
                        {/* 4 Counter Rows */}
                        <div className="divide-y divide-zinc-100">
                          
                          {/* Row 1: Adults */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setAdults(prev => Math.max(0, prev - 1))}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-extrabold text-zinc-900">{adults}</span>
                              <button 
                                onClick={() => setAdults(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-zinc-900">بالغون</p>
                              <p className="text-[10px] font-bold text-zinc-400">13 سنة وما فوق</p>
                            </div>
                          </div>

                          {/* Row 2: Children */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-extrabold text-zinc-900">{childrenCount}</span>
                              <button 
                                onClick={() => setChildrenCount(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-zinc-900">أطفال</p>
                              <p className="text-[10px] font-bold text-zinc-400">الأعمار 2 - 12</p>
                            </div>
                          </div>

                          {/* Row 3: Infants */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setInfants(prev => Math.max(0, prev - 1))}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-extrabold text-zinc-900">{infants}</span>
                              <button 
                                onClick={() => setInfants(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-zinc-900">رضّع</p>
                              <p className="text-[10px] font-bold text-zinc-400">أقل من 2 سنة</p>
                            </div>
                          </div>

                          {/* Row 4: Pets */}
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => setPets(prev => Math.max(0, prev - 1))}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-extrabold text-zinc-900">{pets}</span>
                              <button 
                                onClick={() => setPets(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:border-zinc-800 hover:text-zinc-900 active:scale-90 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-zinc-900">الحيوانات الأليفة</p>
                              <p className="text-[10px] font-bold text-zinc-400 underline decoration-zinc-300 cursor-pointer">هل ستتحضر حيوان خدمة؟</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            {searchOverlayTab !== 'experiences' && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-4 shadow-lg z-50">
                <div className="max-w-md mx-auto flex items-center justify-between" dir="rtl">
                  {searchStep === 2 ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedCheckIn(19);
                          setSelectedCheckOut(25);
                        }}
                        className="text-xs font-black text-zinc-500 hover:text-zinc-900 transition underline cursor-pointer"
                      >
                        إعادة تعيين
                      </button>
                      <button
                        onClick={() => setSearchStep(3)}
                        className="px-8 py-3 bg-zinc-950 text-white rounded-full text-xs font-black hover:bg-zinc-855 transition active:scale-95 cursor-pointer shadow-md"
                      >
                        التالي
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedLoc('');
                          setSelectedCheckIn(null);
                          setSelectedCheckOut(null);
                          setAdults(0);
                          setChildrenCount(0);
                          setInfants(0);
                          setPets(0);
                        }}
                        className="text-xs font-black text-zinc-550 hover:text-zinc-900 transition underline cursor-pointer"
                      >
                        مسح الكل
                      </button>
                      <button
                        onClick={() => {
                          setSearchTerm(selectedLoc || '');
                          setIsSearchOverlayOpen(false);
                        }}
                        className="px-8 py-3 bg-[#ff385c] hover:bg-[#e61e4d] text-white rounded-full text-xs font-black transition active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        <span>بحث</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
