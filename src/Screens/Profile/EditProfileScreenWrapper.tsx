import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { pinService } from '../../services/pin';
import { apiService } from '../../services/api';
import PinInputDialog from '../../components/PinInputDialog';
import CustomAlert from '../../components/CustomAlert';
import { colors } from '../../config/colors';
import EditProfileScreen from './EditProfileScreen';

const EditProfileScreenWrapper: React.FC = () => {
  const navigation = useNavigation();
  const [showPinDialog, setShowPinDialog] = useState(true);
  const [pinVerified, setPinVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
    apiService.clearPin();
    navigation.goBack();
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    setShowPinDialog(true);
  };

  if (!pinVerified) {
    return (
      <>
        <PinInputDialog
          visible={showPinDialog}
          title="Masukkan PIN"
          message="Masukkan PIN untuk edit profile"
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </>
    );
  }

  return <EditProfileScreen />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default EditProfileScreenWrapper;
