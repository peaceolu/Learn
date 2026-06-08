export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'ebook';
  category: string;
  price: number;
  coverImage: string;
  instructor?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  curriculum?: CurriculumItem[];
  learningOutcomes?: string[];
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  googleDriveLink?: string; // Protected link for delivery
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumItem {
  title: string;
  duration: string;
  lessons: { title: string; duration: string }[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productTitle: string;
  productType: string;
  amount: number;
  transactionRef: string;
  status: 'pending' | 'completed' | 'failed';
  paymentStatus: 'pending' | 'successful' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}