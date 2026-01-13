import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import CustomAlert from '../CustomAlert';

interface QuantityModalProps {
  visible: boolean;
  onClose: () => void;
  product: {
    partNumber: string;
    name: string;
    price: number;
    isReady: boolean;
  } | null;
  onConfirm: (quantity: number) => void;
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  visible,
  onClose,
  product,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState('1');
  const [showAlert, setShowAlert] = useState(false);

  if (!product) return null;

  const handleMinus = () => {
    const currentQty = parseInt(quantity) || 1;
    if (currentQty > 1) {
      setQuantity((currentQty - 1).toString());
    }
  };

  const handlePlus = () => {
    const currentQty = parseInt(quantity) || 0;
    setQuantity((currentQty + 1).toString());
  };

  const handleQuantityChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setQuantity(numericValue);
  };

  const handleConfirm = () => {
    if (!product.isReady) {
      setShowAlert(true);
      return;
    }
    const finalQty = parseInt(quantity) || 1;
    onConfirm(finalQty);
    setQuantity('1');
    onClose();
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.partNumber}>{product.partNumber}</Text>
            <Text style={styles.name}>{product.name}</Text>

            <View style={[styles.statusBadge, product.isReady ? styles.statusReady : styles.statusNotReady]}>
              <Text style={styles.statusText}>{product.isReady ? 'Ready' : 'Not Ready'}</Text>
            </View>

            <View style={styles.quantityRow}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity style={styles.minusButton} onPress={handleMinus}>
                  <Image source={getImage('ic_min_en.png')} style={styles.controlIcon} />
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  maxLength={6}
                  selectTextOnFocus
                />
                <TouchableOpacity style={styles.plusButton} onPress={handlePlus}>
                  <Image source={getImage('ic_plus_en.png')} style={styles.controlIcon} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.confirmButton, !product.isReady && styles.confirmButtonDisabled]} 
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CustomAlert
        visible={showAlert}
        title="Stock Tidak Tersedia"
        message="Maaf, stock sedang tidak tersedia untuk produk ini."
        type="alert"
        onConfirm={() => setShowAlert(false)}
        confirmText="OK"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: 24,
  },
  partNumber: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 4,
  },
  name: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 24,
  },
  statusReady: {
    backgroundColor: '#4CAF50',
  },
  statusNotReady: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  minusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  quantityInput: {
    fontSize: fonts.sizes.huge,
    fontFamily: fonts.bold,
    color: colors.black,
    minWidth: 80,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.grayInactive,
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});

export default QuantityModal;
