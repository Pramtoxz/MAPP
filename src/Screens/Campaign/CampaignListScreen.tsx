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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { Campaign } from '../../services';
import { useCampaignList } from './hooks/useCampaignList';

type CampaignListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CampaignListScreen: React.FC = () => {
  const navigation = useNavigation<CampaignListScreenNavigationProp>();
  const { campaigns, loading, achievement } = useCampaignList();

  const handleCampaignPress = (campaign: Campaign) => {
    navigation.navigate('CampaignDetail', { campaignId: campaign.id });
  };

  const renderCampaignCard = ({ item }: { item: Campaign }) => (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => handleCampaignPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.campaignImage} />
      <View style={styles.campaignContent}>
        <Text style={styles.campaignTitle}>{item.title}</Text>
        <Text style={styles.campaignPeriod}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Campaign</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>My Achievement</Text>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{achievement.label}</Text>
          </View>
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignInfoTitle}>{achievement.title}</Text>
            <Text style={styles.campaignInfoDate}>End: {achievement.endDate}</Text>
          </View>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 16, color: colors.grayText }}>Loading campaigns...</Text>
          </View>
        ) : (
          <View style={styles.listContent}>
            {campaigns.map((item) => (
              <View key={item.id}>{renderCampaignCard({ item })}</View>
            ))}
            <View style={{ height: 100 }} />
          </View>
        )}
      </ScrollView>
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
  progressSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  progressLabel: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: fonts.sizes.huge + 8,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  campaignInfo: {
    alignItems: 'center',
  },
  campaignInfoTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  campaignInfoDate: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  campaignCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  campaignImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  campaignContent: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  campaignPeriod: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
});

export default CampaignListScreen;
