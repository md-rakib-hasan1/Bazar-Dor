export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface PriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: Market[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}