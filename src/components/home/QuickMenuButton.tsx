import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';

interface QuickMenuButtonProps {
  icon: ImageSourcePropType;
  label: string;
  badge?: number;
  onPress: () => void;
}

const QuickMenuButton: React.FC<QuickMenuButtonProps> = ({ icon, label, badge, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.black,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  label: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
});

export default QuickMenuButton;
