import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { authService } from '../../services/auth';
import { colors } from '../../config/colors';
import { getImage } from '../../assets/images';
import CustomAlert from '../../components/CustomAlert';
import LoadingDialog from '../../components/LoadingDialog';

const { height } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage('Email dan password harus diisi');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    const result = await authService.login({ email, password });
    setLoading(false);

    if (result.success) {
      navigation.replace('MainTabs');
    } else {
      setAlertMessage(result.message || 'Login gagal');
      setAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image source={getImage('bg_honda.webp')} style={styles.backgroundImage} />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mobile Part{'\n'}Ordering</Text>
        <Text style={styles.headerSubtitle}>
          Salam SATU HATI Silahkan masukan akun untuk{'\n'}mengakses aplikasi
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Image source={getImage('ic_username.png')} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor={colors.grayHint}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Image source={getImage('ic_password.png')} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Type password"
              placeholderTextColor={colors.grayHint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.visibilityButton}
            >
              <Image source={getImage('ic_visible.png')} style={styles.visibilityIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>

      <LoadingDialog visible={loading} message="Memproses login..." />
      <CustomAlert
        visible={alertVisible}
        title="Informasi"
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
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.grayText,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: colors.grayInactive,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },
  visibilityButton: {
    padding: 4,
  },
  visibilityIcon: {
    width: 20,
    height: 20,
    tintColor: colors.grayInactive,
    resizeMode: 'contain'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.grayText,
  },
  loginButton: {
    backgroundColor: colors.primary,
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
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
  },
});

export default LoginScreen;
