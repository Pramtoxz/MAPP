import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { authService } from './auth';

const PIN_STATUS_KEY = 'pin_status';

interface PinStatusResponse {
  success: boolean;
  data?: {
    has_pin: boolean;
    requires_setup: boolean;
  };
  message?: string;
}

interface PinSetupRequest {
  pin: string;
  pin_confirmation: string;
}

interface PinVerifyRequest {
  pin: string;
}

interface PinChangeRequest {
  old_pin: string;
  new_pin: string;
  new_pin_confirmation: string;
}

interface PinResponse {
  success: boolean;
  data?: {
    message: string;
    verified?: boolean;
  };
  message?: string;
  requires_setup?: boolean;
  requires_pin?: boolean;
}

class PinService {
  async checkPinStatus(): Promise<{ success: boolean; has_pin: boolean; requires_setup: boolean; message?: string }> {
    try {
      const token = await authService.getToken();
      if (!token) {
        return { success: false, has_pin: false, requires_setup: true, message: 'Token tidak ditemukan' };
      }

      const response = await fetch(`${API_BASE_URL}/collections/pin/status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result: PinStatusResponse = await response.json();

      if (result.success && result.data) {
        await AsyncStorage.setItem(PIN_STATUS_KEY, JSON.stringify(result.data));
        return {
          success: true,
          has_pin: result.data.has_pin,
          requires_setup: result.data.requires_setup,
        };
      }

      return {
        success: false,
        has_pin: false,
        requires_setup: true,
        message: result.message || 'Gagal mengecek status PIN',
      };
    } catch {
      return {
        success: false,
        has_pin: false,
        requires_setup: true,
        message: 'Koneksi ke server gagal',
      };
    }
  }

  async setupPin(pin: string, pinConfirmation: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = await authService.getToken();
      if (!token) {
        return { success: false, message: 'Token tidak ditemukan' };
      }

      const body: PinSetupRequest = {
        pin,
        pin_confirmation: pinConfirmation,
      };

      const response = await fetch(`${API_BASE_URL}/collections/pin/setup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result: PinResponse = await response.json();

      if (result.success) {
        await AsyncStorage.setItem(PIN_STATUS_KEY, JSON.stringify({ has_pin: true, requires_setup: false }));
        return {
          success: true,
          message: result.data?.message || 'PIN berhasil diatur',
        };
      }

      return {
        success: false,
        message: result.message || 'Gagal mengatur PIN',
      };
    } catch {
      return {
        success: false,
        message: 'Koneksi ke server gagal',
      };
    }
  }

  async verifyPin(pin: string): Promise<{ success: boolean; verified: boolean; message?: string }> {
    try {
      const token = await authService.getToken();
      if (!token) {
        return { success: false, verified: false, message: 'Token tidak ditemukan' };
      }

      const body: PinVerifyRequest = { pin };

      const response = await fetch(`${API_BASE_URL}/collections/pin/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result: PinResponse = await response.json();

      if (result.success && result.data?.verified) {
        return {
          success: true,
          verified: true,
          message: result.data.message || 'PIN valid',
        };
      }

      return {
        success: false,
        verified: false,
        message: result.message || 'PIN salah',
      };
    } catch {
      return {
        success: false,
        verified: false,
        message: 'Koneksi ke server gagal',
      };
    }
  }

  async changePin(oldPin: string, newPin: string, newPinConfirmation: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = await authService.getToken();
      if (!token) {
        return { success: false, message: 'Token tidak ditemukan' };
      }

      const body: PinChangeRequest = {
        old_pin: oldPin,
        new_pin: newPin,
        new_pin_confirmation: newPinConfirmation,
      };

      const response = await fetch(`${API_BASE_URL}/collections/pin/change`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result: PinResponse = await response.json();

      if (result.success) {
        return {
          success: true,
          message: result.data?.message || 'PIN berhasil diubah',
        };
      }

      return {
        success: false,
        message: result.message || 'Gagal mengubah PIN',
      };
    } catch {
      return {
        success: false,
        message: 'Koneksi ke server gagal',
      };
    }
  }

  async getCachedPinStatus(): Promise<{ has_pin: boolean; requires_setup: boolean } | null> {
    try {
      const cached = await AsyncStorage.getItem(PIN_STATUS_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  async clearPinStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PIN_STATUS_KEY);
    } catch {
      // Silent fail
    }
  }
}

export const pinService = new PinService();
