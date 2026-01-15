import { useState, useEffect } from 'react';
import { campaignService, Campaign } from '../../../services';

export const useCampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [achievement, setAchievement] = useState({
    percentage: 50,
    label: '50%',
    title: 'Gear Up & Get Rewarded',
    endDate: '31 December 2025',
  });

  useEffect(() => {
    loadCampaigns();
    loadAchievement();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await campaignService.getCampaignList();
    setLoading(false);

    if (result.success && result.data) {
      setCampaigns(result.data);
    }
  };

  const loadAchievement = async () => {
    const result = await campaignService.getMyAchievement();

    if (result.success && result.data) {
      setAchievement({
        percentage: result.data.currentCampaign.achievementPercentage,
        label: result.data.currentCampaign.achievementLabel,
        title: result.data.currentCampaign.title,
        endDate: result.data.currentCampaign.endDate,
      });
    }
  };

  return {
    campaigns,
    loading,
    achievement,
    loadCampaigns,
  };
};
