// Base API configuration with fetch
import { toast } from 'sonner';

// TODO: need to update production API according to the environment
// 测试环境使用的baseUrl是基于http的，部署到vercel后，前端是https的，会有混合内容的问题
// 现在的解决方法是通过vite的proxy把请求代理到后端，后端再请求真正的API
// 生产环境需要确认一下API地址
export const API_BASE_URL = process.env.NODE_ENV === '/api';
// export const API_BASE_URL =
//   process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_URL : '/api';
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
    // stop default redirect behavior
    // redirect: 'manual',
  });

  // console.log('response', response);

  // only handle the redirect which happen in the same domain, if there are some cross-domain redirect later, need to handle it differently
  if (response.redirected) {
    const redirectUrl = new URL(response.url).pathname;
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return {} as Promise<T>; // Return empty object as we're redirecting
    }
  }

  if (!response.ok) {
    // Handle unauthorized
    // TODO: the current BE seems does not return 401, remove this check after confirming with BE team
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

export interface ApiResponse<T = null> {
  code: number;
  msg: string;
  data: T;
}

export type ApiPostData = Record<string, unknown> | unknown[] | string | number | boolean | null;

export async function apiGet<T = null>(url: string, options?: RequestInit) {
  return fetchWithAuth<ApiResponse<T>>(url, { ...options, method: 'GET' });
}
export async function apiGetCustom<T = null>(url: string, options?: RequestInit) {
  return fetchWithAuth<T>(url, { ...options, method: 'GET' });
}

export async function apiPost<T = null, D extends ApiPostData = Record<string, unknown>>(
  url: string,
  data: D,
  options?: RequestInit,
) {
  return fetchWithAuth<ApiResponse<T>>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export type FormValue = string | number | boolean | undefined | Record<string, unknown> | null;

function flattenParams(
  obj: Record<string, FormValue>,
  parentKey = '',
  result: URLSearchParams = new URLSearchParams(),
) {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      flattenParams(value as Record<string, FormValue>, newKey, result);
    } else {
      result.append(newKey, `${value ?? ''}`);
    }
  });

  return result;
}

function apiFormPostBase<T>(
  url: string,
  params: Record<string, FormValue>,
  options?: RequestInit,
): Promise<T> {
  // const urlSearchParams = new URLSearchParams();
  // Object.entries(params).forEach(([key, value]) => {
  //   urlSearchParams.append(key, String(value));
  // });
  const urlSearchParams = flattenParams(params);

  return fetchWithAuth<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options?.headers || {}),
    },
    body: urlSearchParams.toString(),
  });
}
export function apiFormPost<T>(
  url: string,
  params: Record<string, FormValue>,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  return apiFormPostBase<ApiResponse<T>>(url, params, options);
}

export function apiFormPostCustom<T>(
  url: string,
  params: Record<string, FormValue>,
  options?: RequestInit,
): Promise<T> {
  return apiFormPostBase<T>(url, params, options);
}
