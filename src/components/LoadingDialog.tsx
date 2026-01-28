import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
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
  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <View style={styles.container}>
        <LottieView
          source={require('../assets/lottie/rocket.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  message: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoadingDialog;
