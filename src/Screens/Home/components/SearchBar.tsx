import React from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getImage } from '../../../assets/images';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';

interface SearchBarProps {
  searchQuery: string;
  hasActiveFilters: boolean;
  onSearchChange: (text: string) => void;
  onSearchSubmit: () => void;
  onClearSearch: () => void;
  onFilterPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  hasActiveFilters,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  onFilterPress,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Image source={getImage('ic_search.png')} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Parts Number / Parts Name"
        placeholderTextColor="#000"
        value={searchQuery}
        onChangeText={onSearchChange}
        onSubmitEditing={onSearchSubmit}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearSearch}>
          <Image source={getImage('ic_close_rounded.png')} style={styles.clearIcon} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Image source={getImage('ic_filter.png')} style={styles.filterIcon} />
        {hasActiveFilters && <View style={styles.filterBadge} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.grayText,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  clearIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
