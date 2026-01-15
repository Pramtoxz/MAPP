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
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log(`API ${options.method || 'GET'} ${endpoint}:`, response.status);
      
      const text = await response.text();
      console.log(`Response text (${endpoint}):`, text.substring(0, 200));
      
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', text);
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
    } catch (error) {
      console.error('API Error:', error);
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
