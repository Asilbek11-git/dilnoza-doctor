import {
  Doctor,
  Service,
  Experience,
  Certificate,
  Article,
  FAQItem,
  Appointment,
  AppointmentFormData,
  DashboardStats
} from '../types.ts';

const API_BASE = '/api/v1';

let authToken: string | null = localStorage.getItem('dilnoza_admin_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('dilnoza_admin_token', token);
  } else {
    localStorage.removeItem('dilnoza_admin_token');
  }
}

export function getAuthToken(): string | null {
  return authToken || localStorage.getItem('dilnoza_admin_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || 'Xatolik yuz berdi';
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.errors = data?.errors || {};
    throw err;
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Public
  getDoctor: () => request<Doctor>('/doctor/'),
  getServices: (all = false) => request<Service[]>(`/services/?all=${all}`),
  getServiceBySlug: (slug: string) => request<Service>(`/services/${slug}/`),
  getExperiences: () => request<Experience[]>('/experiences/'),
  getCertificates: () => request<Certificate[]>('/certificates/'),
  getArticles: (params?: { page?: number; page_size?: number; search?: string; category?: string; all?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.page_size) query.set('page_size', params.page_size.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.all) query.set('all', 'true');
    return request<{ count: number; total_pages: number; current_page: number; results: Article[] }>(`/articles/?${query.toString()}`);
  },
  getArticleBySlug: (slug: string) => request<Article>(`/articles/${slug}/`),
  getFAQ: (all = false) => request<FAQItem[]>(`/faq/?all=${all}`),
  createAppointment: (data: AppointmentFormData) => request<{ appointment: Appointment; message: string }>('/appointments/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Auth
  login: (username: string, password: string) => request<{ access: string; refresh: string; user: any }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  verifyToken: () => request<{ valid: boolean; user: any }>('/auth/verify/'),

  // Admin CRUD
  updateDoctor: (data: Partial<Doctor>) => request<Doctor>('/doctor/', {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  createService: (data: Partial<Service>) => request<Service>('/services/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateService: (slug: string, data: Partial<Service>) => request<Service>(`/services/${slug}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteService: (slug: string) => request<{ message: string }>(`/services/${slug}/`, {
    method: 'DELETE'
  }),

  createExperience: (data: Partial<Experience>) => request<Experience>('/experiences/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateExperience: (id: string, data: Partial<Experience>) => request<Experience>(`/experiences/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteExperience: (id: string) => request<{ message: string }>(`/experiences/${id}/`, {
    method: 'DELETE'
  }),

  createCertificate: (data: Partial<Certificate>) => request<Certificate>('/certificates/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCertificate: (id: string, data: Partial<Certificate>) => request<Certificate>(`/certificates/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteCertificate: (id: string) => request<{ message: string }>(`/certificates/${id}/`, {
    method: 'DELETE'
  }),

  createArticle: (data: Partial<Article>) => request<Article>('/articles/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateArticle: (slug: string, data: Partial<Article>) => request<Article>(`/articles/${slug}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteArticle: (slug: string) => request<{ message: string }>(`/articles/${slug}/`, {
    method: 'DELETE'
  }),

  createFAQ: (data: Partial<FAQItem>) => request<FAQItem>('/faq/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateFAQ: (id: string, data: Partial<FAQItem>) => request<FAQItem>(`/faq/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteFAQ: (id: string) => request<{ message: string }>(`/faq/${id}/`, {
    method: 'DELETE'
  }),

  getAppointments: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    return request<{ count: number; results: Appointment[] }>(`/appointments/?${query.toString()}`);
  },
  updateAppointment: (id: string, data: Partial<Appointment>) => request<Appointment>(`/appointments/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteAppointment: (id: string) => request<{ message: string }>(`/appointments/${id}/`, {
    method: 'DELETE'
  }),

  getStats: () => request<DashboardStats>('/stats/'),
  testTelegram: () => request<{ result: any; message: string }>('/telegram/test/', { method: 'POST' })
};
