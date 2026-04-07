import { API_BASE_URL } from '../config/api';
import { authService } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

class ApiService {
  private pinCache: string | null = null;

  setPinForRequest(pin: string) {
    this.pinCache = pin;
  }

  clearPin() {
    this.pinCache = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await authService.getToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token && !endpoint.includes('/auth/login')) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (this.pinCache && (endpoint.includes('/collections') || endpoint.includes('/auth/profile'))) {
        headers['X-Collection-Pin'] = this.pinCache;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      const text = await response.text();
      
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        return {
          success: false,
          error: {
            code: 'PARSE_ERROR',
            message: 'Response tidak valid dari server',
          },
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: result.error || {
            code: 'SERVER_ERROR',
            message: result.message || 'Terjadi kesalahan pada server',
          },
        };
      }

      return result;
    } catch {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Koneksi ke server gagal',
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
