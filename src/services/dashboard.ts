import { apiService } from './api';

interface DashboardStats {
  deliveryProgress: string;
  monthlyBuyIn: string;
  cartCount: number;
}

class DashboardService {
  async getStats() {
    return apiService.get<DashboardStats>('/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();
