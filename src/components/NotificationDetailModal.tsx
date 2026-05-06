import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';
import { getImage } from '../assets/images';
import { analyticsService } from '../services/analytics';

interface NotificationDetailModalProps {
  visible: boolean;
  onClose: () => void;
  notification: {
    title: string;
    message: string;
    created_at: string;
    type: string;
  } | null;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  visible,
  onClose,
  notification,
}) => {
  const openTimeRef = useRef<number>(0);

  useEffect(() => {
    if (visible && notification) {
      openTimeRef.current = Date.now();
      analyticsService.logModalOpen('notification_detail', 'notification_list');
      analyticsService.logNotificationOpened(
        notification.created_at,
        notification.type
      );
    }
  }, [visible, notification]);

  const handleClose = () => {
    const duration = Date.now() - openTimeRef.current;
    analyticsService.logModalClose('notification_detail', duration);
    onClose();
  };

  if (!notification) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Image source={getImage('ic_close_rounded.png')} style={styles.closeIcon} />
          </TouchableOpacity>

          <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) }]}>
            <Image source={getNotificationIcon(notification.type)} style={styles.icon} />
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{notification.title}</Text>
            
            <View style={styles.dateContainer}>
              <Image source={getImage('ic_date.png')} style={styles.dateIcon} />
              <Text style={styles.date}>{formatDate(notification.created_at)}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.message}>{notification.message}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.grayText,
    marginRight: 6,
  },
  date: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.regular,
    color: colors.grayText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 16,
  },
  message: {
    fontSize: fonts.sizes.default,
    fontFamily: fonts.regular,
    color: colors.black,
    lineHeight: 24,
    textAlign: 'left',
  },
});

export default NotificationDetailModal;
