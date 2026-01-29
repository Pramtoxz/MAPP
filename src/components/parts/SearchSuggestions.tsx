import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Part } from '../../services';
import { colors } from '../../config/colors';

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
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => onSelect(item)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.suggestionImage}
              resizeMode="contain"
            />
            <View style={styles.suggestionInfo}>
              <Text style={styles.partNumber}>{item.partNumber}</Text>
              <Text style={styles.partName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.grayText,
  },
  list: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  suggestionImage: {
    width: 50,
    height: 50,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  suggestionInfo: {
    flex: 1,
  },
  partNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  partName: {
    fontSize: 12,
    color: colors.grayText,
  },
});

export default SearchSuggestions;
