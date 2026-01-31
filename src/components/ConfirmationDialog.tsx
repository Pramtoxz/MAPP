import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';
import { getImage } from '../assets/images';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'info' | 'danger';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Ya',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return '#FF5252';
      case 'info':
        return '#2196F3';
      case 'warning':
      default:
        return '#FFC107';
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'danger':
        return 'ic_warning.png';
      case 'info':
        return 'ic_info_b.png';
      case 'warning':
      default:
        return 'ic_warning_yellow.png';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
            <Image 
              source={getImage(getIconName())} 
              style={styles.icon} 
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: getIconColor() }]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.grayBorder,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  cancelButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default ConfirmationDialog;
