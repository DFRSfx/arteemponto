export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  colors: string[];
  inStock: boolean;
  featured: boolean;
  new: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface PaymentReference {
  entity: string;
  reference: string;
  value: number;
  method: 'multibanco' | 'mbway' | 'card' | 'apple_pay';
}