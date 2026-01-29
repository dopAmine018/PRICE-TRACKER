
export enum Category {
  ALL = "all",
  SPEED = "speedups",
  RES = "resources",
  HERO = "hero",
  GEAR = "gear",
  DECOR = "decor"
}

export interface Currency {
  code: string;
  rate: number;
  symbol: string;
  pos: 'prefix' | 'suffix';
  prec: number;
  label: string;
}

export interface MarketPrice {
  market: string;
  price: number;
}

export interface ItemData {
  id: string;
  name: string;
  category: Category;
  prices: MarketPrice[];
}

export type Language = 'en' | 'ar';

export interface TranslationStrings {
  ui: {
    title: string;
    search: string;
    cheapest: string;
    back: string;
    viewPrices: string;
    selectedCount: string;
    viewSelected: string;
    clearAll: string;
    selectedItems: string;
    maxItems: string;
    minItems: string;
    theme: string;
    dark: string;
    light: string;
    noResults: string;
    close: string;
  };
  categories: Record<Category, string>;
  markets: Record<string, string>;
  items: Record<string, string>;
}
