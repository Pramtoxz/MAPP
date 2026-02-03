import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../../../config/colors';

export const LoadingOverlay: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/lottie/rocket2.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>Sedang Menyiapkan</Text>
      <Text style={styles.subtitle}>Mohon Tunggu Sebentar, Ga Bakal Lama Kok...</Text>
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
    width: 500,
    height: 300,
  },
  title: {
    marginTop: 32,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.grayText,
  },
});
