import React, { useState } from 'react';
import { useApp } from './AppContext';
import { useLanguage } from './LanguageContext';
import { MessageSquare, Send, CheckCheck, Compass, PhoneCall, Settings, Search, ArrowRight, ArrowLeft, X, Inbox, ChevronLeft, Check, Image as ImageIcon, Paperclip, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LottieEmptyState } from './LottieEmptyState';

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

  // States to hold the attached items
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  
  const activeMessage = messages.find((m) => m.id === activeMessageId);
  
  const triggerPhoneShow = () => {
    setCopiedPhoneHost(true);
    setTimeout(() => setCopiedPhoneHost(false), 4500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedFile(null); // Clear selected file when image selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      setSelectedFile({
        name: file.name,
        size: sizeStr,
      });
      setSelectedImage(null); // Clear selected image when file selected
    }
  };
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage && !selectedFile) return;
    if (!activeMessageId) return;

    let textToSend = inputText;
    if (selectedImage) {
      textToSend = `[IMAGE]${selectedImage}|${inputText.trim()}`;
    } else if (selectedFile) {
      textToSend = `[FILE]${selectedFile.name}|${selectedFile.size}|${inputText.trim()}`;
    }
  
    sendMessageToHost(activeMessageId, textToSend);
    setInputText('');
    setSelectedImage(null);
    setSelectedFile(null);
  };

  // Filter messages dynamically based on selected pill:
  // "all" contains the user's mock conversation with Yassin.
  // "travel" and "support" are empty by default to show the precise mockup empty state.
  const filteredMessages = selectedPill === 'all' ? messages : [];
  
  // Base desktop/mobile responsive container styling matching other tabs for immaculate unity
  return (
    <div className="w-full bg-white text-zinc-900" id="messages-tab-container" dir="rtl">
      
      {activeMessage ? (
        /* ==================== ACTIVE CHAT WORKSPACE (SUB-VIEW) ==================== */
        <div className="max-w-md mx-auto px-4 sm:px-6 pt-4 pb-6 animate-fade-in flex flex-col h-[calc(100vh-140px)] min-h-[580px] sm:h-[680px]" dir="rtl">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100/90 shrink-0">
            <div className="flex items-center gap-3 text-right">
              {/* Circular Back button pointing to the RIGHT */}
              <button
                onClick={() => {
                  setActiveMessageId(null);
                  setSelectedImage(null);
                  setSelectedFile(null);
                }}
                className="w-9 h-9 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 text-zinc-800"
                title="رجوع"
              >
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.3]" />
              </button>

              {/* Host Profile Info Group */}
              <div className="flex items-center gap-2.5">
                <img 
                  src={activeMessage.senderAvatar} 
                  alt={activeMessage.senderName}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-zinc-150"
                  referrerPolicy="no-referrer"
                />
                <div className="text-right">
                  <h3 className="font-extrabold text-[13.5px] text-zinc-950 leading-tight">
                    {activeMessage.senderName}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1.5 mt-0.5 justify-start">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>نشط حالياً</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Call Action Button */}
            <button 
              onClick={triggerPhoneShow}
              className="w-9 h-9 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 text-zinc-855"
              title="اتصال تلفني"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>

          {/* Copied Phone Overlay */}
          <AnimatePresence>
            {copiedPhoneHost && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900 text-white p-3 rounded-2xl border border-zinc-800 shadow-lg text-[11px] font-bold text-center flex items-center justify-between shrink-0 my-1"
              >
                <span>رقم المضيف للتنسيق: <b className="text-rose-400 font-mono tracking-wider">0552 44 91 30</b></span>
                <span className="text-[9px] bg-zinc-800 text-zinc-300 py-0.5 px-2 rounded-full font-mono">جاهز للاتصال</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Bubbles List */}
          <div className="flex-1 space-y-3.5 py-4 px-3 overflow-y-auto no-scrollbar flex flex-col gap-1.5 bg-zinc-50/70 border border-zinc-100/60 rounded-2xl my-2 pr-3 pl-3">
            <div className="text-center pb-1 shrink-0">
              <span className="inline-block text-[9.5px] bg-zinc-50 border border-zinc-100 text-zinc-400 py-1 px-3.5 rounded-full font-bold">
                تأمين مشفر ومحمي بواسطة Daro 
              </span>
            </div>

            {activeMessage.conversation.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const isImage = msg.text.startsWith('[IMAGE]');
              const isFile = msg.text.startsWith('[FILE]');
              
              let displayContent = msg.text;
              let imageSrc = '';
              let imageCaption = '';
              let fileName = '';
              let fileSize = '';
              let fileComment = '';

              if (isImage) {
                const parts = msg.text.substring(7).split('|');
                imageSrc = parts[0];
                imageCaption = parts[1] || '';
              } else if (isFile) {
                const parts = msg.text.substring(6).split('|');
                fileName = parts[0];
                fileSize = parts[1] || '';
                fileComment = parts[2] || '';
              }

              return (
                <div 
                  key={msg.id || index}
                  className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] rounded-[1.25rem] px-4 py-2.5 shadow-xs ${
                    isUser 
                      ? 'bg-[#111111] text-white rounded-br-none text-right' 
                      : 'bg-white border border-zinc-150 text-zinc-950 rounded-bl-none text-right'
                  }`}>
                    {isImage ? (
                      <div className="space-y-1.5 flex flex-col items-end">
                        <img 
                          src={imageSrc} 
                          alt="مرفق" 
                          className="rounded-lg max-w-full max-h-48 object-cover select-none cursor-zoom-in"
                          referrerPolicy="no-referrer"
                        />
                        {imageCaption && (
                          <p className={`text-[12px] font-medium leading-relaxed whitespace-pre-line text-right ${isUser ? 'text-zinc-100' : 'text-zinc-800'}`}>
                            {imageCaption}
                          </p>
                        )}
                      </div>
                    ) : isFile ? (
                      <div className="space-y-2 flex flex-col text-right">
                        <div className={`flex items-center gap-2.5 p-2 rounded-xl border ${isUser ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-800'}`} dir="rtl">
                          <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 ${isUser ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-705'}`}>
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <div className="text-right flex-1 min-w-0">
                            <p className="text-[11.5px] font-extrabold truncate leading-tight">{fileName}</p>
                            <p className="text-[9.5px] opacity-75 mt-0.5 font-mono">{fileSize}</p>
                          </div>
                        </div>
                        {fileComment && (
                          <p className={`text-[12px] font-medium leading-relaxed whitespace-pre-line text-right ${isUser ? 'text-zinc-100' : 'text-zinc-800'}`}>
                            {fileComment}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[12px] font-medium leading-relaxed whitespace-pre-line text-right">{displayContent}</p>
                    )}
                    
                    <div className="flex items-center justify-end gap-1 mt-1 text-[8.5px] opacity-75">
                      <span className="font-mono">{msg.time}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-zinc-300" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Attachment Preview Bar */}
          <AnimatePresence>
            {(selectedImage || selectedFile) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl flex items-center justify-between gap-3 text-right shrink-0 mb-1.5"
                dir="rtl"
              >
                <div className="flex items-center gap-2.5">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="معاينة"
                      className="w-11 h-11 rounded-lg object-cover border border-zinc-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-zinc-200 text-zinc-750 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5.5 h-5.5" />
                    </div>
                  )}
                  <div className="text-right min-w-0">
                    <p className="text-xs font-black text-zinc-900 truncate max-w-[180px]">
                      {selectedImage ? 'صورة للارسال' : selectedFile?.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-bold mt-0.5">
                      {selectedImage ? 'جاهزة للإرسال' : selectedFile?.size}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                  }}
                  className="w-8 h-8 hover:bg-zinc-200/80 rounded-full flex items-center justify-center text-zinc-450 hover:text-rose-500 transition-all cursor-pointer shrink-0"
                  title="إلغاء المرفق"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input Field Form */}
          <form 
            onSubmit={handleSubmitMessage}
            className="pt-2 flex gap-1.5 items-center bg-white shrink-0"
            dir="rtl"
          >
            {/* Hidden Input Pickers */}
            <input 
              type="file" 
              id="chat-image-picker" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
            <input 
              type="file" 
              id="chat-file-picker" 
              accept="*/*" 
              className="hidden" 
              onChange={handleFileChange}
            />

            {/* Image attachment button trigger */}
            <button
              type="button"
              onClick={() => document.getElementById('chat-image-picker')?.click()}
              className="w-[42px] h-[42px] bg-zinc-100 hover:bg-zinc-150 text-zinc-700 hover:text-zinc-950 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95"
              title="إضافة صورة"
            >
              <ImageIcon className="w-4.5 h-4.5" />
            </button>

            {/* File attachment button trigger */}
            <button
              type="button"
              onClick={() => document.getElementById('chat-file-picker')?.click()}
              className="w-[42px] h-[42px] bg-zinc-100 hover:bg-zinc-150 text-zinc-700 hover:text-zinc-950 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95"
              title="إرسال ملف"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك للمضيف..."
              className="flex-1 text-[12.5px] bg-zinc-100 hover:bg-zinc-150 text-zinc-900 px-4 py-3 rounded-xl border border-transparent focus:border-zinc-200 outline-none transition-all text-right"
              id="messages-input-field"
            />

            {/* Send button */}
            <button
              type="submit"
              className="bg-[#111111] hover:bg-black text-white p-3 rounded-xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
              id="messages-send-button"
            >
              <Send className="w-4.5 h-4.5 translate-x-[1px]" />
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 sm:px-6 pt-5 pb-6 space-y-4 bg-white text-zinc-900" dir="rtl">
          {showArchived ? (
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
            <div className="w-full pt-4">
              <LottieEmptyState
                animationUrl="https://assets3.lottiefiles.com/packages/lf20_9wS9gS.json" // Beautiful sliding letter inbox empty state
                title="لا توجد رسائل واردة"
                subtitle={
                  selectedPill === 'travel' 
                    ? "ليس لديك أي رسائل بخصوص رحلاتك وأسفارك بعد." 
                    : selectedPill === 'support'
                    ? "ليس لديك أي تذاكر دعم فني نشطة حالياً."
                    : "ستظهر هنا أي رسائل جديدة تتلقاها."
                }
                height={160}
              />
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
                    className="flex items-center gap-3 p-3 bg-white border border-zinc-100/90 hover:bg-zinc-50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] relative"
                  >
                    <img 
                      src={item.senderAvatar} 
                      alt={item.senderName}
                      className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex justify-between items-baseline" dir="rtl">
                        <h4 className="font-black text-[13.5px] text-zinc-900 truncate pl-2">
                          {item.senderName}
                        </h4>
                        <span className="text-[9.5px] text-zinc-400 font-bold shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11.5px] text-zinc-500 text-ellipsis overflow-hidden whitespace-nowrap mt-0.5 font-bold">
                        {item.lastMessage}
                      </p>
                    </div>

                    {item.unread && (
                      <span className="absolute top-1/2 -translate-y-1/2 left-3 w-2 h-2 bg-rose-500 rounded-full shadow-xs" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                        <span className="text-[#ff385c] font-black block mt-1 hover:underline">
                          تواصل معنا عبر البريد: support@daro.dz
                        </span>
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
