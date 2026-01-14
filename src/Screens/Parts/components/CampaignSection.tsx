import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import CampaignCard from '../../../components/home/CampaignCard';

interface CampaignSectionProps {
  onSeeMorePress: () => void;
  onCampaignPress: () => void;
}

const CampaignSection: React.FC<CampaignSectionProps> = ({
  onSeeMorePress,
  onCampaignPress,
}) => {
  return (
    <View style={styles.campaignSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Campaign</Text>
        <TouchableOpacity onPress={onSeeMorePress}>
          <Text style={styles.seeMoreText}>See More &gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.campaignWrapper}>
        <CampaignCard
          badge="NEW CONTRACT"
          title="Gear Up & Get Rewarded"
          description="Ends Dec 31, 2025 • Target: 85% Reach"
          onPress={onCampaignPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  campaignSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  seeMoreText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  campaignWrapper: {
    paddingHorizontal: 16,
  },
});

export default CampaignSection;
