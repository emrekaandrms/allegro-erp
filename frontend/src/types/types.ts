export interface Product {
  id: number;
  sku: string;
  karat: string;
  color: string;
  type: string;
  weight: number;
  thickness: number;
  width: number;
  length: string;
  status: string;
  costs?: Cost[];
  seo_infos?: SEOInfo[];
  created_at: string;
  updated_at: string;
}

export interface Cost {
  id?: number;
  product_id: number;
  gold_price_per_gram: number;
  labor_cost: number;
  shipping_cost: number;
  desired_profit_margin: number;
  shopify_commission: number;
  etsy_commission: number;
  amazon_commission: number;
  hepsiburada_commission: number;
  trendyol_commission: number;
  payment_commission: number;
  gold_cost: number;
  total_cost: number;
  shopify_selling_price: number;
  etsy_selling_price: number;
  amazon_selling_price: number;
  hepsiburada_selling_price: number;
  trendyol_selling_price: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface SEOInfo {
  id: number;
  platform: 'shopify' | 'etsy' | 'amazon' | 'hepsiburada' | 'trendyol';
  title: string;
  description: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}
