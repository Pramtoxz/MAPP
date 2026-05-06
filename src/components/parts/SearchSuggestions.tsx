import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Part } from '../../services';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';

interface SearchSuggestionsProps {
  suggestions: Part[];
  loading: boolean;
  onSelect: (part: Part) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  loading,
  onSelect,
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Mencari...</Text>
        </View>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hasil Pencarian</Text>
        <Text style={styles.countText}>{suggestions.length} item</Text>
      </View>
      <ScrollView 
        style={styles.list}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {suggestions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.suggestionItem}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.suggestionImage}
                resizeMode="contain"
              />
              {item.isDiscontinued ? (
                <View style={styles.discontinuedBadge}>
                  <Text style={styles.discontinuedText}>DISCONTINUED</Text>
                </View>
              ) : item.isReady === false ? (
                <View style={styles.outOfStockBadge}>
                  <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.suggestionInfo}>
              <Text style={styles.partNumber}>{item.partNumber}</Text>
              <Text style={styles.partName} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF5F6',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E8',
  },
  headerText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  countText: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.primary,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  list: {
    maxHeight: 350,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  suggestionImage: {
    width: 60,
    height: 60,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(230, 27, 51, 0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  outOfStockText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  discontinuedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  discontinuedText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  suggestionInfo: {
    flex: 1,
  },
  partNumber: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 4,
  },
  partName: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 28,
    color: colors.grayHint,
    marginLeft: 8,
  },
});

export default SearchSuggestions;
