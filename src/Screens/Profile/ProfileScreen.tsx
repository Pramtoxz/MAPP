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
import { StackNavigationProp } from '@react-navigation/stack';
import { authService } from '../../services/auth';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import CustomAlert from '../../components/CustomAlert';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [userName, setUserName] = useState('Demo User');
  const [userEmail, setUserEmail] = useState('demo@example.com');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getUserData();
      if (userData) {
        setUserName(userData.name);
        setUserEmail(userData.email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
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
    navigation.replace('Login');
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

  const StatBox = ({ value, label, icon }: any) => (
    <View style={styles.statBox}>
      <Image source={icon} style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
          </TouchableOpacity>

          <View style={styles.profileCard}>
            <View style={styles.logoContainer}>
              <Image source={getImage('logomd.png')} style={styles.logo} />
            </View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Premium Member</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* <View style={styles.statsRow}>
            <StatBox
              value="24"
              label="Orders"
              icon={getImage('ic_order.png')}
            />
            <StatBox
              value="12"
              label="Pending"
              icon={getImage('ic_warning.png')}
            />
            <StatBox
              value="156"
              label="Completed"
              icon={getImage('ic_check.png')}
            />
          </View> */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <MenuItem
              icon={getImage('ic_profile.png')}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => {}}
            />
            <MenuItem
              icon={getImage('ic_order.png')}
              title="Order History"
              subtitle="View all your past orders"
              onPress={() => {}}
            />
            <MenuItem
              icon={getImage('ic_notification.png')}
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => {}}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <MenuItem
              icon={getImage('ic_info_b.png')}
              title="Help Center"
              subtitle="Get help and support"
              onPress={() => {}}
            />
            <MenuItem
              icon={getImage('ic_book_knowledge.png')}
              title="Terms & Conditions"
              subtitle="Read our terms and policies"
              onPress={() => {}}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            {/* <Image source={getImage('ic_arrow_back.png')} style={styles.logoutIcon} /> */}
            <Text style={styles.logoutButtonText}>Logout</Text>
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
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  profileCard: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
  userName: {
    fontSize: fonts.sizes.huge + 4,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userEmail: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
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
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: colors.primary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayText,
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
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
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
    flexDirection: 'row',
    backgroundColor: colors.primary,
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
  logoutIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
    marginRight: 8,
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
    marginBottom: 32,
  },
});

export default ProfileScreen;
