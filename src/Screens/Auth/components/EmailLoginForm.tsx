import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { colors } from '../../../config/colors';
import { getImage } from '../../../assets/images';

interface EmailLoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputContainer}>
          <Image
            source={getImage('ic_username.png')}
            style={styles.inputIcon}
          />
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
          <Image
            source={getImage('ic_password.png')}
            style={styles.inputIcon}
          />
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
            <Image
              source={getImage('ic_visible.png')}
              style={styles.visibilityIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
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
    resizeMode: 'contain',
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

export default EmailLoginForm;
