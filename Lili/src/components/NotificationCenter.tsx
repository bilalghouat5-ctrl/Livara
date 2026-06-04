import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Star, Calendar, MessageSquare, Heart, Tag, Home, ChevronRight, BellOff } from 'lucide-react';
import { Haptic } from './HapticEngine';

export interface AppNotification {
  id: string;
  type: 'booking' | 'message' | 'review' | 'favorite' | 'promo' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'تأكيد الحجز ✅',
    body: 'تم تأكيد حجزك لشاليه تيكجدا من 15 إلى 20 جوان. استمتع بإقامتك!',
    time: 'الآن',
    read: false,
  },
  {
    id: 'n2',
    type: 'message',
    title: 'رسالة من ياسين',
    body: 'الشاليه جاهز لاستقبالكم في التاريخ المحدد. تفضل بالاتصال عند وصولك.',
    time: 'منذ 5 دقائق',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'n3',
    type: 'promo',
    title: '🔥 عرض خاص — خصم 20%',
    body: 'احجز بيتك في جيجل هذا الأسبوع واستفد من خصم 20% على أي إقامة لمدة 3 ليالٍ أو أكثر.',
    time: 'منذ ساعة',
    read: false,
  },
  {
    id: 'n4',
    type: 'review',
    title: 'تقييم جديد لإعلانك',
    body: 'أضاف رضا بلعيد تقييم ⭐⭐⭐⭐⭐ على شاليهك في تيزي وزو.',
    time: 'أمس',
    read: true,
  },
  {
    id: 'n5',
    type: 'favorite',
    title: 'سعر مُخفَّض على مفضلاتك',
    body: 'انخفض سعر فيلا زرالدة بمسبح خلفي بنسبة 15%. لا تفوّت الفرصة!',
    time: 'أمس',
    read: true,
  },
  {
    id: 'n6',
    type: 'system',
    title: 'مرحباً بك في دارو 👋',
    body: 'اكتشف أجمل العقارات في الجزائر — من شواطئ جيجل إلى جبال جرجرة وصحراء تمنراست.',
    time: 'منذ يومين',
    read: true,
  },
];

const typeIcons: Record<AppNotification['type'], React.ReactNode> = {
  booking:  <Calendar className="w-4 h-4 text-emerald-600" />,
  message:  <MessageSquare className="w-4 h-4 text-blue-500" />,
  review:   <Star className="w-4 h-4 text-amber-500" />,
  favorite: <Heart className="w-4 h-4 text-[#ff385c]" />,
  promo:    <Tag className="w-4 h-4 text-violet-500" />,
  system:   <Home className="w-4 h-4 text-zinc-500" />,
};

const typeBg: Record<AppNotification['type'], string> = {
  booking:  'bg-emerald-50',
  message:  'bg-blue-50',
  review:   'bg-amber-50',
  favorite: 'bg-rose-50',
  promo:    'bg-violet-50',
  system:   'bg-zinc-100',
};

// ── Toast banner (top of screen) ────────────────────────────────────
interface ToastProps {
  notification: AppNotification;
  onDismiss: () => void;
}

const NotifToast: React.FC<ToastProps> = ({ notification, onDismiss }) => (
  <motion.div
    initial={{ y: -90, opacity: 0, scale: 0.95 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: -90, opacity: 0, scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    className="absolute top-12 left-3 right-3 z-[99990] rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-zinc-100/80 px-3.5 py-3 flex items-start gap-3"
    dir="rtl"
    onClick={onDismiss}
    style={{ cursor: 'pointer' }}
  >
    <div className={`w-9 h-9 rounded-xl ${typeBg[notification.type]} flex items-center justify-center shrink-0 mt-0.5`}>
      {notification.avatar ? (
        <img src={notification.avatar} alt="" className="w-full h-full rounded-xl object-cover" referrerPolicy="no-referrer" />
      ) : (
        typeIcons[notification.type]
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-black text-zinc-900 leading-tight">{notification.title}</p>
      <p className="text-[10.5px] text-zinc-500 font-semibold mt-0.5 leading-snug line-clamp-2">{notification.body}</p>
    </div>
    <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className="shrink-0 mt-0.5 text-zinc-300 hover:text-zinc-500 transition cursor-pointer">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

// ── Full Notification Panel ──────────────────────────────────────────
interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const NotifPanel: React.FC<PanelProps> = ({ isOpen, onClose, notifications, onMarkAllRead, onDismiss }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 z-[9998]"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-3xl max-h-[80%] flex flex-col overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
            dir="rtl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-zinc-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-zinc-800" />
                <h2 className="text-[15px] font-black text-zinc-900">الإشعارات</h2>
                {unreadCount > 0 && (
                  <span className="bg-[#ff385c] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={onMarkAllRead} className="text-[11px] font-black text-[#ff385c] cursor-pointer active:opacity-70">
                    قراءة الكل
                  </button>
                )}
                <button onClick={onClose} className="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition">
                  <X className="w-3.5 h-3.5 text-zinc-600" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 pb-6">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <BellOff className="w-10 h-10 text-zinc-200" />
                  <p className="text-[13px] font-black text-zinc-400">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {notifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer active:bg-zinc-50 transition-colors ${!notif.read ? 'bg-rose-50/40' : ''}`}
                      onClick={() => { Haptic.selection(); onDismiss(notif.id); }}
                    >
                      {/* Icon / Avatar */}
                      <div className={`w-10 h-10 rounded-2xl ${typeBg[notif.type]} flex items-center justify-center shrink-0`}>
                        {notif.avatar ? (
                          <img src={notif.avatar} alt="" className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          typeIcons[notif.type]
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[12.5px] leading-tight ${notif.read ? 'font-bold text-zinc-700' : 'font-black text-zinc-950'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[9.5px] text-zinc-400 font-semibold shrink-0 mt-0.5">{notif.time}</span>
                        </div>
                        <p className="text-[10.5px] text-zinc-500 font-medium mt-0.5 leading-snug line-clamp-2">{notif.body}</p>
                      </div>

                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-[#ff385c] shrink-0 mt-1.5" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Main hook + Bell Button ──────────────────────────────────────────
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS);
  const [toastQueue, setToastQueue] = useState<AppNotification[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate an incoming push notification after 4s
  useEffect(() => {
    const timer = setTimeout(() => {
      const incoming: AppNotification = {
        id: 'n_push_1',
        type: 'message',
        title: 'رسالة جديدة من فاطمة',
        body: 'هل أنتم بخير؟ الفيلا جاهزة لاستقبالكم 🏡',
        time: 'الآن',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      };
      setNotifications(prev => [incoming, ...prev]);
      setToastQueue(prev => [...prev, incoming]);
      Haptic.trigger('success');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toastQueue.length === 0) return;
    const timer = setTimeout(() => {
      setToastQueue(prev => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastQueue]);

  const dismissToast = useCallback(() => {
    setToastQueue(prev => prev.slice(1));
  }, []);

  const markAllRead = useCallback(() => {
    Haptic.light();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotif = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return {
    notifications,
    toastQueue,
    isPanelOpen,
    setIsPanelOpen,
    unreadCount,
    dismissToast,
    markAllRead,
    dismissNotif,
  };
};

// ── Exported Bell Icon Button ────────────────────────────────────────
interface NotifBellProps {
  unreadCount: number;
  onClick: () => void;
}

export const NotifBell: React.FC<NotifBellProps> = ({ unreadCount, onClick }) => (
  <button
    onClick={() => { Haptic.selection(); onClick(); }}
    className="relative w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-all active:scale-90 cursor-pointer"
    aria-label="الإشعارات"
  >
    <Bell className="w-4.5 h-4.5 text-zinc-700" />
    <AnimatePresence>
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#ff385c] text-white text-[8.5px] font-black flex items-center justify-center rounded-full px-1"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

// ── Re-export Panel + Toast for use in PhoneFrame ───────────────────
export { NotifToast, NotifPanel };
