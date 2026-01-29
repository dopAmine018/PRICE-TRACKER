
import { Category, Currency, TranslationStrings, ItemData } from './types';

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', rate: 1.0, symbol: '$', pos: 'prefix', prec: 4, label: 'US Dollar' },
  SAR: { code: 'SAR', rate: 3.75, symbol: 'ر.س', pos: 'suffix', prec: 4, label: 'Saudi Riyal' },
  EUR: { code: 'EUR', rate: 0.92, symbol: '€', pos: 'prefix', prec: 4, label: 'Euro' },
  AED: { code: 'AED', rate: 3.67, symbol: 'د.إ', pos: 'suffix', prec: 4, label: 'UAE Dirham' },
  TRY: { code: 'TRY', rate: 34.0, symbol: '₺', pos: 'prefix', prec: 4, label: 'Turkish Lira' },
  EGP: { code: 'EGP', rate: 48.4, symbol: 'ج.م', pos: 'suffix', prec: 4, label: 'Egyptian Pound' },
  KWD: { code: 'KWD', rate: 0.31, symbol: 'د.ك', pos: 'suffix', prec: 4, label: 'Kuwaiti Dinar' },
  GBP: { code: 'GBP', rate: 0.79, symbol: '£', pos: 'prefix', prec: 4, label: 'British Pound' },
  BHD: { code: 'BHD', rate: 0.37, symbol: 'ب.د', pos: 'suffix', prec: 4, label: 'Bahraini Dinar' },
  QAR: { code: 'QAR', rate: 3.64, symbol: 'ر.ق', pos: 'suffix', prec: 4, label: 'Qatari Rial' }
};

export const I18N: Record<'en' | 'ar', TranslationStrings> = {
  en: {
    ui: {
      title: "Store Price Comparison",
      search: "Search for an item...",
      cheapest: "Cheapest",
      back: "Back",
      viewPrices: "Tap for prices",
      selectedCount: "items selected",
      viewSelected: "Compare",
      clearAll: "Clear",
      selectedItems: "Selected Items",
      maxItems: "Max 3 items",
      minItems: "Select 1 item",
      theme: "Theme",
      dark: "Dark",
      light: "Light",
      noResults: "No items found",
      close: "Close"
    },
    categories: {
      [Category.ALL]: "All",
      [Category.SPEED]: "Speedups",
      [Category.RES]: "Resources",
      [Category.HERO]: "Hero",
      [Category.GEAR]: "Gear",
      [Category.DECOR]: "Decor"
    },
    markets: {
      "Black Market (Top Row - Regular)": "Black Market (Top Row - Regular)",
      "Black Market (Top Row - 5$ Bundle)": "Black Market (Top Row - 5$ Bundle)",
      "Black Market (Bottom Row - Regular)": "Black Market (Bottom Row - Regular)",
      "Black Market (Bottom Row - 5$ Bundle)": "Black Market (Bottom Row - 5$ Bundle)",
      "Bounty Hunter (Wandering Merchant)": "Bounty Hunter (Wandering Merchant)",
      "Glittering Market (Regular)": "Glittering Market (Regular)",
      "Glittering Market (5$ Bundle)": "Glittering Market (5$ Bundle)",
      "Summon Supplies (Regular)": "Summon Supplies (Regular)",
      "Summon Supplies (5$ Bundle)": "Summon Supplies (5$ Bundle)",
      "Total Mobilization (Regular)": "Total Mobilization (Regular)",
      "Total Mobilization (Milestone #1)": "Total Mobilization (Milestone #1)",
      "Total Mobilization (Milestone #2)": "Total Mobilization (Milestone #2)",
      "Total Mobilization (Milestone #3)": "Total Mobilization (Milestone #3)",
      "Total Mobilization (Milestone #4)": "Total Mobilization (Milestone #4)",
      "Total Mobilization (Milestone #5)": "Total Mobilization (Milestone #5)",
      "Glittering Market - Luxury Choice Chest": "Glittering Market - Luxury Choice Chest",
      "Glittering Market - Luxury Choice Chest (5$ Bundle)": "Glittering Market - Luxury Choice Chest (5$ Bundle)",
      "Bullseye Loot (Regular)": "Bullseye Loot (Regular)",
      "Bullseye Loot (5$ Bundle)": "Bullseye Loot (5$ Bundle)",
      "Decorate Your Dreams (Regular)": "Decorate Your Dreams (Regular)",
      "Decorate Your Dreams (5$ Bundle)": "Decorate Your Dreams (5$ Bundle)",
      "Decorate Your Dreams (10$ Bundle)": "Decorate Your Dreams (10$ Bundle)",
      "Premium Subscription (5$)": "Premium Subscription (5$)",
      "Elite Subscription (10$)": "Elite Subscription (10$)",
      "Custom Weekly Pass": "Custom Weekly Pass"
    },
    items: {
      "5m Speed-up": "5m Speed-up",
      "1h Speed-Up": "1h Speed-Up",
      "Battle Data 10K": "Battle Data 10K",
      "Decoration (UR)": "Decoration (UR)",
      "Decoration Chest (UR)": "Decoration Chest (UR)",
      "Bond Badge": "Bond Badge",
      "Dielectric Ceramic": "Dielectric Ceramic",
      "Drone Parts": "Drone Parts",
      "Dual Propeller Base": "Dual Propeller Base",
      "Enchanted Fungus": "Enchanted Fungus",
      "Gear Blueprint (MR)": "Gear Blueprint (MR)",
      "Gear Blueprint (UR)": "Gear Blueprint (UR)",
      "Gorilla Overlord Shard": "Gorilla Overlord Shard",
      "Hero Choice Chest": "Hero Choice Chest",
      "Hero Exclusive Weapon Shard Choice Chest": "Hero Exclusive Weapon Shard Choice Chest",
      "Hero EXP Chest (SR)": "Hero EXP Chest (SR)",
      "Hero EXP Chest (UR)": "Hero EXP Chest (UR)",
      "Hero Universal Shard (UR)": "Hero Universal Shard (UR)",
      "Level-tied Iron Chest (UR)": "Level-tied Iron Chest (UR)",
      "Level-tied Food Chest (UR)": "Level-tied Food Chest (UR)",
      "Level-tied Coin Chest (UR)": "Level-tied Coin Chest (UR)",
      "Luxury Choice Chest": "Luxury Choice Chest",
      "Lv. 5 Drone Component Chest": "Lv. 5 Drone Component Chest",
      "Lv. 5 Drone Component Choice Chest": "Lv. 5 Drone Component Choice Chest",
      "Overlord Skill Badge": "Overlord Skill Badge",
      "Premium Chip Material": "Premium Chip Material",
      "Resource Choice Chest (SR)": "Resource Choice Chest (SR)",
      "Resource Choice Chest (UR)": "Resource Choice Chest (UR)",
      "Skill Chip Chest (SR)": "Skill Chip Chest (SR)",
      "Skill Chip Chest (UR)": "Skill Chip Chest (UR)",
      "Skill Chip Choice Chest (UR)": "Skill Chip Choice Chest (UR)",
      "Skill Medal": "Skill Medal",
      "Skill Medal Lucky Chest": "Skill Medal Lucky Chest",
      "Silver Assault Trooper": "Silver Assault Trooper",
      "Survivor Recruitment Ticket": "Survivor Recruitment Ticket",
      "Tower of Victory": "Tower of Victory",
      "Training Certificate": "Training Certificate",
      "Training Guidebook": "Training Guidebook",
      "Training Tire": "Training Tire",
      "Universal Decor Component": "Universal Decor Component",
      "Upgrade Ore": "Upgrade Ore",
      "Upgrade Ore Lucky Chest": "Upgrade Ore Lucky Chest",
      "Valor Badge": "Valor Badge"
    }
  },
  ar: {
    ui: {
      title: "مقارنة أسعار المتجر",
      search: "ابحث عن عنصر...",
      cheapest: "الأرخص",
      back: "رجوع",
      viewPrices: "اضغط لعرض الأسعار",
      selectedCount: "عناصر محددة",
      viewSelected: "مقارنة",
      clearAll: "مسح",
      selectedItems: "العناصر المختارة",
      maxItems: "الحد 3 عناصر",
      minItems: "اختر عنصرًا واحدًا",
      theme: "المظهر",
      dark: "داكن",
      light: "فاتح",
      noResults: "لم يتم العثور على نتائج",
      close: "إغلاق"
    },
    categories: {
      [Category.ALL]: "الكل",
      [Category.SPEED]: "تسريعات",
      [Category.RES]: "موارد",
      [Category.HERO]: "أبطال",
      [Category.GEAR]: "عتاد",
      [Category.DECOR]: "زينة"
    },
    markets: {
      "Black Market (Top Row - Regular)": "السوق السوداء (صف علوي - عادي)",
      "Black Market (Top Row - 5$ Bundle)": "السوق السوداء (صف علوي - حزمة 5$)",
      "Black Market (Bottom Row - Regular)": "السوق السوداء (صف سفلي - عادي)",
      "Black Market (Bottom Row - 5$ Bundle)": "السوق السوداء (صف سفلي - حزمة 5$)",
      "Bounty Hunter (Wandering Merchant)": "صائد المكافآت",
      "Glittering Market (Regular)": "السوق الساطعة (عادي)",
      "Glittering Market (5$ Bundle)": "السوق الساطعة (حزمة 5$)",
      "Summon Supplies (Regular)": "استدعاء الإمدادات (عادي)",
      "Summon Supplies (5$ Bundle)": "استدعاء الإمدادات (حزمة 5$)",
      "Total Mobilization (Regular)": "الاستعداد الشامل (عادي)",
      "Total Mobilization (Milestone #1)": "الاستعداد الشامل (الحزمة 1)",
      "Total Mobilization (Milestone #2)": "الاستعداد الشامل (الحزمة 2)",
      "Total Mobilization (Milestone #3)": "الاستعداد الشامل (الحزمة 3)",
      "Total Mobilization (Milestone #4)": "الاستعداد الشامل (الحزمة 4)",
      "Total Mobilization (Milestone #5)": "الاستعداد الشامل (الحزمة 5)",
      "Glittering Market - Luxury Choice Chest": "السوق الساطعة - صندوق اختياري فاخر",
      "Glittering Market - Luxury Choice Chest (5$ Bundle)": "السوق الساطعة - صندوق اختياري فاخر (5$)",
      "Bullseye Loot (Regular)": "غنيمة التصويب (عادي)",
      "Bullseye Loot (5$ Bundle)": "غنيمة التصويب (حزمة 5$)",
      "Decorate Your Dreams (Regular)": "زيّن أحلامك (عادي)",
      "Decorate Your Dreams (5$ Bundle)": "زيّن أحلامك (حزمة 5$)",
      "Decorate Your Dreams (10$ Bundle)": "زيّن أحلامك (حزمة 10$)",
      "Premium Subscription (5$)": "الاشتراك المميز (5$)",
      "Elite Subscription (10$)": "الاشتراك النخبوي (10$)",
      "Custom Weekly Pass": "البطاقة الأسبوعية المخصصة"
    },
    items: {
      "5m Speed-up": "5 دقائق تسريعات",
      "1h Speed-Up": "ساعة واحدة تسريعات",
      "Battle Data 10K": "بيانات الطائرة 10k",
      "Decoration (UR)": "الزينة (UR)",
      "Decoration Chest (UR)": "صندوق الزينة (UR)",
      "Bond Badge": "شارة الرابطة",
      "Dielectric Ceramic": "السراميك العازل",
      "Drone Parts": "أجزاء الطائرة المسيرة",
      "Dual Propeller Base": "القلعة الحزلونية",
      "Enchanted Fungus": "الفطر الغامض",
      "Gear Blueprint (MR)": "مخطوطة المعدات (MR)",
      "Gear Blueprint (UR)": "مخطوطة المعدات (UR)",
      "Gorilla Overlord Shard": "شظية العملاق العامة",
      "Hero Choice Chest": "صندوق بطل اختياري",
      "Hero Exclusive Weapon Shard Choice Chest": "صندوق اختياري للسلاح الحصري",
      "Hero EXP Chest (SR)": "صندوق خبرة بطل (SR)",
      "Hero EXP Chest (UR)": "صندوق خبرة بطل (UR)",
      "Hero Universal Shard (UR)": "الشظايا العامة لبطل (UR)",
      "Level-tied Iron Chest (UR)": "صندوق تطوير الفولاذ (UR)",
      "Level-tied Food Chest (UR)": "صندوق تطوير الغذاء (UR)",
      "Level-tied Coin Chest (UR)": "صندوق تطوير العملات (UR)",
      "Luxury Choice Chest": "صندوق اختياري فاخر",
      "Lv. 5 Drone Component Chest": "صندوق مكوّنات الدرون مستوى 5",
      "Lv. 5 Drone Component Choice Chest": "صندوق اختيار مكوّنات الدرون مستوى 5",
      "Overlord Skill Badge": "شارة مهارة العملاق",
      "Premium Chip Material": "مواد الرقاقة المتقدمة",
      "Resource Choice Chest (SR)": "صندوق الموارد اختياري (SR)",
      "Resource Choice Chest (UR)": "صندوق الموارد اختياري (UR)",
      "Skill Chip Chest (SR)": "صندوق رقاقة المهارة (SR)",
      "Skill Chip Chest (UR)": "صندوق رقاقة المهارة (UR)",
      "Skill Chip Choice Chest (UR)": "صندوق رقاقة المهارة اختياري (UR)",
      "Skill Medal": "ميدالية المهارة",
      "Skill Medal Lucky Chest": "صندوق الحظ لميدالية المهارة",
      "Silver Assault Trooper": "المحارب الفضي",
      "Survivor Recruitment Ticket": "بطاقة تجنيد النجاة",
      "Tower of Victory": "برج النصر",
      "Training Certificate": "شهادة تدريب",
      "Training Guidebook": "دليل التدريب",
      "Training Tire": "إطار التدريب",
      "Universal Decor Component": "مكونات الزينة العامة",
      "Upgrade Ore": "حجر تعزيز",
      "Upgrade Ore Lucky Chest": "صندوق الحظ لحجر التعزيز",
      "Valor Badge": "ميدالية الشرف"
    }
  }
};

export async function fetchLiveRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    return data.rates;
  } catch (e) {
    console.error("Failed to fetch live rates", e);
    return {};
  }
}

export function slugify(name: any, keepParens = false): string {
  if (name === null || name === undefined) return 'default';
  let s = String(name).toLowerCase();
  if (!keepParens) {
    s = s.replace(/\s*\([^)]*\)/g, '');
  }
  return s
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getItemImageSrc(itemName: string): string {
  if (!itemName) return 'images/default.png';
  return `images/${itemName}.png`;
}

export const DEFAULT_IMAGE = 'images/default.png';

export function getItemCategory(itemName: any): Category {
  if (!itemName) return Category.ALL;
  const k = String(itemName).toLowerCase();
  if (k.includes("speed-up")) return Category.SPEED;
  if (k.includes("iron") || k.includes("food") || k.includes("coin") || k.includes("resource") || k.includes("battle data")) return Category.RES;
  if (k.includes("hero") || k.includes("shard") || k.includes("medal") || k.includes("skill") || k.includes("exp") || k.includes("recruit") || k.includes("chip") || k.includes("weapon")) return Category.HERO;
  if (k.includes("drone") || k.includes("gear") || k.includes("blueprint") || k.includes("ore") || k.includes("ceramic") || k.includes("upgrade") || k.includes("valor") || k.includes("guidebook") || k.includes("certificate") || k.includes("trooper")) return Category.GEAR;
  if (k.includes("decor") || k.includes("tower") || k.includes("badge") || k.includes("fungus") || k.includes("propeller")) return Category.DECOR;
  return Category.ALL;
}

export function parseAllRows(rows: any[]): ItemData[] {
  if (!Array.isArray(rows)) return [];
  const grouped: Record<string, ItemData> = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length < 3) continue;
    const name = String(row[0] || '').trim();
    if (!name || name === 'undefined') continue;
    const market = String(row[1] || '').trim();
    const price = typeof row[2] === 'number' ? row[2] : parseFloat(String(row[2]));
    if (isNaN(price)) continue;
    if (!grouped[name]) {
      grouped[name] = {
        id: slugify(name, true),
        name: name,
        category: getItemCategory(name),
        prices: []
      };
    }
    grouped[name].prices.push({ market, price });
  }
  return Object.values(grouped);
}

export const INITIAL_ITEMS: ItemData[] = parseAllRows((window as any).ALL_ROWS || []);
