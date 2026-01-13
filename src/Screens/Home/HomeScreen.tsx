import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { authService } from '../../services/auth';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import QuickMenuButton from '../../components/home/QuickMenuButton';
import CampaignCard from '../../components/home/CampaignCard';
import StatCard from '../../components/home/StatCard';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState('Demo User (Offline)');
  const [cartCount] = useState(3);

  useEffect(() => {
    loadUserData();
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

  const menuItems = [
    { id: 1, icon: getImage('ic_spring.png'), label: 'PARTS', onPress: () => { console.log('Navigate to Parts'); navigation.navigate('Parts'); } },
    { id: 2, icon: getImage('ic_dealer_active.png'), label: 'CATALOGUE', onPress: () => console.log('CATALOGUE') },
    { id: 3, icon: getImage('ic_promotion.png'), label: 'PROMO', onPress: () => console.log('PROMO') },
    { id: 4, icon: getImage('ic_cart_response.png'), label: 'CART', badge: cartCount, onPress: () => navigation.navigate('Cart') },
    { id: 5, icon: getImage('ic_menu_wallboard_en.png'), label: 'STATISTIK', onPress: () => { console.log('Navigate to Parts'); navigation.navigate('Parts'); } },
    { id: 6, icon: getImage('ic_spk.png'), label: 'CP', onPress: () => console.log('CATALOGUE') },
    { id: 7, icon: getImage('ic_piala.png'), label: 'FAVORITE', onPress: () => console.log('PROMO') },
    { id: 8, icon: getImage('ic_contact_wa.png'), label: 'CHAT ME', onPress: () => console.log('CHAT ME') },
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
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <CampaignCard
              badge="NEW CONTRACT"
              title="Gear Up & Get Rewarded"
              description="Ends Dec 31, 2025 • Target: 85% Reach"
              onPress={() => console.log('Campaign pressed')}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.statsContainer}>
              <StatCard
                value="50%"
                icon={
                  <Image
                    source={getImage('ic_pin_map.png')}
                    style={styles.statIcon}
                  />
                }
              />
              <View style={styles.statSpacer} />
              <StatCard
                value="Rp xx.xxx,xx"
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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={getImage('ic_homepage.png')} style={styles.navIconActive} />
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={getImage('ic_menu_katalog_dis.png')} style={styles.navIcon} />
          <Text style={styles.navLabel}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={getImage('ic_menu_katalog_dis.png')} style={styles.navIcon} />
          <Text style={styles.navLabel}>Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Image source={getImage('ic_profile.png')} style={styles.navIcon} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  bottomSpacer: {
    height: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
    tintColor: colors.grayInactive,
  },
  navIconActive: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  navLabel: {
    fontSize: fonts.sizes.tiny + 1,
    fontFamily: fonts.regular,
    color: colors.grayInactive,
  },
  navLabelActive: {
    fontSize: fonts.sizes.tiny + 1,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});

export default HomeScreen;
