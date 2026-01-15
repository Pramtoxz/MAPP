import { useState, useEffect } from 'react';
import { campaignService, Campaign } from '../../../services';

export const useCampaignDetail = (campaignId: string) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaignDetail();
  }, [campaignId]);

  const loadCampaignDetail = async () => {
    setLoading(true);
    const result = await campaignService.getCampaignDetail(campaignId);
    setLoading(false);

    if (result.success && result.data) {
      setCampaign(result.data);
    }
  };

  return {
    campaign,
    loading,
  };
};
