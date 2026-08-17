export type Language = 'uz' | 'ru' | 'en';

export interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  birth_year: number;
  experience_years: number;
  bio: string;
  photo: string;
  phone: string;
  email: string;
  address: string;
  clinic_name: string;
  work_hours: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  duration_minutes: number;
  price?: number;
  price_formatted?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  doctor_id: string;
  organization: string;
  position: string;
  start_year: number;
  end_year: number | null;
  description: string;
  is_current: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  doctor_id: string;
  title: string;
  organization: string;
  year: number;
  image: string;
  description: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  read_time_minutes: number;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  related_articles?: Article[];
  medical_disclaimer?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export type AppointmentStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service_id: string;
  service_title: string;
  preferred_date: string;
  preferred_time?: string;
  price?: number | string;
  message?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentFormData {
  name: string;
  phone: string;
  email?: string;
  service_id: string;
  preferred_date: string;
  preferred_time?: string;
  price?: number | string;
  message?: string;
}

export interface DashboardStats {
  appointments: {
    total: number;
    new: number;
    confirmed: number;
    completed: number;
  };
  counts: {
    services: number;
    articles: number;
    certificates: number;
    faq: number;
    experiences: number;
  };
  telegram_logs: Array<{
    sent: boolean;
    timestamp: string;
    recipient: string;
    messageFormatted: string;
    error?: string;
  }>;
}
