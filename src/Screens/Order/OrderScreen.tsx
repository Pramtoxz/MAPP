import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { useOrderScreen, OrderWithDetails } from './hooks/useOrderScreen';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const OrderScreen: React.FC = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const {
    allOrders,
    loading,
    refreshing,
    handleOrderPress,
    handleRefresh,
    formatPrice,
    formatDate,
    getStatusColor,
  } = useOrderScreen();

  const renderOrderItem = ({ item }: { item: OrderWithDetails }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      <View style={styles.cardContent}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
          <Text style={styles.orderTotal}>{formatPrice(item.grandTotal)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={getImage('es_no_data.webp')} style={styles.emptyImage} />
      <Text style={styles.emptyText}>Belum ada order</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.redCard}>
          <View style={styles.redCardRow}>
            <View style={styles.redCardItem}>
              <Image source={getImage('ic_order_bg_red.png')} style={styles.redCardIcon} />
              <Text style={styles.redCardLabel}>PO Created</Text>
              <Text style={styles.redCardValue}>{allOrders.length}</Text>
            </View>
            <View style={styles.redCardItem}>
              <Image source={getImage('ic_order_bg_black.png')} style={styles.redCardIcon} />
              <Text style={styles.redCardLabel}>SO</Text>
              <Text style={styles.redCardValue}>0</Text>
            </View>
            <View style={styles.redCardItem}>
              <Image source={getImage('ic_order_bg_red.png')} style={styles.redCardIcon} />
              <Text style={styles.redCardLabel}>Packing</Text>
              <Text style={styles.redCardValue}>0</Text>
            </View>
            <View style={styles.redCardItem}>
              <Image source={getImage('ic_order_bg_black.png')} style={styles.redCardIcon} />
              <Text style={styles.redCardLabel}>Delivery</Text>
              <Text style={styles.redCardValue}>0</Text>
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : (
          <FlatList
            data={allOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
  },
  redCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  redCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  redCardItem: {
    flex: 1,
    alignItems: 'center',
  },
  redCardIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  redCardLabel: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  redCardValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 6,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
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
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
});

export default OrderScreen;
