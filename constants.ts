
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

/**
 * Converts item names to a clean URL-safe slug.
 * 1. Lowercase
 * 2. Remove parentheses text like (UR)
 * 3. Trim
 * 4. Replace spaces/symbols with -
 * 5. Collapse multiple hyphens
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // remove content in parentheses like (UR), (SR)
    .trim()
    .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')          // collapse multiple hyphens
    .replace(/^-|-$/g, '');       // trim hyphens from start/end
}

export function getItemImageSrc(itemName: string): string {
  return `images/items/${slugify(itemName)}.png`;
}

export const DEFAULT_IMAGE = 'images/items/default.png';

export function getItemCategory(itemName: string): Category {
  if (!itemName) return Category.ALL;
  const k = itemName.toLowerCase();
  
  if (k.includes("speed-up")) return Category.SPEED;
  if (k.includes("iron") || k.includes("food") || k.includes("coin") || k.includes("resource") || k.includes("battle data")) return Category.RES;
  if (k.includes("hero") || k.includes("shard") || k.includes("medal") || k.includes("skill") || k.includes("exp") || k.includes("recruit") || k.includes("chip") || k.includes("weapon")) return Category.HERO;
  if (k.includes("drone") || k.includes("gear") || k.includes("blueprint") || k.includes("ore") || k.includes("ceramic") || k.includes("upgrade") || k.includes("valor") || k.includes("guidebook") || k.includes("certificate") || k.includes("trooper")) return Category.GEAR;
  if (k.includes("decor") || k.includes("tower") || k.includes("badge") || k.includes("fungus") || k.includes("propeller")) return Category.DECOR;
  
  return Category.ALL;
}

// RAW_ROWS derived from your provided data scripts
const RAW_ROWS: [string, string, number][] = [
  ["5m Speed-up","Black Market (Top Row - Regular)",0.0083],
  ["5m Speed-up","Black Market (Top Row - 5$ Bundle)",0.0052],
  ["5m Speed-up","Summon Supplies (Regular)",0.0200],
  ["5m Speed-up","Summon Supplies (5$ Bundle)",0.0125],
  ["1h Speed-Up","Black Market (Bottom Row - Regular)",0.2667],
  ["1h Speed-Up","Black Market (Bottom Row - 5$ Bundle)",0.1667],
  ["1h Speed-Up","Bounty Hunter (Wandering Merchant)",0.1667],
  ["1h Speed-Up","Glittering Market (Regular)",0.2000],
  ["1h Speed-Up","Glittering Market (5$ Bundle)",0.1250],
  ["Battle Data 10K","Bounty Hunter (Wandering Merchant)",0.1667],
  ["Battle Data 10K","Summon Supplies (Regular)",0.3125],
  ["Battle Data 10K","Summon Supplies (5$ Bundle)",0.1953],
  ["Decoration (UR)","Black Market (Top Row - Regular)",8.0000],
  ["Decoration (UR)","Black Market (Top Row - 5$ Bundle)",5.0000],
  ["Decoration Chest (UR)","Black Market (Top Row - Regular)",6.0000],
  ["Decoration Chest (UR)","Black Market (Top Row - 5$ Bundle)",3.7500],
  ["Decoration Chest (UR)","Black Market (Bottom Row - Regular)",10.0000],
  ["Decoration Chest (UR)","Black Market (Bottom Row - 5$ Bundle)",6.2500],
  ["Decoration Chest (UR)","Bounty Hunter (Wandering Merchant)",8.3333],
  ["Decoration Chest (UR)","Summon Supplies (Regular)",10.0000],
  ["Decoration Chest (UR)","Summon Supplies (5$ Bundle)",6.2500],
  ["Bond Badge","Black Market (Top Row - Regular)",5.0000],
  ["Bond Badge","Black Market (Top Row - 5$ Bundle)",3.1250],
  ["Bond Badge","Bounty Hunter (Wandering Merchant)",3.7500],
  ["Dielectric Ceramic","Black Market (Top Row - Regular)",0.0333],
  ["Dielectric Ceramic","Black Market (Top Row - 5$ Bundle)",0.0208],
  ["Dielectric Ceramic","Black Market (Bottom Row - Regular)",0.0667],
  ["Dielectric Ceramic","Black Market (Bottom Row - 5$ Bundle)",0.0417],
  ["Dielectric Ceramic","Glittering Market (Regular)",0.0400],
  ["Dielectric Ceramic","Glittering Market (5$ Bundle)",0.0250],
  ["Drone Parts","Black Market (Top Row - Regular)",0.2000],
  ["Drone Parts","Black Market (Top Row - 5$ Bundle)",0.1250],
  ["Drone Parts","Black Market (Bottom Row - Regular)",0.3333],
  ["Drone Parts","Black Market (Bottom Row - 5$ Bundle)",0.2083],
  ["Drone Parts","Bounty Hunter (Wandering Merchant)",0.1833],
  ["Drone Parts","Summon Supplies (Regular)",0.2000],
  ["Drone Parts","Summon Supplies (5$ Bundle)",0.1250],
  ["Dual Propeller Base","Glittering Market (Regular)",400.0000],
  ["Dual Propeller Base","Glittering Market (5$ Bundle)",250.0000],
  ["Enchanted Fungus","Glittering Market (Regular)",150.0000],
  ["Enchanted Fungus","Glittering Market (5$ Bundle)",93.7500],
  ["Gear Blueprint (MR)","Glittering Market (Regular)",30.0000],
  ["Gear Blueprint (MR)","Glittering Market (5$ Bundle)",18.7500],
  ["Gear Blueprint (UR)","Black Market (Top Row - Regular)",6.0000],
  ["Gear Blueprint (UR)","Black Market (Top Row - 5$ Bundle)",3.7500],
  ["Gear Blueprint (UR)","Black Market (Bottom Row - Regular)",8.0000],
  ["Gear Blueprint (UR)","Black Market (Bottom Row - 5$ Bundle)",5.0000],
  ["Gear Blueprint (UR)","Glittering Market (Regular)",6.0000],
  ["Gear Blueprint (UR)","Glittering Market (5$ Bundle)",3.7500],
  ["Gear Blueprint (UR)","Total Mobilization (Regular)",6.0000],
  ["Gear Blueprint (UR)","Total Mobilization (Milestone #1)",3.0000],
  ["Gear Blueprint (UR)","Total Mobilization (Milestone #2)",3.4286],
  ["Gorilla Overlord Shard","Black Market (Bottom Row - Regular)",0.8000],
  ["Gorilla Overlord Shard","Black Market (Bottom Row - 5$ Bundle)",0.5000],
  ["Gorilla Overlord Shard","Total Mobilization (Regular)",1.0000],
  ["Gorilla Overlord Shard","Total Mobilization (Milestone #1)",0.5000],
  ["Gorilla Overlord Shard","Total Mobilization (Milestone #2)",0.5714],
  ["Hero Choice Chest","Glittering Market (Regular)",0.6000],
  ["Hero Choice Chest","Glittering Market (5$ Bundle)",0.3750],
  ["Hero Choice Chest","Total Mobilization (Regular)",1.0000],
  ["Hero Choice Chest","Total Mobilization (Milestone #1)",0.5000],
  ["Hero Choice Chest","Total Mobilization (Milestone #2)",0.5714],
  ["Hero Exclusive Weapon Shard Choice Chest","Black Market (Top Row - Regular)",0.6000],
  ["Hero Exclusive Weapon Shard Choice Chest","Black Market (Top Row - 5$ Bundle)",0.3750],
  ["Hero Exclusive Weapon Shard Choice Chest","Black Market (Bottom Row - Regular)",1.0000],
  ["Hero Exclusive Weapon Shard Choice Chest","Black Market (Bottom Row - 5$ Bundle)",0.6250],
  ["Hero Exclusive Weapon Shard Choice Chest","Total Mobilization (Regular)",1.0000],
  ["Hero Exclusive Weapon Shard Choice Chest","Total Mobilization (Milestone #1)",0.5000],
  ["Hero Exclusive Weapon Shard Choice Chest","Total Mobilization (Milestone #2)",0.5714],
  ["Hero EXP Chest (SR)","Summon Supplies (Regular)",0.2500],
  ["Hero EXP Chest (SR)","Summon Supplies (5$ Bundle)",0.1563],
  ["Hero EXP Chest (UR)","Total Mobilization (Regular)",1.5000],
  ["Hero EXP Chest (UR)","Total Mobilization (Milestone #1)",0.7500],
  ["Hero EXP Chest (UR)","Total Mobilization (Milestone #2)",0.8571],
  ["Hero Universal Shard (UR)","Black Market (Top Row - Regular)",0.6000],
  ["Hero Universal Shard (UR)","Black Market (Top Row - 5$ Bundle)",0.3750],
  ["Hero Universal Shard (UR)","Bounty Hunter (Wandering Merchant)",0.6667],
  ["Hero Universal Shard (UR)","Glittering Market (Regular)",1.0000],
  ["Hero Universal Shard (UR)","Glittering Market (5$ Bundle)",0.6250],
  ["Hero Universal Shard (UR)","Total Mobilization (Regular)",0.5000],
  ["Hero Universal Shard (UR)","Total Mobilization (Milestone #1)",0.2500],
  ["Hero Universal Shard (UR)","Total Mobilization (Milestone #2)",0.2857],
  ["Hero Universal Shard (UR)","Summon Supplies (Regular)",0.8333],
  ["Hero Universal Shard (UR)","Summon Supplies (5$ Bundle)",0.5208],
  ["Level-tied Iron Chest (UR)","Black Market (Top Row - Regular)",0.2400],
  ["Level-tied Iron Chest (UR)","Black Market (Top Row - 5$ Bundle)",0.1500],
  ["Level-tied Food Chest (UR)","Black Market (Top Row - Regular)",0.2400],
  ["Level-tied Food Chest (UR)","Black Market (Top Row - 5$ Bundle)",0.1500],
  ["Level-tied Coin Chest (UR)","Black Market (Top Row - Regular)",0.3000],
  ["Level-tied Coin Chest (UR)","Black Market (Top Row - 5$ Bundle)",0.1875],
  ["Luxury Choice Chest","Glittering Market (Regular)",10.0000],
  ["Luxury Choice Chest","Glittering Market (5$ Bundle)",6.2500],
  ["Lv. 5 Drone Component Chest","Total Mobilization (Regular)",15.0000],
  ["Lv. 5 Drone Component Chest","Total Mobilization (Milestone #1)",7.5000],
  ["Lv. 5 Drone Component Chest","Total Mobilization (Milestone #2)",8.5714],
  ["Lv. 5 Drone Component Chest","Bounty Hunter (Wandering Merchant)",6.6667],
  ["Lv. 5 Drone Component Choice Chest","Bounty Hunter (Wandering Merchant)",18.3333],
  ["Lv. 5 Drone Component Choice Chest","Summon Supplies (Regular)",20.0000],
  ["Lv. 5 Drone Component Choice Chest","Summon Supplies (5$ Bundle)",12.5000],
  ["Overlord Skill Badge","Black Market (Top Row - Regular)",0.0005],
  ["Overlord Skill Badge","Black Market (Top Row - 5$ Bundle)",0.0003],
  ["Overlord Skill Badge","Black Market (Bottom Row - Regular)",0.0010],
  ["Overlord Skill Badge","Black Market (Bottom Row - 5$ Bundle)",0.0006],
  ["Overlord Skill Badge","Total Mobilization (Regular)",0.0033],
  ["Overlord Skill Badge","Total Mobilization (Milestone #1)",0.0017],
  ["Overlord Skill Badge","Total Mobilization (Milestone #2)",0.0019],
  ["Premium Chip Material","Total Mobilization (Regular)",0.0350],
  ["Premium Chip Material","Total Mobilization (Milestone #1)",0.0175],
  ["Premium Chip Material","Total Mobilization (Milestone #2)",0.0200],
  ["Resource Choice Chest (SR)","Total Mobilization (Regular)",0.5000],
  ["Resource Choice Chest (SR)","Total Mobilization (Milestone #1)",0.2500],
  ["Resource Choice Chest (SR)","Total Mobilization (Milestone #2)",0.2857],
  ["Resource Choice Chest (UR)","Black Market (Bottom Row - Regular)",0.8333],
  ["Resource Choice Chest (UR)","Black Market (Bottom Row - 5$ Bundle)",0.5208],
  ["Resource Choice Chest (UR)","Bounty Hunter (Wandering Merchant)",0.4167],
  ["Resource Choice Chest (UR)","Glittering Market (Regular)",0.5000],
  ["Resource Choice Chest (UR)","Glittering Market (5$ Bundle)",0.3125],
  ["Resource Choice Chest (UR)","Summon Supplies (Regular)",0.5000],
  ["Resource Choice Chest (UR)","Summon Supplies (5$ Bundle)",0.3125],
  ["Skill Chip Chest (SR)","Glittering Market (Regular)",3.0000],
  ["Skill Chip Chest (SR)","Glittering Market (5$ Bundle)",1.8750],
  ["Skill Chip Chest (UR)","Black Market (Top Row - Regular)",15.0000],
  ["Skill Chip Chest (UR)","Black Market (Top Row - 5$ Bundle)",9.3750],
  ["Skill Chip Chest (UR)","Black Market (Bottom Row - Regular)",30.0000],
  ["Skill Chip Chest (UR)","Black Market (Bottom Row - 5$ Bundle)",18.7500],
  ["Skill Chip Chest (UR)","Glittering Market (Regular)",25.0000],
  ["Skill Chip Chest (UR)","Glittering Market (5$ Bundle)",15.6250],
  ["Skill Chip Choice Chest (UR)","Black Market (Top Row - Regular)",30.0000],
  ["Skill Chip Choice Chest (UR)","Black Market (Top Row - 5$ Bundle)",18.7500],
  ["Skill Chip Choice Chest (UR)","Black Market (Bottom Row - Regular)",40.0000],
  ["Skill Chip Choice Chest (UR)","Black Market (Bottom Row - 5$ Bundle)",25.0000],
  ["Skill Chip Choice Chest (UR)","Glittering Market (Regular)",30.0000],
  ["Skill Chip Choice Chest (UR)","Glittering Market (5$ Bundle)",18.7500],
  ["Skill Medal","Black Market (Top Row - Regular)",0.0010],
  ["Skill Medal","Black Market (Top Row - 5$ Bundle)",0.0006],
  ["Skill Medal","Black Market (Bottom Row - Regular)",0.0020],
  ["Skill Medal","Black Market (Bottom Row - 5$ Bundle)",0.0013],
  ["Skill Medal","Bounty Hunter (Wandering Merchant)",0.0013],
  ["Skill Medal","Glittering Market (Regular)",0.0012],
  ["Skill Medal","Glittering Market (5$ Bundle)",0.0008],
  ["Skill Medal","Total Mobilization (Regular)",0.0033],
  ["Skill Medal","Total Mobilization (Milestone #1)",0.0017],
  ["Skill Medal","Total Mobilization (Milestone #2)",0.0019],
  ["Skill Medal","Summon Supplies (Regular)",0.0013],
  ["Skill Medal","Summon Supplies (5$ Bundle)",0.0008],
  ["Skill Medal Lucky Chest","Black Market (Top Row - Regular)",1.5000],
  ["Skill Medal Lucky Chest","Black Market (Top Row - 5$ Bundle)",0.9375],
  ["Silver Assault Trooper","Glittering Market (Regular)",4.0000],
  ["Silver Assault Trooper","Glittering Market (5$ Bundle)",2.5000],
  ["Survivor Recruitment Ticket","Total Mobilization (Regular)",0.4000],
  ["Survivor Recruitment Ticket","Total Mobilization (Milestone #1)",0.2000],
  ["Survivor Recruitment Ticket","Total Mobilization (Milestone #2)",0.2286],
  ["Tower of Victory","Glittering Market (Regular)",10.0000],
  ["Tower of Victory","Glittering Market (5$ Bundle)",6.2500],
  ["Training Certificate","Black Market (Top Row - Regular)",0.2000],
  ["Training Certificate","Black Market (Top Row - 5$ Bundle)",0.1250],
  ["Training Certificate","Bounty Hunter (Wandering Merchant)",0.1667],
  ["Training Guidebook","Bounty Hunter (Wandering Merchant)",0.0003],
  ["Universal Decor Component","Black Market (Top Row - Regular)",0.0667],
  ["Universal Decor Component","Black Market (Top Row - 5$ Bundle)",0.0417],
  ["Universal Decor Component","Black Market (Bottom Row - Regular)",0.1000],
  ["Universal Decor Component","Black Market (Bottom Row - 5$ Bundle)",0.0625],
  ["Upgrade Ore","Black Market (Top Row - Regular)",0.0013],
  ["Upgrade Ore","Black Market (Top Row - 5$ Bundle)",0.0008],
  ["Upgrade Ore","Black Market (Bottom Row - Regular)",0.0030],
  ["Upgrade Ore","Black Market (Bottom Row - 5$ Bundle)",0.0019],
  ["Upgrade Ore","Glittering Market (Regular)",0.0025],
  ["Upgrade Ore","Glittering Market (5$ Bundle)",0.0016],
  ["Upgrade Ore","Total Mobilization (Regular)",0.0042],
  ["Upgrade Ore","Total Mobilization (Milestone #1)",0.0021],
  ["Upgrade Ore","Total Mobilization (Milestone #2)",0.0024],
  ["Upgrade Ore Lucky Chest","Black Market (Top Row - Regular)",2.0000],
  ["Upgrade Ore Lucky Chest","Black Market (Top Row - 5$ Bundle)",1.2500],
  ["Valor Badge","Black Market (Top Row - Regular)",0.0300],
  ["Valor Badge","Black Market (Top Row - 5$ Bundle)",0.0188],
  ["Valor Badge","Black Market (Bottom Row - Regular)",0.1000],
  ["Valor Badge","Black Market (Bottom Row - 5$ Bundle)",0.0625],
  ["Valor Badge","Bounty Hunter (Wandering Merchant)",0.0417],
  ["Valor Badge","Glittering Market (Regular)",0.0500],
  ["Valor Badge","Glittering Market (5$ Bundle)",0.0313],
  ["Valor Badge","Summon Supplies (Regular)",0.0417],
  ["Valor Badge","Summon Supplies (5$ Bundle)",0.0260]
];

export function parseAllRows(rows: any[]): ItemData[] {
  const data = rows || RAW_ROWS;
  if (!Array.isArray(data)) return [];
  
  const grouped: Record<string, ItemData> = {};
  
  data.forEach((row) => {
    if (!Array.isArray(row) || row.length < 3) return;
    const [name, market, price] = row;
    if (!name || typeof name !== 'string') return;

    if (!grouped[name]) {
      grouped[name] = {
        id: name.toLowerCase().replace(/\s+/g, "-").replace(/[()]+/g, ""),
        name: name,
        category: getItemCategory(name),
        prices: []
      };
    }
    
    const numPrice = Number(price);
    if (isNaN(numPrice)) return;

    const alreadyExists = grouped[name].prices.find(p => p.market === market);
    if (!alreadyExists) {
      grouped[name].prices.push({ market, price: numPrice });
    }
  });

  return Object.values(grouped);
}

export const INITIAL_ITEMS = parseAllRows(RAW_ROWS);
