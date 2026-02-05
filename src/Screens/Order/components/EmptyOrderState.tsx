import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';

type TabType = 'all' | 'pending' | 'back_order' | 'completed';

interface EmptyOrderStateProps {
  activeTab: TabType;
}

export const EmptyOrderState: React.FC<EmptyOrderStateProps> = ({ activeTab }) => {
  const getMessage = () => {
    switch (activeTab) {
      case 'pending':
        return 'Tidak ada order yang menunggu approval';
      case 'back_order':
        return 'Tidak ada back order';
      case 'completed':
        return 'Tidak ada order yang sudah selesai';
      default:
        return 'Belum ada order';
    }
  };

  return (
    <View style={styles.emptyContainer}>
      <Image source={getImage('es_no_data.webp')} style={styles.emptyImage} />
      <Text style={styles.emptyText}>{getMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
});
