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

const ChangePinScreen: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'old' | 'new' | 'confirm'>('old');
  const [oldPin, setOldPin] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'alert'>('alert');

  const oldPinRefs = useRef<Array<TextInput | null>>([]);
  const newPinRefs = useRef<Array<TextInput | null>>([]);
  const confirmPinRefs = useRef<Array<TextInput | null>>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      oldPinRefs.current[0]?.focus();
    }, 300);
  }, []);

  const handlePinChange = (value: string, index: number, type: 'old' | 'new' | 'confirm') => {
    if (!/^\d*$/.test(value)) return;

    let currentPin, setCurrentPin, refs;
    
    if (type === 'old') {
      currentPin = [...oldPin];
      setCurrentPin = setOldPin;
      refs = oldPinRefs;
    } else if (type === 'new') {
      currentPin = [...newPin];
      setCurrentPin = setNewPin;
      refs = newPinRefs;
    } else {
      currentPin = [...confirmPin];
      setCurrentPin = setConfirmPin;
      refs = confirmPinRefs;
    }

    currentPin[index] = value;
    setCurrentPin(currentPin);

    if (value && index < 3) {
      refs.current[index + 1]?.focus();
    }

    if (currentPin.every(digit => digit !== '') && index === 3) {
      if (type === 'old') {
        setStep('new');
        setTimeout(() => {
          newPinRefs.current[0]?.focus();
        }, 100);
      } else if (type === 'new') {
        setStep('confirm');
        setTimeout(() => {
          confirmPinRefs.current[0]?.focus();
        }, 100);
      } else {
        handleSubmit(oldPin.join(''), newPin.join(''), currentPin.join(''));
      }
    }
  };

  const handleKeyPress = (e: any, index: number, type: 'old' | 'new' | 'confirm') => {
    const currentPin = type === 'old' ? oldPin : type === 'new' ? newPin : confirmPin;
    const refs = type === 'old' ? oldPinRefs : type === 'new' ? newPinRefs : confirmPinRefs;
    
    if (e.nativeEvent.key === 'Backspace' && !currentPin[index] && index > 0) {
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

  const handleSubmit = async (oldPinValue: string, newPinValue: string, confirmValue: string) => {
    if (newPinValue !== confirmValue) {
      shake();
      setAlertType('alert');
      setAlertMessage('PIN baru tidak sama. Silakan coba lagi.');
      setAlertVisible(true);
      setConfirmPin(['', '', '', '']);
      setStep('new');
      setNewPin(['', '', '', '']);
      setTimeout(() => {
        newPinRefs.current[0]?.focus();
      }, 100);
      return;
    }

    setLoading(true);
    const result = await pinService.changePin(oldPinValue, newPinValue, confirmValue);
    setLoading(false);

    if (result.success) {
      setAlertType('success');
      setAlertMessage('PIN berhasil diubah');
      setAlertVisible(true);
    } else {
      shake();
      setAlertType('alert');
      setAlertMessage(result.message);
      setAlertVisible(true);
      setConfirmPin(['', '', '', '']);
      setStep('old');
      setOldPin(['', '', '', '']);
      setNewPin(['', '', '', '']);
      setTimeout(() => {
        oldPinRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      navigation.goBack();
    }
  };

  const getStepTitle = () => {
    if (step === 'old') return 'Masukkan PIN Lama';
    if (step === 'new') return 'Masukkan PIN Baru';
    return 'Konfirmasi PIN Baru';
  };

  const getStepSubtitle = () => {
    if (step === 'old') return 'Masukkan PIN lama Anda';
    if (step === 'new') return 'Buat PIN baru 4 digit';
    return 'Konfirmasi PIN baru Anda';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <LoadingDialog visible={loading} message="Mengubah PIN..." />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah PIN</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image source={getImage('ic_password.png')} style={styles.lockIcon} />
        </View>

        <Text style={styles.title}>{getStepTitle()}</Text>
        <Text style={styles.subtitle}>{getStepSubtitle()}</Text>

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step === 'old' && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === 'new' && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === 'confirm' && styles.stepDotActive]} />
        </View>

        <Animated.View
          style={[
            styles.pinContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          {step === 'old' && (
            <>
              {oldPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    oldPinRefs.current[index] = ref;
                  }}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={value => handlePinChange(value, index, 'old')}
                  onKeyPress={e => handleKeyPress(e, index, 'old')}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  editable={!loading}
                  selectTextOnFocus
                />
              ))}
            </>
          )}
          {step === 'new' && (
            <>
              {newPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    newPinRefs.current[index] = ref;
                  }}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={value => handlePinChange(value, index, 'new')}
                  onKeyPress={e => handleKeyPress(e, index, 'new')}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  editable={!loading}
                  selectTextOnFocus
                />
              ))}
            </>
          )}
          {step === 'confirm' && (
            <>
              {confirmPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    confirmPinRefs.current[index] = ref;
                  }}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={value => handlePinChange(value, index, 'confirm')}
                  onKeyPress={e => handleKeyPress(e, index, 'confirm')}
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

        {step !== 'old' && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step === 'new') {
                setStep('old');
                setNewPin(['', '', '', '']);
                setTimeout(() => {
                  oldPinRefs.current[0]?.focus();
                }, 100);
              } else {
                setStep('new');
                setConfirmPin(['', '', '', '']);
                setTimeout(() => {
                  newPinRefs.current[0]?.focus();
                }, 100);
              }
            }}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
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

export default ChangePinScreen;
