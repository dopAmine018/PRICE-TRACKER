
import { Category, Currency, TranslationStrings, ItemData } from './types';

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', rate: 1.0, symbol: '$', pos: 'prefix', prec: 4, label: 'US Dollar' },
  SAR: { code: 'SAR', rate: 3.75, symbol: 'ر.س', pos: 'suffix', prec: 2, label: 'Saudi Riyal' },
  EUR: { code: 'EUR', rate: 0.92, symbol: '€', pos: 'prefix', prec: 2, label: 'Euro' },
  AED: { code: 'AED', rate: 3.67, symbol: 'د.إ', pos: 'suffix', prec: 2, label: 'UAE Dirham' },
  TRY: { code: 'TRY', rate: 34.0, symbol: '₺', pos: 'prefix', prec: 2, label: 'Turkish Lira' },
  EGP: { code: 'EGP', rate: 48.4, symbol: 'ج.م', pos: 'suffix', prec: 2, label: 'Egyptian Pound' },
  KWD: { code: 'KWD', rate: 0.31, symbol: 'د.ك', pos: 'suffix', prec: 3, label: 'Kuwaiti Dinar' },
  GBP: { code: 'GBP', rate: 0.79, symbol: '£', pos: 'prefix', prec: 2, label: 'British Pound' },
  BHD: { code: 'BHD', rate: 0.37, symbol: 'ب.د', pos: 'suffix', prec: 3, label: 'Bahraini Dinar' },
  QAR: { code: 'QAR', rate: 3.64, symbol: 'ر.ق', pos: 'suffix', prec: 2, label: 'Qatari Rial' }
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
    }
  },
  ar: {
    ui: {
      title: "مقارنة أسعار المتجر",
      search: "ابحث عن عنصر...",
      cheapest: "الأرخص",
      back: "رجوع",
      viewPrices: "اضغط للأسعار",
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
  // Use literal item name as requested
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
