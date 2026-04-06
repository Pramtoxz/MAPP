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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { authService } from '../../services/auth';
import { pinService } from '../../services/pin';
import { apiService } from '../../services/api';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import CustomAlert from '../../components/CustomAlert';
import LoadingDialog from '../../components/LoadingDialog';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [npwp, setNpwp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirmation, setNewPinConfirmation] = useState('');
  
  const [dealerCode, setDealerCode] = useState('');
  const [salesName, setSalesName] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'alert'>('success');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const profile = await authService.refreshProfile();
    if (profile) {
      setEmail(profile.email || '');
      const displayPhone = profile.phone?.startsWith('628') 
        ? '0' + profile.phone.substring(2) 
        : profile.phone || '';
      setPhone(displayPhone);
      setAddress(profile.address || '');
      setNpwp(profile.npwp || '');
      setDealerCode(profile.dealerCode);
      setSalesName(profile.salesName || '');
    }
    setLoading(false);
  };

  const formatPhoneNumber = (text: string): string => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('62')) {
      cleaned = '0' + cleaned.substring(2);
    }
    if (cleaned.length > 13) {
      cleaned = cleaned.substring(0, 13);
    }
    return cleaned;
  };

  const convertPhoneToBackendFormat = (displayPhone: string): string => {
    if (displayPhone.startsWith('0')) {
      return '62' + displayPhone.substring(1);
    }
    return displayPhone;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (phone && !phone.startsWith('08')) {
      newErrors.phone = 'Nomor HP harus dimulai dengan 08';
    }
    
    if (phone && phone.length < 10) {
      newErrors.phone = 'Nomor HP minimal 10 digit';
    }
    
    if (password && password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (password && password !== passwordConfirmation) {
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
    }
    
    if (oldPin || newPin || newPinConfirmation) {
      if (!oldPin) {
        newErrors.old_pin = 'PIN lama harus diisi';
      } else if (oldPin.length !== 4) {
        newErrors.old_pin = 'PIN harus 4 digit';
      }
      
      if (!newPin) {
        newErrors.new_pin = 'PIN baru harus diisi';
      } else if (newPin.length !== 4) {
        newErrors.new_pin = 'PIN harus 4 digit';
      }
      
      if (newPin && newPin !== newPinConfirmation) {
        newErrors.new_pin_confirmation = 'Konfirmasi PIN tidak cocok';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});

    let pinChanged = false;
    if (oldPin && newPin && newPinConfirmation) {
      const pinResult = await pinService.changePin(oldPin, newPin, newPinConfirmation);
      if (!pinResult.success) {
        setSaving(false);
        setAlertType('alert');
        setAlertMessage(pinResult.message);
        setAlertVisible(true);
        return;
      }
      apiService.setPinForRequest(newPin);
      pinChanged = true;
    }

    const updateData: any = {};
    
    if (email) updateData.email = email;
    if (phone) updateData.phone = convertPhoneToBackendFormat(phone);
    if (address) updateData.address = address;
    if (npwp) updateData.npwp = npwp;
    if (password) {
      updateData.password = password;
      updateData.password_confirmation = passwordConfirmation;
    }

    if (Object.keys(updateData).length > 0) {
      const result = await authService.updateProfile(updateData);
      setSaving(false);

      if (result.success) {
        setAlertType('success');
        setAlertMessage(pinChanged ? 'PIN dan profil berhasil diupdate' : result.message || 'Profil berhasil diupdate');
        setAlertVisible(true);
      } else {
        if (result.errors) {
          const formattedErrors: { [key: string]: string } = {};
          Object.keys(result.errors).forEach(key => {
            formattedErrors[key] = result.errors![key][0];
          });
          setErrors(formattedErrors);
        }
        setAlertType('alert');
        setAlertMessage(result.message || 'Gagal mengupdate profil');
        setAlertVisible(true);
      }
    } else {
      setSaving(false);
      if (pinChanged) {
        setAlertType('success');
        setAlertMessage('PIN berhasil diubah');
        setAlertVisible(true);
      }
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <LoadingDialog visible={loading} message="Loading profile..." />
      
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image source={getImage('ic_arrow_back.png')} style={styles.backIco} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kode Dealer</Text>
              <Text style={styles.infoValue}>{dealerCode}</Text>
            </View>
            {salesName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nama Sales</Text>
                <Text style={styles.infoValue}>{salesName}</Text>
              </View>
            )}
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="email@example.com"
            placeholderTextColor={colors.grayHint}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={styles.label}>Nomor HP</Text>
          <View style={styles.phoneRow}>
            <View style={styles.phonePrefix}>
              <Text style={styles.phonePrefixText}>+62</Text>
            </View>
            <TextInput
              style={[styles.phoneInput, errors.phone && styles.inputError]}
              placeholder="8123456789"
              placeholderTextColor={colors.grayHint}
              value={phone.startsWith('0') ? phone.substring(1) : phone}
              onChangeText={(text) => handlePhoneChange('0' + text)}
              keyboardType="phone-pad"
              maxLength={12}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Masukkan alamat lengkap"
            placeholderTextColor={colors.grayHint}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>NPWP</Text>
          <TextInput
            style={styles.input}
            placeholder="12.345.678.9-012.000"
            placeholderTextColor={colors.grayHint}
            value={npwp}
            onChangeText={setNpwp}
            maxLength={20}
          />

          <Text style={styles.label}>Password Baru <Text style={styles.optional}>(opsional)</Text></Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={[styles.passwordInput, errors.password && styles.inputError]}
              placeholder="Minimal 6 karakter"
              placeholderTextColor={colors.grayHint}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Image source={getImage('ic_visible.png')} style={[styles.eyeIcon, !showPassword && styles.eyeIconHidden]} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {password.length > 0 && (
            <>
              <Text style={styles.label}>Konfirmasi Password</Text>
              <View style={styles.passwordBox}>
                <TextInput
                  style={[styles.passwordInput, errors.password_confirmation && styles.inputError]}
                  placeholder="Ulangi password baru"
                  placeholderTextColor={colors.grayHint}
                  value={passwordConfirmation}
                  onChangeText={(text) => {
                    setPasswordConfirmation(text);
                    if (errors.password_confirmation) setErrors(prev => ({ ...prev, password_confirmation: '' }));
                  }}
                  secureTextEntry={!showPasswordConfirm}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                  <Image source={getImage('ic_visible.png')} style={[styles.eyeIcon, !showPasswordConfirm && styles.eyeIconHidden]} />
                </TouchableOpacity>
              </View>
              {errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation}</Text>}
            </>
          )}

          <Text style={styles.label}>PIN Lama <Text style={styles.optional}>(opsional)</Text></Text>
          <TextInput
            style={[styles.input, errors.old_pin && styles.inputError]}
            placeholder="Masukkan PIN lama 4 digit"
            placeholderTextColor={colors.grayHint}
            value={oldPin}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) && text.length <= 4) {
                setOldPin(text);
                if (errors.old_pin) setErrors(prev => ({ ...prev, old_pin: '' }));
              }
            }}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
          {errors.old_pin && <Text style={styles.errorText}>{errors.old_pin}</Text>}

          {oldPin.length > 0 && (
            <>
              <Text style={styles.label}>PIN Baru</Text>
              <TextInput
                style={[styles.input, errors.new_pin && styles.inputError]}
                placeholder="Masukkan PIN baru 4 digit"
                placeholderTextColor={colors.grayHint}
                value={newPin}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text) && text.length <= 4) {
                    setNewPin(text);
                    if (errors.new_pin) setErrors(prev => ({ ...prev, new_pin: '' }));
                  }
                }}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
              {errors.new_pin && <Text style={styles.errorText}>{errors.new_pin}</Text>}

              <Text style={styles.label}>Konfirmasi PIN Baru</Text>
              <TextInput
                style={[styles.input, errors.new_pin_confirmation && styles.inputError]}
                placeholder="Ulangi PIN baru"
                placeholderTextColor={colors.grayHint}
                value={newPinConfirmation}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text) && text.length <= 4) {
                    setNewPinConfirmation(text);
                    if (errors.new_pin_confirmation) setErrors(prev => ({ ...prev, new_pin_confirmation: '' }));
                  }
                }}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
              {errors.new_pin_confirmation && <Text style={styles.errorText}>{errors.new_pin_confirmation}</Text>}
            </>
          )}

          <TouchableOpacity 
            onPress={handleSave}
            disabled={saving}
          >
            <LinearGradient
              colors={saving 
                ? [colors.grayInactive, colors.grayInactive] 
                : [colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertType === 'success' ? 'Berhasil' : 'Gagal'}
        message={alertMessage}
        type={alertType}
        onConfirm={handleAlertConfirm}
        confirmText="OK"
      />
    </View>
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
  backIco: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.grayText,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 6,
    marginTop: 10,
  },
  optional: {
    fontSize: 11,
    color: colors.grayHint,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.black,
  },
  inputError: {
    borderColor: colors.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  phoneRow: {
    flexDirection: 'row',
  },
  phonePrefix: {
    backgroundColor: colors.backgroundGray,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 8,
  },
  phonePrefixText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.black,
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.black,
  },
  eyeButton: {
    padding: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
  },
  eyeIconHidden: {
    opacity: 0.3,
  },
  errorText: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 4,
  },
  saveButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default EditProfileScreen;
