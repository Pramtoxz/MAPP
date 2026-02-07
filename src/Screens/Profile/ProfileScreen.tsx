import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { authService } from '../../services/auth';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import CustomAlert from '../../components/CustomAlert';
import LoadingDialog from '../../components/LoadingDialog';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ProfileTab'>,
  StackNavigationProp<RootStackParamList>
>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  
  // User data
  const [dealerName, setDealerName] = useState('');
  const [dealerCode, setDealerCode] = useState('');
  const [email, setEmail] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    const profile = await authService.refreshProfile();
    if (profile) {
      setEmail(profile.email || '');
      setDealerName(profile.dealerName || profile.name);
      setDealerCode(profile.dealerCode);
    }
    setLoading(false);
  };

  const handleLogoutPress = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    await authService.logout();
    setShowLogoutSuccess(true);
  };

  const handleLogoutSuccess = () => {
    setShowLogoutSuccess(false);
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const MenuItem = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Image source={icon} style={styles.menuIcon} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Image source={getImage('ic_arrow_back.png')} style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={getImage('bg_honda3.png')} style={styles.backgroundImage} />

      <LoadingDialog visible={loading} message="Loading profile..." />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.profileCard}>
            <View style={styles.logoContainer}>
              <Image source={getImage('malogo.png')} style={styles.logo} />
            </View>
            <Text style={styles.userName}>{dealerName}</Text>
            <Text style={styles.userEmail}>{email || 'Login via WhatsApp'}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>{dealerCode}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Menu Items */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Settings</Text>
                <MenuItem
                  icon={getImage('ic_profile.png')}
                  title="My Profile"
                  subtitle="Update your personal information"
                  onPress={() => navigation.navigate('EditProfile')}
                />
                <MenuItem
                  icon={getImage('ic_notification.png')}
                  title="Notifications"
                  subtitle="Manage notification preferences"
                  onPress={() => {}}
                />
                <MenuItem
                  icon={getImage('ic_order.png')}
                  title="Order History"
                  subtitle="View all your past orders"
                  onPress={() => navigation.navigate('MainTabs', { screen: 'OrderTab' })}
                />
                <MenuItem
                  icon={getImage('ic_book_knowledge.png')}
                  title="Privacy & Policy"
                  subtitle="Read our terms and policies"
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                />
              </View>

              <TouchableOpacity onPress={handleLogoutPress}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoutButton}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <CustomAlert
        visible={showLogoutConfirm}
        title="Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        type="confirm"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Logout"
        cancelText="Batal"
      />

      <CustomAlert
        visible={showLogoutSuccess}
        title="Berhasil"
        message="Anda telah berhasil logout"
        type="success"
        onConfirm={handleLogoutSuccess}
        confirmText="OK"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerSection: {
    paddingTop: 40,
    paddingBottom: 80,
  },
  profileCard: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  userName: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 16,
  },
  userEmail: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 12,
    textAlign: 'center',
  },
  memberBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 24,
    marginTop: -60,
    minHeight: 600,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.bold,
    color: colors.grayText,
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.grayText,
    transform: [{ rotate: '180deg' }],
  },
  logoutButton: {
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  versionText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ProfileScreen;
