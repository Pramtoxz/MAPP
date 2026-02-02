import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authService, campaignService, dashboardService, Campaign } from '../../../services';

export const useHomeScreen = () => {
  const [userName, setUserName] = useState('Loading...');
  const [salesWhatsapp, setSalesWhatsapp] = useState<string | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      loadDashboardStats();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await authService.getUserData();
      if (userData) {
        setUserName(userData.name);
        setSalesWhatsapp(userData.salesWhatsapp || null);
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
    salesWhatsapp,
    cartCount,
    campaigns,
    stats,
  };
};
