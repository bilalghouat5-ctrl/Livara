import React, { useState } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { MessageSquare, Send, CheckCheck, Compass, PhoneCall, Settings, Search, ArrowRight, ArrowLeft, X, Inbox, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MessagesTab: React.FC = () => {
  const { messages, sendMessageToHost } = useApp();
  const { t, language } = useLanguage();
  
  // Set default activeMessageId to null so the user arrives at the primary Message Inbox List view matching the mockup
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [selectedPill, setSelectedPill] = useState<'all' | 'travel' | 'support'>('all');
  const [inputText, setInputText] = useState('');
  const [copiedPhoneHost, setCopiedPhoneHost] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackOptionSelected, setFeedbackOptionSelected] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const activeMessage = messages.find((m) => m.id === activeMessageId);
  
  const triggerPhoneShow = () => {
    setCopiedPhoneHost(true);
    setTimeout(() => setCopiedPhoneHost(false), 4500);
  };
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMessageId) return;
  
    sendMessageToHost(activeMessageId, inputText);
    setInputText('');
  };

  // Filter messages dynamically based on selected pill:
  // "all" contains the user's mock conversation with Yassin.
  // "travel" and "support" are empty by default to show the precise mockup empty state.
  const filteredMessages = selectedPill === 'all' ? messages : [];
  
  // Base desktop/mobile responsive container styling matching other tabs for immaculate unity
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-10 pb-6 space-y-5 bg-white text-zinc-900" id="messages-tab-container" dir="rtl">
      
      {activeMessage ? (
        /* ==================== ACTIVE CHAT WORKSPACE (SUB-VIEW) ==================== */
        <div className="space-y-4 animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
            {/* Circular Back button pointing to the RIGHT exactly like other sub-views */}
            <button
              onClick={() => setActiveMessageId(null)}
              className="w-8.5 h-8.5 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="رجوع"
            >
              <ArrowRight className="w-4 h-4 text-zinc-800" />
            </button>

            {/* Title & Host Profile */}
            <div className="flex items-center gap-2.5 text-right">
              <img 
                src={activeMessage.senderAvatar} 
                alt={activeMessage.senderName}
                className="w-8.5 h-8.5 rounded-full object-cover shrink-0 ring-1 ring-zinc-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-extrabold text-[12.5px] text-zinc-900 leading-tight">
                  {activeMessage.senderName}
                </h3>
                <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5 justify-end">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                  <span>نشط حالياً</span>
                </p>
              </div>
            </div>

            {/* Call Action Button */}
            <button 
              onClick={triggerPhoneShow}
              className="w-8.5 h-8.5 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="اتصال تلفني"
            >
              <PhoneCall className="w-3.5 h-3.5 text-zinc-800" />
            </button>
          </div>

          {/* Copied Phone Overlay */}
          <AnimatePresence>
            {copiedPhoneHost && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900 text-white p-2.5 rounded-xl border border-zinc-800 shadow-lg text-[10.5px] font-bold text-center flex items-center justify-between"
              >
                <span>رقم المضيف للتنسيق: <b className="text-rose-400">0552 44 91 30</b></span>
                <span className="text-[8.5px] bg-zinc-800 text-zinc-300 py-0.5 px-1.5 rounded-full">جاهز للاتصال</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Bubbles List */}
          <div className="space-y-2.5 py-1 overflow-y-auto max-h-[340px] scrollbar-none flex flex-col gap-1">
            <div className="text-center pb-1">
              <span className="inline-block text-[9px] bg-zinc-50 border border-zinc-100 text-zinc-400 py-0.5 px-2.5 rounded-full font-semibold">
                تأمين مشفر ومحمي بواسطة Daro 
              </span>
            </div>

            {activeMessage.conversation.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id || index}
                  className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] rounded-[1.125rem] px-3 py-2 shadow-xs ${
                    isUser 
                      ? 'bg-[#111111] text-white rounded-br-none' 
                      : 'bg-zinc-100 text-zinc-950 rounded-bl-none'
                  }`}>
                    <p className="text-[11.5px] font-medium leading-relaxed whitespace-pre-line text-right">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-70">
                      <span>{msg.time}</span>
                      {isUser && <CheckCheck className="w-3 h-3 text-zinc-300" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Field */}
          <form 
            onSubmit={handleSubmitMessage}
            className="pt-1.5 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك للمضيف..."
              className="flex-1 text-[12px] bg-zinc-100 hover:bg-zinc-150 text-zinc-900 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-zinc-200 outline-none transition-all"
              id="messages-input-field"
            />
            <button
              type="submit"
              className="bg-[#111111] hover:bg-black text-white p-2.5 rounded-xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
              id="messages-send-button"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : showArchived ? (
        /* ==================== ARCHIVED SUB-VIEW (MATCHING IMAGE 2) ==================== */
        <div className="space-y-5 animate-fade-in text-right">
          {/* Top Bar Header with Circular Back Button and Title */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100/80">
            {/* Symmetrical placeholder for visual center balance */}
            <div className="w-8.5 h-8.5 pointer-events-none opacity-0" />

            {/* Title */}
            <h1 className="text-[20px] font-black text-zinc-900 tracking-tight leading-tight">
              المؤرشفة
            </h1>

            {/* Circular Back button pointing to the RIGHT */}
            <button
              onClick={() => setShowArchived(false)}
              className="w-8.5 h-8.5 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="رجوع"
            >
              <ArrowRight className="w-4 h-4 text-zinc-800" />
            </button>
          </div>

          {/* Centered Empty State Illustration precisely matching Image 2 */}
          <div className="flex flex-col items-center justify-center pt-16 pb-20 text-center space-y-4 w-full">
            {/* Custom rounded chat-bubble icon with outline matching Image 2 perfectly */}
            <div className="w-11 h-11 flex items-center justify-center text-zinc-900 bg-white border-2 border-zinc-900 rounded-xl relative shadow-[1.5px_1.5px_0_rgba(0,0,0,1)]">
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Rect speech bubble with rounded corners */}
                <rect x="3" y="4" width="18" height="12" rx="3" />
                {/* Bottom dialog pointer */}
                <path d="M7 16l-3 4v-4" />
                {/* Horizontal comment lines */}
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="13" y2="12" />
              </svg>
            </div>

            {/* Title & Prompts matching Image 2 */}
            <div className="space-y-1">
              <h3 className="text-[13.5px] font-extrabold text-[#111111]">
                ليست لديك أي رسائل مؤرشفة
              </h3>
              <p className="text-[11px] font-bold text-zinc-400">
                ستظهر هنا أي رسائل مؤرشفة.
              </p>
            </div>

            {/* Back to Inbox Action button matching Image 2 */}
            <div className="pt-3">
              <button
                onClick={() => setShowArchived(false)}
                className="px-5 py-2 border border-zinc-250 hover:bg-zinc-50 hover:border-zinc-350 active:scale-95 text-zinc-900 text-[11px] font-black rounded-lg transition-all cursor-pointer font-sans"
              >
                عرض جميع الرسائل
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== PRIMARY INBOX LIST VIEW (MATCHING MOCKUP) ==================== */
        <div className="space-y-4 animate-fade-in">
          
          {/* Top Bar Header with Circular Buttons to the LEFT */}
          <div className="flex items-center justify-between pb-1" dir="ltr">
            <div className="flex gap-2">
              {/* Settings Cog button */}
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-8.5 h-8.5 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="إعدادات المراسلة"
              >
                <Settings className="w-4 h-4 text-zinc-800" />
              </button>
              
              {/* Search button */}
              <button 
                className="w-8.5 h-8.5 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="بحث"
              >
                <Search className="w-4 h-4 text-zinc-800" strokeWidth={2.2} />
              </button>
            </div>
            <div></div>
          </div>

          {/* Big Header Title strictly to the right: "الرسائل" */}
          <div className="w-full text-right pt-2 pb-1">
            <h1 className="text-[26px] sm:text-[30px] font-black text-zinc-900 tracking-tight leading-tight">
              الرسائل
            </h1>
          </div>

          {/* Dynamic Navigation Pill Filters matched with screenshot */}
          <div className="flex gap-2 pb-1 justify-start overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedPill('all')}
              className={`font-black px-4.5 py-1.5 sm:py-2 rounded-full text-[12.5px] transition-all cursor-pointer active:scale-95 ${
                selectedPill === 'all'
                  ? 'bg-[#111111] text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-[#111111] font-semibold'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedPill('travel')}
              className={`font-black px-4.5 py-1.5 sm:py-2 rounded-full text-[12.5px] transition-all cursor-pointer active:scale-95 ${
                selectedPill === 'travel'
                  ? 'bg-[#111111] text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-[#111111] font-semibold'
              }`}
            >
              السفر
            </button>
            <button
              onClick={() => setSelectedPill('support')}
              className={`font-black px-4.5 py-1.5 sm:py-2 rounded-full text-[12.5px] transition-all cursor-pointer active:scale-95 ${
                selectedPill === 'support'
                  ? 'bg-[#111111] text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-[#111111] font-semibold'
              }`}
            >
              الدعم
            </button>
          </div>

          {/* Dynamic Content View depending on filters */}
          {filteredMessages.length === 0 ? (
            /* Empty State Mimicking Mockup Screenshot perfectly */
            <div className="flex flex-col items-center justify-center pt-12 pb-16 text-center space-y-4 w-full">
              
              {/* Beautiful Overlapping Conversation Speech Bubbles Icon Block */}
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <svg className="w-9 h-9 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {/* Back speech bubble (dotted pattern similar to illustration) */}
                  <path d="M20 13a2 2 0 0 1-2 2H9l-3 3v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" strokeWidth="1.4" opacity="0.45" strokeDasharray="3 2" />
                  {/* Front speech bubble with horizontal mock text lines inside */}
                  <rect x="4" y="6" width="14" height="10" rx="2.5" fill="white" />
                  <path d="M8 16l-3 3v-3" />
                  <line x1="7" y1="9" x2="15" y2="9" strokeWidth="1.6" />
                  <line x1="7" y1="12" x2="12" y2="12" strokeWidth="1.6" />
                </svg>
              </div>

              {/* Title & Prompt text matching the screenshot */}
              <div className="space-y-1.5 px-4">
                <h3 className="text-[17px] sm:text-[18px] font-black text-zinc-900 leading-tight">
                  ليس لديك أي رسائل
                </h3>
                <p className="text-[12px] sm:text-[13px] font-medium text-zinc-500 leading-relaxed">
                  ستظهر هنا أي رسائل جديدة تتلقاها.
                </p>
              </div>
            </div>
          ) : (
            /* Interactive Chat Contacts List (Highly aligned with design) */
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-black text-zinc-400 block pr-0.5 mb-1 text-right">المحادثات المتاحة</span>
              <div className="space-y-2">
                {filteredMessages.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMessageId(item.id)}
                    className="flex items-center gap-3 p-2.5 sm:p-3 bg-white border border-zinc-100 hover:bg-zinc-50 rounded-xl cursor-pointer transition-all active:scale-[0.99] relative"
                  >
                    <img 
                      src={item.senderAvatar} 
                      alt={item.senderName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9px] text-zinc-400 font-bold shrink-0">{item.time}</span>
                        <h4 className="font-extrabold text-[12.5px] sm:text-[13px] text-zinc-900 truncate pl-2">
                          {item.senderName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-400 text-ellipsis overflow-hidden whitespace-nowrap mt-0.5 font-medium">
                        {item.lastMessage}
                      </p>
                    </div>

                    {item.unread && (
                      <span className="absolute top-1/2 -translate-y-1/2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Elegant Bottom Splash Sheet for Inbox Settings */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Dark interactive backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-end justify-center"
            >
              {/* Sliding Bottom Panel Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-t-[1.75rem] p-4 pb-6 shadow-2xl space-y-4 text-zinc-900 border-t border-zinc-100"
                dir="rtl"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100/90">
                  {/* Close cross button on the left */}
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="w-8 h-8 hover:bg-zinc-100 rounded-full flex items-center justify-center transition-all cursor-pointer text-zinc-900 active:scale-90"
                    title="إغلاق"
                  >
                    <X className="w-4.5 h-4.5 text-black stroke-[2.2px]" />
                  </button>

                  {/* Centered Bold text title */}
                  <h2 className="text-[13.5px] font-black text-black text-center flex-1">
                    إعدادات المراسلة
                  </h2>

                  {/* Symmetrical placeholder for visual center balance */}
                  <div className="w-8 h-8 pointer-events-none" />
                </div>

                {/* Option Rows List */}
                <div className="space-y-0.5">
                  {/* Row 1: Archived Option */}
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setShowArchived(true);
                    }}
                    className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 text-right w-full justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* Box Icon on the right */}
                        <div className="w-8 h-8 bg-zinc-100 group-hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all shrink-0">
                          <Inbox className="w-3.5 h-3.5 text-zinc-800" />
                        </div>
                        
                        {/* Text right aligned */}
                        <span className="text-[12.5px] font-extrabold text-zinc-900 group-hover:text-black">
                          المؤرشفة
                        </span>
                      </div>
                      <ChevronLeft className="w-3.5 h-3.5 text-zinc-350" />
                    </div>
                  </button>

                  {/* Row 2: Feedback Option */}
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsFeedbackOpen(true);
                    }}
                    className="w-full flex items-center justify-between py-2 px-2.5 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 text-right w-full justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* Slanted Send Icon on the right */}
                        <div className="w-8 h-8 bg-zinc-100 group-hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all shrink-0">
                          <Send className="w-3.5 h-3.5 text-zinc-800 -rotate-45 relative right-px top-px" />
                        </div>
                        
                        {/* Text right aligned */}
                        <span className="text-[12.5px] font-extrabold text-zinc-905 group-hover:text-black">
                          تقديم ملاحظات
                        </span>
                      </div>
                      <ChevronLeft className="w-3.5 h-3.5 text-zinc-350" />
                    </div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. Precise Elegant Send Feedback Drawer (Image 1) */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <>
            {/* Dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsFeedbackOpen(false);
                setFeedbackSubmitted(false);
                setFeedbackOptionSelected(false);
              }}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-end justify-center"
            >
              {/* Sliding Feedback Panel Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-t-[1.75rem] p-5 shadow-2xl text-zinc-900 border-t border-zinc-100 flex flex-col justify-between"
                dir="rtl"
              >
                {/* Top close cross button exactly like image 1 */}
                <div className="flex justify-start pb-2">
                  <button
                    onClick={() => {
                      setIsFeedbackOpen(false);
                      setFeedbackSubmitted(false);
                      setFeedbackOptionSelected(false);
                    }}
                    className="w-8 h-8 hover:bg-zinc-105 hover:text-black rounded-full flex items-center justify-center transition-all cursor-pointer text-zinc-800 self-start"
                    title="إغلاق"
                  >
                    <X className="w-4.5 h-4.5 stroke-[2px]" />
                  </button>
                </div>

                {!feedbackSubmitted ? (
                  <>
                    {/* Content Section */}
                    <div className="space-y-4 pt-1 pb-4 text-right">
                      {/* Bold Title "تقديم ملاحظات" */}
                      <h2 className="text-[20px] font-black text-[#111111] leading-tight">
                        تقديم ملاحظات
                      </h2>

                      {/* Description Subtitle */}
                      <p className="text-[11.5px] font-bold text-zinc-800 leading-relaxed pr-0.5">
                        يرجى إخبارنا عن موضوع ملاحظاتك. نقوم بمراجعة جميع الملاحظات ولكن لا يمكننا الرد بشكل فردي.
                      </p>

                      {/* Divider */}
                      <div className="border-t border-zinc-150 my-3.5" />

                      {/* Selectable Option Row (Image 1 item) */}
                      <div className="flex items-center justify-between py-2 text-right group">
                        {/* Text representing the title on the right */}
                        <span className="text-[12.5px] font-bold text-zinc-900 leading-none">
                          ملاحظات عامة حول الصندوق الوارد
                        </span>

                        {/* Interactive Selection circle on the LEFT */}
                        <button
                          type="button"
                          onClick={() => setFeedbackOptionSelected(!feedbackOptionSelected)}
                          className={`w-5.5 h-5.5 rounded-full border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer outline-none ${
                            feedbackOptionSelected 
                              ? 'border-[#ff385c] bg-white' 
                              : 'border-zinc-300 bg-white hover:border-zinc-400'
                          }`}
                        >
                          {feedbackOptionSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff385c]" />
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-zinc-150 my-3.5" />

                      {/* Explanatory notes */}
                      <p className="text-[11.5px] font-bold text-zinc-550 leading-relaxed pr-0.5">
                        قد نتصل بك بشأن ملاحظاتك. هل تحتاج إلى المساعدة في مسألة أخرى؟{' '}
                        <button
                          type="button"
                          onClick={() => {
                            // Inform user visually without interrupting the flow
                            alert("يمكنك التواصل معنا عبر صفحة الدعم الفني أو عبر البريد الإلكتروني.");
                          }}
                          className="underline hover:text-black font-extrabold cursor-pointer"
                        >
                          تواصل معنا
                        </button>
                      </p>
                    </div>

                    {/* Footer Row exactly as shown in Image 1 */}
                    <div className="pt-4 border-t border-zinc-150/80 flex items-center justify-between mt-4">
                      {/* Left: Next button */}
                      <button
                        disabled={!feedbackOptionSelected}
                        onClick={() => setFeedbackSubmitted(true)}
                        className={`px-6 py-2 rounded-xl transition-all font-black text-[12px] cursor-pointer ${
                          feedbackOptionSelected
                            ? 'bg-[#111111] text-white hover:bg-black active:scale-95 shadow-sm'
                            : 'bg-zinc-100 text-zinc-350 cursor-not-allowed'
                        }`}
                      >
                        التالي
                      </button>

                      {/* Right: Cancel button */}
                      <button
                        onClick={() => {
                          setIsFeedbackOpen(false);
                          setFeedbackOptionSelected(false);
                        }}
                        className="text-[12px] font-black text-zinc-900 hover:text-black cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </>
                ) : (
                  /* Success Screen state */
                  <div className="py-8 text-center space-y-4 animate-fade-in text-right">
                    <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 mb-2">
                      <Check className="w-5.5 h-5.5 stroke-[3px]" />
                    </div>
                    <div className="space-y-1 text-center">
                      <h3 className="text-[14.5px] font-black text-zinc-900">
                        تم تقديم ملاحظاتك بالنجاح
                      </h3>
                      <p className="text-[11px] font-bold text-zinc-400 max-w-xs mx-auto leading-relaxed">
                        شكراً لك على تخصيص جزء من وقتك لمساعدتنا في تحسين تجربة المراسلة في Daro.
                      </p>
                    </div>
                    <div className="pt-3 text-center">
                      <button
                        onClick={() => {
                          setIsFeedbackOpen(false);
                          setFeedbackSubmitted(false);
                          setFeedbackOptionSelected(false);
                        }}
                        className="px-6 py-2 bg-zinc-900 hover:bg-black text-white text-[11px] font-black rounded-lg transition-all active:scale-95 cursor-pointer"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
