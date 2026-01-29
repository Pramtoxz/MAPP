import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  onComplete: () => void;
  duration?: number; // Duration in ms before auto redirect
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  message,
  onComplete,
  duration = 2500, // Default 2.5 seconds
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, onComplete, duration]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LottieView
          source={require('../assets/lottie/success.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  lottie: {
    width: 280,
    height: 280,
    marginBottom: 32,
  },
  title: {
    fontSize: fonts.sizes.huge,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.regular,
    color: colors.grayText,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SuccessModal;
