export type ProductCategory = 
  | 'all'
  | 'tikka-bbq'
  | 'rolls'
  | 'burgers'
  | 'sandwiches'
  | 'fried-chicken'
  | 'fries-sides'
  | 'deals';

export interface Product {
  id: string;
  name: string;
  category: 'tikka-bbq' | 'rolls' | 'burgers' | 'sandwiches' | 'fried-chicken' | 'fries-sides' | 'deals';
  price: number | null; // null for unconfirmed draft products
  priceConfirmed: boolean;
  isPublished: boolean;
  isAvailable: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  description: string;
  image: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
  price: number;
  originalPrice?: number;
  image: string;
  isAvailable: boolean;
  isPublished: boolean;
  badge?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'easypaisa';

export type PaymentStatus = 'pending' | 'awaiting_verification' | 'verified' | 'paid' | 'rejected';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  orderType: 'delivery' | 'pickup';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  easypaisaRef?: string;
  easypaisaScreenshot?: string;
  internalNotes?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
    by: string;
  }[];
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  minOrder: number;
  currency: string;
  timeZone: string;
  easypaisaAccountName: string;
  easypaisaAccountNumber: string;
  easypaisaInstructions: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}
