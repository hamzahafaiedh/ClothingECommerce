export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  stock: number;
  category_id: string | null;
  gender: string | null;
  discount_id: string | null;
  active: boolean;
  is_new_arrival: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: Category;
  discount?: Discount;
}

export interface Discount {
  id: string;
  code: string | null;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  name: string;
  price: number | null;
  stock: number;
  attributes: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface AppliedDiscount {
  code: string;
  discount: Discount;
  amount: number;
}

export interface Customer {
  id?: string;
  full_name: string;
  email?: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    postal?: string;
    country?: string;
  };
}

export interface Order {
  id: string;
  customer_id: string | null;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  payment_method: string | null;
  shipping: Record<string, any> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  customer?: Customer;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  title: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}
