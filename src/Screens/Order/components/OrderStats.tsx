import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statsCard}
    >
      <Text style={styles.statsTitle}>Total Receipt of Process</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Image source={getImage('ic_spring_fill.png')} style={styles.statIcon} />
          </View>
          <Text style={styles.statLabel}>Total Order</Text>
          <Text style={styles.statValue}>{totalOrders}</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Image source={getImage('ic_list.png')} style={styles.statIcon} />
          </View>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>{pendingOrders}</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Image source={getImage('ic_order.png')} style={styles.statIcon} />
          </View>
          <Text style={styles.statLabel}>Back Order</Text>
          <Text style={styles.statValue}>{backOrders}</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.iconCircle}>
            <Image source={getImage('ic_profits.png')} style={styles.statIcon} />
          </View>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedOrders}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  statsTitle: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.white,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  statLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
