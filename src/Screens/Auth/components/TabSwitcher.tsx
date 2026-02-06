import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../../../config/colors';

const { width } = Dimensions.get('window');

interface TabSwitcherProps {
  activeTab: 'email' | 'otp';
  onTabChange: (tab: 'email' | 'otp') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  const slideAnim = useRef(new Animated.Value(activeTab === 'email' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeTab === 'email' ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [activeTab]);

  const tabIndicatorTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 64) / 2],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('email')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>
          Email Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('otp')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'otp' && styles.tabTextActive]}>
          OTP Login
        </Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.tabIndicator,
          { transform: [{ translateX: tabIndicatorTranslate }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 32,
    marginBottom: 24,
    backgroundColor: colors.backgroundGray,
    borderRadius: 16,
    padding: 4,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grayText,
  },
  tabTextActive: {
    color: colors.white,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: (width - 64 - 8) / 2,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    zIndex: 1,
  },
});

export default TabSwitcher;
