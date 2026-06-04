import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { Listing } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Star, MapPin, Heart, Share2, Compass, Calendar, 
  Users, Coffee, ChevronLeft, ChevronRight, CheckCircle2, Send,
  ArrowRight, Upload, Flag, Shield, Key, Camera, ChefHat, Dumbbell, 
  Scissors, Droplet, Sparkles, Award
} from 'lucide-react';
import { BookingReviewPage } from './BookingReviewPage';
import { Haptic } from './HapticEngine';
import { ReportListingPage } from './ReportListingPage';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const { toggleFavorite, favorites, addBooking, addReviewToListing } = useApp();
  const { t, language } = useLanguage();
  const isFavorite = favorites.includes(listing.id);


  // Direct DOM refs and viewport anchors for 60fps / 120fps fluid bottom sheet interactions
  const modalRef = React.useRef<HTMLDivElement>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollTopRef = React.useRef(0);
  const lastScrollTopRef = React.useRef(0);
  const touchStartYRef = React.useRef<number | null>(null);
  const touchStartXRef = React.useRef<number | null>(null);
  const activeDragYRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Exclude image carousels, buttons, inputs or options from hijacking swipe-down
    if (target.closest('.no-swipe-back') || target.closest('button') || target.closest('input') || target.closest('select')) return;
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchStartYRef.current = e.targetTouches[0].clientY;
    activeDragYRef.current = 0;
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const currentY = e.targetTouches[0].clientY;
    const deltaY = currentY - touchStartYRef.current;

    // Check if we are at the top of the scrollable container and pulling down
    if (scrollTopRef.current <= 5 && deltaY > 0) {
      isDraggingRef.current = true;
      // Soften pulling force for responsive natural spring feeling similar to iOS/Airbnb
      const pullingResistance = Math.pow(deltaY, 0.95);
      activeDragYRef.current = pullingResistance;
      
      // Directly apply style transform of GPU layer for buttery smooth 60fps / 120fps rendering!
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0, ${pullingResistance}px, 0)`;
        modalRef.current.style.transition = 'none'; // Ensure zero delay tracking
      }
      
      // Prevent browser scroll bounding interference
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;
    
    if (isDraggingRef.current) {
      if (activeDragYRef.current > 140) {
        // High fidelity dismiss transition sequence:
        Haptic.heavy();
        // Slide it completely off the screen downwards smoothly
        if (modalRef.current) {
          modalRef.current.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.94, 0.6, 1)';
          modalRef.current.style.transform = `translate3d(0, 105vh, 0)`;
        }
        setTimeout(() => {
          onClose();
        }, 210);
      } else {
        // Springs bounce back back to original position
        if (modalRef.current) {
          modalRef.current.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
          modalRef.current.style.transform = 'translate3d(0, 0px, 0)';
        }
      }
    } else {
      // Validate horizontal swipe over 115px threshold to dismiss (standard iOS swipe back)
      if (Math.abs(deltaX) > 115 && Math.abs(deltaY) < 60) {
        Haptic.success();
        if (modalRef.current) {
          modalRef.current.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.94, 0.6, 1)';
          modalRef.current.style.transform = `translate3d(100vw, 0, 0)`;
        }
        setTimeout(() => {
          onClose();
        }, 210);
      }
    }
    
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    activeDragYRef.current = 0;
    isDraggingRef.current = false;
  };

  // States
  const [bannerState, setBannerState] = useState<'floating' | 'docked'>('floating');
  const [isScrolledHeader, setIsScrolledHeader] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    // Keep it as 'floating' so the rare-find card remains pinned and highly visible as requested by the user
    setBannerState('floating');
    setIsScrolledHeader(false);
    setScrollTop(0);
  }, [listing.id]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('2026-06-15');
  const [checkOut, setCheckOut] = useState('2026-06-20');
  const [guestCount, setGuestCount] = useState(2);
  const [isBooked, setIsBooked] = useState(false);
  const [showAmenitiesPage, setShowAmenitiesPage] = useState(false);
  const [showBookingReview, setShowBookingReview] = useState(false);
  const [showReportPage, setShowReportPage] = useState(false);
  
  // Custom review inputs
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % listing.images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const calculateDays = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const subtotal = days * listing.pricePerNight;
  const cleaningFee = Math.round(listing.pricePerNight * 0.12);
  const serviceFee = Math.round(listing.pricePerNight * 0.08);
  const total = subtotal + cleaningFee + serviceFee;

  const handleReserve = () => {
    Haptic.heavy();
    addBooking(listing.id, checkIn, checkOut, guestCount);
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 2200);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    Haptic.medium();
    addReviewToListing(listing.id, 'أنت (مستكشف Daro)', reviewRating, reviewText);
    setReviewText('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleShareClick = () => {
    Haptic.light();
    const fullPath = `${window.location.origin}/listing/${listing.id}`;
    navigator.clipboard.writeText(fullPath);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Arabic date formatter helper for Algerian/Arabic months to show perfectly formatted dates in Arabic RTL
  const getArabicDateRange = () => {
    try {
      const monthsAr = [
        'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 
        'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return '15-20 جوان';
      }
      
      const startDay = start.getDate();
      const endDay = end.getDate();
      const startMonthIndex = start.getMonth();
      const endMonthIndex = end.getMonth();
      
      if (startMonthIndex === endMonthIndex) {
        return `${startDay}-${endDay} ${monthsAr[startMonthIndex]}`;
      } else {
        return `${startDay} ${monthsAr[startMonthIndex]} - ${endDay} ${monthsAr[endMonthIndex]}`;
      }
    } catch (e) {
      return '15-20 جوان';
    }
  };

  const isServiceCategory = ['photography', 'private_chef', 'gym', 'womens_hair', 'traditional_hammam', 'sauna'].includes(listing.category);

  if (isServiceCategory) {
    const serviceConfigs: Record<string, {
      subtitle: string;
      badgeText: string;
      deliveryText: string;
      packages: Array<{
        title: string;
        description: string;
        priceText: string;
        minBookText?: string;
        duration: string;
        image: string;
      }>;
      qualifications: Array<{
        title: string;
        description: string;
        iconType: 'camera' | 'star' | 'education' | 'chef' | 'dumbbell' | 'hair' | 'hammam' | 'sauna' | 'badge';
      }>;
      verifiedSealTitle: string;
      verifiedSealDescription: string;
      reviewAuthor: string;
      reviewLocation: string;
      reviewText: string;
      priceNote: string;
    }> = {
      photography: {
        subtitle: "التقط أفضل لحظاتك في برشلونة. الأعلى تقييمًا والأكثر مبيعًا في المدينة، منذ عام 2019.",
        badgeText: "مصوّر في برشلونة",
        deliveryText: "يتم تقديمها في بيتك",
        packages: [
          {
            title: "جلسة خاصة في ساغرادا فاميليا",
            description: "سنلتقط لك صورًا أمام كاتدرائية ساغرادا فاميليا الشهيرة. هل هذه المرة الأولى...",
            priceText: "26$ / الضيف",
            minBookText: "الحد الأدنى للحجز 137$",
            duration: "1 ساعة",
            image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "جلسة خاصة في الحي القوطي والباركلي",
            description: "سنلتقط صوراً دافئة في أزقة برشلونة القوطية التاريخية الشهيرة، مع زوايا نادرة ومقاهي...",
            priceText: "30$ / الضيف",
            minBookText: "الحد الأدنى للحجز 137$",
            duration: "2 ساعات",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80"
          }
        ],
        qualifications: [
          {
            title: "15 سنةً من الخبرة",
            description: "قضيت 8 سنوات كمصور صحفي لصحيفة El Colombiano في كولومبيا.",
            iconType: 'camera'
          },
          {
            title: "الإنجازات البارزة في مسيرتي المهنية",
            description: "تم ترشيحي لجوائز Sony World Photography في عامي 2015 و 2016.",
            iconType: 'star'
          },
          {
            title: "التعليم والتدريب",
            description: "لقد تخصصت في التنفيح الرقمي ونمط الحياة والصور الشخصية والأزياء.",
            iconType: 'education'
          }
        ],
        verifiedSealTitle: "يتم التحقق من الخدمات التي يقدمها \"المصورون\" على Daro للتأكد من جودتها",
        verifiedSealDescription: "يتم تقييم المصورين بناءً على خبرتهم المهنية ونماذج أعمالهم الرائعة وسمعتهم في تقديم خدمات متميزة.",
        reviewAuthor: "Quay",
        reviewLocation: "بوردو، فرنسا",
        reviewText: "تجربة رائعة حقًا ❤️ كانت الأجواء مريحة وممتعة للغاية. سنتذكر هذه اللحظات دائماً بفضل الصور الرائعة والجميلة!",
        priceNote: "الحد الأدنى للحجز 137$"
      },
      private_chef: {
        subtitle: "مطبخ إبداعي وقابل للتكيف، مع شغف قوي واتصال عاطفي.",
        badgeText: "شيف في " + listing.wilaya,
        deliveryText: "يتم تقديمها في بيتك",
        packages: [
          {
            title: "تذوق إسباني إبداعي",
            description: "تفسيرات حديثة للأطباق الإسبانية الأساسية، متجذرة في العاطفة والتقني...",
            priceText: "88$ / الضيف",
            minBookText: "الحد الأدنى للحجز 175$",
            duration: "2 ساعات",
            image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "قائمة طعام إقليمية راقية",
            description: "أطباق كلاسيكية أعيد ابتكارها باستخدام مكونات موسمية وطبق فاخر.",
            priceText: "111$ / الضيف",
            minBookText: "الحد الأدنى للحجز 175$",
            duration: "3 ساعات",
            image: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "قائمة تذوق الطعام المطهو ببطء",
            description: "نكهات عميقة ومتعددة الطبقات تتشكل بمرور الوقت والتقنية والشغف بالتركيز...",
            priceText: "134$ / الضيف",
            minBookText: "الحد الأدنى للحجز 175$",
            duration: "4 ساعات",
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=150&q=80"
          }
        ],
        qualifications: [
          {
            title: "6 سنوات من الخبرة",
            description: "طاهٍ يبلغ من العمر 24 عامًا يتمتع بخبرة في المطاعم الكبرى والتحديات الطهوية.",
            iconType: 'chef'
          },
          {
            title: "عملت في أرزاك وأباك",
            description: "العمل في مطاعم مشهورة صقلت مطبخي المتنوع.",
            iconType: 'star'
          },
          {
            title: "تعلم فن الطهي الإسباني",
            description: "تدرب في أفضل المدارس والمطاعم مثل أرزاك وأباك وأنخيل ليون.",
            iconType: 'education'
          }
        ],
        verifiedSealTitle: "يتم التحقق من الخدمات التي يقدمها \"الطهاة\" على Daro للتأكد من جودتها",
        verifiedSealDescription: "يتم تقييم الطهاة بناءً على خبرتهم المهنية وقوائم طعامه الرائعة وسعتهم في تقديم خدمات متميزة للضيوف.",
        reviewAuthor: "سارة والتر",
        reviewLocation: "باريس، فرنسا",
        reviewText: "أفضل وجبة عشاء حظينا بها إطلاقا! كانت النكهات متجانسة بشكل لا يصدق والتقديم راقٍ للغاية ومثير للإعجاب.",
        priceNote: "الحد الأدنى للحجز 175$"
      },
      gym: {
        subtitle: "تدريب لياقة بدنية مخصص ومرافقة شخصية معتمدة لتحقيق أهدافك وصحتك البدنية بأمان.",
        badgeText: "تأهيل وتدريب لياقة بدنية",
        deliveryText: "يتم تقديمها في الصالة الرياضية",
        packages: [
          {
            title: "حصة تدريب شخصي مخصصة الكارديو والقوة",
            description: "متابعة حركاتك بدقة تامة وبناء خطة كارديو وقوة مخصصة مجهزة ومريحة لمنع الإصابات.",
            priceText: "15$ / الضيف",
            minBookText: "الحد الأدنى للحجز 45$",
            duration: "1 ساعة",
            image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "برنامج غذائي رياضي متوازن متكامل",
            description: "تصميم برنامج وجبات غذائية مدروس ومجهز من طرف مختصين لتسريع تحقيق هدف التنشيف أو التضخيم.",
            priceText: "25$ / البرنامج",
            minBookText: "الحد الأدنى للحجز 45$",
            duration: "استشارة 45 دقيقة",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80"
          }
        ],
        qualifications: [
          {
            title: "8 سنوات من المرافقة الرياضية",
            description: "مدرب رياضي معتمد وحاصل على شهادات تدريب فيزيولوجي برعاية دولية ثقة.",
            iconType: 'dumbbell'
          },
          {
            title: "أكثر من 500 قصة تحول جسدي",
            description: "نجاح باهر في مرافقة مئات المشتركين نحو نمط حياة رياضي وصحي رائع.",
            iconType: 'star'
          },
          {
            title: "التخصص العلمي الأكاديمي",
            description: "خريج معهد اللياقة البدنية والكمال الرياضي وحاصل على دبلوم الكوتشينغ الوقائي.",
            iconType: 'education'
          }
        ],
        verifiedSealTitle: "يتم التحقق من خبرات \"المدربين\" الرياضيين على Daro للتأكد من أمان تدريبهم",
        verifiedSealDescription: "يتم تقييم المدربين بناءً على شهاداتهم القانونية وسلامة البرمج والتمارين الرياضية المقدمة للعملاء.",
        reviewAuthor: "رياض هلال",
        reviewLocation: "الجزائر",
        reviewText: "المدرب قمة في الأخلاق والاحترافية والاهتمام التام بالتفاصيل لمنع الإصابات وتشجيع العزيمة اليومية والتحول الجسدي الحقيقي.",
        priceNote: "الحد الأدنى للحجز 45$"
      },
      womens_hair: {
        subtitle: "أرقى تسريحات وسحر إطلالتك بخصوصية تامة وعناية متميزة بالشعر والبشرة.",
        badgeText: "حلاقة وتجميل نسائي",
        deliveryText: "يتم تقديمها في الصالون",
        packages: [
          {
            title: "تسريحة عروس ملكية حصرية",
            description: "تسريحة فاخرة ممع أرقى مكياج وعناية بالبشرة على يد خبيرات مؤهلات لضمان إشراقتك.",
            priceText: "60$ / الضيفة",
            minBookText: "الحد الأدنى للحجز 95$",
            duration: "2.5 ساعة",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "معالجة حرارية كيراتين وبوتوكس للشعر",
            description: "ترميم عميق وصحي لاستعادة نعومة وحيوية شعرك باستخدام منتجات حيوية آمنة خالية من المواد الكيميائية.",
            priceText: "45$ / الضيفة",
            minBookText: "الحد الأدنى للحجز 95$",
            duration: "2 ساعات",
            image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80"
          }
        ],
        qualifications: [
          {
            title: "10 سنوات من الإبداع والجمال",
            description: "سحر إتقان تصفيف وحلاقة العرائس في صالونات مكة والجزائر الأرقى.",
            iconType: 'hair'
          },
          {
            title: "جوائز في تصفيف الشعر والموضة",
            description: "حائزة على تقديرات التميز من منتدى تجميل المغرب العربي لعام 2023 لمنتجات الطبيعية المعقمة الكولاجين.",
            iconType: 'star'
          },
          {
            title: "التدريب الدولي الأكاديمي",
            description: "حاصلة على دبلوم الصبغ والتسريح المتقدم الموثق رسمياً من مدرسة لوريال بباريس الدولية.",
            iconType: 'education'
          }
        ],
        verifiedSealTitle: "يتم التحقق من مهارات \"صالونات التجميل\" على Daro لضمان سلامتكم الكلية",
        verifiedSealDescription: "تخضع الصالونات لتدقيق الصحة والتعقيم الكامل للمعدات واستخدام مستحضرات آمنة مصادق عليها طبياً.",
        reviewAuthor: "سناء اليمين",
        reviewLocation: "سطيف، الجزائر",
        reviewText: "الخصوصية في الصالون مذهلة والتعقيم 100%، عملت تسريحة وبوتوكس للشعر والنتيجة بقيت ناعمة وصحية بشكل يفوق التوقعات!",
        priceNote: "الحد الأدنى للحجز 95$"
      },
      traditional_hammam: {
        subtitle: "جلسات استرخاء بخار وتقشير كيسة بالصابون الأسود الدافئ لتجديد المسامات وحيوية بشرتك.",
        badgeText: "حمام بخار وتدليك تقليدي",
        deliveryText: "يتم تقديمها في الحمام الأندلسي",
        packages: [
          {
            title: "جلسة الاستحمام الأندلسي بالصابون الأسود والليفة",
            description: "تخلص من سموم الجسم والضغط اليومي في جلسة بخار منعش متبوع بتقشير كيسة عميق لاستعادة صحة جلدك كليا.",
            priceText: "20$ / الضيف",
            minBookText: "الحد الأدنى للحجز 35$",
            duration: "1.5 ساعة",
            image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "جلسة تدليك مسترخ ومكثف بالزيوت الأساسية",
            description: "مساج دافئ لكامل مفاصل الجسم بواسطة معالجين مؤهلين يعيد للجسم توازنه ونشاط دورته الدموية.",
            priceText: "30$ / الضيف",
            minBookText: "الحد الأدنى للحجز 35$",
            duration: "1 ساعة",
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=150&q=80"
          }
        ],
        qualifications: [
          {
            title: "12 سنةً من مهارات التدليك والحمام",
            description: "توفير تجارب حمامات متميزة بالبخار والعناية الدقيقة بسلامة الضيوف وراحتهم.",
            iconType: 'hammam'
          },
          {
            title: "الأدوات والمكونات التقليدية الأصلية",
            description: "الالتزام التام بالصابون البلدي الأسود والطين والزيوت النقية المستوردة لضمان عافيتكم.",
            iconType: 'star'
          },
          {
            title: "التدريب والترخيص الصحي والوقائي",
            description: "حاصلون على تراخيص الهيئة الطبية والوقائية لممارسة الاستجمام والعلاج الطبيعي الدقيق.",
            iconType: 'education'
          }
        ],
        verifiedSealTitle: "يتم التحقق من ممارسات \"الحمامات التقليدية\" على Daro للتأكد من التعقيم المثالي",
        verifiedSealDescription: "يخضع الحمام لفحوص المياه المستمرة وتنظيف غرف البخار وتوزيع مستحضرات طبيعية دقيقة لحمايتكم.",
        reviewAuthor: "سفيان بن علي",
        reviewLocation: "العاصمة، الجزائر",
        reviewText: "مكان تاريخي جميل ودافئ مريح للغاية، التدليك بالزيوت شال التعب والضغط بعد أسبوع متعب من العمل الكثيف وشاي دافئ ممتاز بالبهو.",
        priceNote: "الحد الأدنى للحجز 35$"
      },
      sauna: {
        subtitle: "تجربة سونا جافة دافئة وجاكوزي مائي علاجي للشعيرات وتسكين تعب العضلات في بيئة فخمة مغلقة.",
        badgeText: "سونا سويدية وجاكوزي دافئ",
        deliveryText: "يتم تقديمها في كبائن خاصة مغلقة",
        packages: [
          {
            title: "جلسة كابينة سونا الأرز الجاف المعقمة",
            description: "ارتخاء العظام والعضلات تحت درجات حرارة مثالية داخل كبائن خشبية طبيعية مريحة تنعش الشعب الهوائية.",
            priceText: "25$ / الجلسة",
            minBookText: "الحد الأدنى للحجز 55$",
            duration: "1 ساعة",
            image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=150&q=80"
          },
          {
            title: "علاج هيدروليكي جاكوزي دافئ بالدفع المائي",
            description: "مساج مائي دافئ ينشط دورتك الدموية ويمنح جسمك استجماماً عميقاً وصحياً يدوم لأيام.",
            priceText: "35$ / الضيف",
            minBookText: "الحد الأدنى للحجز 55$",
            duration: "1.5 ساعة",
            image: "https://images.unsplash.com/photo-1554156002-975557968276?auto=format&fit=crop&w=150&q=80"
          }
        ],
        qualifications: [
          {
            title: "15 سنةً في علوم الاستجمام والسونا",
            description: "إتقان توازن رطوبة وحرارة كبائن سونا خشب الصنوبر الكندي لراحة الرئتين.",
            iconType: 'sauna'
          },
          {
            title: "معايير السلامة وأحدث أجهزة الجاكوزي",
            description: "تطبيق تعقيم حراري يومي كامل ومراقبة جودة دفع المياه والجاكوزيات العلاجية بدقة.",
            iconType: 'star'
          },
          {
            title: "الترخيص والأكاديمية المهنية",
            description: "شهادات علاج فيزيائي وطبيعي مصادق عليها من كليات العلاج العلاجي الإسكندنافي.",
            iconType: 'education'
          }
        ],
        verifiedSealTitle: "يتم التحقق من مراكز \"السونا والسبا\" على Daro لضمان سلامتكم المطلقة",
        verifiedSealDescription: "تخضع جودة المياه للأوزون والكلور الآمن الطبيعي، فضلاً عن تعقيم كبائن الأرز بمضادات البكتيريا المعقمة.",
        reviewAuthor: "سارة عبد الله",
        reviewLocation: "تيبازة، الجزائر",
        reviewText: "الكبائن نظيفة جداً ومعقمة، رائحة الأرز مع البخار والجاكوزي الدافئ كانت علاجا حقيقيا لآلام الظهر وتعب الأسبوع بخصوصية وهدوء تام.",
        priceNote: "الحد الأدنى للحجز 55$"
      }
    };

    const config = serviceConfigs[listing.category] || serviceConfigs.photography;

    const getQualIcon = (iconType: string) => {
      switch (iconType) {
        case 'camera':
          return <Camera className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
        case 'star':
          return (
            <svg className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        case 'education':
          return (
            <svg className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        case 'chef':
          return <ChefHat className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
        case 'dumbbell':
          return <Dumbbell className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
        case 'hair':
          return <Scissors className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
        case 'hammam':
          return <Droplet className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
        case 'sauna':
          return <Sparkles className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
        default:
          return <Award className="w-5.5 h-5.5 text-zinc-800 stroke-[1.8]" />;
      }
    };

    const getGridImages = () => {
      const defaultImages: Record<string, string[]> = {
        photography: [
          listing.images[0],
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80",
          listing.images[1] || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=300&q=80"
        ],
        private_chef: [
          listing.images[0],
          "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80",
          listing.images[1] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80"
        ],
        gym: [
          listing.images[0],
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80",
          listing.images[1] || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80"
        ],
        womens_hair: [
          listing.images[0],
          "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=300&q=80",
          listing.images[1] || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80"
        ],
        traditional_hammam: [
          listing.images[0],
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80",
          listing.images[1] || "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=300&q=80"
        ],
        sauna: [
          listing.images[0],
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=300&q=80",
          listing.images[1] || "https://images.unsplash.com/photo-1554156002-975557968276?auto=format&fit=crop&w=300&q=80"
        ]
      };
      return defaultImages[listing.category] || defaultImages.photography;
    };

    const gridImages = getGridImages();

    // Cleaned up host display name
    const displayHostName = listing.hostName
      .replace('الشيف', '')
      .replace('المدرب', '')
      .replace('المركز الصحي', '')
      .replace('الخبيرة', '')
      .replace('عيادة', '')
      .trim();

    return (
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-zinc-950/40 backdrop-blur-[1.5px] p-0 sm:p-4 overflow-hidden"
      >
        <motion.div 
          ref={modalRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          style={{ willChange: 'transform' }}
          className="relative bg-white w-full sm:max-w-2xl h-screen sm:h-[92vh] sm:rounded-[36px] flex flex-col overflow-hidden shadow-none sm:shadow-2xl border-0 sm:border border-zinc-200/40"
          id={`detail-modal-${listing.id}`}
          dir="rtl"
        >
          {/* Mobile Native Sleek Bottom Sheet Drag Indicator Pill */}
          <div className="absolute top-2.5 left-0 right-0 z-50 flex justify-center no-swipe-back select-none pointer-events-none">
            <div className="w-12 h-1.5 bg-zinc-350/60 rounded-full" />
          </div>

          {/* Share Copied Alert Indicator Overlay */}
          <AnimatePresence>
            {copiedLink && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white py-2.5 px-6 rounded-full text-[11px] font-black shadow-lg border border-zinc-800"
              >
                تم نسخ رابط المنشور بنجاح!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fixed Top Sticky Header Actions */}
          <div 
            className={`absolute top-0 left-0 right-0 z-40 transition-all duration-200 flex justify-between items-center ${
              isScrolledHeader 
                ? 'bg-white border-b border-zinc-200/80 px-5 py-3 shadow-xs' 
                : 'bg-transparent px-5 pt-8 pb-2'
            }`} 
            dir="rtl"
          >
            {/* Back to listings button on the right edge */}
            <button 
              onClick={onClose}
              className={`transition-all flex items-center justify-center cursor-pointer active:scale-95 border-0 ${
                isScrolledHeader 
                  ? 'bg-transparent text-zinc-950 p-2' 
                  : 'bg-white/90 backdrop-blur-sm text-zinc-900 p-2.5 rounded-full shadow-md hover:bg-zinc-50'
              }`}
              type="button"
              id="photographer-back-button"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.3] text-zinc-950" />
            </button>

            {/* Share & Favorite buttons on the left edge */}
            <div className="flex gap-3">
              <button 
                onClick={handleShareClick}
                className={`transition-all flex items-center justify-center cursor-pointer active:scale-95 border-0 ${
                  isScrolledHeader 
                    ? 'bg-transparent text-zinc-955 p-2' 
                    : 'bg-white/90 backdrop-blur-sm text-zinc-700 p-2.5 rounded-full shadow-md hover:bg-zinc-50'
                }`}
                type="button"
              >
                <Upload className="w-5 h-5 stroke-[2.3] text-zinc-955" />
              </button>
              <button 
                onClick={() => toggleFavorite(listing.id)}
                className={`transition-all flex items-center justify-center cursor-pointer active:scale-95 border-0 ${
                  isScrolledHeader 
                    ? 'bg-transparent p-2' 
                    : 'bg-white/90 backdrop-blur-sm text-rose-500 p-2.5 rounded-full shadow-md hover:bg-zinc-50'
                }`}
                type="button"
              >
                <Heart className={`w-5 h-5 transition-colors ${
                  isFavorite 
                    ? 'fill-rose-500 text-rose-500 stroke-rose-500' 
                    : isScrolledHeader  
                      ? 'text-zinc-955 stroke-[2.3]' 
                      : 'text-zinc-700 stroke-[2.2]'
                }`} />
              </button>
            </div>
          </div>

          {/* Scrollable Container Wrapper - Animates contents on top of the fixed image */}
          <div 
            onScroll={(e) => {
              const currentScrollTop = e.currentTarget.scrollTop;
              scrollTopRef.current = currentScrollTop;
              setScrollTop(currentScrollTop);

              const isPast = currentScrollTop > 180;
              if (isPast !== isScrolledHeader) {
                setIsScrolledHeader(isPast);
              }

              // Airbnb high-fidelity smooth fade-out to pure white
              const fadeThreshold = 240;
              const opacity = Math.max(0, 1 - currentScrollTop / fadeThreshold);
              if (imageContainerRef.current) {
                imageContainerRef.current.style.opacity = `${opacity}`;
              }
              lastScrollTopRef.current = currentScrollTop;
            }}
            className="flex-1 overflow-y-auto scrollbar-none pb-32 relative z-10 text-right bg-white touch-pan-y"
          >
            {/* STICKY TOP BACKGROUND HERO BANNER IMAGE (z-0) */}
            <div 
              ref={imageContainerRef}
              className="sticky top-0 h-[44vh] sm:h-96 w-full bg-white overflow-hidden no-swipe-back z-0 transition-opacity duration-75 will-change-transform"
            >
              <motion.img 
                layoutId={`listing-image-${listing.id}`}
                src={listing.images[currentImgIndex] || listing.images[0]} 
                alt={listing.title[language] || listing.title['ar']}
                className="w-full h-full object-cover select-none pointer-events-auto"
                style={{ willChange: 'transform' }}
                referrerPolicy="no-referrer"
              />
              {/* Dark Linear Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10 pointer-events-none" />
            </div>

            {/* White Card Pull-Up sliding over the image bottom part */}
            <div className="bg-white rounded-t-[36px] relative z-10 -mt-12 pt-12 px-5 sm:px-6 pb-20 text-right shadow-[0_-15px_30px_rgba(0,0,0,0.05)]">
              
              {/* Image counter (1 / 6) stuck above the content card and fades to white */}
              {listing.images.length > 1 && (
                <div 
                  style={{ opacity: Math.max(0, 1 - scrollTop / 180) }}
                  className="absolute -top-10 left-5 z-20 bg-zinc-950/75 text-white text-[10.5px] font-extrabold py-1 px-3.5 rounded-lg no-swipe-back select-none pointer-events-none transition-opacity duration-75"
                  dir="ltr"
                >
                  {currentImgIndex + 1} / {listing.images.length}
                </div>
              )}

              {/* Photographer Avatar Center-Aligned, Overlapping the Banner Seam */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[76px] h-[76px] rounded-full border-4 border-white shadow-md overflow-hidden bg-white z-20">
                <img 
                  src={listing.hostImage} 
                  alt={listing.hostName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

            {/* Page Title (Centered, bold/black display typography) */}
            <h1 className="text-xl md:text-2xl font-black text-zinc-950 text-center leading-normal px-2 mt-1">
              {listing.title[language] || listing.title['ar']}
            </h1>

            {/* Description Subtitle (Centered, gray font) */}
            <p className="text-zinc-500 text-[12.5px] sm:text-xs font-semibold text-center mt-2.5 px-4 leading-relaxed max-w-sm mx-auto">
              {config.subtitle}
            </p>

            {/* Centered Rating row with separation bullets */}
            <div className="flex justify-center items-center gap-1.5 text-xs text-zinc-900 font-extrabold mt-3.5 select-none">
              <span className="flex items-center gap-0.5 font-black text-amber-500">
                ★ {listing.rating}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="underline decoration-zinc-900 underline-offset-4 font-black cursor-pointer">
                {listing.reviewsCount.toLocaleString()} تقييمًا
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500 font-bold">{config.badgeText}</span>
            </div>

            {/* Home Service Delivery note */}
            <p className="text-[12px] text-zinc-800 font-bold text-center mt-3 select-none">
              {config.deliveryText}
            </p>

            {/* Grey Separator */}
            <div className="border-t border-zinc-100 my-6 max-w-md mx-auto" />

            {/* Generalized List entries packages */}
            <div className="space-y-4 max-w-md mx-auto">
              {config.packages.map((pkg, idx) => (
                <div key={idx} className="bg-white border border-zinc-150 rounded-[24px] p-4 flex flex-row items-center gap-4 text-right hover:border-zinc-300 transition-all shadow-xs">
                  {/* Right Text */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-extrabold text-[15px] text-zinc-950 pr-1">
                      {pkg.title}
                    </h3>
                    <p className="text-zinc-500 text-[11.5px] font-medium leading-relaxed pr-1 text-wrap">
                      {pkg.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 pr-1 text-[11.5px] font-black text-zinc-900 select-none">
                      <span>{pkg.priceText}</span>
                      {pkg.minBookText && (
                        <>
                          <span className="text-zinc-300">•</span>
                          <span className="text-zinc-500">{pkg.minBookText}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 pr-1 text-[11px] font-bold text-zinc-500">
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{pkg.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Contact Callout */}
            <p className="text-[11.5px] text-zinc-500 font-semibold text-center mt-4.5 max-w-sm mx-auto select-none">
              يمكنك مراسلة {displayHostName} لتخصيص العروض أو إجراء تغييرات عليها.
            </p>



            {/* "يمكنني ملاقاتك" Location Map */}
            <div className="space-y-2 mt-8 text-right max-w-md mx-auto">
              <h3 className="text-base font-black text-zinc-950 pr-0.5">يمكننا ملاقاتك</h3>
              <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed pr-0.5 max-w-sm">
                نأتي إلى موقع الضيوف في نطاق المنطقة الخدمية المحددة. يمكنك مراسلتنا لحجز الخدمة في موقع آخر.
              </p>
            </div>

            {/* "المؤهلات" Section */}
            <div className="space-y-6 mt-9 text-right max-w-md mx-auto border-t border-zinc-100 pt-7">
              <h2 className="text-base font-black text-zinc-950 pr-0.5">المؤهلات</h2>
              
              <div className="space-y-6 pt-1">
                {config.qualifications.map((qual, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    {/* Icon renders at start of line (the right hand side in RTL) */}
                    <div className="shrink-0 p-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-800 flex items-center justify-center shadow-xs">
                      {getQualIcon(qual.iconType)}
                    </div>
                    {/* Text on the left */}
                    <div className="flex-1 text-right space-y-0.5">
                      <h4 className="font-extrabold text-zinc-950 text-[13.5px]">
                        {qual.title}
                      </h4>
                      <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed">
                        {qual.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* "أشياء يجب معرفتها" */}
            <div className="space-y-6 mt-9 text-right max-w-md mx-auto border-t border-zinc-100 pt-7">
              <h2 className="text-base font-black text-zinc-950 pr-0.5">أشياء يجب معرفتها</h2>
              
              <div className="space-y-6 pt-1">
                {/* Guest bounds */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 p-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-800 flex items-center justify-center shadow-xs">
                    <Users className="w-5.5 h-5.5 stroke-[1.8]" />
                  </div>
                  {/* Text */}
                  <div className="flex-1 text-right space-y-0.5">
                    <h4 className="font-extrabold text-zinc-950 text-[13.5px]">
                      المتطلبات المتعلقة بالضيوف
                    </h4>
                    <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed">
                      يستطيع الضيوف بمختلف الأعمار الاستمتاع وحضور هذه الخدمات.
                    </p>
                  </div>
                </div>

                {/* Accessibility */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 p-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-850 flex items-center justify-center shadow-xs">
                    <svg className="w-5.5 h-5.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" strokeWidth="1.8" />
                      <path d="M19 13v-2c0-1.1-.9-2-2-2h-3l-2-2-2.5 1.5L8 10c-.5.5-.8 1.2-.8 2v5c0 1.1.9 2 2 2h3l1.5 4.5c.2.6.8 1 1.5 1h1c1 0 1.6-.9 1.3-1.8L15 15h3c1.1 0 2-.9 2-2z" strokeWidth="1.8" />
                    </svg>
                  </div>
                  {/* Text */}
                  <div className="flex-1 text-right space-y-0.5">
                    <h4 className="font-extrabold text-zinc-950 text-[13.5px]">
                      سهولة الوصول والترتيبات
                    </h4>
                    <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed">
                      يرجى مراسلتنا في الرسائل المباشرة لتخصيص الخدمة وتوفير التسهيلات المطلوبة.
                    </p>
                  </div>
                </div>

                {/* Cancellations */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 p-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-855 flex items-center justify-center shadow-xs">
                    <Calendar className="w-5.5 h-5.5 stroke-[1.8]" />
                  </div>
                  {/* Text */}
                  <div className="flex-1 text-right space-y-0.5">
                    <h4 className="font-extrabold text-zinc-950 text-[13.5px]">
                      سياسة الإلغاء المرنة
                    </h4>
                    <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed">
                      لاسترداد المبلغ بالكامل، يتاح الإلغاء قبل 24 ساعة من موعد الموعد أو بدأ تقديم الخدمة.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification / Seal Card (Gold Seal) */}
            <div className="bg-[#fafaf6] border border-[#f0eee0] rounded-[32px] p-7 text-center space-y-4.5 max-w-md mx-auto mt-9 shadow-xs">
              <div className="flex justify-center select-none py-1">
                {/* 3D Golden Wax Stamp */}
                <svg 
                  className="w-20 h-20 filter drop-shadow-[0_4px_8px_rgba(138,100,15,0.25)] hover:scale-105 transition-transform duration-350" 
                  viewBox="0 0 120 120" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="goldWax" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
                      <stop offset="0%" stopColor="#fffae0" />
                      <stop offset="25%" stopColor="#f5d677" />
                      <stop offset="65%" stopColor="#cf9e2b" />
                      <stop offset="85%" stopColor="#ab7b15" />
                      <stop offset="100%" stopColor="#704e05" />
                    </radialGradient>
                    
                    <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffd875" />
                      <stop offset="30%" stopColor="#a37612" />
                      <stop offset="50%" stopColor="#fff1bf" />
                      <stop offset="70%" stopColor="#875e07" />
                      <stop offset="100%" stopColor="#e5be5a" />
                    </linearGradient>

                    <filter id="insetShadow1" x="-20%" y="-20%" width="140%" height="140%">
                      <feOffset dx="1" dy="2" />
                      <feGaussianBlur stdDeviation="2" result="offset-blur" />
                      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                      <feFlood floodColor="black" floodOpacity="0.4" result="color" />
                      <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                      <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                  </defs>

                  <path 
                    d="M 60,8 C 72,6 83,12 91,18 C 99,24 105,32 110,42 C 115,52 118,63 115,75 C 112,87 106,97 97,104 C 88,111 77,115 65,116 C 53,117 40,113 31,106 C 22,99 15,90 11,79 C 7,68 8,55 12,45 C 16,35 22,26 31,19 C 40,12 50,10 60,8 Z" 
                    fill="url(#goldWax)" 
                    stroke="url(#goldMetallic)" 
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  <path 
                    d="M 60,16 C 69,15 78,19 84,24 C 91,29 96,36 99,44 C 102,52 104,61 102,70 C 100,79 96,87 89,93 C 82,99 74,102 65,103 C 56,104 46,101 39,96 C 32,91 26,84 23,76 C 20,68 21,59 24,51 C 27,43 32,36 39,30 C 46,24 54,17 60,16 Z" 
                    fill="#a17513" 
                    opacity="0.15" 
                  />

                  <circle cx="60" cy="60" r="39" fill="url(#goldWax)" stroke="url(#goldMetallic)" strokeWidth="2.5" />
                  <circle cx="60" cy="60" r="34" stroke="#7A5600" strokeWidth="1" strokeDasharray="2 1.5" opacity="0.6" />

                  <g filter="url(#insetShadow1)">
                    <path 
                      d="M 33,63 L 60,37 L 87,63 M 76,43 V 51" 
                      stroke="url(#goldMetallic)" 
                      strokeWidth="4.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M 38,61 V 85 C 38,87.2 39.8,89 42,89 H 78 C 80.2,89 82,87.2 82,85 V 61" 
                      stroke="url(#goldMetallic)" 
                      strokeWidth="4.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M 60,66 C 56.5,66 54,68.5 54,72 C 54,76.5 60,82 60,82 C 60,82 66,76.5 66,72 C 66,68.5 63.5,66 60,66 Z" 
                      stroke="url(#goldMetallic)" 
                      strokeWidth="4.0" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <circle cx="60" cy="72" r="1.5" fill="url(#goldMetallic)" />
                  </g>
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-zinc-950 px-2 leading-snug">
                {config.verifiedSealTitle}
              </h3>
              <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed px-3">
                {config.verifiedSealDescription}{" "}
                <span className="font-extrabold underline text-zinc-800 cursor-pointer hover:text-[#ff385c]">لمعرفة المزيد</span>
              </p>
            </div>

            {/* Dynamic Customer Review matching Quay's from Image 6 */}
            <div className="space-y-6 mt-9 text-right max-w-md mx-auto border-t border-zinc-100 pt-7 font-sans">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-base font-black text-zinc-950">
                  ★ {listing.rating} • {listing.reviewsCount.toLocaleString()} تقييمًا
                </h2>
                <span className="text-[11.5px] font-black text-zinc-800 underline hover:text-[#ff385c] cursor-pointer">إظهار كل التقييمات</span>
              </div>

              {/* Verified review box */}
              <div className="bg-white border border-zinc-150 rounded-[28px] p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#747474] select-none">منذ 3 أيام</span>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <h4 className="font-bold text-[13.5px] text-zinc-950">{config.reviewAuthor}</h4>
                      <p className="text-zinc-400 text-[10px] font-bold">{config.reviewLocation}</p>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center font-black text-rose-700 text-sm">
                      {config.reviewAuthor.charAt(0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-0.5 text-zinc-900 pr-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3" />
                  ))}
                </div>

                <p className="text-zinc-700 text-xs font-semibold leading-relaxed pr-0.5" dir="rtl">
                  {config.reviewText}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Fixed Reservator Footer */}
          <motion.div 
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed sm:absolute bottom-0 left-0 right-0 z-45 max-w-2xl mx-auto w-full flex flex-col pointer-events-none" 
            dir="rtl"
          >
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-t border-zinc-200 py-4.5 px-6 flex items-center justify-between shadow-[0_-12px_36px_-15px_rgba(0,0,0,0.12)] rounded-b-none sm:rounded-b-[36px]" dir="rtl">
              {/* Right: Booking price details */}
              <div className="text-right flex flex-col justify-center select-none">
                <div className="flex items-baseline gap-1" dir="rtl">
                  <span className="text-zinc-500 text-[10px] font-extrabold">بدءًا من</span>
                  <span className="text-base sm:text-lg font-black text-zinc-900">
                    {(listing.pricePerNight).toLocaleString()} دج
                  </span>
                  <span className="text-zinc-500 text-[10.5px] font-bold">
                    / الضيف
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-extrabold leading-none pt-1">
                  {config.priceNote}
                </p>
              </div>

              {/* Left: Button */}
              <button
                type="button"
                onClick={() => setShowBookingReview(true)}
                className="px-6 py-3.5 font-bold text-[13px] text-white bg-[#ff385c] hover:bg-rose-600 active:scale-95 transition-all rounded-2xl cursor-pointer shadow-xs border-0"
              >
                إظهار التواريخ
              </button>
            </div>
          </motion.div>

          {/* Integration overlays to keep reservation flow completely operational */}
          <AnimatePresence>
            {showBookingReview && (
              <BookingReviewPage 
                onClose={() => setShowBookingReview(false)} 
                listing={listing}
                checkIn={checkIn}
                checkOut={checkOut}
                guestCount={guestCount}
                total={total}
                getArabicDateRange={getArabicDateRange}
                onConfirm={() => {
                  setShowBookingReview(false);
                  handleReserve();
                }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showReportPage && (
              <ReportListingPage 
                onClose={() => setShowReportPage(false)} 
                listingTitle={listing.title[language] || listing.title['ar']}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-zinc-950/40 backdrop-blur-[1.5px] p-0 sm:p-4 overflow-hidden"
    >
      <motion.div 
        ref={modalRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        style={{ willChange: 'transform' }}
        className="relative bg-white w-full sm:max-w-2xl h-screen sm:h-[92vh] sm:rounded-[36px] flex flex-col overflow-hidden shadow-none sm:shadow-2xl border-0 sm:border border-zinc-200/40"
        id={`detail-modal-${listing.id}`}
        dir="rtl"
      >
        {/* Mobile Native Sleek Bottom Sheet Drag Indicator Pill */}
        <div className="absolute top-2.5 left-0 right-0 z-55 flex justify-center no-swipe-back select-none pointer-events-none">
          <div className="w-12 h-1.5 bg-zinc-350/60 rounded-full shadow-xs" />
        </div>
        {/* Share Copied Alert Indicator Overlay */}
        <AnimatePresence>
          {copiedLink && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white py-2.5 px-6 rounded-full text-[11px] font-black shadow-lg border border-zinc-800"
            >
              تم نسخ رابط السكن الذاتي للمشاركة بنجاح!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pinned Sticky Header Actions pinned above the scrolling content card */}
        <div 
          className={`absolute top-0 left-0 right-0 z-40 transition-all duration-200 flex justify-between items-center h-16 px-4 ${
            isScrolledHeader 
              ? 'bg-white border-b border-zinc-200/80 shadow-xs' 
              : 'bg-transparent'
          }`} 
          dir="rtl"
        >
          {/* Close/Back Button - White Circle pointing right */}
          <button 
            onClick={onClose}
            className={`transition-all flex items-center justify-center cursor-pointer active:scale-95 border border-zinc-200/30 rounded-full w-10 h-10 ${
              isScrolledHeader 
                ? 'bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-150' 
                : 'bg-white/90 backdrop-blur-sm text-zinc-900 shadow-md hover:bg-white'
            }`}
            id={`btn-close-detail-${listing.id}`}
            type="button"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.3]" />
          </button>
          
          <div className="flex gap-3">
             {/* Share button */}
            <button 
              onClick={handleShareClick}
              className={`transition-all flex items-center justify-center cursor-pointer active:scale-95 border border-zinc-200/30 rounded-full w-10 h-10 ${
                isScrolledHeader 
                  ? 'bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-150' 
                  : 'bg-white/90 backdrop-blur-sm text-zinc-700 shadow-md hover:bg-white'
              }`}
              id={`btn-share-detail-${listing.id}`}
              type="button"
            >
              <Upload className="w-4.5 h-4.5 stroke-[2.3]" />
            </button>
            {/* Favorite button */}
            <button 
              onClick={() => toggleFavorite(listing.id)}
              className={`transition-all flex items-center justify-center cursor-pointer active:scale-95 border border-zinc-200/30 rounded-full w-10 h-10 ${
                isScrolledHeader 
                  ? 'bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-150' 
                  : 'bg-white/90 backdrop-blur-sm text-rose-500 shadow-md hover:bg-white'
              }`}
              id={`btn-fav-detail-${listing.id}`}
              type="button"
            >
              <Heart className={`w-4.5 h-4.5 transition-colors ${
                isFavorite 
                  ? 'fill-rose-500 text-rose-500 stroke-rose-500' 
                  : 'text-zinc-700 stroke-[2.2]'
              }`} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content Wrapper - Handles all listing description/reviews scrolling */}
        <div 
          onScroll={(e) => {
            const currentScrollTop = e.currentTarget.scrollTop;
            scrollTopRef.current = currentScrollTop;
            setScrollTop(currentScrollTop);

            const isPast = currentScrollTop > 180;
            if (isPast !== isScrolledHeader) {
              setIsScrolledHeader(isPast);
            }
            
            // Airbnb high-fidelity smooth fade-out to pure white
            const fadeThreshold = 240;
            const opacity = Math.max(0, 1 - currentScrollTop / fadeThreshold);
            if (imageContainerRef.current) {
              imageContainerRef.current.style.opacity = `${opacity}`;
            }

            if (currentScrollTop > 10) {
              if (bannerState !== 'docked') setBannerState('docked');
            } else {
              if (bannerState !== 'floating') setBannerState('floating');
            }

            lastScrollTopRef.current = currentScrollTop;
          }}
          className="flex-1 overflow-y-auto scrollbar-none pb-36 text-right relative z-10 bg-white touch-pan-y"
        >
          {/* STICKY TOP BACKGROUND HERO BANNER IMAGE CAROUSEL (z-0) */}
          <div 
            ref={imageContainerRef}
            className="sticky top-0 h-[44vh] sm:h-96 w-full bg-white overflow-hidden no-swipe-back z-0 transition-opacity duration-75 will-change-transform"
          >
            <motion.div
              key={currentImgIndex}
              initial={{ opacity: 0.9, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0.9, x: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                const swipeThreshold = 55;
                if (info.offset.x > swipeThreshold) {
                  // Dragged right -> Previous image
                  handlePrevImage();
                } else if (info.offset.x < -swipeThreshold) {
                  // Dragged left -> Next image
                  handleNextImage();
                }
              }}
              className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center touch-pan-y pointer-events-auto"
            >
              <motion.img 
                layoutId={`listing-image-${listing.id}`}
                src={listing.images[currentImgIndex]} 
                alt={listing.title[language] || listing.title['ar']}
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{ willChange: 'transform' }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
            
            {listing.images.length > 1 && (
              <>
                {/* Hide navigation chevrons on mobile to match the screenshot, show on desktop screens */}
                <button 
                  onClick={(e) => handlePrevImage(e)}
                  className="hidden sm:flex absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-md z-10 transition-all text-zinc-800 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => handleNextImage(e)}
                  className="hidden sm:flex absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-md z-10 transition-all text-zinc-800 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Content Pull-Up Container overlaying the image bottom part */}
          <div className="bg-white rounded-t-[36px] relative z-10 -mt-12 pt-7 px-4 sm:px-6 pb-20 text-right shadow-[0_-15px_30px_rgba(0,0,0,0.05)]">
            
            {/* Image counter (1 / 6) stuck above the content card and fades to white */}
            {listing.images.length > 1 && (
              <div 
                style={{ opacity: Math.max(0, 1 - scrollTop / 185) }}
                className="absolute -top-10 left-5 z-20 bg-zinc-950/75 text-white text-[10.5px] font-extrabold py-1 px-3.5 rounded-lg no-swipe-back select-none pointer-events-none transition-opacity duration-75"
                dir="ltr"
              >
                {currentImgIndex + 1} / {listing.images.length}
              </div>
            )}
          
          {/* Centered Title - NO translation icon banner as instructed by user */}
          <div className="flex justify-center items-center text-center px-2">
            <h1 className="text-xl md:text-2xl font-black text-zinc-900 leading-normal text-center">
              {listing.title[language] || listing.title['ar']}
            </h1>
          </div>

          {/* Subtitles (Centered) */}
          <div className="text-zinc-500 text-[11.5px] font-[800] text-center space-y-1.5 mt-2.5">
            <p>غرفة خاصة في وحدة للإيجار في {listing.location[language] || listing.location['ar']}، الجزائر</p>
            <p>
              {listing.guests} ضيف · {listing.beds} غرفة نوم · {listing.beds} سرير · {listing.bathrooms} حمام مشترك
            </p>
          </div>

          {/* Centered Rating row with underline under the reviews count */}
          <div className="flex justify-center items-center gap-1.5 text-xs text-zinc-900 font-bold mt-4.5">
            <span className="flex items-center gap-0.5 font-black">
              ★ {listing.rating}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="underline decoration-zinc-900 underline-offset-4 font-black cursor-pointer">
              {listing.reviewsCount} {t('reviews')}
            </span>
          </div>

          {/* Horizontal Grey Separator Rule */}
          <div className="border-t border-zinc-150 my-5 max-w-sm mx-auto" dir="rtl" />

          {/* Host info: Name and years of hosting, fully aligned and styled exactly like the screenshot */}
          <div className="flex items-center justify-start gap-3.5 max-w-sm mx-auto px-1 mt-4" dir="rtl">
            <div className="relative shrink-0">
              <img 
                src={listing.hostImage} 
                alt={listing.hostName}
                className="w-12 h-12 rounded-full object-cover border border-zinc-100 shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-right flex flex-col justify-center">
              <span className="font-extrabold text-zinc-900 text-[14px]">
                المضيف: {listing.hostName}
              </span>
              <span className="text-zinc-500 text-[12px] font-medium mt-0.5">
                2 سنوات في مجال الاستضافة
              </span>
            </div>
          </div>

          {/* Horizontal Grey Separator Rule */}
          <div className="border-t border-zinc-150 my-5 max-w-sm mx-auto" dir="rtl" />

          <div className="max-w-sm mx-auto mt-6 space-y-5">
            {/* About stay */}
            <div className="space-y-2">
              <h2 className="text-sm font-black text-zinc-900">
                {t('aboutPlace')}
              </h2>
              <p className="text-zinc-600 text-xs leading-relaxed font-bold">
                {listing.description[language] || listing.description['ar']}
              </p>
            </div>

            {/* What this place offers (ما يقدمه هذا المسكن) - matched exactly to the screenshot and RTL layout */}
            <div className="space-y-4 pt-1 select-none" dir="rtl">
              <h2 className="text-base font-black text-zinc-950 text-right pr-1">
                ما يقدمه هذا المسكن
              </h2>
              
              <div className="space-y-4 pt-2">
                {/* Kitchen */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                      <path d="M7 2v20" />
                      <path d="M21 15V2v0a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2z" />
                      <path d="M18 22V15" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">مطبخ</span>
                </div>

                {/* Wifi */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M5 13a10 10 0 0 1 14 0" />
                      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                      <path d="M1.5 9.5a16 16 0 0 1 21 0" />
                      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">واي فاي</span>
                </div>

                {/* Hair Dryer */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M6 15h11a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H6.5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2z" />
                      <path d="M9 15v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5" />
                      <path d="M4 10h2" />
                      <path d="M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">مجفف شعر</span>
                </div>

                {/* Refrigerator */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="5" y1="10" x2="19" y2="10" />
                      <line x1="9" y1="5" x2="9" y2="7" />
                      <line x1="9" y1="13" x2="9" y2="17" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">ثلاجة</span>
                </div>

                {/* Microwave */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <rect x="6" y="7" width="9" height="8" rx="1" />
                      <circle cx="18" cy="8" r="1" fill="currentColor" />
                      <line x1="17" y1="11" x2="19" y2="11" />
                      <line x1="17" y1="14" x2="19" y2="14" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">ميكروويف</span>
                </div>

                {/* Carbon Monoxide Detector - Fully Enabled */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="5" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">جهاز الكشف عن أول أكسيد الكربون</span>
                </div>

                {/* Smoke Detector - Fully Enabled */}
                <div className="flex items-center justify-start gap-3.5">
                  <div className="shrink-0 text-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.1-2.5 7.6-6 9" />
                      <path d="M12 2a10 10 0 0 0-10 10c0 4.1 2.5 7.6 6 9" />
                      <path d="M8 12a4 4 0 0 1 8 0" />
                    </svg>
                  </div>
                  <span className="text-zinc-850 font-bold text-[13.5px] text-right">جهاز الكشف عن الدخان</span>
                </div>
              </div>

              {/* Show all 27 amenities button */}
              <button 
                type="button"
                onClick={() => setShowAmenitiesPage(true)}
                className="w-full text-center bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-950 font-black text-[13.5px] py-3.5 px-6 rounded-2xl transition-all cursor-pointer mt-3 animate-none"
              >
                عرض جميع الميزات الـ 27
              </button>
            </div>

            {/* Reviews sector */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black text-zinc-900">
                  {t('reviews')} ({listing.reviews.length})
                </h2>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600">
                  <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{listing.rating}</span>
                </div>
              </div>

              {listing.reviews.length === 0 ? (
                <div className="text-center py-4 text-zinc-400 text-xs font-bold">
                  {t('noReviewsYet')}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none no-scrollbar max-w-full">
                  {listing.reviews.map((review) => (
                    <div 
                      key={review.id}
                      className="min-w-[280px] max-w-[290px] bg-zinc-50 border border-zinc-100 rounded-2xl p-4 snap-start shrink-0 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={review.userAvatar} 
                          alt={review.userName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-extrabold text-zinc-900 text-xs truncate">
                            {review.userName}
                          </h4>
                          <p className="text-zinc-500 text-[9px] font-medium">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-rose-500">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star 
                            key={starIdx} 
                            className={`w-3 h-3 ${starIdx < review.rating ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-zinc-655 text-[11px] font-bold leading-relaxed line-clamp-3">
                        {review.comment[language] || review.comment['ar']}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Horizontal Grey Separator Rule */}
            <div className="border-t border-zinc-150 my-5" />

            {/* "أشياء يجب معرفتها" (Things to know) Section - MATCHES SCREENSHOT EXACTLY */}
            <div className="space-y-6 pt-1 text-right select-none" dir="rtl">
              <h2 className="text-xl font-black text-zinc-950 text-right pr-1">
                أشياء يجب معرفتها
              </h2>

              <div className="space-y-5">
                {/* 1. سياسة الإلغاء */}
                <div className="flex items-start justify-start gap-3.5">
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-start gap-2 text-right">
                      <Calendar className="w-5 h-5 text-zinc-850 shrink-0" />
                      <span className="font-extrabold text-zinc-900 text-sm">سياسة الإلغاء</span>
                      <ChevronLeft className="w-4 h-4 text-zinc-400 ml-auto mr-1" />
                    </div>
                    <div className="text-zinc-500 text-xs font-semibold leading-relaxed mt-1.5 pl-1 pr-7">
                      <p>إلغاء مجاني قبل 30 سبتمبر الإلغاء قبل تسجيل الوصول في 1 أكتوبر للحصول على رد جزئي للمبلغ المدفوع.</p>
                      <p className="mt-1">لمزيد من المعلومات، راجع السياسة الكاملة لهذا المضيف.</p>
                    </div>
                  </div>
                </div>

                {/* 2. قوانين البيت */}
                <div className="flex items-start justify-start gap-3.5 pt-2">
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-start gap-2 text-right">
                      <Key className="w-5 h-5 text-zinc-850 shrink-0" />
                      <span className="font-extrabold text-zinc-900 text-sm">قوانين البيت</span>
                      <ChevronLeft className="w-4 h-4 text-zinc-400 ml-auto mr-1" />
                    </div>
                    <div className="text-zinc-500 text-xs font-semibold leading-relaxed mt-1.5 space-y-1 pl-1 pr-7">
                      <p>تسجيل الوصول بعد 3:00 م</p>
                      <p>تسجيل المغادرة قبل 12:00 م</p>
                      <p>1 ضيف بحدٍ أقصى</p>
                    </div>
                  </div>
                </div>

                {/* 3. السلامة والعقار */}
                <div className="flex items-start justify-start gap-3.5 pt-2">
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-start gap-2 text-right">
                      <Shield className="w-5 h-5 text-zinc-850 shrink-0" />
                      <span className="font-extrabold text-zinc-900 text-sm">السلامة والعقار</span>
                      <ChevronLeft className="w-4 h-4 text-zinc-400 ml-auto mr-1" />
                    </div>
                    <div className="text-zinc-500 text-xs font-semibold leading-relaxed mt-1.5 space-y-1 pl-1 pr-7">
                      <p>لم يتم الإبلاغ عن جهاز إنذار أول أكسيد الكربون</p>
                      <p>لم يتم الإبلاغ عن جهاز إنذار للكشف عن الدخان</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Grey Separator Rule */}
              <div className="border-t border-zinc-150 my-5" />

              {/* Report this Listing button - Aligned perfectly to the right */}
              <button
                type="button"
                onClick={() => setShowReportPage(true)}
                className="flex items-center justify-start gap-2.5 w-full py-1 text-right group text-zinc-900 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Flag className="w-5 h-5 text-zinc-900 group-hover:text-rose-600 shrink-0 stroke-[2.2]" />
                <span className="font-extrabold text-sm underline underline-offset-4 decoration-zinc-900 group-hover:decoration-rose-600">
                  الإبلاغ عن هذا الإعلان
                </span>
                <ChevronLeft className="w-4 h-4 text-zinc-400 ml-auto mr-1 group-hover:text-rose-600 transition-colors" />
              </button>
            </div>
          </div>

        </div>

        </div>

        {/* BOTTOM FLOATING CONTAINER WITH PERSISTENT BANNER & RESERVATION BAR */}
        <motion.div 
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed sm:absolute bottom-0 left-0 right-0 z-45 max-w-2xl mx-auto w-full flex flex-col pointer-events-none" 
          dir="rtl"
        >
          
          {/* Custom style injection for the shimmering sweep on the floating red banner */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes shimmerSweep {
              0% { transform: translateX(-150%) skewX(-15deg); }
              50% { transform: translateX(150%) skewX(-15deg); }
              100% { transform: translateX(150%) skewX(-15deg); }
            }
            .animate-shimmer-sweep {
              animation: shimmerSweep 1.6s ease-in-out infinite;
            }
          `}} />

          {/* Airbnb-style Announcement Banner with Airbnb-style Layout transitions */}
          <div className="w-full flex flex-col items-center">
            <motion.div
              layout
              initial={{ x: 380, opacity: 0, scale: 0.92 }}
              animate={bannerState}
              variants={{
                floating: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  backgroundImage: 'linear-gradient(135deg, #ff385c 0%, #e11d48 50%, #ff385c 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px -4px rgba(255, 56, 92, 0.45), 0 4px 10px -4px rgba(255, 56, 92, 0.25)',
                  width: 'auto',
                  maxWidth: '265px',
                  marginRight: '22px',
                  marginLeft: '22px',
                  marginTop: '0px',
                  marginBottom: '8px',
                  paddingLeft: '14px',
                  paddingRight: '14px',
                  paddingTop: '7.5px',
                  paddingBottom: '7.5px',
                  borderWidth: '1px',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                },
                docked: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  backgroundImage: 'linear-gradient(135deg, #f4f4f5 0%, #f4f4f5 100%)', // zinc-100 grey matching the Airbnb screenshot
                  borderRadius: '0px',
                  boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
                  width: '100%',
                  maxWidth: '100%',
                  marginRight: '0px',
                  marginLeft: '0px',
                  marginTop: '0px',
                  marginBottom: '0px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                  borderWidth: '0px',
                  borderTopWidth: '1px',
                  borderColor: '#e2e2e5',
                }
              }}
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 48,
                  damping: 14.5,
                  duration: 2.0 // Stretches and morphs gracefully over 2 seconds
                },
                x: {
                  type: 'spring',
                  stiffness: 110,
                  damping: 15
                },
                opacity: { duration: 0.35 },
                scale: { duration: 0.45 },
                backgroundImage: { duration: 2.0 }, // Background color transition takes exactly 2 seconds
                borderRadius: { duration: 1.8 }
              }}
              className="relative flex items-center justify-between pointer-events-auto border-solid overflow-hidden"
            >
              {/* Shining sweep effect when floating to look premium */}
              {bannerState === 'floating' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent w-[50%] h-full -translate-x-full animate-shimmer-sweep" />
                </div>
              )}

              <div className={`flex items-center gap-2.5 w-full relative z-10 ${bannerState === 'docked' ? 'justify-center' : 'justify-between'}`}>
                {/* Iconic Gem representation matching screenshots - rendered first so it is on the right in RTL */}
                <div className="shrink-0 flex items-center justify-center transition-all duration-150">
                  {bannerState === 'floating' ? (
                    /* Pink design from Image 2 */
                    <div className="shrink-0 p-1 bg-white/20 border border-white/20 rounded-lg flex items-center justify-center animate-pulse">
                      <svg className="w-3.5 h-3.5 text-white fill-white" viewBox="0 0 24 24">
                        <polygon points="12,2 22,8.5 12,22 2,8.5" />
                        <polygon points="12,2 8.5,8.5 12,22 15.5,8.5" fill="rgba(255,255,255,0.4)" stroke="none" />
                        <polygon points="12,2 12,22 2,8.5" fill="rgba(0,0,0,0.05)" stroke="none" />
                      </svg>
                    </div>
                  ) : (
                    /* Flat Outline Diamond Vector from Image 1 matching user screenshot */
                    <svg className="w-4 h-4 text-zinc-900 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polygon points="12,3 22,8.5 12,21 2,8.5" />
                      <line x1="12" y1="3" x2="12" y2="21" />
                      <polyline points="2,8.5 12,8.5 22,8.5" />
                      <polyline points="7,3 12,8.5 17,3" />
                    </svg>
                  )}
                </div>

                {/* Visual attention-drawing writing effect where words fade & deblur sequentially */}
                <div className="flex items-center flex-wrap gap-x-1 sm:gap-x-1.2 justify-start select-none">
                  {["فرصة", "نادرة!", "عادةً", "ما", "يكون", "هذا", "المكان", "محجوزًا"].map((word, wordIndex) => (
                    <motion.span
                      key={`${listing.id}-word-${wordIndex}`}
                      initial={{ opacity: 0, filter: 'blur(3.5px)', y: 3 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{
                        duration: 0.22,
                        delay: 0.15 + wordIndex * 0.08,
                        ease: "easeOut"
                      }}
                      className={`inline-block text-[11px] sm:text-[11.8px] font-extrabold tracking-tight transition-colors duration-1000 leading-none ${
                        bannerState === 'floating' ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* SIGNATURE FIXED BOTTOM STICKY FOOTER - EXACT MATCH TO SCREENSHOT (حجز - تفاصيل الأسعار والتواريخ) */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-t border-zinc-200 py-4 px-6 flex items-center justify-between shadow-[0_-12px_36px_-15px_rgba(0,0,0,0.12)] rounded-b-none sm:rounded-b-[36px]" dir="rtl">
            
            {/* RIGHT SIDE: Dynamic Price info - matched exactly format to the requested picture */}
            <div className="text-right flex flex-col justify-center space-y-1">
              <div className="flex items-baseline gap-1" dir="rtl">
                <span className="text-lg sm:text-xl font-black text-zinc-900">
                  {listing.pricePerNight.toLocaleString()} دج
                </span>
                <span className="text-zinc-500 text-[10.5px] font-bold">
                  / {t('perNight')}
                </span>
              </div>
              <p className="text-[10.5px] text-zinc-600 font-bold leading-none">
                مقابل {days} ليالٍ · {getArabicDateRange()}
              </p>
              <p className="text-[10px] text-[#ff385c] font-black leading-none pt-0.5">
                 0 دج اليوم • إلغاء مجاني
              </p>
            </div>

            {/* LEFT SIDE: Big pink crimson customized Pill Button for booking action */}
            <button
              type="button"
              onClick={() => setShowBookingReview(true)}
              disabled={isBooked}
              className={`px-8 min-w-[110px] sm:px-11 py-3.5 font-black text-[12.5px] text-white tracking-wide rounded-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 ${
                isBooked 
                ? 'bg-zinc-900 shadow-none' 
                : 'bg-[#ff385c] hover:bg-rose-600 shadow-md shadow-rose-500/10'
              }`}
              id={`btn-reserve-action-${listing.id}`}
            >
              {isBooked ? (
                <span className="animate-pulse">تم الحجز!</span>
              ) : (
                <span>حجز</span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Full-screen Amenities overlay matching the screenshots exactly */}
        <AnimatePresence>
          {showAmenitiesPage && (
            <AmenitiesPage onClose={() => setShowAmenitiesPage(false)} hostName={listing.hostName} />
          )}
        </AnimatePresence>

        {/* Full-screen Reservation Review and Follow-up page overlay */}
        <AnimatePresence>
          {showBookingReview && (
            <BookingReviewPage 
              onClose={() => setShowBookingReview(false)} 
              listing={listing}
              checkIn={checkIn}
              checkOut={checkOut}
              guestCount={guestCount}
              total={total}
              getArabicDateRange={getArabicDateRange}
              onConfirm={() => {
                setShowBookingReview(false);
                handleReserve();
              }}
            />
          )}
        </AnimatePresence>

        {/* Full-screen Report Listing page overlay */}
        <AnimatePresence>
          {showReportPage && (
            <ReportListingPage 
              onClose={() => setShowReportPage(false)} 
              listingTitle={listing.title[language] || listing.title['ar']}
            />
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

// --- Full screen/modal AmenitiesPage Component ---
interface AmenitiesPageProps {
  onClose: () => void;
  hostName: string;
}

const AmenitiesPage: React.FC<AmenitiesPageProps> = ({ onClose, hostName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="absolute inset-0 bg-white z-50 overflow-y-auto pb-24 flex flex-col text-right scrollbar-none rounded-t-[36px] sm:rounded-[36px]"
      dir="rtl"
    >
      {/* Sticky Header with Back Button */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-zinc-100/90 px-6 py-4 flex items-center justify-start select-none">
        <button 
          onClick={onClose}
          type="button"
          className="text-zinc-900 bg-zinc-50 hover:bg-zinc-100 p-2.5 rounded-full transition-all cursor-pointer active:scale-95 flex items-center justify-center border border-zinc-100 shadow-xs"
        >
          <ArrowRight className="w-5.5 h-5.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Structured Content Container */}
      <div className="px-6 py-4 max-w-xl mx-auto w-full space-y-9 select-none">
        
        {/* Title: ما يقدمه هذا المسكن */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 pr-1 mt-1 leading-normal">
            ما يقدمه هذا المسكن
          </h2>

          {/* Category: الحمّام */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              الحمّام
            </h3>
            
            {/* مجفف شعر */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">مجفف شعر</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M6 15h11a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H6.5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2z" />
                  <path d="M9 15v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5" />
                  <path d="M4 10h2" />
                  <path d="M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
            </div>

            {/* بلسم الشعر */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">بلسم الشعر</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 2v20" />
                  <path d="M17 5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                  <path d="M12 5a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" />
                </svg>
              </div>
            </div>

            {/* صابون للجسم */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">صابون للجسم</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M7 11h10v9a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-9z" />
                  <path d="M12 11V3" />
                  <path d="M12 3a2 2 0 0 0-2-2h4a2 2 0 0 0-2 2z" />
                  <circle cx="12" cy="7" r="1.2" />
                </svg>
              </div>
            </div>

            {/* ماء ساخن */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">ماء ساخن</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M4 14a5 5 0 0 1 8 0M12 14a5 5 0 0 1 8 0" />
                  <path d="M12 2v10" />
                  <path d="M12 22v-3" />
                  <path d="M16 19v-2M8 19v-2" />
                </svg>
              </div>
            </div>

            {/* جل استحمام */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">جل استحمام</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M7 11h10v9a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-9z" />
                  <path d="M12 11V3" />
                  <circle cx="10" cy="7" r="1" />
                  <circle cx="14" cy="8" r="1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category: لوازم غرف النوم والغسيل */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              لوازم غرف النوم والغسيل
            </h3>

            {/* مكواة */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">مكواة</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M2 18h18" />
                  <path d="M17 18a4 4 0 0 0 4-4v-3c0-3-2-5-5-5H6c-2.5 0-4 1.5-4 4v4a4 4 0 0 0 4 4" />
                  <path d="M12 6V3h4v3" />
                </svg>
              </div>
            </div>

            {/* غسالة */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">غسالة</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
            </div>

            {/* نشافة */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">نشافة</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>

            {/* الأساسيات */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">الأساسيات (ملاءات، مناشف، صابون)</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M4 12h16" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category: التدفئة والتبريد */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              التدفئة والتبريد
            </h3>

            {/* مروحة سقف */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">مروحة سقف</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 9a4 4 0 0 0-4-4V2" />
                  <path d="M15 12h5a4 4 0 0 1-4 4" />
                  <path d="M12 15v5a4 4 0 0 1 4-4" />
                  <path d="M9 12H4a4 4 0 0 1 4-4" />
                </svg>
              </div>
            </div>

            {/* مكيف الهواء */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">مكيف الهواء</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 2v20M17 5H7a2 2 0 0 0-2 2v13" />
                </svg>
              </div>
            </div>

            {/* التدفئة */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">التدفئة</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 2v20M17 5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category: الترفيه */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              الترفيه والوسائط
            </h3>

            {/* تلفزيون */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">تلفزيون</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="7" width="20" height="15" rx="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category: ميزات الأمان والسلامة */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              ميزات الأمان والسلامة
            </h3>

            {/* كاميرات المراقبة الخارجية للعقار */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">كاميرات المراقبة الخارجية للعقار</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>

            {/* جهاز الكشف عن الدخان */}
            <div className="py-4 border-b border-zinc-100/60 text-right">
              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-bold text-[13.5px]">جهاز الكشف عن الدخان</span>
                <div className="text-zinc-800 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 2a10 10 0 0 1 10 10c0 4.1-2.5 7.6-6 9" />
                    <path d="M12 2a10 10 0 0 0-10 10c0 4.1 2.5 7.6 6 9" />
                    <path d="M8 12a4 4 0 0 1 8 0" />
                  </svg>
                </div>
              </div>
            </div>

            {/* جهاز الكشف عن أول أكسيد الكربون */}
            <div className="py-4 border-b border-zinc-100/60 text-right">
              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-bold text-[13.5px]">جهاز الكشف عن أول أكسيد الكربون</span>
                <div className="text-zinc-800 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" strokeDasharray="3 3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Category: الإنترنت والمكتب */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              الإنترنت والمكتب
            </h3>

            {/* واي فاي */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">واي فاي</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M5 13a10 10 0 0 1 14 0" />
                  <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                  <path d="M1.5 9.5a16 16 0 0 1 21 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category: الطعام والمطبخ */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              الطعام والمطبخ
            </h3>

            {/* مطبخ */}
            <div className="py-4 border-b border-zinc-100/60 text-right">
              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-bold text-[13.5px]">مطبخ</span>
                <div className="text-zinc-800 shrink-0 animate-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2z" />
                    <path d="M18 22V15" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-500 text-[11px] font-medium mt-1.5 leading-relaxed">
                مساحة حيث يمكن للضيوف طهي وجباتهم الخاصة
              </p>
            </div>

            {/* ثلاجة */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">ثلاجة</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="5" y1="10" x2="19" y2="10" />
                  <line x1="9" y1="5" x2="9" y2="7" />
                  <line x1="9" y1="13" x2="9" y2="17" />
                </svg>
              </div>
            </div>

            {/* ميكروويف */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">ميكروويف</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <rect x="6" y="7" width="9" height="8" rx="1" />
                  <circle cx="18" cy="8" r="1" fill="currentColor" />
                  <line x1="17" y1="11" x2="19" y2="11" />
                  <line x1="17" y1="14" x2="19" y2="14" />
                </svg>
              </div>
            </div>

            {/* ضروريات الطهي */}
            <div className="py-4 border-b border-zinc-100/60 text-right">
              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-bold text-[13.5px]">ضروريات الطهي</span>
                <div className="text-zinc-800 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M12 2v20" />
                    <path d="M5 12h14" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-500 text-[11px] font-medium mt-1.5 leading-relaxed">
                أواني ومقالي وزيت وملح وفلفل
              </p>
            </div>

            {/* الأطباق وأدوات المائدة */}
            <div className="py-4 border-b border-zinc-100/60 text-right">
              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-bold text-[13.5px]">الأطباق وأدوات المائدة</span>
                <div className="text-zinc-800 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <ellipse cx="12" cy="12" rx="9" ry="3" />
                    <ellipse cx="12" cy="19" rx="9" ry="3" />
                  </svg>
                </div>
              </div>
              <p className="text-zinc-500 text-[11px] font-medium mt-1.5 leading-relaxed">
                أوعية، وعيدان طعام، وصحون، وأكواب، وغيرها.
              </p>
            </div>

            {/* غلاية ماء ساخن */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">غلاية ماء ساخن</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M6 18h12" />
                  <path d="M17 18V8a5 5 0 0 0-10 0v10" />
                  <path d="M15 4V2" />
                  <path d="M12 4V2" />
                  <path d="M9 4V2" />
                </svg>
              </div>
            </div>

            {/* آلة صنع القهوة: ماكينة صنع القهوة بالتنقيط */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">آلة صنع القهوة: ماكينة صنع القهوة بالتنقيط</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path d="M9 12h6" />
                  <circle cx="12" cy="7" r="1.5" />
                </svg>
              </div>
            </div>

            {/* خلاط */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">خلاط</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 22h6v-4H9v4ZM10 18l-1.5-11h7L14 18h-4Z" />
                  <path d="M12 3v4" />
                </svg>
              </div>
            </div>

            {/* القهوة */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">القهوة</span>
              <div className="text-zinc-805 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M18 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" />
                  <path d="M6 2v2M10 2v2M14 2v2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category: ميزات الموقع */}
          <div className="space-y-4 pb-8">
            <h3 className="text-sm font-black text-zinc-900 pr-1 mt-5 border-b border-zinc-100/50 pb-2">
              ميزات الموقع
            </h3>

            {/* محل غسيل الملابس في مكان قريب */}
            <div className="flex items-center justify-between py-4 border-b border-zinc-100/60">
              <span className="text-zinc-800 font-bold text-[13.5px]">محل غسيل الملابس في مكان قريب</span>
              <div className="text-zinc-800 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="13" r="5" />
                  <path d="M12 10a3 3 0 0 1 3 3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        </div>

      </motion.div>
  );
};
