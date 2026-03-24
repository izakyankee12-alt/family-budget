'use strict';

// ===== AUTH CONSTANTS =====
const AUTH_KEY = 'familyBudgetAuth';
const SESSION_KEY = 'familyBudgetSession';
const LOCKOUT_KEY = 'familyBudgetLockout';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 60000; // 60 seconds
const SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours


// ===== CONSTANTS =====
const STORAGE_KEY = 'familyBudgetData';
const EXPENSE_CATEGORIES = [
  { id: 'housing', name: 'דיור', icon: '🏠', color: '#4150f5', subs: [
    { id: 'rent', name: 'שכר דירה/משכנתא' }, { id: 'electricity', name: 'חשמל' },
    { id: 'water', name: 'מים' }, { id: 'gas', name: 'גז' },
    { id: 'arnona', name: 'ארנונה' }, { id: 'vaad', name: 'ועד בית' }
  ]},
  { id: 'food', name: 'מזון', icon: '🛒', color: '#10b981', subs: [
    { id: 'grocery', name: 'סופר' }, { id: 'restaurants', name: 'מסעדות' },
    { id: 'coffee', name: 'קפה' }, { id: 'delivery', name: 'משלוחים' }
  ]},
  { id: 'transport', name: 'תחבורה', icon: '🚗', color: '#f59e0b', subs: [
    { id: 'fuel', name: 'דלק' }, { id: 'car_insurance', name: 'ביטוח רכב' },
    { id: 'test', name: 'טסט' }, { id: 'public', name: 'תחבורה ציבורית' },
    { id: 'parking', name: 'חניה' }, { id: 'repairs', name: 'תיקונים' }
  ]},
  { id: 'education', name: 'חינוך', icon: '📚', color: '#ef4444', subs: [
    { id: 'tuition', name: 'שכר לימוד' }, { id: 'courses', name: 'חוגים' },
    { id: 'books', name: 'ספרים' }, { id: 'supplies', name: 'ציוד' }
  ]},
  { id: 'health', name: 'בריאות', icon: '💊', color: '#06b6d4', subs: [
    { id: 'hmo', name: 'קופת חולים' }, { id: 'meds', name: 'תרופות' },
    { id: 'dental', name: 'רופא שיניים' }, { id: 'glasses', name: 'משקפיים' },
    { id: 'treatments', name: 'טיפולים' }
  ]},
  { id: 'entertainment', name: 'בילויים', icon: '🎭', color: '#ec4899', subs: [
    { id: 'movies', name: 'סרטים' }, { id: 'shows', name: 'הופעות' },
    { id: 'dining', name: 'מסעדות' }, { id: 'vacation', name: 'חופשות' },
    { id: 'sports', name: 'ספורט' }
  ]},
  { id: 'clothing', name: 'ביגוד', icon: '👔', color: '#f97316', subs: [
    { id: 'clothes', name: 'ביגוד' }, { id: 'shoes', name: 'הנעלה' }
  ]},
  { id: 'utilities', name: 'חשבונות', icon: '⚡', color: '#8b5cf6', subs: [
    { id: 'elec', name: 'חשמל' }, { id: 'water', name: 'מים' },
    { id: 'gas', name: 'גז' }, { id: 'arnona', name: 'ארנונה' }
  ]},
  { id: 'phone', name: 'סלולר', icon: '📱', color: '#7c3aed', subs: [
    { id: 'plan', name: 'חבילה' }, { id: 'device', name: 'מכשיר' }
  ]},
  { id: 'internet', name: 'אינטרנט וטלוויזיה', icon: '📡', color: '#0891b2', subs: [
    { id: 'net', name: 'אינטרנט' }, { id: 'tv', name: 'טלוויזיה' },
    { id: 'streaming', name: 'סטרימינג' }
  ]},
  { id: 'subscriptions', name: 'מנויים', icon: '🔄', color: '#d946ef', subs: [
    { id: 'netflix', name: 'נטפליקס' }, { id: 'spotify', name: 'ספוטיפיי' },
    { id: 'gym', name: 'חדר כושר' }, { id: 'apps', name: 'אפליקציות' }
  ]},
  { id: 'insurance', name: 'ביטוחים', icon: '🛡️', color: '#64748b', subs: [
    { id: 'health_ins', name: 'בריאות' }, { id: 'life', name: 'חיים' },
    { id: 'car_ins', name: 'רכב' }, { id: 'home_ins', name: 'דירה' }
  ]},
  { id: 'kids', name: 'ילדים', icon: '👶', color: '#f472b6', subs: [
    { id: 'daycare', name: 'צהרון/גן' }, { id: 'babysitter', name: 'בייביסיטר' },
    { id: 'kid_supplies', name: 'ציוד' }, { id: 'kid_clothes', name: 'בגדים' }
  ]},
  { id: 'pets', name: 'חיות מחמד', icon: '🐾', color: '#a3785f', subs: [
    { id: 'pet_food', name: 'מזון' }, { id: 'vet', name: 'וטרינר' },
    { id: 'pet_supplies', name: 'ציוד' }
  ]},
  { id: 'gifts', name: 'מתנות ותרומות', icon: '🎁', color: '#e11d48', subs: [
    { id: 'presents', name: 'מתנות' }, { id: 'donations', name: 'תרומות' },
    { id: 'charity', name: 'צדקה' }
  ]},
  { id: 'maintenance', name: 'תחזוקת בית', icon: '🔧', color: '#78716c', subs: [
    { id: 'renovation', name: 'שיפוצים' }, { id: 'cleaning', name: 'ניקיון' },
    { id: 'furniture', name: 'ריהוט' }, { id: 'appliances', name: 'מוצרי חשמל' }
  ]},
  { id: 'beauty', name: 'טיפוח', icon: '💅', color: '#e879a0', subs: [
    { id: 'nails', name: 'לק' }, { id: 'gel', name: "ג'ל" },
    { id: 'eyebrows', name: 'גבות' }, { id: 'barber', name: 'מספרה' }
  ]},
  { id: 'savings', name: 'חיסכון', icon: '🏦', color: '#059669' },
  { id: 'other', name: 'אחר', icon: '📦', color: '#9ca3af' }
];
const INCOME_CATEGORIES = [
  { id: 'salary', name: 'משכורת', icon: '💰', color: '#10b981' },
  { id: 'freelance', name: 'פרילנס', icon: '💻', color: '#4150f5' },
  { id: 'passive', name: 'הכנסה פסיבית', icon: '📈', color: '#8b5cf6' },
  { id: 'benefits', name: 'קצבאות', icon: '🏛️', color: '#06b6d4' },
  { id: 'other_income', name: 'אחר', icon: '📦', color: '#9ca3af' }
];
const HEBREW_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

// ===== SMART CATEGORY KEYWORDS =====
const CATEGORY_KEYWORDS = {
  'housing:rent': ['שכר דירה', 'משכנתא', 'שכירות', 'דירה', 'rent'],
  'housing:electricity': ['חשמל', 'חברת חשמל', 'iec'],
  'housing:water': ['מים', 'מקורות', 'תאגיד מים'],
  'housing:gas': ['גז', 'פזגז', 'סופרגז', 'אמישראגז'],
  'housing:arnona': ['ארנונה', 'עירייה', 'מועצה'],
  'housing:vaad': ['ועד בית', 'ועד', 'תחזוקה משותפת'],
  'food:grocery': ['סופר', 'מכולת', 'רמי לוי', 'שופרסל', 'ויקטורי', 'יוחננוף', 'אושר עד', 'מגה', 'סופרמרקט', 'קניות'],
  'food:restaurants': ['מסעדה', 'מסעדות', 'אוכל בחוץ'],
  'food:coffee': ['קפה', 'בית קפה', 'קפוצינו', 'ארומה', 'קפיקס', 'גרג'],
  'food:delivery': ['משלוח', 'משלוחים', 'וולט', 'תן ביס', 'wolt'],
  'transport:fuel': ['דלק', 'בנזין', 'סולר', 'תדלוק', 'דור אלון', 'פז', 'סונול', 'דלק'],
  'transport:car_insurance': ['ביטוח רכב', 'ביטוח חובה', 'ביטוח מקיף'],
  'transport:test': ['טסט', 'בדיקת רכב', 'טכנאי רכב'],
  'transport:public': ['אוטובוס', 'רכבת', 'רב קו', 'תחבורה ציבורית', 'מונית', 'גט', 'יאנגו'],
  'transport:parking': ['חניה', 'חנייה', 'פנגו', 'חניון'],
  'transport:repairs': ['מוסך', 'תיקון רכב', 'תיקונים', 'שמן', 'טיפול רכב'],
  'education:tuition': ['שכר לימוד', 'לימודים', 'אוניברסיטה', 'מכללה', 'קורס'],
  'education:courses': ['חוג', 'חוגים', 'שיעור', 'שיעורים פרטיים'],
  'education:books': ['ספר', 'ספרים', 'ספרי לימוד'],
  'education:supplies': ['ציוד לימודי', 'מחברת', 'עטים', 'ציוד משרדי'],
  'health:hmo': ['קופת חולים', 'מכבי', 'כללית', 'מאוחדת', 'לאומית', 'ביטוח בריאות'],
  'health:meds': ['תרופות', 'בית מרקחת', 'סופר פארם', 'תרופה'],
  'health:dental': ['שיניים', 'רופא שיניים', 'שתל', 'טיפול שורש'],
  'health:glasses': ['משקפיים', 'עדשות', 'אופטיקה', 'עדשות מגע'],
  'health:treatments': ['טיפול', 'פיזיותרפיה', 'רופא', 'בדיקות דם', 'אולטראסאונד'],
  'entertainment:movies': ['סרט', 'סרטים', 'קולנוע', 'סינמה'],
  'entertainment:shows': ['הופעה', 'הופעות', 'קונצרט', 'הצגה', 'תיאטרון'],
  'entertainment:dining': ['ארוחת ערב', 'ארוחה בחוץ'],
  'entertainment:vacation': ['חופשה', 'חופשות', 'טיסה', 'מלון', 'צימר', 'נופש', 'טיול'],
  'entertainment:sports': ['ספורט', 'כדורגל', 'כדורסל', 'שחייה', 'בריכה', 'משחק'],
  'clothing:clothes': ['ביגוד', 'חולצה', 'מכנסיים', 'שמלה', 'חצאית', 'ז\'ארה', 'zara', 'h&m', 'בגדים', 'מעיל'],
  'clothing:shoes': ['נעליים', 'הנעלה', 'סנדלים', 'מגפיים'],
  'utilities:elec': ['חשבון חשמל'],
  'utilities:water': ['חשבון מים'],
  'utilities:gas': ['חשבון גז'],
  'utilities:arnona': ['חשבון ארנונה'],
  'phone:plan': ['חבילת סלולר', 'פלאפון', 'סלקום', 'הוט מובייל', 'פרטנר', 'גולן', '012', 'סלולרי', 'חשבון טלפון'],
  'phone:device': ['מכשיר טלפון', 'אייפון', 'סמסונג', 'טלפון חדש'],
  'internet:net': ['אינטרנט', 'בזק', 'הוט נט', 'סלקום', 'פרטנר'],
  'internet:tv': ['טלוויזיה', 'כבלים', 'הוט', 'יס'],
  'internet:streaming': ['נטפליקס', 'סטרימינג', 'דיסני', 'אפל טיוי', 'HBO'],
  'subscriptions:netflix': ['נטפליקס', 'netflix'],
  'subscriptions:spotify': ['ספוטיפיי', 'spotify'],
  'subscriptions:gym': ['חדר כושר', 'מכון כושר', 'ספורט מנוי', 'הולמס פלייס'],
  'subscriptions:apps': ['אפליקציה', 'מנוי אפליקציה', 'אפל', 'גוגל'],
  'insurance:health_ins': ['ביטוח בריאות', 'ביטוח רפואי'],
  'insurance:life': ['ביטוח חיים', 'ביטוח מנהלים', 'פנסיה'],
  'insurance:car_ins': ['ביטוח רכב', 'ביטוח מקיף', 'ביטוח חובה'],
  'insurance:home_ins': ['ביטוח דירה', 'ביטוח בית', 'ביטוח מבנה', 'ביטוח תכולה'],
  'kids:daycare': ['גן', 'צהרון', 'גן ילדים', 'מעון'],
  'kids:babysitter': ['בייביסיטר', 'שמרטפ', 'שמרטפית'],
  'kids:kid_supplies': ['ציוד ילדים', 'צעצועים', 'חיתולים', 'מוצרי תינוק'],
  'kids:kid_clothes': ['בגדי ילדים', 'בגדים לילדים'],
  'pets:pet_food': ['אוכל לכלב', 'אוכל לחתול', 'מזון חיות'],
  'pets:vet': ['וטרינר', 'חיסון כלב', 'חיסון חתול'],
  'pets:pet_supplies': ['ציוד לחיות', 'קולר', 'רצועה'],
  'gifts:presents': ['מתנה', 'מתנות', 'יום הולדת', 'מתנת חתונה'],
  'gifts:donations': ['תרומה', 'תרומות'],
  'gifts:charity': ['צדקה', 'מעשר'],
  'maintenance:renovation': ['שיפוץ', 'שיפוצים', 'צבע', 'צביעה', 'שרברב', 'אינסטלטור', 'חשמלאי'],
  'maintenance:cleaning': ['ניקיון', 'מנקה', 'עוזרת בית', 'חומרי ניקוי'],
  'maintenance:furniture': ['ריהוט', 'ספה', 'שולחן', 'כסא', 'ארון', 'מיטה', 'איקאה'],
  'maintenance:appliances': ['מוצרי חשמל', 'מכונת כביסה', 'מייבש', 'מקרר', 'תנור', 'מיקרוגל', 'שואב אבק'],
  'beauty:nails': ['לק', 'ציפורניים', 'מניקור', 'פדיקור'],
  'beauty:gel': ['ג\'ל', 'ג׳ל', "ג'ל"],
  'beauty:eyebrows': ['גבות', 'שעווה', 'אפילציה', 'לייזר'],
  'beauty:barber': ['מספרה', 'תספורת', 'ספר', 'שיער', 'צבע שיער', 'פן', 'החלקה', 'קרטין'],
  'savings': ['חיסכון', 'הפקדה', 'קופת גמל', 'קרן השתלמות', 'פיקדון'],
  'other': ['אחר', 'שונות', 'כללי']
};

function smartCategorize(text) {
  if (!text || text.trim().length === 0) return null;
  const q = text.trim().toLowerCase();
  let bestMatch = null;
  let bestLen = 0;
  for (const [catKey, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw) || kw.includes(q)) {
        const matchLen = Math.min(q.length, kw.length);
        if (matchLen > bestLen) {
          bestLen = matchLen;
          const parts = catKey.split(':');
          bestMatch = { category: parts[0], subcategory: parts[1] || null, keyword: kw };
        }
      }
    }
  }
  return bestMatch;
}

// ===== STATE =====
let appData = null;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-indexed
let entryType = 'income';
let forgotStep = 'username'; // 'username', 'reset'

// ===== SECURITY HELPERS =====
function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>"'&]/g, '').trim().slice(0, 250);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidAmount(value) {
  const num = parseFloat(value);
  if (!Number.isFinite(num)) return false;
  if (num <= 0 || num > 10000000) return false;
  return true;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getMonthKey(y, m) {
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

function formatCurrency(n) {
  return '₪' + Number(n).toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatCurrencyShort(n) {
  if (n >= 1000) return '₪' + (n / 1000).toFixed(1) + 'K';
  return '₪' + n;
}

// ===== DATA PERSISTENCE =====
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.family) return null;
    if (!parsed.recurring) parsed.recurring = [];
    return parsed;
  } catch (e) {
    console.warn('Failed to load data:', e.message);
    return null;
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      showToast('נפח האחסון מלא. נסה למחוק נתונים ישנים.');
    } else {
      showToast('שגיאה בשמירת הנתונים.');
    }
    return false;
  }
}

function getMonthData(key) {
  if (!appData.months[key]) {
    appData.months[key] = { income: [], expenses: [], budget: { ...appData.settings.budgetTemplate } };
  }
  return appData.months[key];
}

function getEffectiveExpenses(monthData) {
  const skipped = monthData.skippedRecurring || [];
  const recExpenses = (appData.recurring || [])
    .filter(r => !skipped.includes(r.id))
    .map(r => ({
      id: r.id,
      amount: r.amount,
      category: r.category,
      subcategory: r.subcategory || '',
      description: r.name,
      date: new Date(currentYear, currentMonth, Math.min(r.dayOfMonth || 1, 28)).toISOString().split('T')[0],
      isRecurring: true
    }));
  return [...monthData.expenses, ...recExpenses];
}

function skipRecurring(recurringId) {
  const key = getMonthKey(currentYear, currentMonth);
  const md = getMonthData(key);
  if (!md.skippedRecurring) md.skippedRecurring = [];
  md.skippedRecurring.push(recurringId);
  saveData();
  renderDashboard();
}

function unskipRecurring(recurringId) {
  const key = getMonthKey(currentYear, currentMonth);
  const md = getMonthData(key);
  if (md.skippedRecurring) md.skippedRecurring = md.skippedRecurring.filter(id => id !== recurringId);
  saveData();
  renderDashboard();
}

// ===== UI HELPERS =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  document.querySelectorAll('.bottom-nav__item').forEach(b => {
    b.classList.toggle('bottom-nav__item--active', b.dataset.view === viewId);
  });
  if (viewId === 'reportsView') renderReports();
  if (viewId === 'insightsView') renderInsights();
  if (viewId === 'settingsView') renderSettings();
}

function openPanel(panelId) {
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

function closePanel(panelId) {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById(panelId).classList.remove('active');
}

function closeAllPanels() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById('addPanel').classList.remove('active');
  document.getElementById('editPanel').classList.remove('active');
}

// ===== AUTH =====
function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// PBKDF2 with salt — used for all new registrations and password resets
async function hashPasswordPBKDF2(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 200000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Legacy SHA-256 (no salt) — used only to verify and migrate old accounts
async function hashPasswordLegacy(password) {
  if (crypto.subtle) {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return 'fb' + Math.abs(hash).toString(16).padStart(8, '0') + password.length.toString(16).padStart(4, '0');
}

function getAuthData() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setAuthData(data) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

function isAuthenticated() {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    if (!parsed || parsed.authenticated !== true) return false;
    if (Date.now() - parsed.loginTime > SESSION_TIMEOUT_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch { return false; }
}

function createSession(username) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    authenticated: true,
    username,
    loginTime: Date.now()
  }));
}

function destroySession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function getLockout() {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    return raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
  } catch { return { attempts: 0, lockedUntil: 0 }; }
}

function setLockout(data) {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
}

function isLockedOut() {
  const lockout = getLockout();
  if (lockout.lockedUntil && Date.now() < lockout.lockedUntil) {
    return Math.ceil((lockout.lockedUntil - Date.now()) / 1000);
  }
  if (lockout.lockedUntil && Date.now() >= lockout.lockedUntil) {
    setLockout({ attempts: 0, lockedUntil: 0 });
  }
  return 0;
}

function recordFailedAttempt() {
  const lockout = getLockout();
  lockout.attempts++;
  if (lockout.attempts >= MAX_ATTEMPTS) {
    lockout.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }
  setLockout(lockout);
  return lockout;
}

function showAuthScreen() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('app').classList.add('hidden');
}

function hideAuthScreen() {
  document.getElementById('authScreen').classList.add('hidden');
}

function showAuthForm(formId) {
  ['loginForm', 'registerForm', 'forgotForm'].forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== formId);
  });
  const titles = { loginForm: 'כניסה לחשבון', registerForm: 'הרשמה', forgotForm: 'איפוס סיסמה' };
  document.getElementById('authTitle').textContent = titles[formId] || '';
}

function logoutUser() {
  destroySession();
  showAuthScreen();
  showAuthForm('loginForm');
}

function setupAuth() {
  document.getElementById('showRegister').addEventListener('click', () => showAuthForm('registerForm'));
  document.getElementById('showLogin').addEventListener('click', () => showAuthForm('loginForm'));
  document.getElementById('showForgot').addEventListener('click', () => {
    forgotStep = 'username';
    document.getElementById('newPasswordGroup').classList.add('hidden');
    document.getElementById('forgotError').textContent = '';
    document.getElementById('forgotBtn').textContent = 'המשך';
    showAuthForm('forgotForm');
  });
  document.getElementById('backToLogin').addEventListener('click', () => showAuthForm('loginForm'));
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('האם לצאת מהחשבון?')) logoutUser();
  });

  // Login
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('loginError');
    const lockoutEl = document.getElementById('lockoutMsg');
    errorEl.textContent = '';

    const remaining = isLockedOut();
    if (remaining > 0) {
      lockoutEl.classList.remove('hidden');
      lockoutEl.textContent = 'החשבון נעול. נסה שוב בעוד ' + remaining + ' שניות.';
      return;
    }
    lockoutEl.classList.add('hidden');

    const username = sanitizeText(document.getElementById('loginUsername').value.trim().toLowerCase());
    const password = document.getElementById('loginPassword').value;
    const authData = getAuthData();

    if (!authData || authData.username !== username) {
      const lockout = recordFailedAttempt();
      if (lockout.attempts >= MAX_ATTEMPTS) {
        lockoutEl.classList.remove('hidden');
        lockoutEl.textContent = 'יותר מדי ניסיונות. החשבון נעול ל-60 שניות.';
      } else {
        errorEl.textContent = 'שם משתמש או סיסמה שגויים (' + (MAX_ATTEMPTS - lockout.attempts) + ' ניסיונות נותרו)';
      }
      return;
    }

    const hash = await hashPasswordPBKDF2(password, authData.salt);
    if (hash !== authData.passwordHash) {
      const lockout = recordFailedAttempt();
      if (lockout.attempts >= MAX_ATTEMPTS) {
        lockoutEl.classList.remove('hidden');
        lockoutEl.textContent = 'יותר מדי ניסיונות. החשבון נעול ל-60 שניות.';
      } else {
        errorEl.textContent = 'שם משתמש או סיסמה שגויים (' + (MAX_ATTEMPTS - lockout.attempts) + ' ניסיונות נותרו)';
      }
      return;
    }

    setLockout({ attempts: 0, lockedUntil: 0 });
    createSession(username);
    hideAuthScreen();
    initApp();
    showToast('ברוך הבא! 🎉');
  });

  // Register
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('regError');
    errorEl.textContent = '';

    const username = sanitizeText(document.getElementById('regUsername').value.trim().toLowerCase());
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;

    if (!username) { errorEl.textContent = 'נא להזין שם משתמש'; return; }
    if (password.length < 6) { errorEl.textContent = 'הסיסמה חייבת להכיל לפחות 6 תווים'; return; }
    if (password !== confirm) { errorEl.textContent = 'הסיסמאות אינן תואמות'; return; }

    if (getAuthData()) { errorEl.textContent = 'כבר קיים חשבון. נא להתחבר.'; return; }

    const salt = generateSalt();
    const passwordHash = await hashPasswordPBKDF2(password, salt);
    setAuthData({ username, passwordHash, salt, version: 2, createdAt: new Date().toISOString().split('T')[0] });
    createSession(username);
    hideAuthScreen();
    initApp();
    showToast('ההרשמה הושלמה! 🎉');
  });

  // Forgot password
  document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('forgotError');
    errorEl.textContent = '';

    if (forgotStep === 'username') {
      const username = sanitizeText(document.getElementById('forgotUsername').value.trim().toLowerCase());
      const authData = getAuthData();
      if (!authData || authData.username !== username) {
        errorEl.textContent = 'שם משתמש לא נמצא';
        return;
      }
      document.getElementById('newPasswordGroup').classList.remove('hidden');
      document.getElementById('forgotBtn').textContent = 'עדכן סיסמה';
      forgotStep = 'reset';
    } else if (forgotStep === 'reset') {
      const newPassword = document.getElementById('forgotNewPassword').value;
      if (newPassword.length < 6) { errorEl.textContent = 'הסיסמה חייבת להכיל לפחות 6 תווים'; return; }
      const authData = getAuthData();
      const newSalt = generateSalt();
      authData.passwordHash = await hashPasswordPBKDF2(newPassword, newSalt);
      authData.salt = newSalt;
      authData.version = 2;
      setAuthData(authData);
      showToast('הסיסמה עודכנה! ✓');
      showAuthForm('loginForm');
      forgotStep = 'username';
    }
  });
}

// ===== WELCOME =====
function initApp() {
  // Check auth first
  const authData = getAuthData();
  if (authData && !isAuthenticated()) {
    showAuthScreen();
    showAuthForm('loginForm');
    return;
  }

  // No account yet - show auth registration if no data exists either
  if (!authData) {
    appData = loadData();
    if (appData) {
      // Legacy user without auth - let them set up auth or continue
      // Show the app directly (backwards compatible)
      document.getElementById('authScreen').classList.add('hidden');
      document.getElementById('welcomeScreen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('navTitle').textContent = 'תקציב משפחת ' + appData.family.name;
      renderDashboard();
    } else {
      // No auth, no data - show registration first
      showAuthScreen();
      showAuthForm('registerForm');
    }
    // Dark mode
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.getElementById('darkModeToggle').textContent = '☀️';
    }
    return;
  }

  // Authenticated - load app
  appData = loadData();
  document.getElementById('authScreen').classList.add('hidden');
  if (!appData) {
    document.getElementById('welcomeScreen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  } else {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('navTitle').textContent = 'תקציב משפחת ' + appData.family.name;
    renderDashboard();
  }
  // Dark mode
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('darkModeToggle').textContent = '☀️';
  }
}

function setupWelcome() {
  document.getElementById('startBtn').addEventListener('click', () => {
    const name = sanitizeText(document.getElementById('familyNameInput').value);
    if (!name) { showToast('נא להזין שם משפחה'); return; }
    const goal = parseFloat(document.getElementById('savingsGoalInput').value) || 3000;
    appData = {
      family: { name, createdAt: new Date().toISOString() },
      settings: {
        monthlySavingsGoal: goal,
        budgetTemplate: {
          housing: 5000, food: 3000, transport: 1500, education: 2000, health: 1000,
          entertainment: 1500, clothing: 800, utilities: 1200, phone: 200, internet: 300,
          subscriptions: 200, insurance: 1000, kids: 1000, pets: 300, gifts: 300,
          maintenance: 500, beauty: 300, savings: goal, other: 500
        }
      },
      recurring: [],
      months: {}
    };
    saveData();
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('navTitle').textContent = 'תקציב משפחת ' + name;
    renderDashboard();
    showToast('ברוכים הבאים! 🎉');
  });
}

// ===== MONTH NAVIGATION =====
function updateMonthDisplay() {
  document.getElementById('monthDisplay').textContent = HEBREW_MONTHS[currentMonth] + ' ' + currentYear;
}

function setupMonthNav() {
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    updateMonthDisplay();
    renderDashboard();
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    updateMonthDisplay();
    renderDashboard();
  });
}

// ===== ENTRY FORM =====
function populateCategories(selectEl, type) {
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  selectEl.innerHTML = '<option value="">בחר קטגוריה...</option>';
  cats.forEach(c => {
    if (c.subs && c.subs.length > 0) {
      const group = document.createElement('optgroup');
      group.label = c.icon + ' ' + c.name;
      const general = document.createElement('option');
      general.value = c.id;
      general.textContent = c.name + ' - כללי';
      group.appendChild(general);
      c.subs.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = c.id + ':' + sub.id;
        opt.textContent = sub.name;
        group.appendChild(opt);
      });
      selectEl.appendChild(group);
    } else {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.icon + ' ' + c.name;
      selectEl.appendChild(opt);
    }
  });
}

function parseCategoryValue(value) {
  const parts = value.split(':');
  return { category: parts[0], subcategory: parts[1] || null };
}

function getSubcategoryName(categoryId, subcategoryId) {
  if (!subcategoryId) return null;
  const cat = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
  if (!cat || !cat.subs) return null;
  const sub = cat.subs.find(s => s.id === subcategoryId);
  return sub ? sub.name : null;
}

function setupEntryForm() {
  const form = document.getElementById('entryForm');
  const segIncome = document.getElementById('segIncome');
  const segExpense = document.getElementById('segExpense');
  const categorySelect = document.getElementById('entryCategory');

  // Default date
  document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
  populateCategories(categorySelect, 'income');

  segIncome.addEventListener('click', () => {
    entryType = 'income';
    segIncome.classList.add('active', 'segmented-control__option--active-income');
    segIncome.classList.remove('segmented-control__option--active-expense');
    segExpense.classList.remove('active', 'segmented-control__option--active-expense', 'segmented-control__option--active-income');
    populateCategories(categorySelect, 'income');
  });
  segExpense.addEventListener('click', () => {
    entryType = 'expense';
    segExpense.classList.add('active', 'segmented-control__option--active-expense');
    segExpense.classList.remove('segmented-control__option--active-income');
    segIncome.classList.remove('active', 'segmented-control__option--active-income', 'segmented-control__option--active-expense');
    populateCategories(categorySelect, 'expense');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Clear errors
    document.getElementById('amountError').textContent = '';
    document.getElementById('categoryError').textContent = '';
    document.getElementById('dateError').textContent = '';

    const amount = document.getElementById('entryAmount').value;
    const category = document.getElementById('entryCategory').value;
    const description = sanitizeText(document.getElementById('entryDescription').value);
    const date = document.getElementById('entryDate').value;

    // Validate
    if (!isValidAmount(amount)) {
      document.getElementById('amountError').textContent = 'נא להזין סכום תקין (מספר חיובי)';
      return;
    }
    if (!category) {
      document.getElementById('categoryError').textContent = 'נא לבחור קטגוריה';
      return;
    }
    if (!date) {
      document.getElementById('dateError').textContent = 'נא להזין תאריך';
      return;
    }

    const parsed = parseCategoryValue(category);
    const entry = {
      id: generateId(),
      description: description || (entryType === 'income' ? 'הכנסה' : 'הוצאה'),
      amount: parseFloat(amount),
      category: parsed.category,
      date
    };
    if (parsed.subcategory) entry.subcategory = parsed.subcategory;

    // Add to the entry's month, not the currently viewed month
    const d = new Date(date);
    const key = getMonthKey(d.getFullYear(), d.getMonth());
    const monthData = getMonthData(key);

    if (entryType === 'income') {
      monthData.income.push(entry);
    } else {
      monthData.expenses.push(entry);
    }

    saveData();
    closeAllPanels();
    form.reset();
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    renderDashboard();
    showToast(entryType === 'income' ? 'הכנסה נוספה בהצלחה ✓' : 'הוצאה נוספה בהצלחה ✓');
  });
}

// ===== EDIT FORM =====
function setupEditForm() {
  const form = document.getElementById('editForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const type = document.getElementById('editType').value;
    const amount = document.getElementById('editAmount').value;
    const category = document.getElementById('editCategory').value;
    const description = sanitizeText(document.getElementById('editDescription').value);
    const date = document.getElementById('editDate').value;
    if (!isValidAmount(amount) || !category || !date) { showToast('נא למלא את כל השדות'); return; }

    const key = getMonthKey(currentYear, currentMonth);
    const monthData = getMonthData(key);
    const list = type === 'income' ? monthData.income : monthData.expenses;
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      const parsed = parseCategoryValue(category);
      const updated = { id, description: description || list[idx].description, amount: parseFloat(amount), category: parsed.category, date };
      if (parsed.subcategory) updated.subcategory = parsed.subcategory;
      list[idx] = updated;
      saveData();
      closeAllPanels();
      renderDashboard();
      showToast('הרשומה עודכנה ✓');
    }
  });

  document.getElementById('deleteEntryBtn').addEventListener('click', () => {
    if (!confirm('האם למחוק רשומה זו?')) return;
    const id = document.getElementById('editId').value;
    const type = document.getElementById('editType').value;
    const key = getMonthKey(currentYear, currentMonth);
    const monthData = getMonthData(key);
    const list = type === 'income' ? monthData.income : monthData.expenses;
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list.splice(idx, 1);
      saveData();
      closeAllPanels();
      renderDashboard();
      showToast('הרשומה נמחקה');
    }
  });
}

function openEditPanel(entry, type) {
  document.getElementById('editId').value = entry.id;
  document.getElementById('editType').value = type;
  document.getElementById('editAmount').value = entry.amount;
  document.getElementById('editDescription').value = entry.description;
  document.getElementById('editDate').value = entry.date;
  const sel = document.getElementById('editCategory');
  populateCategories(sel, type);
  sel.value = entry.subcategory ? entry.category + ':' + entry.subcategory : entry.category;
  openPanel('editPanel');
}

// ===== BUDGET ALERTS =====
function renderBudgetAlerts(catTotals, budget) {
  const card = document.getElementById('budgetAlertCard');
  const list = document.getElementById('budgetAlertList');
  const dismissKey = 'budgetAlertDismiss_' + getMonthKey(currentYear, currentMonth);
  if (localStorage.getItem(dismissKey)) { card.style.display = 'none'; return; }

  const alerts = [];
  EXPENSE_CATEGORIES.forEach(cat => {
    const budgeted = budget[cat.id];
    if (!budgeted) return;
    const spent = catTotals[cat.id] || 0;
    const pct = (spent / budgeted) * 100;
    if (pct >= 80) alerts.push({ cat, spent, budgeted, pct });
  });
  alerts.sort((a, b) => b.pct - a.pct);

  if (alerts.length === 0) { card.style.display = 'none'; return; }

  list.innerHTML = '';
  alerts.forEach(({ cat, spent, budgeted, pct }) => {
    const color = pct >= 100 ? '#ef4444' : pct >= 90 ? '#f97316' : '#f59e0b';
    const label = pct >= 100 ? '⛔ חריגה!' : pct >= 90 ? '🔴 קרוב לחריגה' : '🟡 שים לב';
    const row = document.createElement('div');
    row.className = 'budget-alert-item';
    row.innerHTML = '<div class="budget-alert-row">' +
      '<span>' + cat.icon + ' ' + cat.name + '</span>' +
      '<span class="budget-alert-label">' + label + '</span>' +
      '<span class="budget-alert-nums">' + formatCurrency(spent) + ' / ' + formatCurrency(budgeted) + '</span>' +
    '</div>' +
    '<div class="budget-alert-track"><div class="budget-alert-fill" style="width:' + Math.min(pct, 100) + '%;background:' + color + '"></div></div>';
    list.appendChild(row);
  });

  card.style.display = 'block';
  document.getElementById('dismissBudgetAlert').onclick = () => {
    localStorage.setItem(dismissKey, '1');
    card.style.display = 'none';
  };
}

// ===== DAYS LEFT / PACE =====
function renderDaysLeft() {
  const today = new Date();
  const isCurrentMonth = (today.getFullYear() === currentYear && today.getMonth() === currentMonth);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfMonth = isCurrentMonth ? today.getDate() : daysInMonth;
  const daysLeft = isCurrentMonth ? daysInMonth - dayOfMonth : 0;
  const pctElapsed = (dayOfMonth / daysInMonth) * 100;

  document.getElementById('daysLeft').textContent = isCurrentMonth ? daysLeft : '-';
  const fill = document.getElementById('monthProgressFill');
  fill.style.width = pctElapsed.toFixed(0) + '%';
  fill.style.background = pctElapsed > 85 ? '#ef4444' : pctElapsed > 60 ? '#f59e0b' : '#10b981';

  if (!isCurrentMonth) { document.getElementById('spendingPace').textContent = ''; return; }

  const key = getMonthKey(currentYear, currentMonth);
  const monthData = getMonthData(key);
  const budget = monthData.budget || appData.settings.budgetTemplate;
  const totalBudget = Object.values(budget).reduce((s, v) => s + v, 0);
  const totalSpent = monthData.expenses.reduce((s, e) => s + e.amount, 0);
  const expectedByNow = totalBudget * (dayOfMonth / daysInMonth);
  const paceEl = document.getElementById('spendingPace');

  if (totalBudget === 0) { paceEl.textContent = ''; return; }
  if (totalSpent > expectedByNow * 1.15) {
    paceEl.textContent = '🔴 מהיר מדי';
    paceEl.style.color = '#ef4444';
  } else if (totalSpent < expectedByNow * 0.85) {
    paceEl.textContent = '🟢 חסכני';
    paceEl.style.color = '#10b981';
  } else {
    paceEl.textContent = '🟡 מאוזן';
    paceEl.style.color = '#f59e0b';
  }
}

// ===== QUICK ADD =====
let quickAddCategory = null;

function getTopCategories() {
  const counts = {};
  Object.values(appData.months).forEach(m => {
    m.expenses.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1; });
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
  if (sorted.length > 0) return sorted;
  return ['food', 'transport', 'entertainment', 'housing', 'other'];
}

function renderQuickAddBtns() {
  const container = document.getElementById('quickAddBtns');
  container.innerHTML = '';
  const topCatIds = getTopCategories();
  topCatIds.forEach(catId => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    const btn = document.createElement('button');
    btn.className = 'quick-add-btn';
    btn.style.borderColor = cat.color;
    btn.innerHTML = '<span class="quick-add-btn-icon">' + cat.icon + '</span><span class="quick-add-btn-label">' + cat.name + '</span>';
    btn.addEventListener('click', () => openQuickModal(cat));
    container.appendChild(btn);
  });
}

function openQuickModal(cat) {
  quickAddCategory = cat;
  document.getElementById('quickModalTitle').innerHTML = cat.icon + ' ' + cat.name;
  document.getElementById('quickAmount').value = '';
  document.getElementById('quickModalOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('quickAmount').focus(), 100);
}

function closeQuickModal() {
  document.getElementById('quickModalOverlay').style.display = 'none';
  quickAddCategory = null;
}

function setupQuickAdd() {
  document.getElementById('quickSaveBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('quickAmount').value);
    if (!amount || amount <= 0 || !quickAddCategory) return;
    const today = new Date().toISOString().split('T')[0];
    const key = getMonthKey(new Date().getFullYear(), new Date().getMonth());
    const monthData = getMonthData(key);
    monthData.expenses.push({
      id: generateId(),
      description: quickAddCategory.name,
      amount,
      category: quickAddCategory.id,
      date: today
    });
    saveData();
    closeQuickModal();
    renderDashboard();
    showToast('✓ ' + quickAddCategory.name + ' ' + formatCurrency(amount) + ' נוספה');
  });

  document.getElementById('quickCancelBtn').addEventListener('click', closeQuickModal);
  document.getElementById('quickModalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('quickModalOverlay')) closeQuickModal();
  });

  document.getElementById('quickAmount').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('quickSaveBtn').click();
    if (e.key === 'Escape') closeQuickModal();
  });
}

// ===== RENDER DASHBOARD =====
function renderDashboard() {
  if (!appData) return;
  updateMonthDisplay();
  const key = getMonthKey(currentYear, currentMonth);
  const monthData = getMonthData(key);

  const effectiveExpenses = getEffectiveExpenses(monthData);
  const totalIncome = monthData.income.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = effectiveExpenses.reduce((s, e) => s + e.amount, 0);
  const net = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((net / totalIncome) * 100).toFixed(1) : '0';
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyAvg = totalExpenses / daysInMonth;

  // Hero
  document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
  document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
  const balEl = document.getElementById('netBalance');
  balEl.textContent = formatCurrency(net);
  balEl.className = 'hero-metric__value ' + (net >= 0 ? 'income-color' : 'expense-color');

  // Change vs previous month
  const prevKey = getMonthKey(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1);
  const prevData = appData.months[prevKey];
  if (prevData) {
    const prevIncome = prevData.income.reduce((s, e) => s + e.amount, 0);
    const prevExpense = prevData.expenses.reduce((s, e) => s + e.amount, 0);
    const incChange = prevIncome > 0 ? (((totalIncome - prevIncome) / prevIncome) * 100).toFixed(1) : '0';
    const expChange = prevExpense > 0 ? (((totalExpenses - prevExpense) / prevExpense) * 100).toFixed(1) : '0';
    document.getElementById('incomeChange').textContent = (incChange >= 0 ? '▲' : '▼') + ' ' + Math.abs(incChange) + '%';
    document.getElementById('expenseChange').textContent = (expChange >= 0 ? '▲' : '▼') + ' ' + Math.abs(expChange) + '%';
  } else {
    document.getElementById('incomeChange').textContent = '';
    document.getElementById('expenseChange').textContent = '';
  }
  document.getElementById('savingsRate').textContent = 'חיסכון ' + savingsRate + '%';

  // Stats
  document.getElementById('dailyAvg').textContent = formatCurrency(Math.round(dailyAvg));

  // Top category
  const catTotals = {};
  effectiveExpenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === topCat[0]);
    document.getElementById('topCategory').textContent = cat ? cat.icon + ' ' + cat.name : '-';
  } else {
    document.getElementById('topCategory').textContent = '-';
  }

  // Budget adherence
  const budget = monthData.budget || appData.settings.budgetTemplate;
  const totalBudget = Object.values(budget).reduce((s, v) => s + v, 0);
  const adherence = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
  document.getElementById('budgetAdherence').textContent = adherence + '%';

  // Pie chart
  renderPieChart(catTotals, totalExpenses);

  // Income bars
  renderIncomeChart(monthData.income, totalIncome);

  // Budget bars
  renderBudgetBars(catTotals, budget);

  // Savings ring
  renderSavingsRing(net);

  // Trends
  renderTrends();

  // Recent transactions
  renderTransactions(monthData, effectiveExpenses);

  // Dashboard extras
  renderBudgetAlerts(catTotals, budget);
  renderDaysLeft();
  renderQuickAddBtns();
}

// ===== PIE CHART =====
function renderPieChart(catTotals, total) {
  const pie = document.getElementById('pieChart');
  document.getElementById('pieCenter').textContent = formatCurrency(total);
  const legend = document.getElementById('expenseLegend');
  legend.innerHTML = '';

  if (total === 0) {
    pie.style.background = 'var(--gray-100)';
    return;
  }

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  let deg = 0;
  const gradientParts = [];
  sorted.forEach(([catId, amount]) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    const pct = (amount / total) * 360;
    gradientParts.push(`${cat.color} ${deg}deg ${deg + pct}deg`);
    deg += pct;

    const row = document.createElement('div');
    row.className = 'legend-row';
    const colorDiv = document.createElement('div');
    colorDiv.className = 'legend-color';
    colorDiv.style.background = cat.color;
    const label = document.createElement('span');
    label.className = 'legend-label';
    label.textContent = cat.icon + ' ' + cat.name;
    const val = document.createElement('span');
    val.className = 'legend-value';
    val.textContent = formatCurrency(amount);
    const pctSpan = document.createElement('span');
    pctSpan.className = 'legend-percent';
    pctSpan.textContent = ((amount / total) * 100).toFixed(0) + '%';
    row.appendChild(colorDiv);
    row.appendChild(label);
    row.appendChild(val);
    row.appendChild(pctSpan);
    legend.appendChild(row);
  });

  pie.style.background = `conic-gradient(${gradientParts.join(', ')})`;
}

// ===== INCOME CHART =====
function renderIncomeChart(incomeList, total) {
  const container = document.getElementById('incomeChart');
  container.innerHTML = '';
  container.style.textAlign = '';
  container.style.color = '';
  container.style.padding = '';
  document.getElementById('incomeTotalChart').textContent = formatCurrency(total);

  const catTotals = {};
  incomeList.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const maxVal = Math.max(...Object.values(catTotals), 1);

  Object.entries(catTotals).sort((a, b) => b[1] - a[1]).forEach(([catId, amount]) => {
    const cat = INCOME_CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    const item = document.createElement('div');
    item.className = 'bar-item';
    const label = document.createElement('span');
    label.className = 'bar-item-label';
    label.textContent = cat.icon + ' ' + cat.name;
    const track = document.createElement('div');
    track.className = 'bar-track';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = ((amount / maxVal) * 100) + '%'; }, 50);
    track.appendChild(fill);
    const val = document.createElement('span');
    val.className = 'bar-value';
    val.textContent = formatCurrency(amount);
    item.appendChild(label);
    item.appendChild(track);
    item.appendChild(val);
    container.appendChild(item);
  });

  if (Object.keys(catTotals).length === 0) {
    container.textContent = 'אין הכנסות להצגה';
    container.style.textAlign = 'center';
    container.style.color = 'var(--text-secondary)';
    container.style.padding = '20px';
  }
}

// ===== BUDGET BARS =====
function renderBudgetBars(catTotals, budget) {
  const container = document.getElementById('budgetBars');
  container.innerHTML = '';

  EXPENSE_CATEGORIES.forEach(cat => {
    const budgetAmount = budget[cat.id] || 0;
    if (budgetAmount === 0) return;
    const actual = catTotals[cat.id] || 0;
    const pct = Math.round((actual / budgetAmount) * 100);

    const item = document.createElement('div');
    item.className = 'budget-item';

    const header = document.createElement('div');
    header.className = 'budget-item__header';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'budget-item__name';
    nameSpan.textContent = cat.icon + ' ' + cat.name;
    const valSpan = document.createElement('span');
    valSpan.className = 'budget-item__values';
    valSpan.textContent = formatCurrency(actual) + ' / ' + formatCurrency(budgetAmount);
    const pctSpan = document.createElement('span');
    pctSpan.className = 'budget-item__percent';
    pctSpan.textContent = pct + '%';
    pctSpan.style.color = pct > 100 ? 'var(--danger-500)' : pct > 80 ? 'var(--warning-600)' : 'var(--success-600)';
    valSpan.appendChild(pctSpan);
    header.appendChild(nameSpan);
    header.appendChild(valSpan);

    const track = document.createElement('div');
    track.className = 'budget-bar__track';
    const fill = document.createElement('div');
    fill.className = 'budget-bar__fill ' + (pct > 100 ? 'over' : pct > 90 ? 'danger' : pct > 60 ? 'warn' : 'ok');
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = Math.min(pct, 100) + '%'; }, 50);
    track.appendChild(fill);

    item.appendChild(header);
    item.appendChild(track);
    container.appendChild(item);
  });
}

// ===== SAVINGS RING =====
function renderSavingsRing(net) {
  const goal = appData.settings.monthlySavingsGoal || 1;
  const pct = Math.max(0, Math.min(100, Math.round((net / goal) * 100)));
  const ring = document.getElementById('savingsRing');
  const circumference = 251.2;
  const offset = circumference * (1 - pct / 100);
  setTimeout(() => { ring.style.strokeDashoffset = offset; }, 50);

  if (pct > 75) ring.style.stroke = 'var(--success-600)';
  else if (pct > 50) ring.style.stroke = 'var(--success-500)';
  else ring.style.stroke = 'var(--primary-500)';

  document.getElementById('savingsRingLabel').textContent = pct + '%';
  document.getElementById('actualSavings').textContent = formatCurrency(Math.max(0, net));
  document.getElementById('savingsGoalDisplay').textContent = formatCurrency(goal);
}

// ===== TRENDS CHART =====
function renderTrends() {
  const canvas = document.getElementById('trendsCanvas');
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 250;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get last 6 months data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m < 0) { m += 12; y--; }
    const key = getMonthKey(y, m);
    const data = appData.months[key];
    months.push({
      label: HEBREW_MONTHS[m].slice(0, 3),
      income: data ? data.income.reduce((s, e) => s + e.amount, 0) : 0,
      expenses: data ? data.expenses.reduce((s, e) => s + e.amount, 0) : 0
    });
  }

  const allValues = months.flatMap(m => [m.income, m.expenses]);
  const maxVal = Math.max(...allValues, 1000);
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const w = canvas.width - padding.left - padding.right;
  const h = canvas.height - padding.top - padding.bottom;

  // Grid lines (adapt to theme)
  const computedStyle = getComputedStyle(document.documentElement);
  const gridColor = computedStyle.getPropertyValue('--border-default').trim() || '#e5e7eb';
  const labelColor = computedStyle.getPropertyValue('--text-secondary').trim() || '#9ca3af';
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(canvas.width - padding.right, y); ctx.stroke();
    ctx.fillStyle = labelColor;
    ctx.font = '11px Heebo';
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrencyShort(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
  }

  // X labels
  ctx.textAlign = 'center';
  ctx.fillStyle = labelColor;
  months.forEach((m, i) => {
    const x = padding.left + (w / (months.length - 1)) * i;
    ctx.fillText(m.label, x, canvas.height - 10);
  });

  // Draw line helper
  function drawLine(data, color, dashed) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    if (dashed) ctx.setLineDash([6, 4]);
    else ctx.setLineDash([]);
    data.forEach((val, i) => {
      const x = padding.left + (w / (data.length - 1)) * i;
      const y = padding.top + h - (val / maxVal) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Area fill
    if (!dashed) {
      ctx.lineTo(padding.left + w, padding.top + h);
      ctx.lineTo(padding.left, padding.top + h);
      ctx.closePath();
      ctx.fillStyle = color.replace(')', ',0.08)').replace('rgb', 'rgba');
      ctx.fill();
    }

    // Dots
    ctx.setLineDash([]);
    data.forEach((val, i) => {
      const x = padding.left + (w / (data.length - 1)) * i;
      const y = padding.top + h - (val / maxVal) * h;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  drawLine(months.map(m => m.income), 'rgb(16, 185, 129)', false);
  drawLine(months.map(m => m.expenses), 'rgb(239, 68, 68)', true);

  // Legend
  ctx.font = '12px Heebo';
  ctx.fillStyle = 'rgb(16, 185, 129)';
  ctx.fillText('── הכנסות', canvas.width - 60, 18);
  ctx.fillStyle = 'rgb(239, 68, 68)';
  ctx.fillText('- - הוצאות', canvas.width - 160, 18);
}

// ===== TRANSACTIONS =====
function renderTransactions(monthData, effectiveExpenses) {
  const container = document.getElementById('recentTransactions');
  const empty = document.getElementById('emptyState');
  container.innerHTML = '';

  const expenses = effectiveExpenses || monthData.expenses;
  const all = [
    ...monthData.income.map(e => ({ ...e, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (all.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  all.slice(0, 20).forEach(entry => {
    const cats = entry.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const cat = cats.find(c => c.id === entry.category);
    const row = document.createElement('div');
    row.className = 'transaction-row' + (entry.isRecurring ? ' transaction-row--recurring' : '');
    if (!entry.isRecurring) {
      row.addEventListener('click', () => openEditPanel(entry, entry.type));
    }

    const icon = document.createElement('div');
    icon.className = 'transaction-icon';
    icon.textContent = entry.isRecurring ? '🔄' : (cat ? cat.icon : '📄');

    const info = document.createElement('div');
    info.className = 'transaction-info';
    const desc = document.createElement('div');
    desc.className = 'transaction-desc';
    desc.textContent = entry.description;
    const catLabel = document.createElement('div');
    catLabel.className = 'transaction-cat';
    const subName = getSubcategoryName(entry.category, entry.subcategory);
    const catText = subName ? (cat ? cat.name : '') + ' › ' + subName : (cat ? cat.name : '');
    catLabel.textContent = entry.isRecurring ? catText + ' · קבוע' : catText;
    info.appendChild(desc);
    info.appendChild(catLabel);

    const amountEl = document.createElement('div');
    amountEl.className = 'transaction-amount ' + entry.type;
    amountEl.textContent = (entry.type === 'income' ? '+' : '-') + formatCurrency(entry.amount);

    const dateEl = document.createElement('div');
    dateEl.className = 'transaction-date';
    dateEl.textContent = new Date(entry.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });

    row.appendChild(icon);
    row.appendChild(info);
    row.appendChild(amountEl);
    row.appendChild(dateEl);

    if (entry.isRecurring) {
      const skipBtn = document.createElement('button');
      skipBtn.className = 'transaction-skip-btn';
      skipBtn.textContent = 'דלג';
      skipBtn.title = 'דלג על חשבון זה החודש';
      skipBtn.addEventListener('click', (ev) => { ev.stopPropagation(); skipRecurring(entry.id); });
      row.appendChild(skipBtn);
    }

    container.appendChild(row);
  });
}

// ===== REPORTS =====
function renderReports() {
  const tbody = document.getElementById('comparisonBody');
  tbody.innerHTML = '';

  const monthsList = [];
  for (let i = 11; i >= 0; i--) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m < 0) { m += 12; y--; }
    const key = getMonthKey(y, m);
    const data = appData.months[key];
    const inc = data ? data.income.reduce((s, e) => s + e.amount, 0) : 0;
    const exp = data ? data.expenses.reduce((s, e) => s + e.amount, 0) : 0;
    monthsList.push({ label: HEBREW_MONTHS[m] + ' ' + y, income: inc, expenses: exp, month: m, year: y });
  }

  monthsList.forEach((m, idx) => {
    const net = m.income - m.expenses;
    const savRate = m.income > 0 ? ((net / m.income) * 100).toFixed(1) : '0';
    const prev = idx > 0 ? monthsList[idx - 1] : null;
    let changeStr = '-';
    if (prev && prev.expenses > 0) {
      const ch = (((m.expenses - prev.expenses) / prev.expenses) * 100).toFixed(1);
      changeStr = (ch >= 0 ? '+' : '') + ch + '%';
    }

    const tr = document.createElement('tr');
    const cells = [m.label, formatCurrency(m.income), formatCurrency(m.expenses), formatCurrency(net), savRate + '%', changeStr];
    cells.forEach((text, i) => {
      const td = document.createElement('td');
      td.textContent = text;
      if (i === 3) td.style.color = net >= 0 ? 'var(--success-600)' : 'var(--danger-500)';
      if (i === 5 && changeStr !== '-') {
        td.className = parseFloat(changeStr) <= 0 ? 'change-positive' : 'change-negative';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // Category trends chart
  renderCategoryTrends(monthsList);
}

function renderCategoryTrends(monthsList) {
  const canvas = document.getElementById('categoryTrendsCanvas');
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const last6 = monthsList.slice(-6);
  const topCats = EXPENSE_CATEGORIES.slice(0, 5);
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const w = canvas.width - padding.left - padding.right;
  const h = canvas.height - padding.top - padding.bottom;

  // Get data per category per month
  const catData = {};
  topCats.forEach(cat => {
    catData[cat.id] = last6.map(m => {
      const key = getMonthKey(m.year, m.month);
      const data = appData.months[key];
      if (!data) return 0;
      return data.expenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
    });
  });

  const allVals = Object.values(catData).flat();
  const maxVal = Math.max(...allVals, 1000);

  // Grid (theme-aware)
  const cs = getComputedStyle(document.documentElement);
  const gridC = cs.getPropertyValue('--border-default').trim() || '#e5e7eb';
  const labelC = cs.getPropertyValue('--text-secondary').trim() || '#9ca3af';
  ctx.strokeStyle = gridC; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(canvas.width - padding.right, y); ctx.stroke();
    ctx.fillStyle = labelC; ctx.font = '11px Heebo'; ctx.textAlign = 'right';
    ctx.fillText(formatCurrencyShort(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
  }

  // X labels
  ctx.textAlign = 'center'; ctx.fillStyle = labelC;
  last6.forEach((m, i) => {
    const x = padding.left + (w / (last6.length - 1)) * i;
    ctx.fillText(m.label.split(' ')[0].slice(0, 3), x, canvas.height - 15);
  });

  // Lines per category
  topCats.forEach(cat => {
    const data = catData[cat.id];
    ctx.beginPath(); ctx.strokeStyle = cat.color; ctx.lineWidth = 2; ctx.setLineDash([]);
    data.forEach((val, i) => {
      const x = padding.left + (w / (data.length - 1)) * i;
      const y = padding.top + h - (val / maxVal) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // Dots
    data.forEach((val, i) => {
      const x = padding.left + (w / (data.length - 1)) * i;
      const y = padding.top + h - (val / maxVal) * h;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = cat.color; ctx.fill();
    });
  });

  // Legend
  let lx = padding.left;
  ctx.font = '11px Heebo';
  topCats.forEach(cat => {
    ctx.fillStyle = cat.color;
    ctx.fillRect(lx, canvas.height - 5, 10, 3);
    ctx.fillStyle = labelC;
    ctx.textAlign = 'left';
    ctx.fillText(cat.name, lx + 14, canvas.height - 1);
    lx += ctx.measureText(cat.name).width + 30;
  });
}

// ===== INSIGHTS BI =====
const FIXED_CATEGORIES = ['housing', 'insurance', 'subscriptions', 'phone', 'internet'];
const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

function getYearData() {
  const data = [];
  for (let m = 0; m < 12; m++) {
    const key = getMonthKey(currentYear, m);
    const md = appData.months[key];
    data.push({
      month: m,
      label: HEBREW_MONTHS[m].slice(0, 3),
      income: md ? md.income.reduce((s, e) => s + e.amount, 0) : 0,
      expenses: md ? md.expenses.reduce((s, e) => s + e.amount, 0) : 0,
      expenseEntries: md ? md.expenses : [],
      incomeEntries: md ? md.income : []
    });
  }
  return data;
}

function getCanvasContext(canvasId, height) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = height || 280;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

function getThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    grid: cs.getPropertyValue('--border-default').trim() || '#e5e7eb',
    label: cs.getPropertyValue('--text-secondary').trim() || '#9ca3af',
    text: cs.getPropertyValue('--text-primary').trim() || '#1f2937'
  };
}

function renderInsights() {
  if (!appData) return;
  const yearData = getYearData();
  const hasData = yearData.some(m => m.income > 0 || m.expenses > 0);
  document.getElementById('insightsEmpty').style.display = hasData ? 'none' : 'block';
  document.getElementById('insightsGrid').style.display = hasData ? '' : 'none';
  if (!hasData) return;

  const curMonthData = yearData[currentMonth];
  const prevMonth = currentMonth > 0 ? currentMonth - 1 : 11;
  const prevMonthData = yearData[prevMonth];

  renderAnnualBars(yearData);
  renderYearDonut(yearData);
  renderTopExpenses(curMonthData, prevMonthData);
  renderSavingsTrend(yearData);
  renderDayOfWeekChart(curMonthData);
  renderForecast(yearData);
  renderFixedVsVariable(curMonthData);
}

// --- Card 1: Annual Grouped Bar Chart ---
function renderAnnualBars(yearData) {
  const { canvas, ctx } = getCanvasContext('annualBarsCanvas', 280);
  const tc = getThemeColors();
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const w = canvas.width - padding.left - padding.right;
  const h = canvas.height - padding.top - padding.bottom;

  const maxVal = Math.max(...yearData.flatMap(m => [m.income, m.expenses]), 1000);
  const barGroupW = w / 12;
  const barW = barGroupW * 0.35;

  // Grid
  ctx.strokeStyle = tc.grid; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(canvas.width - padding.right, y); ctx.stroke();
    ctx.fillStyle = tc.label; ctx.font = '10px Heebo'; ctx.textAlign = 'right';
    ctx.fillText(formatCurrencyShort(maxVal - (maxVal / 4) * i), padding.left - 6, y + 3);
  }

  yearData.forEach((m, i) => {
    const x = padding.left + barGroupW * i + barGroupW * 0.1;
    const incH = (m.income / maxVal) * h;
    const expH = (m.expenses / maxVal) * h;

    // Income bar
    ctx.fillStyle = 'rgba(16,185,129,0.8)';
    ctx.fillRect(x, padding.top + h - incH, barW, incH);
    // Expense bar
    ctx.fillStyle = 'rgba(239,68,68,0.8)';
    ctx.fillRect(x + barW + 2, padding.top + h - expH, barW, expH);

    // Label
    ctx.fillStyle = tc.label; ctx.font = '9px Heebo'; ctx.textAlign = 'center';
    ctx.fillText(m.label, x + barW, canvas.height - 10);
  });

  // Legend
  ctx.font = '11px Heebo';
  ctx.fillStyle = 'rgba(16,185,129,0.8)';
  ctx.fillRect(padding.left, canvas.height - 8, 10, 3);
  ctx.fillStyle = tc.label; ctx.textAlign = 'left';
  ctx.fillText('הכנסות', padding.left + 14, canvas.height - 4);
  ctx.fillStyle = 'rgba(239,68,68,0.8)';
  ctx.fillRect(padding.left + 70, canvas.height - 8, 10, 3);
  ctx.fillStyle = tc.label;
  ctx.fillText('הוצאות', padding.left + 84, canvas.height - 4);

  // Summary
  const totalInc = yearData.reduce((s, m) => s + m.income, 0);
  const totalExp = yearData.reduce((s, m) => s + m.expenses, 0);
  const summary = document.getElementById('annualSummary');
  summary.innerHTML = '<div class="insight-summary-row">' +
    '<div class="insight-stat"><span class="insight-stat-label">סה"כ הכנסות</span><span class="insight-stat-value income-color">' + formatCurrency(totalInc) + '</span></div>' +
    '<div class="insight-stat"><span class="insight-stat-label">סה"כ הוצאות</span><span class="insight-stat-value expense-color">' + formatCurrency(totalExp) + '</span></div>' +
    '<div class="insight-stat"><span class="insight-stat-label">יתרה שנתית</span><span class="insight-stat-value ' + (totalInc - totalExp >= 0 ? 'income-color' : 'expense-color') + '">' + formatCurrency(totalInc - totalExp) + '</span></div>' +
    '</div>';
}

// --- Card 2: Year Donut ---
function renderYearDonut(yearData) {
  const { canvas, ctx } = getCanvasContext('yearDonutCanvas', 280);
  const catTotals = {};
  yearData.forEach(m => {
    m.expenseEntries.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
  });

  const total = Object.values(catTotals).reduce((s, v) => s + v, 0);
  if (total === 0) return;

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const cx = canvas.width / 2;
  const cy = 130;
  const outerR = 100;
  const innerR = 55;
  let startAngle = -Math.PI / 2;

  sorted.forEach(([catId, amount]) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    const slice = (amount / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
    ctx.arc(cx, cy, innerR, startAngle + slice, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = cat ? cat.color : '#9ca3af';
    ctx.fill();
    startAngle += slice;
  });

  // Center text
  const tc = getThemeColors();
  ctx.fillStyle = tc.text; ctx.font = 'bold 16px Heebo'; ctx.textAlign = 'center';
  ctx.fillText(formatCurrency(total), cx, cy - 2);
  ctx.fillStyle = tc.label; ctx.font = '11px Heebo';
  ctx.fillText('סה"כ שנתי', cx, cy + 14);

  // Legend
  const legend = document.getElementById('yearDonutLegend');
  legend.innerHTML = '';
  sorted.slice(0, 8).forEach(([catId, amount]) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    const pct = ((amount / total) * 100).toFixed(1);
    const div = document.createElement('div');
    div.className = 'legend-item';
    div.innerHTML = '<span class="legend-dot" style="background:' + cat.color + '"></span>' +
      '<span class="legend-label">' + cat.icon + ' ' + cat.name + '</span>' +
      '<span class="legend-value">' + formatCurrency(amount) + ' (' + pct + '%)</span>';
    legend.appendChild(div);
  });
}

// --- Card 3: Top 5 Expenses ---
function renderTopExpenses(curMonth, prevMonth) {
  const container = document.getElementById('topExpensesContainer');
  container.innerHTML = '';
  const catTotals = {};
  curMonth.expenseEntries.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const prevTotals = {};
  prevMonth.expenseEntries.forEach(e => {
    prevTotals[e.category] = (prevTotals[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxAmount = sorted.length > 0 ? sorted[0][1] : 1;

  if (sorted.length === 0) {
    container.innerHTML = '<p class="text-muted">אין הוצאות החודש</p>';
    return;
  }

  sorted.forEach(([catId, amount]) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === catId);
    const prevAmt = prevTotals[catId] || 0;
    const change = prevAmt > 0 ? (((amount - prevAmt) / prevAmt) * 100).toFixed(0) : null;
    const pct = (amount / maxAmount * 100).toFixed(0);

    const row = document.createElement('div');
    row.className = 'insight-bar-row';
    row.innerHTML = '<div class="insight-bar-header">' +
      '<span>' + (cat ? cat.icon + ' ' + cat.name : catId) + '</span>' +
      '<span class="insight-bar-amount">' + formatCurrency(amount) +
      (change !== null ? ' <span class="' + (parseFloat(change) <= 0 ? 'change-positive' : 'change-negative') + '">' +
        (parseFloat(change) > 0 ? '▲' : '▼') + Math.abs(change) + '%</span>' : '') +
      '</span></div>' +
      '<div class="insight-bar-track"><div class="insight-bar-fill" style="width:' + pct + '%;background:' + (cat ? cat.color : '#9ca3af') + '"></div></div>';
    container.appendChild(row);
  });
}

// --- Card 4: Savings Trend ---
function renderSavingsTrend(yearData) {
  const { canvas, ctx } = getCanvasContext('savingsTrendCanvas', 260);
  const tc = getThemeColors();
  const padding = { top: 25, right: 20, bottom: 40, left: 60 };
  const w = canvas.width - padding.left - padding.right;
  const h = canvas.height - padding.top - padding.bottom;

  const savings = yearData.map(m => m.income - m.expenses);
  const maxAbs = Math.max(Math.abs(Math.max(...savings)), Math.abs(Math.min(...savings)), 1000);
  const zeroY = padding.top + h / 2;

  // Grid
  ctx.strokeStyle = tc.grid; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(canvas.width - padding.right, y); ctx.stroke();
    const val = maxAbs - (maxAbs * 2 / 4) * i;
    ctx.fillStyle = tc.label; ctx.font = '10px Heebo'; ctx.textAlign = 'right';
    ctx.fillText(formatCurrencyShort(val), padding.left - 6, y + 3);
  }

  // Zero line
  ctx.strokeStyle = tc.label; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(padding.left, zeroY); ctx.lineTo(canvas.width - padding.right, zeroY); ctx.stroke();
  ctx.setLineDash([]);

  // Area fills + line
  const points = savings.map((val, i) => ({
    x: padding.left + (w / 11) * i,
    y: zeroY - (val / maxAbs) * (h / 2)
  }));

  // Green area (above zero)
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, Math.min(p.y, zeroY));
    else ctx.lineTo(p.x, Math.min(p.y, zeroY));
  });
  points.slice().reverse().forEach(p => ctx.lineTo(p.x, zeroY));
  ctx.closePath();
  ctx.fillStyle = 'rgba(16,185,129,0.12)';
  ctx.fill();

  // Red area (below zero)
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, Math.max(p.y, zeroY));
    else ctx.lineTo(p.x, Math.max(p.y, zeroY));
  });
  points.slice().reverse().forEach(p => ctx.lineTo(p.x, zeroY));
  ctx.closePath();
  ctx.fillStyle = 'rgba(239,68,68,0.12)';
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#4150f5'; ctx.lineWidth = 2.5;
  points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  ctx.stroke();

  // Moving average line (3-month)
  const ma = savings.map((_, i) => {
    const start = Math.max(0, i - 2);
    const slice = savings.slice(start, i + 1);
    return slice.reduce((s, v) => s + v, 0) / slice.length;
  });
  ctx.beginPath();
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 3]);
  ma.forEach((val, i) => {
    const x = padding.left + (w / 11) * i;
    const y = zeroY - (val / maxAbs) * (h / 2);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke(); ctx.setLineDash([]);

  // Dots
  points.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = savings[i] >= 0 ? '#10b981' : '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });

  // X labels
  ctx.fillStyle = tc.label; ctx.font = '9px Heebo'; ctx.textAlign = 'center';
  yearData.forEach((m, i) => ctx.fillText(m.label, padding.left + (w / 11) * i, canvas.height - 10));

  // Legend
  ctx.font = '11px Heebo'; ctx.textAlign = 'left';
  ctx.strokeStyle = '#4150f5'; ctx.lineWidth = 2; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(padding.left, canvas.height - 5); ctx.lineTo(padding.left + 15, canvas.height - 5); ctx.stroke();
  ctx.fillStyle = tc.label; ctx.fillText('יתרה חודשית', padding.left + 18, canvas.height - 2);
  ctx.strokeStyle = '#f59e0b'; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(padding.left + 100, canvas.height - 5); ctx.lineTo(padding.left + 115, canvas.height - 5); ctx.stroke();
  ctx.setLineDash([]); ctx.fillText('ממוצע נע', padding.left + 118, canvas.height - 2);
}

// --- Card 5: Day of Week Chart ---
function renderDayOfWeekChart(monthData) {
  const { canvas, ctx } = getCanvasContext('dayOfWeekCanvas', 250);
  const tc = getThemeColors();
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const w = canvas.width - padding.left - padding.right;
  const h = canvas.height - padding.top - padding.bottom;

  const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  monthData.expenseEntries.forEach(e => {
    const day = new Date(e.date).getDay();
    dayTotals[day] += e.amount;
  });

  const maxVal = Math.max(...dayTotals, 100);
  const maxDay = dayTotals.indexOf(Math.max(...dayTotals));
  const barW = w / 7 * 0.6;
  const gap = w / 7;

  // Grid
  ctx.strokeStyle = tc.grid; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(canvas.width - padding.right, y); ctx.stroke();
    ctx.fillStyle = tc.label; ctx.font = '10px Heebo'; ctx.textAlign = 'right';
    ctx.fillText(formatCurrencyShort(maxVal - (maxVal / 4) * i), padding.left - 6, y + 3);
  }

  // Bars
  dayTotals.forEach((val, i) => {
    const x = padding.left + gap * i + (gap - barW) / 2;
    const barH = (val / maxVal) * h;
    const gradient = ctx.createLinearGradient(x, padding.top + h - barH, x, padding.top + h);
    if (i === maxDay) {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#fca5a5');
    } else {
      gradient.addColorStop(0, '#4150f5');
      gradient.addColorStop(1, '#93a0ff');
    }
    ctx.fillStyle = gradient;
    ctx.beginPath();
    const r = 4;
    ctx.moveTo(x + r, padding.top + h - barH);
    ctx.arcTo(x + barW, padding.top + h - barH, x + barW, padding.top + h, r);
    ctx.arcTo(x + barW, padding.top + h, x, padding.top + h, 0);
    ctx.arcTo(x, padding.top + h, x, padding.top + h - barH, 0);
    ctx.arcTo(x, padding.top + h - barH, x + barW, padding.top + h - barH, r);
    ctx.fill();

    // Value on top
    if (val > 0) {
      ctx.fillStyle = i === maxDay ? '#ef4444' : tc.label;
      ctx.font = '9px Heebo'; ctx.textAlign = 'center';
      ctx.fillText(formatCurrencyShort(val), x + barW / 2, padding.top + h - barH - 6);
    }

    // Day label
    ctx.fillStyle = i === maxDay ? '#ef4444' : tc.label;
    ctx.font = (i === maxDay ? 'bold ' : '') + '11px Heebo'; ctx.textAlign = 'center';
    ctx.fillText(HEBREW_DAYS[i], x + barW / 2, canvas.height - 12);
  });
}

// --- Card 6: Forecast ---
function renderForecast(yearData) {
  const container = document.getElementById('forecastContainer');
  // Average of last 3 months with data
  const recent = yearData.filter(m => m.income > 0 || m.expenses > 0).slice(-3);
  if (recent.length === 0) {
    container.innerHTML = '<p class="text-muted">אין מספיק נתונים לתחזית</p>';
    return;
  }

  const avgIncome = recent.reduce((s, m) => s + m.income, 0) / recent.length;
  const avgExpense = recent.reduce((s, m) => s + m.expenses, 0) / recent.length;
  const avgNet = avgIncome - avgExpense;

  container.innerHTML = '<div class="forecast-cards">' +
    '<div class="forecast-card forecast-income">' +
      '<div class="forecast-icon">💰</div>' +
      '<div class="forecast-label">הכנסות צפויות</div>' +
      '<div class="forecast-value">' + formatCurrency(Math.round(avgIncome)) + '</div>' +
    '</div>' +
    '<div class="forecast-card forecast-expense">' +
      '<div class="forecast-icon">💳</div>' +
      '<div class="forecast-label">הוצאות צפויות</div>' +
      '<div class="forecast-value">' + formatCurrency(Math.round(avgExpense)) + '</div>' +
    '</div>' +
    '<div class="forecast-card ' + (avgNet >= 0 ? 'forecast-positive' : 'forecast-negative') + '">' +
      '<div class="forecast-icon">' + (avgNet >= 0 ? '📈' : '📉') + '</div>' +
      '<div class="forecast-label">יתרה צפויה</div>' +
      '<div class="forecast-value">' + formatCurrency(Math.round(avgNet)) + '</div>' +
    '</div>' +
  '</div>' +
  '<p class="forecast-note">* מבוסס על ממוצע ' + recent.length + ' חודשים אחרונים</p>';
}

// --- Card 7: Fixed vs Variable ---
function renderFixedVsVariable(monthData) {
  const container = document.getElementById('fixedVsVariableContainer');
  let fixed = 0, variable = 0;
  monthData.expenseEntries.forEach(e => {
    if (FIXED_CATEGORIES.includes(e.category)) fixed += e.amount;
    else variable += e.amount;
  });

  const total = fixed + variable;
  if (total === 0) {
    container.innerHTML = '<p class="text-muted">אין הוצאות החודש</p>';
    return;
  }
  const fixedPct = ((fixed / total) * 100).toFixed(0);

  container.innerHTML = '<div class="fv-container">' +
    '<div class="fv-gauge">' +
      '<svg viewBox="0 0 100 100" class="fv-ring">' +
        '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-default, #e5e7eb)" stroke-width="8"/>' +
        '<circle cx="50" cy="50" r="40" fill="none" stroke="#4150f5" stroke-width="8" ' +
          'stroke-dasharray="' + (fixedPct * 2.51) + ' 251" stroke-dashoffset="0" transform="rotate(-90 50 50)" stroke-linecap="round"/>' +
      '</svg>' +
      '<div class="fv-gauge-text"><span class="fv-pct">' + fixedPct + '%</span><span class="fv-label">קבועות</span></div>' +
    '</div>' +
    '<div class="fv-details">' +
      '<div class="fv-row"><span class="fv-dot" style="background:#4150f5"></span><span>הוצאות קבועות</span><strong>' + formatCurrency(fixed) + '</strong></div>' +
      '<div class="fv-hint">דיור, ביטוחים, מנויים, סלולר, אינטרנט</div>' +
      '<div class="fv-row"><span class="fv-dot" style="background:#f59e0b"></span><span>הוצאות משתנות</span><strong>' + formatCurrency(variable) + '</strong></div>' +
      '<div class="fv-hint">מזון, בילויים, ביגוד, תחבורה ועוד</div>' +
    '</div>' +
  '</div>';
}

// ===== SETTINGS =====
function renderRecurringList() {
  const container = document.getElementById('recurringList');
  if (!container) return;
  container.innerHTML = '';
  const recurring = appData.recurring || [];
  if (recurring.length === 0) {
    container.innerHTML = '<p class="empty-recurring">אין חשבונות קבועים. לחץ "הוסף" להגדרת חשבון חוזר חודשי.</p>';
    return;
  }
  const total = recurring.reduce((s, r) => s + r.amount, 0);
  const summary = document.createElement('p');
  summary.className = 'recurring-summary';
  summary.textContent = 'סה״כ חודשי: ' + formatCurrency(total);
  container.appendChild(summary);
  recurring.forEach(r => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === r.category);
    const item = document.createElement('div');
    item.className = 'recurring-item';
    const info = document.createElement('div');
    info.className = 'recurring-item-info';
    info.innerHTML = '<span class="recurring-item-name">' + (cat ? cat.icon + ' ' : '') + escapeHtml(r.name) + '</span>' +
      '<span class="recurring-item-meta">' + formatCurrency(r.amount) + ' · יום ' + (r.dayOfMonth | 0) + '</span>';
    const actions = document.createElement('div');
    actions.className = 'recurring-item-actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.textContent = '✏️';
    editBtn.title = 'ערוך';
    editBtn.addEventListener('click', () => openRecurringModal(r));
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon btn-icon--danger';
    delBtn.textContent = '🗑️';
    delBtn.title = 'מחק';
    delBtn.addEventListener('click', () => {
      if (confirm('למחוק את "' + r.name + '"?')) {
        appData.recurring = appData.recurring.filter(x => x.id !== r.id);
        saveData();
        renderRecurringList();
        showToast('חשבון קבוע נמחק');
      }
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    item.appendChild(info);
    item.appendChild(actions);
    container.appendChild(item);
  });
}

function renderSettings() {
  document.getElementById('settingsFamilyName').value = appData.family.name;
  document.getElementById('settingsSavingsGoal').value = appData.settings.monthlySavingsGoal;
  renderRecurringList();

  const container = document.getElementById('budgetSettings');
  container.innerHTML = '';
  const template = appData.settings.budgetTemplate;
  EXPENSE_CATEGORIES.forEach(cat => {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.style.display = 'flex';
    group.style.alignItems = 'center';
    group.style.gap = '12px';
    const label = document.createElement('label');
    label.className = 'form-label';
    label.style.minWidth = '100px';
    label.style.marginBottom = '0';
    label.textContent = cat.icon + ' ' + cat.name;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'form-input';
    input.value = template[cat.id] || 0;
    input.min = 0;
    input.max = 10000000;
    input.dataset.catId = cat.id;
    input.id = 'budget_' + cat.id;
    group.appendChild(label);
    group.appendChild(input);
    container.appendChild(group);
  });
}

function setupSettings() {
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    const name = sanitizeText(document.getElementById('settingsFamilyName').value);
    if (!name) { showToast('נא להזין שם משפחה'); return; }
    const goal = parseFloat(document.getElementById('settingsSavingsGoal').value) || 0;
    appData.family.name = name;
    appData.settings.monthlySavingsGoal = goal;
    document.getElementById('navTitle').textContent = 'תקציב משפחת ' + name;
    saveData();
    showToast('ההגדרות נשמרו ✓');
  });

  document.getElementById('saveBudgetBtn').addEventListener('click', () => {
    EXPENSE_CATEGORIES.forEach(cat => {
      const input = document.getElementById('budget_' + cat.id);
      if (input) {
        const val = parseFloat(input.value) || 0;
        appData.settings.budgetTemplate[cat.id] = val;
      }
    });
    saveData();
    renderDashboard();
    showToast('התקציב נשמר ✓');
  });

  // Export
  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-budget-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('הנתונים יוצאו בהצלחה');
  });

  // Import
  document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data || !data.family || !data.months || !data.settings || !data.settings.budgetTemplate) {
          showToast('קובץ לא תקין'); return;
        }
        // Sanitize imported data
        data.family.name = sanitizeText(data.family.name || '');
        if (!data.family.name) { showToast('שם משפחה חסר בקובץ'); return; }
        // Validate month entries
        for (const [, monthData] of Object.entries(data.months)) {
          if (!Array.isArray(monthData.income)) monthData.income = [];
          if (!Array.isArray(monthData.expenses)) monthData.expenses = [];
          monthData.income = monthData.income.filter(e => e && isValidAmount(e.amount));
          monthData.expenses = monthData.expenses.filter(e => e && isValidAmount(e.amount));
          monthData.income.forEach(e => { e.description = sanitizeText(e.description || ''); });
          monthData.expenses.forEach(e => { e.description = sanitizeText(e.description || ''); });
        }
        appData = data;
        saveData();
        renderDashboard();
        document.getElementById('navTitle').textContent = 'תקציב משפחת ' + appData.family.name;
        showToast('הנתונים יובאו בהצלחה');
        switchView('dashboardView');
      } catch (err) {
        showToast('שגיאה בקריאת הקובץ');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Clear
  document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה הפיכה.')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    location.reload();
  });
}

// ===== RECURRING EXPENSES =====
let editingRecurringId = null;

function openRecurringModal(existing) {
  editingRecurringId = existing ? existing.id : null;
  document.getElementById('recurringModalTitle').textContent = existing ? 'עריכת חשבון קבוע' : 'הוספת חשבון קבוע';
  document.getElementById('recName').value = existing ? existing.name : '';
  document.getElementById('recAmount').value = existing ? existing.amount : '';
  document.getElementById('recDay').value = existing ? existing.dayOfMonth : 1;

  // Populate category select
  const sel = document.getElementById('recCategory');
  sel.innerHTML = '';
  EXPENSE_CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.icon + ' ' + c.name;
    if (existing && existing.category === c.id) opt.selected = true;
    sel.appendChild(opt);
  });

  document.getElementById('recurringModalOverlay').style.display = 'flex';
  document.getElementById('recName').focus();
}

function closeRecurringModal() {
  document.getElementById('recurringModalOverlay').style.display = 'none';
  editingRecurringId = null;
}

function setupRecurring() {
  document.getElementById('addRecurringBtn').addEventListener('click', () => openRecurringModal(null));
  document.getElementById('recCancelBtn').addEventListener('click', closeRecurringModal);
  document.getElementById('recurringModalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('recurringModalOverlay')) closeRecurringModal();
  });

  document.getElementById('recSaveBtn').addEventListener('click', () => {
    const name = sanitizeText(document.getElementById('recName').value);
    const amount = parseFloat(document.getElementById('recAmount').value);
    const category = document.getElementById('recCategory').value;
    const day = parseInt(document.getElementById('recDay').value) || 1;

    if (!name) { showToast('נא להזין שם לחשבון'); return; }
    if (!amount || amount <= 0) { showToast('נא להזין סכום תקין'); return; }
    if (!category) { showToast('נא לבחור קטגוריה'); return; }

    if (!appData.recurring) appData.recurring = [];

    if (editingRecurringId) {
      const idx = appData.recurring.findIndex(r => r.id === editingRecurringId);
      if (idx >= 0) {
        appData.recurring[idx] = { ...appData.recurring[idx], name, amount, category, dayOfMonth: Math.min(Math.max(day, 1), 28) };
      }
      showToast('חשבון קבוע עודכן ✓');
    } else {
      appData.recurring.push({ id: 'rec_' + generateId(), name, amount, category, subcategory: '', dayOfMonth: Math.min(Math.max(day, 1), 28) });
      showToast('חשבון קבוע נוסף ✓');
    }

    saveData();
    closeRecurringModal();
    renderRecurringList();
    renderDashboard();
  });
}

// ===== DARK MODE =====
function setupDarkMode() {
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('darkMode', 'false');
      document.getElementById('darkModeToggle').textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
      document.getElementById('darkModeToggle').textContent = '☀️';
    }
    // Re-render charts with updated colors
    setTimeout(renderDashboard, 50);
  });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // FAB & Mobile add
  document.getElementById('fabBtn').addEventListener('click', () => openPanel('addPanel'));
  document.getElementById('mobileAddBtn').addEventListener('click', () => openPanel('addPanel'));

  // Close panels
  document.getElementById('modalOverlay').addEventListener('click', closeAllPanels);
  document.getElementById('panelClose').addEventListener('click', () => closePanel('addPanel'));
  document.getElementById('editPanelClose').addEventListener('click', () => closePanel('editPanel'));

  // Bottom nav
  document.querySelectorAll('.bottom-nav__item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Desktop nav
  document.getElementById('dashboardBtn').addEventListener('click', () => switchView('dashboardView'));
  document.getElementById('reportsBtn').addEventListener('click', () => switchView('reportsView'));
  document.getElementById('insightsBtn').addEventListener('click', () => switchView('insightsView'));
  document.getElementById('settingsBtn').addEventListener('click', () => switchView('settingsView'));

  // Help modal
  document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('helpOverlay').style.display = 'flex';
  });
  document.getElementById('helpClose').addEventListener('click', () => {
    document.getElementById('helpOverlay').style.display = 'none';
  });
  document.getElementById('helpOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('helpOverlay')) {
      document.getElementById('helpOverlay').style.display = 'none';
    }
  });
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Window resize - redraw charts
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (appData) renderDashboard();
    }, 300);
  });
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
  });
}

// ===== PWA INSTALL PROMPT =====
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install banner
  showInstallBanner();
});

function showInstallBanner() {
  const banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.id = 'installBanner';

  const text = document.createElement('span');
  text.textContent = '📲 התקן את האפליקציה על המכשיר';

  const installBtn = document.createElement('button');
  installBtn.textContent = 'התקן';
  installBtn.className = 'install-btn';
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        showToast('האפליקציה מותקנת! 🎉');
      }
      deferredPrompt = null;
    }
    banner.remove();
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.className = 'install-close';
  closeBtn.addEventListener('click', () => banner.remove());

  banner.appendChild(text);
  banner.appendChild(installBtn);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  try {
    setupAuth();
    setupWelcome();
    setupMonthNav();
    setupEntryForm();
    setupEditForm();
    setupSettings();
    setupRecurring();
    setupDarkMode();
    setupEventListeners();
    setupQuickAdd();
    initApp();
  } catch (e) {
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'padding:20px;direction:rtl;font-family:sans-serif;';
    const h2 = document.createElement('h2');
    h2.textContent = 'שגיאה באתחול';
    const pre = document.createElement('pre');
    pre.style.cssText = 'background:#fee;padding:12px;border-radius:8px;overflow:auto;';
    pre.textContent = (e.message || '') + (e.stack ? '\n' + e.stack : '');
    errDiv.appendChild(h2);
    errDiv.appendChild(pre);
    document.body.innerHTML = '';
    document.body.appendChild(errDiv);
  }
});
