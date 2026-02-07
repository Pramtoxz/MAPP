import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';

interface PhoneInputFormProps {
  onSubmit: (phone: string) => void;
}

const PhoneInputForm: React.FC<PhoneInputFormProps> = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      return;
    }
    if (cleaned.length <= 13) {
      setPhone(cleaned);
    }
  };

  const handleSubmit = () => {
    if (phone.length >= 9) {
      const fullPhone = '62' + phone;
      onSubmit(fullPhone);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nomor HP</Text>
        <View style={styles.inputContainer}>
          <Image
            source={getImage('ic_whatsapp.png')}
            style={styles.inputIcon}
          />
          <Text style={styles.phonePrefix}>+62</Text>
          <TextInput
            style={styles.input}
            placeholder="8xxxxxxxxxx"
            placeholderTextColor={colors.grayHint}
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>
        <Text style={styles.helperText}>
          Masukkan nomor HP yang terdaftar di toko (tanpa 0)
        </Text>
      </View>

      <TouchableOpacity 
        onPress={handleSubmit}
        disabled={phone.length < 9}
      >
        <LinearGradient
          colors={phone.length < 9 
            ? [colors.grayInactive, colors.grayInactive] 
            : [colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>KIRIM OTP</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.grayText,
    marginBottom: 8,
    fontFamily: fonts.semibold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    width: 35,
    height: 35,
    marginRight: 12,
  },
  phonePrefix: {
    fontSize: 15,
    color: colors.black,
    fontWeight: '600',
    marginRight: 4,
    fontFamily: fonts.bold,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    fontFamily: fonts.regular,
  },
  helperText: {
    fontSize: 12,
    color: colors.grayText,
    marginTop: 6,
    fontFamily: fonts.regular,
  },
  submitButton: {
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },
});

export default PhoneInputForm;
