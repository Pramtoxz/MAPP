import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../config/colors';
import { fonts } from '../../config/fonts';
import { getImage } from '../../assets/images';
import { RootStackParamList } from '../../navigation/types';
import PDFViewer from '../../components/common/PDFViewer';

type CataloguePDFScreenRouteProp = RouteProp<RootStackParamList, 'CataloguePDF'>;
type CataloguePDFScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CataloguePDF'
>;

const CataloguePDFScreen: React.FC = () => {
  const navigation = useNavigation<CataloguePDFScreenNavigationProp>();
  const route = useRoute<CataloguePDFScreenRouteProp>();
  
  const [totalPages, setTotalPages] = useState(0);
  
  // Get PDF URL from route params or use default
  const pdfUrl = route.params?.pdfUrl || '';
  const title = route.params?.title || 'Katalog BI';

  const handleLoadComplete = (numberOfPages: number) => {
    setTotalPages(numberOfPages);
  };

  const handleError = (_error: any) => {
    Alert.alert(
      'Error',
      'Gagal memuat PDF. Pastikan koneksi internet Anda stabil.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  // Validate PDF URL
  if (!pdfUrl || pdfUrl.trim() === '') {
    Alert.alert(
      'Error',
      'URL PDF tidak valid',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={getImage('ic_arrow_back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
            {totalPages > 0 && (
              <Text style={styles.headerSubtitle}>{totalPages} halaman</Text>
            )}
          </View>
          <View style={styles.headerRightSpacer} />
        </View>
      </SafeAreaView>

      <PDFViewer
        pdfUrl={pdfUrl}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  safeArea: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 40,
  },
});

export default CataloguePDFScreen;
