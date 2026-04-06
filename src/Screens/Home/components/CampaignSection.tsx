import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import CampaignSlider from '../../../components/home/CampaignSlider';
import { Campaign } from '../../../services';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';

interface CampaignSectionProps {
  campaigns: Campaign[];
  onCampaignPress: (campaignId: string) => void;
  onSeeMorePress: () => void;
}

export const CampaignSection: React.FC<CampaignSectionProps> = ({
  campaigns,
  onCampaignPress,
  onSeeMorePress,
}) => {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.campaignSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campaign</Text>
          <TouchableOpacity onPress={onSeeMorePress}>
            <Text style={styles.seeMoreText}>See More &gt;</Text>
          </TouchableOpacity>
        </View>
        {campaigns.length > 0 ? (
          <View style={styles.campaignWrapper}>
            <CampaignSlider
              campaigns={campaigns}
              onPress={onCampaignPress}
              autoSlide={true}
              interval={3000}
            />
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginHorizontal: -8,
    marginTop: -16,
  },
  campaignSection: {
    backgroundColor: colors.white,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  seeMoreText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  campaignWrapper: {
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
