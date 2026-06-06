import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { X, Star, MapPin, Key, Compass, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playHapticSound } from './InteractionShowcase';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

export interface InteractiveGoogleMapProps {
  onClose: () => void;
  listings: any[];
  onSelectListing: (listing: any) => void;
  onShowMockMap?: () => void; // Option to view the mock fallback map
}

// Map Algerian cities/Wilayas to realistic coordinates with slight randomized jitter offsets
const getListingCoords = (listing: any, index: number): google.maps.LatLngLiteral => {
  const code = String(listing.wilaya || listing.location?.ar || '').toLowerCase();
  
  // Base coordinates
  let baseLat = 36.7538; // Algiers
  let baseLng = 3.0588;

  if (code.includes('غرداية') || code.includes('ghardaia')) {
    baseLat = 32.4909;
    baseLng = 3.6735;
  } else if (code.includes('تيكجدا') || code.includes('tbej') || code.includes('bouira') || code.includes('البويرة')) {
    baseLat = 36.4180;
    baseLng = 4.1438;
  } else if (code.includes('وهران') || code.includes('oran')) {
    baseLat = 35.6971;
    baseLng = -0.6308;
  } else if (code.includes('قسنطينة') || code.includes('constantine')) {
    baseLat = 36.3650;
    baseLng = 6.6147;
  } else if (code.includes('بجاية') || code.includes('bejaia')) {
    baseLat = 36.7511;
    baseLng = 5.0567;
  } else if (code.includes('البليدة') || code.includes('blida')) {
    baseLat = 36.4700;
    baseLng = 2.8300;
  }

  // Jitter offset to prevent perfect overlapping of pins in the same city
  const seed = (index * 13) % 100;
  const jitterLat = ((seed - 50) / 1000) * 0.15;
  const jitterLng = (((seed * 7) % 100 - 50) / 1000) * 0.15;

  return {
    lat: baseLat + jitterLat,
    lng: baseLng + jitterLng
  };
};

export const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  onClose,
  listings,
  onSelectListing,
  onShowMockMap
}) => {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  // Map listings to pins with realistic coordinates
  const mapPins = listings.map((listing, idx) => ({
    ...listing,
    coords: getListingCoords(listing, idx)
  }));

  const activeListing = mapPins.find(p => p.id === selectedListingId);

  // Determine starting map center based on first available property or central Algeria coast
  const defaultCenter = mapPins.length > 0 ? mapPins[0].coords : { lat: 36.7538, lng: 3.0588 };

  if (!hasValidKey) {
    // Beautiful interactive instruction screen for adding Secrets configuration
    return (
      <div className="fixed inset-0 z-48 bg-zinc-950 flex flex-col text-white px-5 sm:px-6 py-6 overflow-y-auto" dir="rtl">
        {/* Floating Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 flex items-center justify-center transition active:scale-95"
          >
            <X className="w-4.5 h-4.5 text-zinc-300" />
          </button>
          <div className="text-right">
            <h3 className="text-sm font-black text-white">إعداد خرائط Google Maps</h3>
            <p className="text-[10px] text-zinc-400 font-bold">خطوة واحدة متبقية للأداء الكامل</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center items-center py-10 space-y-6 text-center">
          {/* Neon Icon Frame */}
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/5 relative animate-pulse">
            <Key className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-zinc-950" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-black text-white tracking-tight">مفتاح خرائط Google مطلوب</h2>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              يقوم هذا التطبيق بدمج خرائط جوجل التفاعلية والواقعية ثنائية الأبعاد لعرض مواقع الشاليهات والعقارات في الجزائر بدقة وبشكل فوري.
            </p>
          </div>

          {/* Guidelines Accordion Info Box */}
          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2.5xl p-4 text-right space-y-3.5">
            <h4 className="text-[12.5px] font-black text-rose-400 flex items-center gap-1.5 justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>خطوات التفعيل السريع:</span>
            </h4>
            
            <ol className="text-[11.5px] text-zinc-300 space-y-2.5 leading-snug list-decimal list-inside pr-1 font-sans">
              <li>
                <a 
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-black text-white underline hover:text-rose-300 inline-flex items-center gap-1"
                >
                  احصل على مفتاح مجاني (Google Maps API Key)
                  <ExternalLink className="w-3 h-3 text-rose-400" />
                </a>
              </li>
              <li>
                افتح قائمة الإعدادات (⚙️ أيقونة الترس بالزاوية العلوية اليمنى من تطبيق AI Studio)
              </li>
              <li>
                انتقل إلى تبويب <strong className="text-white font-bold">Secrets</strong>
              </li>
              <li>
                اكتب اسم المتغير: <code className="bg-zinc-950 font-mono text-[10.5px] text-rose-350 px-1.5 py-0.5 rounded border border-zinc-850">GOOGLE_MAPS_PLATFORM_KEY</code>
              </li>
              <li>
                ألصق المفتاح كقيمة واضغط <strong className="text-white font-bold">Enter</strong> لحفظ الإعدادات.
              </li>
            </ol>
            <p className="text-[10px] text-zinc-550 leading-relaxed pt-1 select-none pr-0.5">
              💡 بعد إضافة السر، سيعاد بناء التطبيق تلقائياً وبسرعة فائقة دون الحاجة لتحديث الصفحة لتفعيل الخرائط الحقيقية فورياً.
            </p>
          </div>

          {/* Action Call for Developer Bypass Mode */}
          <div className="flex flex-col gap-2.5 w-full pt-2">
            {onShowMockMap && (
              <button
                type="button"
                onClick={() => {
                  playHapticSound('select');
                  onShowMockMap();
                }}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-black text-xs rounded-xl border border-zinc-800 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-zinc-400" />
                <span>استخدام خريطة المحاكاة التفاعلية (بدون مفتاح)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-white hover:bg-zinc-100 text-black font-black text-xs rounded-xl transition active:scale-98 cursor-pointer"
            >
              العودة إلى القائمة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-48 bg-zinc-900 flex flex-col text-white overflow-hidden" dir="rtl">
      
      {/* Top Floating panel */}
      <div className="fixed top-14 left-4 right-4 z-49 flex justify-between items-center bg-zinc-950/85 backdrop-blur-md rounded-2.5xl p-3 border border-zinc-800/80 shadow-xl">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-850 flex items-center justify-center border border-zinc-800 transition active:scale-90 text-white"
        >
          <X className="w-5 h-5 stroke-[2.2px]" />
        </button>
        
        <div className="text-right">
          <p className="text-[10px] text-zinc-400 font-bold leading-none">خرائط جوجل المباشرة</p>
          <h4 className="text-sm font-black text-rose-450 mt-1">تصفح العقارات في الجزائر 🇩🇿</h4>
        </div>
      </div>

      {/* Real Maps Display Canvas */}
      <div className="flex-1 w-full h-full relative" id="gmp-google-map-element">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={7}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {mapPins.map((pin) => {
              const isSelected = selectedListingId === pin.id;
              return (
                <AdvancedMarker
                  key={pin.id}
                  position={pin.coords}
                  onClick={() => {
                    playHapticSound('tap');
                    setSelectedListingId(pin.id);
                  }}
                >
                  <div className={`rounded-xl px-2.5 py-1.5 shadow-xl border font-sans font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer select-none ${
                    isSelected 
                      ? 'bg-rose-500 text-white border-rose-400 scale-110 z-20' 
                      : 'bg-zinc-950 text-rose-400 border-zinc-800'
                  }`}>
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-rose-400'}`} />
                    <span>DZD {pin.pricePerNight.toLocaleString()}</span>
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>
      </div>

      {/* Floating Active Details Box */}
      <AnimatePresence>
        {activeListing && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-49 bg-zinc-950/95 border border-zinc-850 rounded-3.5xl p-4 flex gap-4 shadow-2xl backdrop-blur-md"
            dir="rtl"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-zinc-850">
              <img 
                src={activeListing.images[0]} 
                alt={activeListing.title['ar']} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-0.5 text-right">
              <div>
                <div className="flex items-center gap-1 justify-end text-amber-405 font-extrabold text-[10px]">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span className="text-zinc-350">{activeListing.rating}</span>
                </div>
                
                <h4 className="text-xs font-black text-white leading-snug mt-1 truncate max-w-[190px]">
                  {activeListing.title['ar'] || activeListing.title['en']}
                </h4>
                
                <p className="text-[10px] text-zinc-400 font-bold truncate mt-0.5">
                  {activeListing.location['ar'] || activeListing.location['en']} • {activeListing.wilaya}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => {
                    playHapticSound('success');
                    onClose();
                    onSelectListing(activeListing);
                  }}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black py-1.5 px-4 rounded-full transition active:scale-95 cursor-pointer shadow-md"
                >
                  عرض تفاصيل السكن
                </button>
                
                <p className="text-xs font-extrabold text-white">
                  {activeListing.pricePerNight.toLocaleString()} DZD <span className="text-[9px] text-zinc-500 font-normal">/ ليلة</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
