import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';
import { getImage } from '../assets/images';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'alert' | 'confirm' | 'success';
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'alert',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  const getIcon = () => {
    if (type === 'success') {
      return getImage('ic_followup_done.png');
    }
    return getImage('ic_alert.png');
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      onBackdropPress={type === 'alert' || type === 'success' ? onConfirm : onCancel}
    >
      <View style={styles.container}>
        <View style={[styles.iconContainer, type === 'success' && styles.successIconContainer]}>
          <Image source={getIcon()} style={styles.icon} />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonContainer}>
          {type === 'confirm' && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  successIconContainer: {
    backgroundColor: colors.white,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  confirmButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  cancelButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
});

export default CustomAlert;
