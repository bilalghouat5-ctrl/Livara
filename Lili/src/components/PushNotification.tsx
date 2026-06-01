import React, { useEffect, useState, useCallback } from 'react';
import { Bell, X, Home, MessageSquare, Star } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  body: string;
  icon: 'booking' | 'message' | 'review';
  timestamp: number;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'حجز جديد! 🎉', body: 'تم تأكيد حجزك في شاليه تيكجدا ليلة الجمعة.', icon: 'booking', timestamp: 0 },
  { id: 'n2', title: 'رسالة من المضيف', body: 'ياسين: مرحباً، الشاليه جاهز لاستقبالكم!', icon: 'message', timestamp: 0 },
  { id: 'n3', title: 'قيّم إقامتك ⭐', body: 'شاركنا رأيك في فيلا زرالدة — يساعد الضيوف الآخرين.', icon: 'review', timestamp: 0 },
];

const iconMap = {
  booking: <Home className="w-4 h-4 text-rose-500" />,
  message: <MessageSquare className="w-4 h-4 text-blue-500" />,
  review: <Star className="w-4 h-4 text-amber-500" />,
};

export const PushNotificationManager: React.FC = () => {
  const [queue, setQueue] = useState<Notification[]>([]);
  const [current, setCurrent] = useState<Notification | null>(null);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setCurrent(null);
      setExiting(false);
    }, 300);
  }, []);

  // Schedule sample notifications after splash clears
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [3500, 9000, 18000];
    SAMPLE_NOTIFICATIONS.forEach((n, i) => {
      timers.push(setTimeout(() => {
        setQueue(prev => [...prev, { ...n, timestamp: Date.now() }]);
      }, delays[i]));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Show next in queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      // Auto-dismiss after 4s
      const t = setTimeout(dismiss, 4200);
      return () => clearTimeout(t);
    }
  }, [current, queue, dismiss]);

  if (!current) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9990] flex justify-center px-3 pt-3 pointer-events-none`}
      style={{ paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))' }}
    >
      <div
        className={`
          pointer-events-all
          w-full max-w-sm bg-white/95 backdrop-blur-xl 
          border border-zinc-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
          rounded-2xl px-4 py-3 flex items-start gap-3
          ${exiting ? 'notif-exit' : 'notif-enter'}
        `}
        onClick={dismiss}
        role="button"
        tabIndex={0}
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
          {iconMap[current.icon]}
        </div>

        {/* Text */}
        <div className="flex-1 text-right min-w-0">
          <p className="text-[12px] font-black text-zinc-900 leading-tight">{current.title}</p>
          <p className="text-[11px] font-medium text-zinc-500 mt-0.5 leading-snug truncate">{current.body}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 mt-0.5 haptic-tap"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
