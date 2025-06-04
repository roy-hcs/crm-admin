// Base API configuration with fetch

// API base URL
export const API_BASE_URL = 'http://admin-1.hcs55.com:38080';

// Helper function for fetch with error handling
export async function fetchWithAuth<T>(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');

  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    // Parse error message if available
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
