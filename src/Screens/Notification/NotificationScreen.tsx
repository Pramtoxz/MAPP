import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import { notificationService, Notification } from '../../services';
import { LoadingOverlay } from '../Home/components/LoadingOverlay';
import NotificationDetailModal from '../../components/NotificationDetailModal';

type NotificationScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<NotificationScreenNavigationProp>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadNotifications();

    const unsubscribe = navigation.addListener('focus', () => {
      loadNotifications();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await notificationService.getNotifications();
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    } catch {
      // Silent fail
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.is_read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    }

    // Show modal with full content
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleMarkAllRead = async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return getImage('ic_order_white.png');
      case 'announcement':
        return getImage('ic_info_badge.png');
      case 'promotion':
        return getImage('ic_promotion.png');
      default:
        return getImage('ic_notification.png');
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return colors.primary;
      case 'announcement':
        return colors.info;
      case 'promotion':
        return colors.warning;
      default:
        return colors.secondary;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const renderNotification = ({ item }: { item: Notification; index: number }) => (
    <Animated.View style={styles.animatedView}>
      <TouchableOpacity
        style={[styles.notificationCard, !item.is_read && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
          <View style={[styles.iconCircle, { backgroundColor: getNotificationColor(item.type) }]}>
            <Image source={getNotificationIcon(item.type)} style={styles.notificationIcon} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message} numberOfLines={3}>
            {item.message}
          </Text>
          <View style={styles.footerRow}>
            <Image source={getImage('ic_date.png')} style={styles.timeIcon} />
            <Text style={styles.time}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={getImage('nodata.png')} style={styles.emptyImage} />
      <Text style={styles.emptyTitle}>
        {filter === 'unread' ? 'Tidak Ada Notifikasi Belum Dibaca' : 'Tidak Ada Notifikasi'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'unread' 
          ? 'Semua notifikasi sudah dibaca' 
          : 'Notifikasi akan muncul di sini'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
      >
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Belum Dibaca</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{notifications.length - unreadCount}</Text>
            <Text style={styles.statLabel}>Sudah Dibaca</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Semua ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            Belum Dibaca ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image source={getImage('bg_honda3.png')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={getImage('ic_arrow_back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
            <Image source={getImage('ic_step_done.png')} style={styles.markAllIcon} />
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={styles.headerRight} />}
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
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
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
        />
      </View>

      <NotificationDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        notification={selectedNotification}
      />

      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
    marginLeft: 8,
  },
  headerRight: {
    width: 40,
  },
  markAllButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  statsContainer: {
    padding: 16,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fonts.sizes.huge,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.white,
    opacity: 0.3,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.semibold,
    color: colors.grayText,
  },
  filterTextActive: {
    color: colors.primary,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  unreadCard: {
    backgroundColor: colors.backgroundPink,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  message: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    marginBottom: 8,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.grayHint,
    marginRight: 4,
  },
  time: {
    fontSize: fonts.sizes.tiny,
    fontFamily: fonts.regular,
    color: colors.grayHint,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.grayText,
    textAlign: 'center',
  },
  animatedView: {
    opacity: 1,
  },
});

export default NotificationScreen;
