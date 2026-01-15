import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import QuickMenuButton from '../../components/home/QuickMenuButton';
import CampaignSlider from '../../components/home/CampaignSlider';
import StatCard from '../../components/home/StatCard';
import { useHomeScreen } from './hooks/useHomeScreen';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  StackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { userName, cartCount, campaigns, stats } = useHomeScreen();

  const menuItems = [
    { id: 1, icon: getImage('ic_spring.png'), label: 'PARTS', onPress: () => navigation.navigate('Parts') },
    { id: 2, icon: getImage('ic_dealer_active.png'), label: 'CATALOGUE', onPress: () => {} },
    { id: 3, icon: getImage('ic_promotion.png'), label: 'PROMO', onPress: () => {} },
    { id: 4, icon: getImage('ic_cart_response.png'), label: 'CART', badge: cartCount, onPress: () => navigation.navigate('Cart') },
    { id: 5, icon: getImage('ic_menu_wallboard_en.png'), label: 'STATISTIK', onPress: () => navigation.navigate('Parts') },
    { id: 6, icon: getImage('ic_spk.png'), label: 'CP', onPress: () => {} },
    { id: 7, icon: getImage('ic_piala.png'), label: 'FAVORITE', onPress: () => {} },
    { id: 8, icon: getImage('ic_contact_wa.png'), label: 'CHAT ME', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      <Image
        source={getImage('bg_honda.webp')}
        style={styles.backgroundImage}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={getImage('lg_honda.jpg')}
                    style={styles.avatar}
                  />
                </View>
                <View>
                  <Text style={styles.welcomeText}>SALAM SATU HATI,</Text>
                  <Text style={styles.nameText}>{userName}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Image
                  source={getImage('ic_notification.png')}
                  style={styles.notificationIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Image
                source={getImage('ic_spring.png')}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search parts by number or name..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
              />
            </View>
          </View>
        </View>

        <View style={styles.whiteContainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUICK MENU</Text>
            </View>
            <View style={styles.sectionMenu}>
              <View style={styles.quickMenuRow}>
                {menuItems.slice(0, 4).map((item) => (
                  <QuickMenuButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    onPress={item.onPress}
                  />
                ))}
              </View>
              <View style={styles.quickMenuRow}>
                {menuItems.slice(4, 8).map((item) => (
                  <QuickMenuButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    onPress={item.onPress}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CURRENT CAMPAIGN</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CampaignList')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {campaigns.length > 0 ? (
              <CampaignSlider
                campaigns={campaigns}
                onPress={(campaignId) => navigation.navigate('CampaignDetail', { campaignId })}
                autoSlide={true}
                interval={3000}
              />
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.statsContainer}>
              <StatCard
                value={stats.deliveryProgress}
                icon={
                  <Image
                    source={getImage('ic_pin_map.png')}
                    style={styles.statIcon}
                  />
                }
              />
              <View style={styles.statSpacer} />
              <StatCard
                value={stats.monthlyBuyIn}
                icon={
                  <Image
                    source={getImage('ic_checklist_enable.png')}
                    style={styles.statIcon}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.white,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  nameText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  whiteContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 24,
    marginTop: -20,
  },
  sectionMenu: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 16,
  },
  quickMenuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.bold,
    color: colors.grayText,
    letterSpacing: 1.2,
  },
  viewAllText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statSpacer: {
    width: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default HomeScreen;
