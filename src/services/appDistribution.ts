import appDistribution from '@react-native-firebase/app-distribution';
import { Alert } from 'react-native';
import { analyticsService } from './analytics';

class AppDistributionService {
  private isSupported(): boolean {
    // Hanya aktif di debug build — mencegah dialog "Sign in as tester"
    // muncul ke user Play Store pada release build
    return __DEV__;
  }

  async checkForUpdate(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      const isTesterSignedIn = await appDistribution().isTesterSignedIn();
      
      if (!isTesterSignedIn) {
        await appDistribution().signInTester();
      }

      const release = await appDistribution().checkForUpdate();
      
      if (release) {
        await analyticsService.logEvent('app_update_available', {
          version: release.displayVersion,
          build_version: release.buildVersion,
        });
      }
    } catch (error: any) {
      if (error.code === 'app-distribution/update-not-available') {
        return;
      }
      
      const err = error instanceof Error ? error : new Error(String(error));
      await analyticsService.recordError(err, 'app_distribution_check_update');
    }
  }

  async signInTester(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      await appDistribution().signInTester();
      await analyticsService.logEvent('app_distribution_signin', {
        status: 'success',
      });
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      await analyticsService.recordError(err, 'app_distribution_signin');
      throw error;
    }
  }

  async signOutTester(): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      await appDistribution().signOutTester();
      await analyticsService.logEvent('app_distribution_signout', {
        status: 'success',
      });
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      await analyticsService.recordError(err, 'app_distribution_signout');
    }
  }

  async isTesterSignedIn(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }
    return await appDistribution().isTesterSignedIn();
  }

  async checkForUpdateWithCustomUI(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const isTesterSignedIn = await this.isTesterSignedIn();
      
      if (!isTesterSignedIn) {
        Alert.alert(
          'Update Tersedia',
          'Silakan masuk untuk memeriksa pembaruan aplikasi',
          [
            {
              text: 'Batal',
              style: 'cancel',
            },
            {
              text: 'Masuk',
              onPress: async () => {
                await this.signInTester();
                await this.checkForUpdate();
              },
            },
          ]
        );
        return false;
      }

      await this.checkForUpdate();
      return true;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      await analyticsService.recordError(err, 'app_distribution_custom_ui_check');
      return false;
    }
  }
}

export const appDistributionService = new AppDistributionService();
