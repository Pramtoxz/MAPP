import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AppNavigator from './src/navigation/AppNavigator';

async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

function App() {
  useEffect(() => {
    crashlytics().log('App mounted');
    
    createNotificationChannel();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        const { notification, data } = remoteMessage;
        
        if (notification) {
          await notifee.displayNotification({
            title: notification.title,
            body: notification.body,
            android: {
              channelId: 'default',
              importance: AndroidImportance.HIGH,
              pressAction: {
                id: 'default',
              },
            },
            data: data,
          });
        }
      } catch (error) {
        console.error('Error displaying notification:', error);
        if (error instanceof Error) {
          crashlytics().recordError(error);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
