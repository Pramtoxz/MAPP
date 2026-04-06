import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { pinService } from '../../services/pin';
import CustomAlert from '../../components/CustomAlert';
import LoadingDialog from '../../components/LoadingDialog';

const SetupCollectionPinScreen: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'pin' | 'confirm'>('pin');
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'alert'>('alert');

  const pinInputRefs = useRef<Array<TextInput | null>>([]);
  const confirmInputRefs = useRef<Array<TextInput | null>>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      pinInputRefs.current[0]?.focus();
    }, 300);
  }, []);

  const handlePinChange = (value: string, index: number, isConfirm: boolean) => {
    if (!/^\d*$/.test(value)) return;

    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    currentPin[index] = value;

    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setPin(currentPin);
    }

    if (value && index < 3) {
      const refs = isConfirm ? confirmInputRefs : pinInputRefs;
      refs.current[index + 1]?.focus();
    }

    if (currentPin.every(digit => digit !== '') && index === 3) {
      if (!isConfirm) {
        setStep('confirm');
        setTimeout(() => {
          confirmInputRefs.current[0]?.focus();
        }, 100);
      } else {
        handleSubmit(pin.join(''), currentPin.join(''));
      }
    }
  };

  const handleKeyPress = (e: any, index: number, isConfirm: boolean) => {
    const currentPin = isConfirm ? confirmPin : pin;
    if (e.nativeEvent.key === 'Backspace' && !currentPin[index] && index > 0) {
      const refs = isConfirm ? confirmInputRefs : pinInputRefs;
      refs.current[index - 1]?.focus();
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async (pinValue: string, confirmValue: string) => {
    if (pinValue !== confirmValue) {
      shake();
      setAlertType('alert');
      setAlertMessage('PIN tidak sama. Silakan coba lagi.');
      setAlertVisible(true);
      setConfirmPin(['', '', '', '']);
      setStep('pin');
      setPin(['', '', '', '']);
      setTimeout(() => {
        pinInputRefs.current[0]?.focus();
      }, 100);
      return;
    }

    setLoading(true);
    const result = await pinService.setupPin(pinValue, confirmValue);
    setLoading(false);

    if (result.success) {
      setAlertType('success');
      setAlertMessage('PIN berhasil diatur');
      setAlertVisible(true);
    } else {
      shake();
      setAlertType('alert');
      setAlertMessage(result.message);
      setAlertVisible(true);
      setConfirmPin(['', '', '', '']);
      setStep('pin');
      setPin(['', '', '', '']);
      setTimeout(() => {
        pinInputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      pinService.clearPinStatus();
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <LoadingDialog visible={loading} message="Menyimpan PIN..." />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup PIN Collection</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image source={getImage('ic_password.png')} style={styles.lockIcon} />
        </View>

        <Text style={styles.title}>Buat PIN Keamanan</Text>
        <Text style={styles.subtitle}>
          {step === 'pin' 
            ? 'Buat PIN 4 digit untuk mengamankan data collection' 
            : 'Konfirmasi PIN Anda'}
        </Text>

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step === 'pin' && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === 'confirm' && styles.stepDotActive]} />
        </View>

        <Animated.View
          style={[
            styles.pinContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          {step === 'pin' ? (
            <>
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    pinInputRefs.current[index] = ref;
                  }}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={value => handlePinChange(value, index, false)}
                  onKeyPress={e => handleKeyPress(e, index, false)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  editable={!loading}
                  selectTextOnFocus
                />
              ))}
            </>
          ) : (
            <>
              {confirmPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    confirmInputRefs.current[index] = ref;
                  }}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={value => handlePinChange(value, index, true)}
                  onKeyPress={e => handleKeyPress(e, index, true)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  editable={!loading}
                  selectTextOnFocus
                />
              ))}
            </>
          )}
        </Animated.View>

        {step === 'confirm' && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setStep('pin');
              setConfirmPin(['', '', '', '']);
              setTimeout(() => {
                pinInputRefs.current[0]?.focus();
              }, 100);
            }}
          >
            <Text style={styles.backButtonText}>Ubah PIN</Text>
          </TouchableOpacity>
        )}
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? 'Berhasil' : 'Gagal'}
        message={alertMessage}
        type={alertType}
        onConfirm={handleAlertConfirm}
        confirmText="OK"
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.backgroundLight,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: {
    width: 40,
    height: 40,
    tintColor: colors.primary,
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.regular,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  pinInput: {
    width: 64,
    height: 64,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 16,
    fontSize: 28,
    fontFamily: fonts.bold,
    textAlign: 'center',
    color: colors.black,
    backgroundColor: colors.white,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export default SetupCollectionPinScreen;
