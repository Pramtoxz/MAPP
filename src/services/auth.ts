import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './../config/api';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface RequestOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp_code: string;
}

interface UserData {
  id: string;
  name: string;
  email: string | null;
  role: string;
  dealerCode: string;
  dealerName: string;
}

export type { UserData };

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: UserData;
  };
  error?: {
    code: string;
    message: string;
  };
}

class AuthService {
  async login(
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; message?: string; data?: UserData }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const result: LoginResponse = await response.json();

      if (result.success && result.data) {
        await AsyncStorage.setItem(TOKEN_KEY, result.data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.data.user));

        return {
          success: true,
          data: result.data.user,
        };
      } else {
        return {
          success: false,
          message:
            result.error?.message ||
            'Coba ingat-ingat lagi, jangan pake perasaan ya!',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Koneksi ke server gagal',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await this.getToken();

      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token !== null;
    } catch (error) {
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  async refreshProfile(): Promise<UserData | null> {
    try {
      const token = await this.getToken();

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.data));
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Refresh profile error:', error);
      return null;
    }
  }

  async requestOtp(
    phone: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message: result.data?.message || 'Kode OTP telah dikirim ke WhatsApp Anda',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Gagal mengirim OTP',
        };
      }
    } catch (error) {
      console.error('Request OTP error:', error);
      return {
        success: false,
        message: 'Koneksi ke server gagal',
      };
    }
  }

  async verifyOtp(
    phone: string,
    otpCode: string,
  ): Promise<{ success: boolean; message?: string; data?: UserData }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp_code: otpCode }),
      });

      const result: LoginResponse = await response.json();

      if (result.success && result.data) {
        await AsyncStorage.setItem(TOKEN_KEY, result.data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.data.user));

        return {
          success: true,
          data: result.data.user,
        };
      } else {
        return {
          success: false,
          message: result.error?.message || 'Kode OTP tidak valid atau sudah kadaluarsa',
        };
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: 'Koneksi ke server gagal',
      };
    }
  }
}

export const authService = new AuthService();
