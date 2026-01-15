import { useState, useEffect } from 'react';
import { authService, campaignService, dashboardService, Campaign } from '../../../services';

export const useHomeScreen = () => {
  const [userName, setUserName] = useState('Loading...');
  const [cartCount, setCartCount] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    deliveryProgress: '50%',
    monthlyBuyIn: 'Rp xx.xxx,xx',
  });

  useEffect(() => {
    loadUserData();
    loadCampaigns();
    loadDashboardStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getUserData();
      if (userData) {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadCampaigns = async () => {
    const result = await campaignService.getCampaignList();
    if (result.success && result.data) {
      setCampaigns(result.data);
    }
  };

  const loadDashboardStats = async () => {
    const result = await dashboardService.getStats();
    if (result.success && result.data) {
      setStats({
        deliveryProgress: result.data.deliveryProgress,
        monthlyBuyIn: result.data.monthlyBuyIn,
      });
      setCartCount(result.data.cartCount);
    }
  };

  return {
    userName,
    cartCount,
    campaigns,
    stats,
  };
};
