import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Listing, Booking, Message, UserProfile } from '../types';
import { initialListings, initialMessages, initialUserProfile } from '../data';

interface AppContextType {
  listings: Listing[];
  favorites: string[];
  bookings: Booking[];
  messages: Message[];
  userProfile: UserProfile;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  toggleFavorite: (id: string) => void;
  addBooking: (listingId: string, startDate: string, endDate: string, guestsCount: number) => void;
  cancelBooking: (bookingId: string) => void;
  sendMessageToHost: (messageId: string, text: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  addReviewToListing: (listingId: string, userName: string, rating: number, comment: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedWilaya: string;
  setSelectedWilaya: (wilaya: string) => void;
  recentlyViewed: { id: string; viewedAt: string }[];
  removeRecentViewed: (id: string) => void;
  isHosting: boolean;
  setIsHosting: (val: boolean) => void;
  isHostRegistered: boolean;
  setIsHostRegistered: (val: boolean) => void;
  isRegistered: boolean;
  setIsRegistered: (val: boolean) => void;
  isTransitioning: boolean;
  targetTransitionMode: 'host' | 'guest';
  triggerModeTransition: (mode: 'host' | 'guest') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('lacasa_favorites');
    if (saved) {
      try {
        const val = JSON.parse(saved);
        if (Array.isArray(val)) return val;
      } catch (e) {
        console.error('Failed to parse cached favorites:', e);
      }
    }
    return [];
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('lacasa_bookings');
    if (saved) {
      try {
        const val = JSON.parse(saved);
        if (Array.isArray(val)) return val;
      } catch (e) {
        console.error('Failed to parse cached bookings:', e);
      }
    }
    // Initial completed or upcoming mock booking
    return [
      {
        id: 'b_mock',
        listingId: 'chalet_1',
        startDate: '2026-06-15',
        endDate: '2026-06-20',
        totalPrice: 67500,
        guestsCount: 2,
        status: 'upcoming',
        listingTitle: {
          ar: 'شاليه جبل البلوط السويسري الخشبي في أعالي الحديقة الوطنية تيكجدا',
          fr: 'Chalet Suisse en Bois de Chêne dans les Hauteurs de Tikjda',
          en: 'A-Frame Oakwood Forest Chalet in High Tikjda National Park',
          kab: 'ⵛⵛⴰⵍⵉⵀⴰⵜ ⵏ ⵜⵉⴽⵊⴷⴰ ⵙ ⵓⵙⵖⴰⵔ ⴷⴻⴳ ⵓⴷⵔⴰⵔ'
        },
        listingImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'b_mock_past',
        listingId: 'recently_2',
        startDate: '2026-04-10',
        endDate: '2026-04-12',
        totalPrice: 19000,
        guestsCount: 4,
        status: 'completed',
        listingTitle: {
          ar: 'منزل أثري تم ترميمه بعناية في قلب قصبة الجزائر العتيقة',
          fr: 'Maison Traditionnelle Rénovée au Coeur de la Casbah d’Alger',
          en: 'Restored Heritage Riad in the Heart of Algiers Casbah',
          kab: 'ⴰⵅⴰⵎ ⴰⵇⴱⵓر ⵉⵜⵜⵓⵙⴻⴳⵎⴻⵏ ⴷⴻⴳ ⵓⵍ ⵏ ⵜⵇⴰⵚⴱⴰⵜ'
        },
        listingImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
      }
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('lacasa_messages');
    if (saved) {
      try {
        const val = JSON.parse(saved);
        if (Array.isArray(val)) return val;
      } catch (e) {
        console.error('Failed to parse cached messages:', e);
      }
    }
    return initialMessages;
  });

  // Connect to live real-time server messages stream (SSE)
  useEffect(() => {
    // 1. Initial hydration from server backend database
    fetch('/api/messages')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
          localStorage.setItem('lacasa_messages', JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.warn('Backend messages endpoint offline or unavailable, using local cache:', err);
      });

    // 2. Continuous Real-time stream channel registration
    try {
      const eventSource = new EventSource('/api/messages/stream');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'sync' && Array.isArray(payload.data)) {
            setMessages(payload.data);
            localStorage.setItem('lacasa_messages', JSON.stringify(payload.data));
          }
        } catch (e) {
          console.error('Error parsing SSE payload:', e);
        }
      };

      eventSource.onerror = (err) => {
        console.warn('Real-time connection dropped; automatic reconnect is handled by EventSource.', err);
      };

      return () => {
        eventSource.close();
      };
    } catch (e) {
      console.error('SSE initialization failed:', e);
    }
  }, []);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lacasa_profile');
    if (saved) {
      try {
        const val = JSON.parse(saved);
        if (val && typeof val === 'object') return val;
      } catch (e) {
        console.error('Failed to parse cached profile:', e);
      }
    }
    return initialUserProfile;
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('lacasa_listings');
    if (saved) {
      try {
        const parsed: Listing[] = JSON.parse(saved);
        const parsedIds = new Set(parsed.map((item) => item.id));
        const missingListings = initialListings.filter((item) => !parsedIds.has(item.id));
        if (missingListings.length > 0) {
          const merged = [...parsed, ...missingListings];
          localStorage.setItem('lacasa_listings', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse cached listings:', e);
        return initialListings;
      }
    }
    return initialListings;
  });

  const [selectedListing, setSelectedListingState] = useState<Listing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('All');
  const [isHosting, setIsHosting] = useState<boolean>(() => {
    return localStorage.getItem('lacasa_is_hosting') === 'true';
  });

  const handleSetIsHosting = useCallback((val: boolean) => {
    setIsHosting(val);
    localStorage.setItem('lacasa_is_hosting', String(val));
  }, []);

  const [isHostRegistered, setIsHostRegisteredState] = useState<boolean>(() => {
    return localStorage.getItem('lacasa_is_host_registered') === 'true';
  });

  const setIsHostRegistered = useCallback((val: boolean) => {
    setIsHostRegisteredState(val);
    localStorage.setItem('lacasa_is_host_registered', String(val));
  }, []);

  const [isRegistered, setIsRegisteredState] = useState<boolean>(() => {
    return localStorage.getItem('daro_user_registered') === 'true';
  });

  const setIsRegistered = useCallback((val: boolean) => {
    setIsRegisteredState(val);
    localStorage.setItem('daro_user_registered', String(val));
    if (!val) {
      localStorage.removeItem('daro_user_registered');
    }
  }, []);

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [targetTransitionMode, setTargetTransitionMode] = useState<'host' | 'guest'>('host');

  const triggerModeTransition = useCallback((mode: 'host' | 'guest') => {
    setTargetTransitionMode(mode);
    setIsTransitioning(true);
    setTimeout(() => {
      handleSetIsHosting(mode === 'host');
      setIsTransitioning(false);
    }, 3000);
  }, [handleSetIsHosting]);

  const [recentlyViewed, setRecentlyViewed] = useState<{ id: string; viewedAt: string }[]>(() => {
    const saved = localStorage.getItem('lacasa_recently_viewed');
    if (saved) {
      try {
        const val = JSON.parse(saved);
        if (Array.isArray(val)) return val;
      } catch (e) {
        console.error('Failed to parse cached recently viewed list:', e);
      }
    }
    return [
      { id: 'barcelona_room', viewedAt: new Date().toISOString() }, // Today
      { id: 'hotel_este', viewedAt: new Date(Date.now() - 24 * 3600000 - 1000).toISOString() }, // Yesterday
      { id: 'hotel_sevigne', viewedAt: new Date(Date.now() - 24 * 3600000 - 5000).toISOString() }, // Yesterday
      { id: 'recently_1', viewedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString() } // 2 days ago (Friday, May 29)
    ];
  });

  const setSelectedListing = useCallback((listing: Listing | null) => {
    setSelectedListingState(listing);
    if (listing) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((item) => item.id !== listing.id);
        const updated = [{ id: listing.id, viewedAt: new Date().toISOString() }, ...filtered];
        localStorage.setItem('lacasa_recently_viewed', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const removeRecentViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('lacasa_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem('lacasa_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lacasa_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('lacasa_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('lacasa_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('lacasa_listings', JSON.stringify(listings));
  }, [listings]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const addBooking = (listingId: string, startDate: string, endDate: string, guestsCount: number) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * listing.pricePerNight;

    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      listingId,
      startDate,
      endDate,
      totalPrice,
      guestsCount,
      status: 'upcoming',
      listingTitle: listing.title,
      listingImage: listing.images[0],
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Automatically trigger a message conversation with the host
    const conversationId = `c_${Date.now()}`;
    const newConvoMessage: Message = {
      id: `m_${Date.now()}`,
      senderName: `${listing.hostName} - للـ ${listing.title.ar}`,
      senderAvatar: listing.hostImage,
      lastMessage: `مرحباً بك! تم تأكيد حجزك لدينا من تاريخ ${startDate} إلى ${endDate}. يسعدنا استقبالكم في الجزائر!`,
      time: 'الآن',
      unread: true,
      conversation: [
        {
          id: `${conversationId}_init`,
          sender: 'host',
          text: `مرحباً بك أخي الكريم! تم تأكيد حجزك بنجاح في عقارنا (${listing.title.ar}) لعدد ضيوف ${guestsCount} من ${startDate} إلى ${endDate}. كيف يمكنني مساعدتك بخصوص النقل أو تيسير الوصول؟`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    setMessages((prev) => [newConvoMessage, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const sendMessageToHost = (messageId: string, text: string) => {
    const activeConvo = messages.find((m) => m.id === messageId);
    
    // Post to Express Real-Time chat engine
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId,
        text,
        sender: 'user',
        senderName: activeConvo ? `${activeConvo.senderName}` : 'محادثة جديدة',
        senderAvatar: activeConvo ? activeConvo.senderAvatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to send message to backend');
        const updatedConvo = await res.json();
        // Optimistic / instant local state update
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updatedConvo : m))
        );
      })
      .catch((err) => {
        console.warn('Backend send failed, using offline fallback propagation:', err);
        // Offline Fallback local update
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === messageId) {
              const userMsg = {
                id: `msg_${Date.now()}`,
                sender: 'user' as const,
                text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              return {
                ...m,
                lastMessage: text,
                time: 'الآن',
                unread: false,
                conversation: [...m.conversation, userMsg],
              };
            }
            return m;
          })
        );
      });
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const addReviewToListing = (listingId: string, userName: string, rating: number, comment: string) => {
    setListings((prevListings) =>
      prevListings.map((listing) => {
        if (listing.id === listingId) {
          const newReview = {
            id: `rev_${Date.now()}`,
            userName,
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            rating,
            date: new Date().toISOString().split('T')[0],
            comment: {
              ar: comment,
              fr: comment,
              en: comment,
              kab: comment,
            },
          };

          const updatedReviews = [newReview, ...listing.reviews];
          const averageRating = parseFloat(
            ((listing.rating * listing.reviewsCount + rating) / (listing.reviewsCount + 1)).toFixed(2)
          );

          return {
            ...listing,
            reviews: updatedReviews,
            reviewsCount: listing.reviewsCount + 1,
            rating: averageRating,
          };
        }
        return listing;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        listings,
        favorites,
        bookings,
        messages,
        userProfile,
        selectedListing,
        setSelectedListing,
        toggleFavorite,
        addBooking,
        cancelBooking,
        sendMessageToHost,
        updateUserProfile,
        addReviewToListing,
        searchTerm,
        setSearchTerm,
        selectedWilaya,
        setSelectedWilaya,
        recentlyViewed,
        removeRecentViewed,
        isHosting,
        setIsHosting: handleSetIsHosting,
        isHostRegistered,
        setIsHostRegistered,
        isRegistered,
        setIsRegistered,
        isTransitioning,
        targetTransitionMode,
        triggerModeTransition,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
