import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';

type TabType = 'outstanding' | 'paid';

interface CollectionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CollectionTabs: React.FC<CollectionTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'outstanding' && styles.tabActive]}
        onPress={() => onTabChange('outstanding')}
      >
        <Text style={[styles.tabText, activeTab === 'outstanding' && styles.tabTextActive]}>
          Outstanding
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'paid' && styles.tabActive]}
        onPress={() => onTabChange('paid')}
      >
        <Text style={[styles.tabText, activeTab === 'paid' && styles.tabTextActive]}>
          Paid
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
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

export default CollectionTabs;
