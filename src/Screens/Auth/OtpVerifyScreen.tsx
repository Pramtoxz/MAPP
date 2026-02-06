import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { authService } from '../../services/auth';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import CustomAlert from '../../components/CustomAlert';
import LoadingDialog from '../../components/LoadingDialog';

type OtpVerifyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OtpVerify'>;
type OtpVerifyScreenRouteProp = RouteProp<RootStackParamList, 'OtpVerify'>;

const OtpVerifyScreen: React.FC = () => {
  const navigation = useNavigation<OtpVerifyScreenNavigationProp>();
  const route = useRoute<OtpVerifyScreenRouteProp>();
  const { phone } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(300); // 5 menit
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const boxAnimations = useRef(
    Array(6).fill(0).map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    Animated.sequence([
      Animated.timing(boxAnimations[index], {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(boxAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const otpCode = [...newOtp.slice(0, 5), value].join('');
      if (otpCode.length === 6) {
        setTimeout(() => handleVerifyOtp(otpCode), 200);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== 6) {
      showAlert('Form Tidak Lengkap', 'Masukkan kode OTP 6 digit');
      return;
    }

    setLoading(true);
    const result = await authService.verifyOtp(phone, code);
    setLoading(false);

    if (result.success) {
      navigation.replace('MainTabs');
    } else {
      showAlert(
        'Verifikasi Gagal',
        result.message || 'Kode OTP tidak valid atau sudah kadaluarsa'
      );
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const result = await authService.requestOtp(phone);
    setLoading(false);

    if (result.success) {
      setOtp(['', '', '', '', '', '']);
      setCountdown(300);
      showAlert('OTP Terkirim', 'Kode OTP baru telah dikirim ke WhatsApp Anda');
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } else {
      showAlert('Gagal Mengirim OTP', result.message || 'Terjadi kesalahan');
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhone = (phoneNumber: string) => {
    if (phoneNumber.startsWith('62')) {
      const number = phoneNumber.substring(2);
      return `+62 ${number}`;
    }
    return phoneNumber;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={getImage('bg_honda3.png')}
        style={styles.backgroundImage}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Image source={getImage('ic_whatsapp.png')} style={styles.waIcon} />
          </View>
          <Text style={styles.title}>OTP WhatsApp Terkirim</Text>
          <Text style={styles.subtitle}>
            Kami telah mengirimkan kode 6 digit ke
          </Text>
          <Text style={styles.phoneNumber}>{formatPhone(phone)}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.otpContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {otp.map((digit, index) => (
            <Animated.View
              key={index}
              style={[
                styles.otpBoxWrapper,
                { transform: [{ scale: boxAnimations[index] }] },
              ]}
            >
              <View style={[styles.otpBox, digit && styles.otpBoxFilled]}>
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {countdown > 0 && (
            <Text style={styles.countdownText}>
              Kode berlaku selama {formatCountdown(countdown)}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (loading || otp.join('').length < 6) && styles.verifyButtonDisabled,
            ]}
            onPress={() => handleVerifyOtp()}
            disabled={loading || otp.join('').length < 6}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Memverifikasi...' : 'Verifikasi Sekarang'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            {countdown === 0 ? (
              <>
                <Text style={styles.resendText}>Tidak menerima kode? </Text>
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendLink}>Kirim Ulang</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.changeNumberText}>Ganti Nomor HP</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>

      <LoadingDialog visible={loading} message="Memproses..." />
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
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
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  waIcon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  otpBoxWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  otpBox: {
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderWidth: 3,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primary,
    textAlign: 'center',
    padding: 0,
  },
  actionContainer: {
    flex: 1,
  },
  countdownText: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: fonts.semibold,
  },
  verifyButton: {
    backgroundColor: colors.white,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 15,
    color: colors.white,
    fontFamily: fonts.regular,
  },
  resendLink: {
    fontSize: 15,
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
    textDecorationLine: 'underline',
  },
  changeNumberText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    textDecorationLine: 'underline',
  },
});

export default OtpVerifyScreen;
