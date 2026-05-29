import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "all",    label: "الكل",         icon: "◉" },
  { id: "chalet", label: "شاليهات",      icon: "⌂" },
  { id: "farm",   label: "مزارع",        icon: "❋" },
  { id: "hall",   label: "قاعات أفراح", icon: "◈" },
  { id: "studio", label: "استوديوهات",  icon: "⬡" },
  { id: "daily",  label: "كراء يومي",   icon: "▣" },
];

const WILAYAS = [
  "الجزائر","وهران","قسنطينة","عنابة","بجاية","تلمسان",
  "سطيف","باتنة","بسكرة","أدرار","تيزي وزو","المدية",
  "غرداية","ورقلة","الشلف","تيارت","مستغانم","سكيكدة","جيجل",
];

const LISTINGS = [
  { id:1,  category:"chalet",  wilaya:"بجاية",    title:"شاليه فاخر على الشاطئ",      desc:"إطلالة رائعة على البحر، مسبح خاص، 4 غرف نوم، مجهز بالكامل للعائلات الكريمة.", price:12000, verified:true,  phone:"0555123456", icon:"⬛", rating:4.9, reviews:38, amenities:["واي فاي","مسبح","مكيف","باربيكيو"], badge:"الأكثر طلباً" },
  { id:2,  category:"farm",    wilaya:"المدية",    title:"مزرعة هادئة بين الأشجار",    desc:"مزرعة واسعة محاطة بالطبيعة، مناسبة للعائلات والمجموعات الكبيرة.", price:8000,  verified:true,  phone:"0661234567", icon:"◆", rating:4.7, reviews:21, amenities:["شواء","ملعب أطفال","قاعة مغطاة"] },
  { id:3,  category:"hall",    wilaya:"الجزائر",   title:"قاعة أفراح الياسمين",         desc:"تسع 400 شخص، ديكور فاخر، خدمة الضيافة الكاملة شاملة.", price:95000, verified:true,  phone:"0770987654", icon:"◉", rating:4.8, reviews:63, amenities:["تكييف مركزي","صوت وإضاءة","مواقف","خدمة كاملة"], badge:"موصى به" },
  { id:4,  category:"studio",  wilaya:"وهران",     title:"استوديو تصوير احترافي",       desc:"معدات حديثة، خلفيات متعددة، إضاءة احترافية كاملة.", price:4500,  verified:false, phone:"0550111222", icon:"▲", rating:4.5, reviews:14, amenities:["إضاءة احترافية","خلفيات","كاميرات","غرفة تبديل"] },
  { id:5,  category:"daily",   wilaya:"تيزي وزو", title:"شقة يومية وسط المدينة",      desc:"شقة مريحة بالقرب من المرافق، متاحة للكراء اليومي والأسبوعي.", price:3500,  verified:true,  phone:"0666555444", icon:"■", rating:4.6, reviews:29, amenities:["واي فاي","مكيف","مطبخ","موقف"] },
  { id:6,  category:"chalet",  wilaya:"جيجل",      title:"شاليه عائلي بالقرب من الغابة",desc:"هدوء تام، 3 غرف، حديقة واسعة، مناسب للعائلات.", price:7000,  verified:true,  phone:"0554321098", icon:"◑", rating:4.4, reviews:17, amenities:["حديقة","شواء","واي فاي","مواقف"] },
  { id:7,  category:"hall",    wilaya:"قسنطينة",   title:"قاعة النجوم الكبرى",          desc:"تسع 600 شخص، مناسبة للأعراس والمؤتمرات الكبرى.", price:120000,verified:false, phone:"0773456789", icon:"✦", rating:4.3, reviews:45, amenities:["قاعتان","تكييف","صوتيات","مطبخ صناعي"] },
  { id:8,  category:"farm",    wilaya:"تيارت",     title:"مزرعة الفرسان",               desc:"خيول، مساحة خضراء رحبة، غرف تقليدية أصيلة.", price:15000, verified:true,  phone:"0667890123", icon:"◈", rating:4.9, reviews:9,  amenities:["خيول","غرف تقليدية","حمام سباحة"], badge:"جديد" },
];

const STORAGE_KEYS = {
  onboarding: "livara_onboarding_done",
  listings: "livara_listings",
  favorites: "livara_favorites",
  verification: "livara_verification",
};

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeDzPhone = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("213")) return digits;
  if (digits.startsWith("0")) return `213${digits.slice(1)}`;
  return digits;
};

const createEmptyDraft = () => ({
  category: "",
  title: "",
  wilaya: "",
  desc: "",
  price: "",
  phone: "",
});

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body, #root { background: #f7f7f7; min-height: 100vh; }

  /* ── ONBOARDING ── */
  .ob-wrap {
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    min-height: 100vh;
    max-width: 430px;
    margin: 0 auto;
    background: #f5f5f5;
    position: relative;
    overflow: hidden;
  }

  .ob-slider {
    display: flex;
    width: 300%;
    height: 100vh;
    transition: transform 0.45s cubic-bezier(0.77, 0, 0.175, 1);
    will-change: transform;
  }

  .ob-slide {
    width: calc(100% / 3);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 56px 28px 40px;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  /* slide 1 */
  .ob-slide-1 { background: #1a1a1a; }
  .ob-s1-glow {
    position: absolute; top: -80px; right: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(211,47,47,0.22) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }
  .ob-s1-pattern {
    position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(135deg, transparent, transparent 30px, rgba(211,47,47,0.035) 30px, rgba(211,47,47,0.035) 31px);
  }

  /* slide 2 */
  .ob-slide-2 { background: #ffffff; }

  /* slide 3 */
  .ob-slide-3 { background: #f5f5f5; }

  /* logo */
  .ob-logo-big {
    width: 72px; height: 72px; background: #d32f2f;
    border-radius: 22px; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 32px; font-weight: 900; font-family: 'Cairo', sans-serif;
    margin-bottom: 36px; position: relative; z-index: 1;
    box-shadow: 0 16px 40px rgba(211,47,47,0.38);
  }
  .ob-s1-title {
    font-size: 42px; font-weight: 900; color: #fff;
    line-height: 1.1; margin-bottom: 14px;
    position: relative; z-index: 1; font-family: 'Cairo', sans-serif;
  }
  .ob-s1-title span { color: #d32f2f; }
  .ob-s1-sub {
    font-size: 16px; color: rgba(255,255,255,0.52);
    line-height: 1.7; margin-bottom: 40px;
    position: relative; z-index: 1; font-family: 'Cairo', sans-serif; font-weight: 400;
  }
  .ob-pills {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin-bottom: 40px; position: relative; z-index: 1;
  }
  .ob-pill {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
    border-radius: 30px; padding: 8px 16px;
    color: rgba(255,255,255,0.72); font-size: 13px;
    font-family: 'Cairo', sans-serif; font-weight: 600;
  }

  /* slide 2 content */
  .ob-s2-hero {
    background: #d32f2f; border-radius: 24px;
    padding: 28px 22px; margin-bottom: 28px; position: relative; overflow: hidden;
  }
  .ob-s2-hero-pat {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(45deg, transparent, transparent 16px, rgba(255,255,255,0.05) 16px, rgba(255,255,255,0.05) 17px);
  }
  .ob-s2-hero-icon { font-size: 52px; margin-bottom: 10px; position: relative; z-index: 1; }
  .ob-s2-hero-title { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 7px; position: relative; z-index: 1; font-family: 'Cairo', sans-serif; }
  .ob-s2-hero-sub { font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6; position: relative; z-index: 1; font-family: 'Cairo', sans-serif; font-weight: 400; }
  .ob-features { display: flex; flex-direction: column; gap: 14px; }
  .ob-feat {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 14px; background: #fafafa;
    border-radius: 16px; border: 1px solid #f0f0f0;
  }
  .ob-feat-ico {
    width: 42px; height: 42px; border-radius: 13px;
    background: #1a1a1a; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .ob-feat-ico.red { background: #d32f2f; }
  .ob-feat-t { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 3px; font-family: 'Cairo', sans-serif; }
  .ob-feat-d { font-size: 11px; color: #888; line-height: 1.55; font-family: 'Cairo', sans-serif; font-weight: 400; }

  /* slide 3 content */
  .ob-s3-top { text-align: center; padding-top: 8px; margin-bottom: 24px; }
  .ob-s3-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fff0f0; color: #c62828;
    border-radius: 30px; padding: 7px 14px;
    font-size: 11px; font-weight: 700; margin-bottom: 16px;
    border: 1px solid #ffcdd2; font-family: 'Cairo', sans-serif;
  }
  .ob-s3-title { font-size: 28px; font-weight: 900; color: #111; line-height: 1.2; margin-bottom: 8px; font-family: 'Cairo', sans-serif; }
  .ob-s3-sub { font-size: 13px; color: #888; line-height: 1.6; font-family: 'Cairo', sans-serif; font-weight: 400; }
  .ob-wilayas { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 22px; }
  .ob-wchip {
    background: #fff; border-radius: 9px; padding: 7px 12px;
    font-size: 11px; font-weight: 700; color: #333;
    border: 1px solid #efefef; font-family: 'Cairo', sans-serif;
  }
  .ob-wchip.hot { background: #d32f2f; color: #fff; border-color: #d32f2f; }
  .ob-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
  .ob-stat {
    background: #fff; border-radius: 16px;
    padding: 16px 14px; border: 1px solid #efefef; text-align: right;
  }
  .ob-stat-n { font-size: 26px; font-weight: 900; color: #d32f2f; line-height: 1; margin-bottom: 3px; font-family: 'Cairo', sans-serif; }
  .ob-stat-l { font-size: 10px; color: #999; font-weight: 600; font-family: 'Cairo', sans-serif; }

  /* bottom nav shared */
  .ob-bottom { margin-top: auto; }
  .ob-dots { display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; }
  .ob-dot { height: 6px; border-radius: 3px; transition: width .35s ease, background .35s ease; width: 6px; background: #e0e0e0; }
  .ob-dot.on { width: 24px; background: #d32f2f; }
  .ob-slide-1 .ob-dot { background: rgba(255,255,255,0.22); }
  .ob-slide-1 .ob-dot.on { background: #d32f2f; width: 24px; }
  .ob-btn-row { display: flex; gap: 10px; }
  .ob-skip {
    flex: 0 0 auto; padding: 13px 16px; border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.18);
    background: transparent; color: rgba(255,255,255,0.45);
    font-family: 'Cairo', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .18s;
  }
  .ob-skip.dk { border-color: #e0e0e0; color: #aaa; }
  .ob-skip.dk:hover { border-color: #bbb; color: #555; }
  .ob-next {
    flex: 1; padding: 13px; border-radius: 14px; border: none;
    background: #d32f2f; color: #fff;
    font-family: 'Cairo', sans-serif; font-size: 14px; font-weight: 800;
    cursor: pointer; transition: all .18s;
    box-shadow: 0 8px 20px rgba(211,47,47,0.3);
  }
  .ob-next:hover { background: #b71c1c; transform: scale(1.02); }
  .ob-next:active { transform: scale(0.97); }
  .ob-next.blk { background: #1a1a1a; box-shadow: 0 8px 20px rgba(0,0,0,0.14); }
  .ob-next.blk:hover { background: #d32f2f; }
  .ob-finish {
    flex: 1; padding: 15px; border-radius: 14px; border: none;
    background: #d32f2f; color: #fff;
    font-family: 'Cairo', sans-serif; font-size: 15px; font-weight: 900;
    cursor: pointer; transition: all .2s;
    box-shadow: 0 12px 28px rgba(211,47,47,0.32);
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .ob-finish:hover { background: #b71c1c; transform: scale(1.02); }
  .ob-finish:active { transform: scale(0.98); }

  /* ── MAIN APP ── */
  .lv { font-family: 'Cairo', sans-serif; direction: rtl; min-height: 100vh; background: #f5f5f5; max-width: 430px; margin: 0 auto; position: relative; overflow-x: hidden; }

  /* FLOATING NAVBAR */
  .lv-header { position: sticky; top: 0; z-index: 200; padding: 12px 16px 0; background: transparent; }
  .lv-navbar { background: rgba(255,255,255,0.82); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-radius: 20px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 14px 18px 10px; }
  .lv-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .lv-logo { display: flex; align-items: center; gap: 8px; }
  .lv-logo-mark { width: 34px; height: 34px; background: #d32f2f; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 900; letter-spacing: -1px; flex-shrink: 0; }
  .lv-logo-text { font-size: 22px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; line-height: 1; }
  .lv-logo-sub { font-size: 10px; color: #888; font-weight: 400; }
  .lv-nav-actions { display: flex; gap: 8px; }
  .lv-icon-btn { width: 36px; height: 36px; background: rgba(0,0,0,0.05); border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #333; transition: background .18s, transform .15s; }
  .lv-icon-btn:hover { background: rgba(0,0,0,0.09); transform: scale(1.06); }
  .lv-icon-btn:active { transform: scale(0.94); }
  .lv-notif-dot { position: relative; }
  .lv-notif-dot::after { content: ''; position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #d32f2f; border-radius: 50%; border: 1.5px solid #fff; }

  /* SEARCH */
  .lv-search-row { display: flex; gap: 8px; margin-bottom: 12px; }
  .lv-search-wrap { flex: 1; position: relative; }
  .lv-search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #999; pointer-events: none; }
  .lv-search { width: 100%; padding: 10px 36px 10px 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); font-size: 14px; font-family: 'Cairo', sans-serif; outline: none; background: rgba(255,255,255,0.9); color: #222; transition: border-color .18s, box-shadow .18s; }
  .lv-search:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.12); }
  .lv-wilaya-sel { padding: 10px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); font-size: 12px; font-family: 'Cairo', sans-serif; background: rgba(255,255,255,0.9); color: #333; outline: none; max-width: 110px; cursor: pointer; transition: border-color .18s; }
  .lv-wilaya-sel:focus { border-color: #d32f2f; }

  /* CATEGORIES */
  .lv-cats { display: flex; gap: 7px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; }
  .lv-cats::-webkit-scrollbar { display: none; }
  .lv-cat { background: rgba(0,0,0,0.05); color: #444; border: 1px solid transparent; border-radius: 30px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: 'Cairo', sans-serif; transition: all .2s ease; display: flex; align-items: center; gap: 5px; }
  .lv-cat:hover { background: rgba(211,47,47,0.08); color: #d32f2f; transform: translateY(-1px); }
  .lv-cat.active { background: #d32f2f; color: #fff; border-color: #d32f2f; box-shadow: 0 4px 12px rgba(211,47,47,0.3); }
  .lv-cat-icon { font-size: 11px; }

  /* BODY */
  .lv-body { padding: 14px 14px 90px; }
  .lv-results { font-size: 12px; color: #999; font-weight: 600; margin-bottom: 12px; letter-spacing: 0.3px; }

  /* SKELETON */
  .sk-card { background: #fff; border-radius: 20px; overflow: hidden; margin-bottom: 14px; border: 1px solid #f0f0f0; }
  .sk-img { height: 130px; background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  .sk-body { padding: 14px 16px; }
  .sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; margin-bottom: 8px; }
  .sk-line.wide { width: 75%; } .sk-line.med { width: 55%; } .sk-line.short { width: 35%; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* CARDS */
  .lv-cards { display: flex; flex-direction: column; gap: 14px; }
  .lv-card { background: #fff; border-radius: 20px; overflow: hidden; cursor: pointer; border: 1px solid #efefef; transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease; animation: fadeSlideIn .35s ease both; }
  .lv-card:hover { transform: scale(1.02) translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.10); }
  .lv-card:active { transform: scale(0.98); }
  @keyframes fadeSlideIn { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
  .lv-card-hero { height: 130px; background: #1a1a1a; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .lv-card-hero-icon { font-size: 52px; color: rgba(255,255,255,0.12); font-weight: 900; user-select: none; }
  .lv-card-hero-pattern { position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px); }
  .lv-card-wilaya { position: absolute; top: 10px; right: 12px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-radius: 8px; font-size: 11px; font-weight: 700; padding: 4px 10px; color: #1a1a1a; }
  .lv-card-badge { position: absolute; top: 10px; left: 12px; background: #d32f2f; border-radius: 8px; font-size: 10px; font-weight: 700; padding: 4px 9px; color: #fff; }
  .lv-card-body { padding: 14px 16px 16px; }
  .lv-card-row1 { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; gap: 8px; }
  .lv-card-title { font-size: 15px; font-weight: 800; color: #111; line-height: 1.3; flex: 1; }
  .lv-ver { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 7px; white-space: nowrap; flex-shrink: 0; }
  .lv-ver.yes { background: #fff0f0; color: #c62828; } .lv-ver.no { background: #f5f5f5; color: #888; }
  .lv-card-desc { font-size: 12px; color: #777; line-height: 1.55; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .lv-rating { display: flex; align-items: center; gap: 5px; margin-bottom: 10px; }
  .lv-stars { color: #d32f2f; font-size: 11px; letter-spacing: 1px; }
  .lv-rating-num { font-size: 11px; color: #aaa; }
  .lv-amenities { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
  .lv-amenity { background: #fafafa; color: #444; font-size: 10px; font-weight: 600; padding: 4px 9px; border-radius: 8px; border: 1px solid #eee; }
  .lv-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f5f5f5; padding-top: 12px; }
  .lv-price { font-size: 20px; font-weight: 900; color: #111; }
  .lv-price-unit { font-size: 11px; color: #bbb; font-weight: 400; }
  .lv-wa-btn { background: #1a1a1a; color: #fff; border: none; border-radius: 12px; padding: 9px 16px; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: 'Cairo', sans-serif; transition: background .18s, transform .15s; }
  .lv-wa-btn:hover { background: #d32f2f; transform: scale(1.04); }
  .lv-wa-btn:active { transform: scale(0.96); }
  .lv-wa-icon { font-size: 14px; }

  /* BOTTOM NAV */
  .lv-bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; padding: 0 14px 12px; pointer-events: none; z-index: 300; }
  .lv-nav-pill { background: rgba(255,255,255,0.90); backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%); border: 1px solid rgba(255,255,255,0.7); border-radius: 22px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: flex; justify-content: space-around; padding: 10px 8px; pointer-events: all; }
  .lv-nav-item { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; font-family: 'Cairo', sans-serif; min-width: 56px; padding: 4px 8px; border-radius: 14px; transition: background .18s, transform .18s; }
  .lv-nav-item:hover { background: rgba(0,0,0,0.05); transform: translateY(-1px); }
  .lv-nav-item.active { background: rgba(211,47,47,0.08); }
  .lv-nav-icon { font-size: 18px; color: #bbb; transition: color .18s; line-height: 1; }
  .lv-nav-item.active .lv-nav-icon { color: #d32f2f; }
  .lv-nav-label { font-size: 10px; font-weight: 700; color: #ccc; transition: color .18s; }
  .lv-nav-item.active .lv-nav-label { color: #d32f2f; }

  /* MODAL */
  .lv-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 500; display: flex; flex-direction: column; justify-content: flex-end; backdrop-filter: blur(4px); animation: fadeIn .22s ease; }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .lv-sheet { background: #fff; border-radius: 28px 28px 0 0; max-height: 90vh; overflow-y: auto; animation: slideUp .28s cubic-bezier(.34,1.56,.64,1); }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .lv-sheet-handle { width: 36px; height: 4px; background: #E0E0E0; border-radius: 2px; margin: 14px auto 0; }
  .lv-sheet-hero { height: 180px; background: #111; display: flex; align-items: center; justify-content: center; position: relative; margin: 10px 14px 0; border-radius: 18px; overflow: hidden; }
  .lv-sheet-hero-icon { font-size: 72px; color: rgba(255,255,255,0.1); font-weight: 900; user-select: none; }
  .lv-sheet-hero-pattern { position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,0.025) 15px, rgba(255,255,255,0.025) 16px); }
  .lv-sheet-close { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.92); border: none; border-radius: 50%; width: 34px; height: 34px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #333; font-weight: 900; transition: background .15s, transform .15s; }
  .lv-sheet-close:hover { background: #fff; transform: scale(1.08); }
  .lv-sheet-body { padding: 20px 18px 30px; }
  .lv-sheet-title { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 10px; line-height: 1.25; }
  .lv-sheet-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .lv-sheet-loc { font-size: 12px; color: #555; font-weight: 700; display: flex; align-items: center; gap: 4px; }
  .lv-sheet-sep { color: #ddd; font-size: 10px; }
  .lv-sheet-desc { font-size: 13px; color: #666; line-height: 1.7; margin-bottom: 18px; }
  .lv-sheet-section { font-size: 11px; font-weight: 800; color: #aaa; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 10px; }
  .lv-price-block { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 16px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .lv-big-price { font-size: 32px; font-weight: 900; color: #111; }
  .lv-big-price-unit { font-size: 13px; color: #bbb; }
  .lv-sheet-phone-label { font-size: 11px; color: #aaa; margin-bottom: 4px; }
  .lv-sheet-phone { font-size: 17px; font-weight: 800; color: #1a1a1a; direction: ltr; }
  .lv-wa-full { width: 100%; background: #1a1a1a; color: #fff; border: none; border-radius: 16px; padding: 16px; font-weight: 900; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Cairo', sans-serif; transition: background .2s, transform .15s; }
  .lv-wa-full:hover { background: #d32f2f; transform: scale(1.01); }
  .lv-wa-full:active { transform: scale(0.98); }
  .lv-warn { text-align: center; font-size: 11px; color: #bbb; margin-top: 10px; }

  /* ADD TAB */
  .lv-add-body { padding: 14px 14px 90px; display: flex; flex-direction: column; gap: 14px; }
  .lv-id-box { border-radius: 20px; padding: 18px; border: 1.5px solid; }
  .lv-id-box.pending { background: #fff5f5; border-color: #ffcdd2; }
  .lv-id-box.done { background: #fff; border-color: #e0e0e0; }
  .lv-id-title { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
  .lv-id-title.pend { color: #c62828; } .lv-id-title.done { color: #1a1a1a; }
  .lv-id-sub { font-size: 12px; color: #888; margin-bottom: 14px; line-height: 1.5; }
  .lv-field { padding: 11px 13px; border-radius: 12px; border: 1.5px solid #e8e8e8; font-size: 14px; font-family: 'Cairo', sans-serif; width: 100%; outline: none; background: #fff; color: #111; margin-bottom: 9px; transition: border-color .18s, box-shadow .18s; }
  .lv-field:focus { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.1); }
  .lv-submit { width: 100%; background: #d32f2f; color: #fff; border: none; border-radius: 12px; padding: 12px; font-weight: 800; font-size: 14px; cursor: pointer; font-family: 'Cairo', sans-serif; transition: background .18s, transform .15s; }
  .lv-submit:hover { background: #b71c1c; transform: scale(1.01); }
  .lv-submit:active { transform: scale(0.98); }
  .lv-done-row { display: flex; align-items: center; gap: 12px; }
  .lv-done-circle { width: 44px; height: 44px; background: #1a1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; flex-shrink: 0; }
  .lv-done-name { font-size: 15px; font-weight: 800; color: #111; }
  .lv-done-sub { font-size: 11px; color: #888; margin-top: 2px; }
  .lv-form-card { background: #fff; border-radius: 20px; border: 1px solid #efefef; padding: 18px; }
  .lv-form-title { font-size: 15px; font-weight: 800; color: #111; margin-bottom: 16px; }
  .lv-post-btn { width: 100%; border: none; border-radius: 14px; padding: 14px; font-weight: 800; font-size: 15px; cursor: pointer; font-family: 'Cairo', sans-serif; margin-top: 4px; transition: all .18s; }
  .lv-post-btn.ready { background: #1a1a1a; color: #fff; }
  .lv-post-btn.ready:hover { background: #d32f2f; }
  .lv-post-btn.locked { background: #f0f0f0; color: #bbb; cursor: not-allowed; }

  /* EMPTY */
  .lv-empty { text-align: center; padding: 60px 20px; color: #ccc; }
  .lv-empty-icon { font-size: 48px; margin-bottom: 12px; color: #ddd; }
  .glass-chip { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); }
`;

/* ─────────────────────────────────────────────
   ONBOARDING COMPONENT
───────────────────────────────────────────── */
function Onboarding({ onDone }) {
  const [slide, setSlide] = useState(0);

  const goTo = (i) => setSlide(i);

  return (
    <div className="ob-wrap">
      <div
        className="ob-slider"
        style={{ transform: `translateX(${slide * (100 / 3)}%)` }}
      >
        {/* ── SLIDE 1 ── */}
        <div className="ob-slide ob-slide-1">
          <div className="ob-s1-pattern" />
          <div className="ob-s1-glow" />
          <div className="ob-logo-big">L</div>
          <div className="ob-s1-title">مرحباً بك في<br /><span>Livara</span></div>
          <div className="ob-s1-sub">
            منصتك الجزائرية الأولى للكراء — شاليهات، مزارع، قاعات أفراح، واستوديوهات في متناول يدك.
          </div>
          <div className="ob-pills">
            <span className="ob-pill">⌂ شاليهات</span>
            <span className="ob-pill">❋ مزارع</span>
            <span className="ob-pill">◈ قاعات أفراح</span>
            <span className="ob-pill">⬡ استوديوهات</span>
            <span className="ob-pill">▣ كراء يومي</span>
          </div>
          <div className="ob-bottom">
            <div className="ob-dots">
              <div className={`ob-dot${slide === 0 ? " on" : ""}`} />
              <div className={`ob-dot${slide === 1 ? " on" : ""}`} />
              <div className={`ob-dot${slide === 2 ? " on" : ""}`} />
            </div>
            <div className="ob-btn-row">
              <button className="ob-skip" onClick={onDone}>تخطى</button>
              <button className="ob-next" onClick={() => goTo(1)}>ابدأ الاستكشاف ←</button>
            </div>
          </div>
        </div>

        {/* ── SLIDE 2 ── */}
        <div className="ob-slide ob-slide-2">
          <div className="ob-s2-hero">
            <div className="ob-s2-hero-pat" />
            <div className="ob-s2-hero-icon">✓</div>
            <div className="ob-s2-hero-title">ثقة وأمان في كل إعلان</div>
            <div className="ob-s2-hero-sub">نظام التحقق من الهوية الوطنية يضمن لك التعامل مع أشخاص حقيقيين وموثوقين.</div>
          </div>
          <div className="ob-features">
            <div className="ob-feat">
              <div className="ob-feat-ico red">◉</div>
              <div>
                <div className="ob-feat-t">شارة الثقة الموثّقة</div>
                <div className="ob-feat-d">كل معلن يمر بتحقق هوية وطني — تعرف فوراً من هو موثوق ومن ليس كذلك.</div>
              </div>
            </div>
            <div className="ob-feat">
              <div className="ob-feat-ico">◆</div>
              <div>
                <div className="ob-feat-t">تواصل مباشر عبر واتساب</div>
                <div className="ob-feat-d">بضغطة واحدة تنتقل إلى محادثة واتساب مع صاحب العقار مباشرةً.</div>
              </div>
            </div>
            <div className="ob-feat">
              <div className="ob-feat-ico red">★</div>
              <div>
                <div className="ob-feat-t">تقييمات حقيقية من مستأجرين</div>
                <div className="ob-feat-d">آراء مستخدمين فعليين تساعدك على اتخاذ القرار الصحيح قبل الحجز.</div>
              </div>
            </div>
          </div>
          <div className="ob-bottom">
            <div className="ob-dots">
              <div className={`ob-dot${slide === 0 ? " on" : ""}`} />
              <div className={`ob-dot${slide === 1 ? " on" : ""}`} />
              <div className={`ob-dot${slide === 2 ? " on" : ""}`} />
            </div>
            <div className="ob-btn-row">
              <button className="ob-skip dk" onClick={() => goTo(0)}>السابق</button>
              <button className="ob-next blk" onClick={() => goTo(2)}>التالي ←</button>
            </div>
          </div>
        </div>

        {/* ── SLIDE 3 ── */}
        <div className="ob-slide ob-slide-3">
          <div className="ob-s3-top">
            <div className="ob-s3-badge">◉ متاح في كل الجزائر</div>
            <div className="ob-s3-title">أكثر من 19 ولاية<br />في خدمتك</div>
            <div className="ob-s3-sub">من الشمال إلى الجنوب، Livara يربطك بأفضل العروض في ولايتك.</div>
          </div>
          <div className="ob-wilayas">
            {["بجاية","الجزائر","وهران","قسنطينة","عنابة","تلمسان","سطيف","باتنة","بسكرة","تيزي وزو","غرداية","جيجل"].map((w, i) => (
              <span key={w} className={`ob-wchip${[0,1,2,7].includes(i) ? " hot" : ""}`}>{w}</span>
            ))}
          </div>
          <div className="ob-stats">
            <div className="ob-stat"><div className="ob-stat-n">+8</div><div className="ob-stat-l">إعلانات نشطة الآن</div></div>
            <div className="ob-stat"><div className="ob-stat-n">19</div><div className="ob-stat-l">ولاية مغطاة</div></div>
            <div className="ob-stat"><div className="ob-stat-n">4.7</div><div className="ob-stat-l">متوسط التقييم ★</div></div>
            <div className="ob-stat"><div className="ob-stat-n">100%</div><div className="ob-stat-l">مجاني للاستخدام</div></div>
          </div>
          <div className="ob-bottom">
            <div className="ob-dots">
              <div className={`ob-dot${slide === 0 ? " on" : ""}`} />
              <div className={`ob-dot${slide === 1 ? " on" : ""}`} />
              <div className={`ob-dot${slide === 2 ? " on" : ""}`} />
            </div>
            <div className="ob-btn-row">
              <button className="ob-skip dk" onClick={() => goTo(1)}>السابق</button>
              <button className="ob-finish" onClick={onDone}>ابدأ الاستكشاف ◉</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
const Stars = ({ n }) => {
  const full = Math.floor(n);
  const empty = 5 - full;
  return <span className="lv-stars">{"★".repeat(full)}{"☆".repeat(empty)}</span>;
};

const VerBadge = ({ v }) =>
  v ? <span className="lv-ver yes">✓ موثّق</span>
    : <span className="lv-ver no">— غير موثّق</span>;

function SkeletonCard() {
  return (
    <div className="sk-card">
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line wide" />
        <div className="sk-line med" />
        <div className="sk-line short" style={{ marginTop: 12 }} />
      </div>
    </div>
  );
}

function Card({ item, onWhatsApp, onSelect, animDelay }) {
  return (
    <div className="lv-card" style={{ animationDelay: `${animDelay}ms` }} onClick={() => onSelect(item)}>
      <div className="lv-card-hero">
        <div className="lv-card-hero-pattern" />
        <span className="lv-card-hero-icon">{item.icon}</span>
        <span className="lv-card-wilaya glass-chip">{item.wilaya}</span>
        {item.badge && <span className="lv-card-badge">{item.badge}</span>}
      </div>
      <div className="lv-card-body">
        <div className="lv-card-row1">
          <span className="lv-card-title">{item.title}</span>
          <VerBadge v={item.verified} />
        </div>
        <p className="lv-card-desc">{item.desc}</p>
        <div className="lv-rating">
          <Stars n={item.rating} />
          <span className="lv-rating-num">{item.rating} ({item.reviews})</span>
        </div>
        <div className="lv-amenities">
          {item.amenities.map(a => <span key={a} className="lv-amenity">{a}</span>)}
        </div>
        <div className="lv-card-footer">
          <div>
            <span className="lv-price">{item.price.toLocaleString("ar-DZ")}</span>
            <span className="lv-price-unit"> دج/يوم</span>
          </div>
          <button className="lv-wa-btn" onClick={e => { e.stopPropagation(); onWhatsApp(item); }}>
            <span className="lv-wa-icon">◆</span> واتساب
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ item, onClose, onWhatsApp, onToggleFavorite, isFavorite }) {
  if (!item) return null;
  return (
    <div className="lv-overlay" onClick={onClose}>
      <div className="lv-sheet" onClick={e => e.stopPropagation()}>
        <div className="lv-sheet-handle" />
        <div className="lv-sheet-hero">
          <div className="lv-sheet-hero-pattern" />
          <span className="lv-sheet-hero-icon">{item.icon}</span>
          <button className="lv-sheet-close" onClick={onClose}>✕</button>
        </div>
        <div className="lv-sheet-body">
          <h2 className="lv-sheet-title">{item.title}</h2>
          <div className="lv-sheet-meta">
            <span className="lv-sheet-loc">◉ {item.wilaya}</span>
            <span className="lv-sheet-sep">|</span>
            <Stars n={item.rating} />
            <span style={{ fontSize: 11, color: "#bbb" }}>({item.reviews} تقييم)</span>
            <VerBadge v={item.verified} />
          </div>
          <p className="lv-sheet-desc">{item.desc}</p>
          <p className="lv-sheet-section">المميزات</p>
          <div className="lv-amenities" style={{ marginBottom: 18 }}>
            {item.amenities.map(a => <span key={a} className="lv-amenity">{a}</span>)}
          </div>
          <div className="lv-price-block">
            <div>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>السعر اليومي</div>
              <span className="lv-big-price">{item.price.toLocaleString("ar-DZ")}</span>
              <span className="lv-big-price-unit"> دج</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="lv-sheet-phone-label">للتواصل</div>
              <div className="lv-sheet-phone">{item.phone}</div>
            </div>
          </div>
          <button className="lv-wa-full" onClick={() => onWhatsApp(item)}>
            <span style={{ fontSize: 18 }}>◆</span>
            تواصل عبر واتساب مباشرة
          </button>
          <button className="lv-wa-full" style={{ marginTop: 10 }} onClick={() => onToggleFavorite(item.id)}>
            <span style={{ fontSize: 18 }}>{isFavorite ? "◆" : "◇"}</span>
            {isFavorite ? "إزالة من المفضلة" : "حفظ في المفضلة"}
          </button>
          {!item.verified && <p className="lv-warn">— لم يُوثَّق بعد · تحقق من الهوية قبل الدفع</p>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function Livara() {
  const [onboarding, setOnboarding] = useState(() => readStorage(STORAGE_KEYS.onboarding, false) !== true);
  const [cat, setCat] = useState("all");
  const [wilaya, setWilaya] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("browse");
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(() => readStorage(STORAGE_KEYS.listings, LISTINGS));
  const [favorites, setFavorites] = useState(() => readStorage(STORAGE_KEYS.favorites, []));
  const savedVerification = readStorage(STORAGE_KEYS.verification, null);
  const [verForm, setVerForm] = useState(savedVerification?.form || { nin: "", name: "", phone: "", wilaya: "" });
  const [verDone, setVerDone] = useState(Boolean(savedVerification?.done));
  const [draft, setDraft] = useState(createEmptyDraft);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    const t = setTimeout(() => setLoading(false), 900);
    return () => { document.head.removeChild(style); clearTimeout(t); };
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [cat, wilaya, search]);

  useEffect(() => writeStorage(STORAGE_KEYS.listings, listings), [listings]);
  useEffect(() => writeStorage(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => writeStorage(STORAGE_KEYS.verification, { done: verDone, form: verForm }), [verDone, verForm]);

  const finishOnboarding = () => {
    writeStorage(STORAGE_KEYS.onboarding, true);
    setOnboarding(false);
  };

  if (onboarding) {
    return <Onboarding onDone={finishOnboarding} />;
  }

  const handleWhatsApp = (item) => {
    const msg = encodeURIComponent(`السلام عليكم، أنا مهتم بـ: ${item.title} في ${item.wilaya}\nالسعر: ${Number(item.price).toLocaleString("ar-DZ")} دج/يوم\nهل لا يزال متاحاً؟`);
    const phone = normalizeDzPhone(item.phone);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const q = search.trim();
  const filtered = listings.filter(l =>
    (cat === "all" || l.category === cat) &&
    (!wilaya || l.wilaya === wilaya) &&
    (
      !q ||
      l.title.includes(q) ||
      l.wilaya.includes(q) ||
      l.desc.includes(q) ||
      l.amenities.some(a => a.includes(q))
    )
  );

  const favoriteListings = listings.filter(l => favorites.includes(l.id));
  const canVerify = verForm.nin.trim() && verForm.name.trim() && verForm.phone.trim() && verForm.wilaya;
  const canPost = verDone && draft.category && draft.title.trim() && draft.wilaya && draft.desc.trim() && Number(draft.price) > 0 && normalizeDzPhone(draft.phone).length >= 9;

  const publishListing = () => {
    if (!canPost) return;
    const categoryMeta = CATEGORIES.find(c => c.id === draft.category);
    const nextListing = {
      id: Date.now(),
      category: draft.category,
      wilaya: draft.wilaya,
      title: draft.title.trim(),
      desc: draft.desc.trim(),
      price: Number(draft.price),
      verified: verDone,
      phone: draft.phone.trim(),
      icon: categoryMeta?.icon || "◉",
      rating: 0,
      reviews: 0,
      amenities: ["إعلان جديد"],
      badge: "جديد",
    };
    setListings(prev => [nextListing, ...prev]);
    setDraft(createEmptyDraft());
    setCat("all");
    setWilaya("");
    setSearch("");
    setTab("browse");
    setSelected(nextListing);
  };

  const resetLocalData = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.listings);
      window.localStorage.removeItem(STORAGE_KEYS.favorites);
      window.localStorage.removeItem(STORAGE_KEYS.verification);
      window.localStorage.removeItem(STORAGE_KEYS.onboarding);
    }
    setListings(LISTINGS);
    setFavorites([]);
    setVerForm({ nin: "", name: "", phone: "", wilaya: "" });
    setVerDone(false);
    setDraft(createEmptyDraft());
    setOnboarding(true);
    setTab("browse");
  };

  const NAV_ITEMS = [
    { id: "browse", icon: "⌂", label: "الرئيسية" },
    { id: "add",    icon: "+", label: "أضف إعلان" },
    { id: "fav",    icon: "◇", label: "المفضلة" },
    { id: "profile",icon: "◌", label: "حسابي" },
  ];

  return (
    <div className="lv">
      {/* FLOATING HEADER */}
      <div className="lv-header">
        <div className="lv-navbar">
          <div className="lv-topbar">
            <div className="lv-logo">
              <div className="lv-logo-mark">L</div>
              <div>
                <div className="lv-logo-text">Livara</div>
                <div className="lv-logo-sub">منصة الكراء الجزائرية</div>
              </div>
            </div>
            <div className="lv-nav-actions">
              <button className="lv-icon-btn lv-notif-dot" title="الإشعارات">◉</button>
              <button className="lv-icon-btn" title="المزيد">≡</button>
            </div>
          </div>

          {tab === "browse" && (
            <>
              <div className="lv-search-row">
                <div className="lv-search-wrap">
                  <span className="lv-search-icon">◎</span>
                  <input
                    className="lv-search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="ابحث عن شاليه، قاعة، مزرعة..."
                  />
                </div>
                <select className="lv-wilaya-sel" value={wilaya} onChange={e => setWilaya(e.target.value)}>
                  <option value="">كل الولايات</option>
                  {WILAYAS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div className="lv-cats">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    className={`lv-cat${cat === c.id ? " active" : ""}`}
                    onClick={() => setCat(c.id)}
                  >
                    <span className="lv-cat-icon">{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* BROWSE TAB */}
      {tab === "browse" && (
        <div className="lv-body">
          <div className="lv-results">{filtered.length} إعلان متاح</div>
          {loading ? (
            <div className="lv-cards">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="lv-cards">
              {filtered.map((item, i) => (
                <Card
                  key={item.id}
                  item={item}
                  onWhatsApp={handleWhatsApp}
                  onSelect={setSelected}
                  animDelay={i * 60}
                />
              ))}
              {filtered.length === 0 && (
                <div className="lv-empty">
                  <div className="lv-empty-icon">◎</div>
                  <div style={{ fontSize: 14, color: "#aaa" }}>لا توجد نتائج مطابقة</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ADD TAB */}
      {tab === "add" && (
        <div className="lv-add-body">
          <div className={`lv-id-box ${verDone ? "done" : "pending"}`}>
            <div className={`lv-id-title ${verDone ? "done" : "pend"}`}>
              {verDone ? "✓ تم التحقق من الهوية" : "◈ التحقق من الهوية الجزائرية"}
            </div>
            <div className="lv-id-sub">
              {verDone ? "يمكنك الآن نشر إعلانك بشارة الثقة ✓" : "مطلوب للحصول على شارة الثقة وزيادة المصداقية"}
            </div>
            {!verDone ? (
              <>
                <input className="lv-field" placeholder="رقم بطاقة التعريف الوطنية (NIN)" value={verForm.nin} onChange={e => setVerForm({...verForm, nin: e.target.value})} />
                <input className="lv-field" placeholder="الاسم الكامل" value={verForm.name} onChange={e => setVerForm({...verForm, name: e.target.value})} />
                <input className="lv-field" placeholder="رقم الهاتف" value={verForm.phone} onChange={e => setVerForm({...verForm, phone: e.target.value})} style={{ direction: "ltr" }} />
                <select className="lv-field" value={verForm.wilaya} onChange={e => setVerForm({...verForm, wilaya: e.target.value})}>
                  <option value="">اختر الولاية</option>
                  {WILAYAS.map(w => <option key={w}>{w}</option>)}
                </select>
                <button className="lv-submit" onClick={() => { if(canVerify) setVerDone(true); }}>
                  تحقق من الهوية ✓
                </button>
              </>
            ) : (
              <div className="lv-done-row">
                <div className="lv-done-circle">✓</div>
                <div>
                  <div className="lv-done-name">{verForm.name}</div>
                  <div className="lv-done-sub">موثّق · {verForm.wilaya}</div>
                </div>
              </div>
            )}
          </div>

          <div className="lv-form-card">
            <div className="lv-form-title">○ تفاصيل الإعلان</div>
            <select className="lv-field" value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})}>
              <option value="">نوع العقار</option>
              {CATEGORIES.filter(c => c.id !== "all").map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
            <input className="lv-field" placeholder="عنوان الإعلان" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} />
            <select className="lv-field" value={draft.wilaya} onChange={e => setDraft({...draft, wilaya: e.target.value})}>
              <option value="">الولاية</option>
              {WILAYAS.map(w => <option key={w}>{w}</option>)}
            </select>
            <textarea className="lv-field" placeholder="وصف مفصّل للعقار..." rows={3} style={{ resize: "vertical" }} value={draft.desc} onChange={e => setDraft({...draft, desc: e.target.value})} />
            <input className="lv-field" type="number" placeholder="السعر اليومي (دج)" value={draft.price} onChange={e => setDraft({...draft, price: e.target.value})} />
            <input className="lv-field" placeholder="رقم واتساب (0655...)" style={{ direction: "ltr" }} value={draft.phone} onChange={e => setDraft({...draft, phone: e.target.value})} />
            <button className={`lv-post-btn ${canPost ? "ready" : "locked"}`} onClick={publishListing}>
              {verDone ? "◉ نشر الإعلان" : "— يجب التحقق من الهوية أولاً"}
            </button>
          </div>
        </div>
      )}

      {/* FAVORITES TAB */}
      {tab === "fav" && (
        <div className="lv-body">
          <div className="lv-results">{favoriteListings.length} إعلان في المفضلة</div>
          <div className="lv-cards">
            {favoriteListings.map((item, i) => (
              <Card
                key={item.id}
                item={item}
                onWhatsApp={handleWhatsApp}
                onSelect={setSelected}
                animDelay={i * 60}
              />
            ))}
            {favoriteListings.length === 0 && (
              <div className="lv-empty">
                <div className="lv-empty-icon">◇</div>
                <div style={{ fontSize: 14, color: "#aaa" }}>لا توجد إعلانات محفوظة بعد</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {tab === "profile" && (
        <div className="lv-add-body">
          <div className={`lv-id-box ${verDone ? "done" : "pending"}`}>
            <div className={`lv-id-title ${verDone ? "done" : "pend"}`}>{verDone ? "✓ حساب موثّق" : "◈ حساب غير موثّق"}</div>
            <div className="lv-id-sub">{verDone ? `${verForm.name} · ${verForm.wilaya}` : "أكمل التحقق من تبويب إضافة إعلان لنشر إعلانات موثّقة"}</div>
            <div className="ob-stats">
              <div className="ob-stat"><div className="ob-stat-n">{listings.length}</div><div className="ob-stat-l">إعلانات</div></div>
              <div className="ob-stat"><div className="ob-stat-n">{favorites.length}</div><div className="ob-stat-l">مفضلة</div></div>
            </div>
          </div>
          <div className="lv-form-card">
            <div className="lv-form-title">○ إعدادات الحساب</div>
            <button className="lv-submit" onClick={() => setTab("add")}>إدارة التحقق والإعلان</button>
            <button className="lv-post-btn ready" onClick={resetLocalData}>إعادة ضبط البيانات المحلية</button>
          </div>
        </div>
      )}

      {/* BOTTOM FLOATING NAV */}
      <div className="lv-bottom-nav">
        <div className="lv-nav-pill">
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              className={`lv-nav-item${tab === n.id ? " active" : ""}`}
              onClick={() => setTab(n.id)}
            >
              <span className="lv-nav-icon">{n.icon}</span>
              <span className="lv-nav-label">{n.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Modal
        item={selected}
        onClose={() => setSelected(null)}
        onWhatsApp={handleWhatsApp}
        onToggleFavorite={toggleFavorite}
        isFavorite={selected ? favorites.includes(selected.id) : false}
      />
    </div>
  );
}
