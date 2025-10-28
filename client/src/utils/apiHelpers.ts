import { apiService, API_URL } from './api';

// Helper function to make authenticated API calls
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = apiService.getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Products
export const productsApi = {
  getAll: () => fetchWithAuth('/products'),
  getOne: (id: number) => fetchWithAuth(`/products/${id}`),
  create: (data: any) => fetchWithAuth('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => fetchWithAuth(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Categories
export const categoriesApi = {
  getAll: () => fetchWithAuth('/categories'),
  getOne: (id: number) => fetchWithAuth(`/categories/${id}`),
  create: (data: any) => fetchWithAuth('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => fetchWithAuth(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchWithAuth(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Orders
export const ordersApi = {
  getAll: () => fetchWithAuth('/orders'),
  getOne: (id: number) => fetchWithAuth(`/orders/${id}`),
  create: (data: any) => fetchWithAuth('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id: number, status: string) => fetchWithAuth(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  delete: (id: number) => fetchWithAuth(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

// Stats
export const statsApi = {
  getDashboard: () => fetchWithAuth('/stats/dashboard'),
};
