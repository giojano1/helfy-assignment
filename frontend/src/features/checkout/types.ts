/**
 * Checkout feature — local TypeScript types.
 * Full type definitions added in Phase 4.
 */

export type ShippingMethod = "standard" | "express" | "overnight";
export type PaymentMethod = "cod" | "card";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface CreateOrderDto {
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: {
    name: string;
    slug: string;
    images: Array<{ url: string; isPrimary: boolean }>;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
