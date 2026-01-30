import React from 'react';
import { View, StyleSheet } from 'react-native';
import PhoneInputForm from './PhoneInputForm';

interface OtpLoginFormProps {
  onRequestOtp: (phone: string) => void;
}

const OtpLoginForm: React.FC<OtpLoginFormProps> = ({ onRequestOtp }) => {
  return (
    <View style={styles.container}>
      <PhoneInputForm onSubmit={onRequestOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OtpLoginForm;
