import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { pinService } from '../../services/pin';
import { apiService } from '../../services/api';
import PinInputDialog from '../../components/PinInputDialog';
import CustomAlert from '../../components/CustomAlert';
import { colors } from '../../config/colors';
import CollectionScreen from './CollectionScreen';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CollectionScreenWrapper: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [requiresSetup, setRequiresSetup] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      checkPinStatus();
      return () => {
        setPinVerified(false);
        setShowPinDialog(false);
        apiService.clearPin();
      };
    }, [])
  );

  const checkPinStatus = async () => {
    setLoading(true);
    setRequiresSetup(false);
    const status = await pinService.checkPinStatus();
    setLoading(false);

    if (!status.success) {
      setAlertMessage(status.message || 'Gagal mengecek status PIN');
      setAlertVisible(true);
      return;
    }

    if (status.requires_setup) {
      setRequiresSetup(true);
      setAlertMessage('PIN belum diatur. Silakan setup PIN terlebih dahulu.');
      setAlertVisible(true);
      return;
    }

    if (status.has_pin) {
      setShowPinDialog(true);
    } else {
      setPinVerified(true);
    }
  };

  const handlePinConfirm = async (pin: string) => {
    setVerifying(true);
    const result = await pinService.verifyPin(pin);
    setVerifying(false);

    if (result.success && result.verified) {
      apiService.setPinForRequest(pin);
      setPinVerified(true);
      setShowPinDialog(false);
    } else {
      setAlertMessage(result.message || 'PIN salah');
      setAlertVisible(true);
      setShowPinDialog(false);
      setTimeout(() => {
        setShowPinDialog(true);
      }, 500);
    }
  };

  const handlePinCancel = () => {
    setShowPinDialog(false);
    navigation.goBack();
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (requiresSetup) {
      navigation.navigate('SetupCollectionPin');
    } else {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!pinVerified) {
    return (
      <>
        <PinInputDialog
          visible={showPinDialog}
          title="Masukkan PIN"
          message="Masukkan PIN untuk mengakses Collection"
          onConfirm={handlePinConfirm}
          onCancel={handlePinCancel}
          loading={verifying}
        />
        <CustomAlert
          visible={alertVisible}
          title="Perhatian"
          message={alertMessage}
          type="alert"
          onConfirm={handleAlertConfirm}
          confirmText="OK"
        />
      </>
    );
  }

  return <CollectionScreen />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default CollectionScreenWrapper;
