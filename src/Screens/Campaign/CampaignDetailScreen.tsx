import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { useCampaignDetail } from './hooks/useCampaignDetail';

type CampaignDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type CampaignDetailScreenRouteProp = RouteProp<RootStackParamList, 'CampaignDetail'>;

const CampaignDetailScreen: React.FC = () => {
  const navigation = useNavigation<CampaignDetailScreenNavigationProp>();
  const route = useRoute<CampaignDetailScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { campaignId } = route.params;

  const { campaign, loading } = useCampaignDetail(campaignId);

  const formatDate = (dateString: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, month, day] = dateString.split('-');
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campaign Detail</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading campaign...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campaign Detail</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Campaign not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{campaign.title}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: campaign.image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.periodSection}>
            <Text style={styles.sectionLabel}>Periode</Text>
            <View style={styles.periodBadge}>
              <Text style={styles.periodText}>
                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              </Text>
            </View>
          </View>

          {campaign.fullDescription && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Campaign Description</Text>
              <Text style={styles.sectionText}>{campaign.fullDescription}</Text>
            </View>
          )}

          {campaign.partsIncluded && campaign.partsIncluded.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parts Included</Text>
              {campaign.partsIncluded.map((part, index) => (
                <Text key={index} style={styles.listItem}>
                  • {part}
                </Text>
              ))}
            </View>
          )}

          {campaign.termsAndConditions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Syarat dan Ketentuan</Text>
              <Text style={styles.sectionText}>{campaign.termsAndConditions}</Text>
            </View>
          )}

          {campaign.rewards && campaign.rewards.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reward</Text>
              {campaign.rewards.map((reward, index) => (
                <Text key={index} style={styles.listItem}>
                  • {reward}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.joinButton}
          >
            <Text style={styles.joinButtonText}>Start Order</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.black,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
  },
  periodSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.grayText,
    marginBottom: 8,
  },
  periodBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  periodText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    lineHeight: 22,
  },
  listItem: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  joinButton: {
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.grayText,
  },
  emptyText: {
    color: colors.grayText,
  },
  spacer: {
    height: 100,
  },
});

export default CampaignDetailScreen;
