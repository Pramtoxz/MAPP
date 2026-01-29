import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';

interface LoadingDialogProps {
  visible: boolean;
  message?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  visible,
  message = 'Loading...',
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/rocket.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.message}>{message}</Text>
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
  lottie: {
    width: 250,
    height: 250,
  },
  message: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginTop: 32,
    textAlign: 'center',
  },
});

export default LoadingDialog;
