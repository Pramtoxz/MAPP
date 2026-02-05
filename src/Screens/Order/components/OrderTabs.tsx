import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';

type TabType = 'all' | 'pending' | 'back_order' | 'completed';

interface OrderTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.tabActive]}
        onPress={() => onTabChange('all')}
      >
        <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
          Semua
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
        onPress={() => onTabChange('pending')}
      >
        <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
          Pending
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'back_order' && styles.tabActive]}
        onPress={() => onTabChange('back_order')}
      >
        <Text style={[styles.tabText, activeTab === 'back_order' && styles.tabTextActive]}>
          Back Order
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
        onPress={() => onTabChange('completed')}
      >
        <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
          Selesai
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  tabTextActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
