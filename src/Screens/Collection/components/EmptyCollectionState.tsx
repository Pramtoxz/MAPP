import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';

interface EmptyCollectionStateProps {
  activeTab: 'outstanding' | 'paid';
}

const EmptyCollectionState: React.FC<EmptyCollectionStateProps> = ({ activeTab }) => {
  const getMessage = () => {
    switch (activeTab) {
      case 'outstanding':
        return 'Tidak ada tagihan outstanding';
      case 'paid':
        return 'Belum ada tagihan yang dibayar';
      default:
        return 'Belum ada tagihan';
    }
  };

  return (
    <View style={styles.container}>
      <Image source={getImage('es_no_data.webp')} style={styles.image} />
      <Text style={styles.message}>{getMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  message: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
});

export default EmptyCollectionState;
