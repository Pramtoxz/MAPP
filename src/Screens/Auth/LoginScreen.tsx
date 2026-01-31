import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { authService } from '../../services/auth';
import { colors } from '../../config/colors';
import { getImage } from '../../assets/images';
import CustomAlert from '../../components/CustomAlert';
import LoadingDialog from '../../components/LoadingDialog';
import TabSwitcher from './components/TabSwitcher';
import EmailLoginForm from './components/EmailLoginForm';
import OtpLoginForm from './components/OtpLoginForm';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [activeTab, setActiveTab] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleEmailLogin = async (email: string, password: string) => {
    if (!email || !password) {
      showAlert('Form Tidak Lengkap', 'Email dan password harus diisi');
      return;
    }

    setLoading(true);
    const result = await authService.login({ email, password });
    setLoading(false);

    if (result.success) {
      navigation.replace('MainTabs');
    } else {
      showAlert(
        'Email atau Password Salah',
        result.message || 'Coba ingat-ingat lagi, jangan pake perasaan ya!'
      );
    }
  };

  const handleRequestOtp = async (phone: string) => {
    if (!phone) {
      showAlert('Form Tidak Lengkap', 'Nomor HP harus diisi');
      return;
    }

    setLoading(true);
    const result = await authService.requestOtp(phone);
    setLoading(false);

    if (result.success) {
      navigation.navigate('OtpVerify', { phone });
    } else {
      showAlert(
        'Gagal Mengirim OTP',
        result.message || 'Nomor HP tidak terdaftar'
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={getImage('bg_honda.webp')}
        style={styles.backgroundImage}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mobile Part{'\n'}Ordering</Text>
        <Text style={styles.headerSubtitle}>
          Salam SATU HATI Silahkan masukan akun untuk{'\n'}mengakses aplikasi
        </Text>
      </View>

      <View style={styles.formCard}>
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.formContent}>
          {activeTab === 'email' ? (
            <EmailLoginForm onLogin={handleEmailLogin} />
          ) : (
            <OtpLoginForm onRequestOtp={handleRequestOtp} />
          )}
        </View>
      </View>

      <LoadingDialog visible={loading} message="Gass Keeeuun..." />
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
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
    height: '100%',
    resizeMode: 'cover',
  },
  headerContainer: {
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
    lineHeight: 48,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 32,
  },
});

export default LoginScreen;
