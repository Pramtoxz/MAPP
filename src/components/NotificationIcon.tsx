import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../config/colors';
import { fonts } from '../config/fonts';
import { getImage } from '../assets/images';
import { RootStackParamList } from '../navigation/types';
import { notificationService } from '../services';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface NotificationIconProps {
  iconColor?: string;
  badgeColor?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  iconColor = colors.white,
  badgeColor = colors.primary,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();

    // Refresh count when screen comes into focus
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadUnreadCount();
    });

    // Listen for incoming push notifications
    const unsubscribeMessage = notificationService.onMessageReceived((_message) => {
      loadUnreadCount();
    });

    // Refresh count every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => {
      unsubscribeFocus();
      unsubscribeMessage();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUnreadCount = async () => {
    const result = await notificationService.getUnreadCount();
    if (result.success && result.count !== undefined) {
      setUnreadCount(result.count);
    }
  };

  const handlePress = () => {
    navigation.navigate('Notification');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={getImage('ic_notification.png')} 
        style={[styles.icon, { tintColor: iconColor }]} 
      />
      {unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.bold,
  },
});
