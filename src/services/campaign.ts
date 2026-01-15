import { apiService } from './api';

export interface Campaign {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  fullDescription?: string;
  partsIncluded?: string[];
  termsAndConditions?: string;
  rewards?: string[];
}

interface CampaignAchievement {
  currentCampaign: {
    id: string;
    title: string;
    endDate: string;
    achievementPercentage: number;
    achievementLabel: string;
  };
}

class CampaignService {
  async getCampaignList() {
    return apiService.get<Campaign[]>('/campaigns');
  }

  async getCampaignDetail(id: string) {
    return apiService.get<Campaign>(`/campaigns/${id}`);
  }

  async getMyAchievement() {
    return apiService.get<CampaignAchievement>('/campaigns/my-achievement');
  }
}

export const campaignService = new CampaignService();
