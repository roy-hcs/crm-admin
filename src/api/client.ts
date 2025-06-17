// Base API configuration with fetch
import { toast } from 'sonner';

// TODO: need to update production API according to the environment
export const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.example.com' : '/api';
export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
  showErrorToast = true,
) {
  // TODO: this system does not use token to authenticate, it uses session cookie, need to remove it later
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
    credentials: 'include',
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

    // Show error toast notification using Sonner
    if (showErrorToast) {
      toast.error('Request Failed', {
        description: errorMessage || 'An error occurred while processing your request.',
      });
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
