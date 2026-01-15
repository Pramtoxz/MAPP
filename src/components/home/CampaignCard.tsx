import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';

interface CampaignCardProps {
  title: string;
  description: string;
  badge: string;
  image?: string;
  onPress: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ title, description, badge, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image 
        source={{ uri: image || 'https://hondampspandeglang.com/wp-content/uploads/2021/09/banner-program-sales-genio-1-02082021-094721.png' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#8B7355',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 8,
  },
  description: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
});

export default CampaignCard;
