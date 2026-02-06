import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';

interface BackOrderNoticeProps {
  message?: string;
}

export const BackOrderNotice: React.FC<BackOrderNoticeProps> = ({ 
  message = 'Barang sedang dalam proses pengiriman. Silahkan hubungi sales untuk informasi lebih lanjut.'
}) => {
  return (
    <View style={styles.noticeSection}>
      <Image source={getImage('ic_info_badge.png')} style={styles.noticeIcon} />
      <Text style={styles.noticeText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeSection: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundWarning,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  noticeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.textWarning,
  },
});
