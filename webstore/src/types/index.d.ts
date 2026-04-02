export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  rating?: {
    rate: number;
    count: number;
  }
}

export interface CartItem extends Product {
  quantity: number;
}
