import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

interface LoginCredentials {
  username: string;
  password: string;
}

interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string; data?: UserData }> {
    try {
      const mockUser: UserData = {
        id: '1',
        username: credentials.username,
        name: 'User Demo',
        email: 'demo@menara-agung.com',
        role: 'dealer',
      };

      await AsyncStorage.setItem(TOKEN_KEY, 'mock_token_12345');
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      return {
        success: true,
        data: mockUser,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login gagal',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
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
}

export const authService = new AuthService();
