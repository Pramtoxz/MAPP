import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../config/colors';
import { fonts } from '../../../config/fonts';
import { getImage } from '../../../assets/images';
import { OrderWithDetails } from '../hooks/useOrderScreen';

interface OrderStatsProps {
  orders: OrderWithDetails[];
}

export const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Waiting For Approval').length;
  const backOrders = orders.filter(o => o.hasBackOrder).length;
  const completedOrders = orders.filter(o => o.fulfillment?.isCompleted).length;

  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Total Receipt of Process</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Image source={getImage('ic_spring_fill.png')} style={styles.statIcon} />
          <Text style={styles.statLabel}>Total Order</Text>
          <Text style={styles.statValue}>{totalOrders}</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={getImage('ic_list.png')} style={styles.statIcon} />
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>{pendingOrders}</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={getImage('ic_order.png')} style={styles.statIcon} />
          <Text style={styles.statLabel}>Back Order</Text>
          <Text style={styles.statValue}>{backOrders}</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={getImage('ic_profits.png')} style={styles.statIcon} />
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedOrders}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: 2,
  },
  statValue: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
