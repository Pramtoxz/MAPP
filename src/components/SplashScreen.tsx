import React, { useEffect } from 'react';
import { View, Image, Text, StatusBar, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { authService } from '../services/auth';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../config/colors';
import { getImage } from '../assets/images';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const route = useRoute<SplashScreenRouteProp>();
  const showWelcome = route.params?.showWelcome || false;

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
        const isLoggedIn = await authService.isLoggedIn();

        if (isLoggedIn) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigation.replace('Login');
      }
    };

    checkUserSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={getImage('bg_honda.webp')}
        style={styles.backgroundImage}
      />
      <View style={styles.logoContainer}>
          <Image source={getImage('logomd.png')} style={styles.logomd} />
        <Text style={styles.logoText}>PT. MENARA AGUNG</Text>
        <Text style={styles.subText}>Parts Mobile Management</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  subText: {
    fontSize: 16,
    color: colors.white,
    marginTop: 8,
    opacity: 0.9,
  },
   logomd:{
    width: 300,
    height: 86,
    borderRadius: 15,
    resizeMode: 'center',
  },
});

export default SplashScreen;
